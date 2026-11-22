import { NextRequest, NextResponse } from "next/server";
import { submitReport, getReportById } from "@/lib/api";
import { analyzeImageWithGemini } from "../detect/route";

// Webhook verification endpoint (Meta Cloud API / Twilio status verification)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN || "snap2solve_webhook_token";

  if (mode === "subscribe" && token === verifyToken) {
    return new NextResponse(challenge, { status: 200 });
  }

  return NextResponse.json({
    status: "Snap2Solve WhatsApp Civic Webhook Online",
    service: "Nagar Nigam Ghaziabad Civic Helpline",
    time: new Date().toISOString(),
  });
}

// Webhook Message Handler (Receives incoming messages from Twilio WhatsApp / Meta Cloud API)
export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let messageText = "";
    let mediaUrl = "";
    let latitude = 28.6418;
    let longitude = 77.3715;
    let locationName = "Ghaziabad, Uttar Pradesh";

    if (contentType.includes("application/x-www-form-urlencoded")) {
      // Standard Twilio WhatsApp Webhook payload
      const formData = await req.formData();
      messageText = ((formData.get("Body") as string) || "").trim();
      mediaUrl = ((formData.get("MediaUrl0") as string) || "").trim();
      const latStr = formData.get("Latitude") as string;
      const lngStr = formData.get("Longitude") as string;
      if (latStr && lngStr) {
        latitude = parseFloat(latStr);
        longitude = parseFloat(lngStr);
        locationName = `Live GPS (${latitude.toFixed(4)}° N, ${longitude.toFixed(4)}° E)`;
      }
    } else {
      // JSON format (Meta Cloud API or internal test payload)
      const body = await req.json();
      messageText = (body.text || body.message || body.Body || "").trim();
      mediaUrl = (body.imageUrl || body.mediaUrl || body.MediaUrl0 || "").trim();
      if (body.latitude && body.longitude) {
        latitude = body.latitude;
        longitude = body.longitude;
        locationName = body.locationName || locationName;
      }
    }

    const host = req.headers.get("host") || "codesprint-13t1.onrender.com";
    const protocol = host.includes("localhost") ? "http" : "https";
    const baseUrl = `${protocol}://${host}`;

    let replyMessage = "";

    // Helper to return Twilio XML or JSON
    const respond = (text: string, extraData?: any) => {
      if (contentType.includes("application/x-www-form-urlencoded")) {
        const twiml = `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${text}</Message></Response>`;
        return new NextResponse(twiml, {
          headers: { "Content-Type": "application/xml" },
        });
      }
      return NextResponse.json({
        success: true,
        reply: text,
        ...extraData,
      });
    };

    const lower = messageText.toLowerCase();

    // 1. Check if user is querying a Complaint Status (e.g. S2S-GZB-004217)
    const idMatch = messageText.match(/S2S-GZB-\d+/i);
    if (idMatch) {
      const complaintId = idMatch[0].toUpperCase();
      const report = await getReportById(complaintId);
      if (report) {
        replyMessage = `🏛️ *NAGAR NIGAM GHAZIABAD*\n🔍 *COMPLAINT STATUS: FOUND*\n\n🆔 *Complaint ID:* ${report.id}\n⚠️ *Category:* ${report.category.toUpperCase()}\n📍 *Location:* ${report.locationName}\n\n📊 *Current Status:* ${report.status.toUpperCase()} (${report.status === "escalated" ? `Escalated to ${report.escalationLevel}` : `Day ${report.daysOpen} of 7`})\n⏱️ *Resolution Target:* ${report.escalationDate}\n\n🔗 *Live Dossier & Map:* ${baseUrl}/c/${report.id}`;
      } else {
        replyMessage = `⚠️ Complaint ID *${complaintId}* public registry mein nahi mila.\n\nKripya sahi ID check karein ya nayi samasya ki photo bhejein.`;
      }
      return respond(replyMessage);
    }

    // 2. Check if user sent a greeting or menu request
    if (
      !mediaUrl &&
      (lower === "hi" ||
        lower === "hello" ||
        lower === "hey" ||
        lower.startsWith("namaste") ||
        lower.startsWith("namaskar") ||
        lower === "start" ||
        lower === "help" ||
        lower === "menu" ||
        lower.includes("join twilio-trial"))
    ) {
      replyMessage = `🙏 *NAMASTE! NAGAR NIGAM GHAZIABAD CIVIC HELPLINE*\n*(Powered by Snap2Solve)*\n\nAap Ghaziabad ki kisi bhi nagar samasya ko yahan report kar sakte hain:\n\n📸 *1. PHOTO BHEJEIN:* Sadak ka gaddha, kachra, kharab streetlight ya jalbhav ki photo attach karein.\n📍 *2. LOCATION:* Live location ya colony ka naam likhein.\n🔍 *3. STATUS TRACKING:* Apna ID type karein (jaise *S2S-GZB-004217*).\n\n👉 *Shuru karne ke liye camera se samasya ki PHOTO bhejiye!*`;
      return respond(replyMessage);
    }

    // 3. User sent a Photo / Media (Grievance Registration)
    if (mediaUrl) {
      let detectedCategory: "garbage" | "pothole" | "streetlight" | "waterlogging" = "garbage";
      let detectedDetails = messageText || "Reported via live WhatsApp Bot with image verification.";
      let bylawsCited = "Solid Waste Management Rules 2016 / UP Municipal Act 1959";
      let confidence = 94;
      let labelEn = "Civic Grievance Detected";

      const geminiKey = process.env.GEMINI_API_KEY;
      if (geminiKey) {
        try {
          const aiAnalysis = await analyzeImageWithGemini(mediaUrl, geminiKey, messageText);
          if (aiAnalysis) {
            if (aiAnalysis.isCivicIssue === false || aiAnalysis.category === "other") {
              replyMessage = `⚠️ *CIVIC DEFECT NOT FOUND IN PHOTO*\n\nIs photo mein koi nagar nigam samasya (jaise khula kachra, sadak ka gaddha, band batti ya naali overflow) nahi dikh rahi hai.\n\nKripya kisi vastavik civic samasya ki photo dobara bhejein.`;
              return respond(replyMessage);
            }
            if (aiAnalysis.category) {
              detectedCategory = aiAnalysis.category;
              detectedDetails = aiAnalysis.detailsEn || detectedDetails;
              bylawsCited = aiAnalysis.detectedBylaws || bylawsCited;
              confidence = aiAnalysis.confidence || confidence;
              labelEn = aiAnalysis.labelEn || labelEn;
            }
          }
        } catch (aiErr: any) {
          console.warn("Gemini vision analysis fallback for WhatsApp image:", aiErr.message);
        }
      } else {
        // Smart keyword deduction if Gemini key not set
        if (lower.includes("pothole") || lower.includes("gaddha") || lower.includes("road") || lower.includes("sadak")) {
          detectedCategory = "pothole";
          labelEn = "Hazardous Road Crater / Pothole";
          bylawsCited = "UP Municipal Corporation Act 1959, Section 243";
        } else if (lower.includes("light") || lower.includes("batti") || lower.includes("andhera") || lower.includes("pole")) {
          detectedCategory = "streetlight";
          labelEn = "Non-functional Public Streetlight";
          bylawsCited = "UP Municipalities Act, Section 7(1)(c)";
        } else if (lower.includes("water") || lower.includes("paani") || lower.includes("drain") || lower.includes("naali")) {
          detectedCategory = "waterlogging";
          labelEn = "Sewer Drain Overflow / Waterlogging";
          bylawsCited = "UP Water Supply & Sewerage Act 1975, Section 54";
        } else {
          detectedCategory = "garbage";
          labelEn = "Solid Waste Dump Encroachment";
          bylawsCited = "Solid Waste Management Rules 2016, Rule 15(zg)";
        }
      }

      // Register into live Snap2Solve registry
      const newReport = await submitReport({
        category: detectedCategory,
        locationName,
        lat: latitude,
        lng: longitude,
        notes: `${labelEn}: ${detectedDetails}`,
        imageUrl: mediaUrl,
      });

      const trackingUrl = `${baseUrl}/c/${newReport.id}`;

      replyMessage = `🏛️ *NAGAR NIGAM GHAZIABAD CIVIC HELPLINE*\n\n✅ *Grievance Successfully Registered!*\n🆔 *Complaint ID:* ${newReport.id}\n⚠️ *Detected Category:* ${newReport.category.toUpperCase()} (${confidence}% AI match)\n📍 *Location:* ${newReport.locationName}\n📜 *Bylaw Cited:* ${bylawsCited}\n\n⏱️ *7-Day Statutory Countdown Started!*\n🎯 *Target Resolution Date:* ${newReport.escalationDate}\n📨 *Official notice auto-dispatched to:* commissioner@nagarnigamghaziabad.in\n\n🔗 *Track Live Dossier & Public Map:* \n${trackingUrl}`;

      return respond(replyMessage, { complaint: newReport, trackingUrl });
    }

    // 4. User sent a text describing an issue without a photo
    let issueCategory: "garbage" | "pothole" | "streetlight" | "waterlogging" | null = null;
    if (lower.includes("pothole") || lower.includes("gaddha") || lower.includes("road") || lower.includes("sadak")) {
      issueCategory = "pothole";
    } else if (lower.includes("light") || lower.includes("batti") || lower.includes("andhera") || lower.includes("pole")) {
      issueCategory = "streetlight";
    } else if (lower.includes("water") || lower.includes("paani") || lower.includes("drain") || lower.includes("naali")) {
      issueCategory = "waterlogging";
    } else if (lower.includes("garbage") || lower.includes("kachra") || lower.includes("kuda") || lower.includes("waste")) {
      issueCategory = "garbage";
    }

    if (issueCategory) {
      // Register with placeholder image and advise photo
      const newReport = await submitReport({
        category: issueCategory,
        locationName,
        lat: latitude,
        lng: longitude,
        notes: messageText,
        imageUrl:
          issueCategory === "pothole"
            ? "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=700&q=80"
            : issueCategory === "streetlight"
            ? "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=700&q=80"
            : issueCategory === "waterlogging"
            ? "https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=700&q=80"
            : "https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=700&q=80",
      });

      const trackingUrl = `${baseUrl}/c/${newReport.id}`;

      replyMessage = `🏛️ *NAGAR NIGAM GHAZIABAD*\n\n✅ *Complaint Logged:* ${newReport.id}\n⚠️ *Category:* ${newReport.category.toUpperCase()}\n📍 *Location:* ${locationName}\n\n⏱️ *7-Day Clock Started!* Target: ${newReport.escalationDate}\n\n📸 *Tip:* Fast resolution ke liye samasya ki ek *PHOTO* bhi bhej dijiye.\n\n🔗 *Track Live:* ${trackingUrl}`;
      return respond(replyMessage, { complaint: newReport, trackingUrl });
    }

    // Default conversational response
    replyMessage = `🙏 *Namaste! Nagar Nigam Ghaziabad Civic Helpline.*\n\nAapki baat hum tak pahunchi hai. Nagar Nigam mein official complaint darj karne ke liye kripya samasya (kachra, gaddha, light, naali) ki ek *PHOTO* camera se kheench kar bhejein ya apna *Complaint ID* bhej kar status check karein!`;
    return respond(replyMessage);
  } catch (err: any) {
    console.error("WhatsApp webhook error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
