import { NextRequest, NextResponse } from "next/server";
import { submitReport } from "@/lib/api";
import { analyzeImageWithGemini } from "../detect/route";

// Webhook verification endpoint (Meta Cloud API / Twilio)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN || "snap2solve_webhook_token";

  if (mode === "subscribe" && token === verifyToken) {
    return new NextResponse(challenge, { status: 200 });
  }

  return NextResponse.json({ status: "Snap2Solve WhatsApp Webhook Online" });
}

// Webhook Message Handler (Receives real incoming messages from WhatsApp)
export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let messageText = "";
    let mediaUrl = "";
    let latitude = 28.6418;
    let longitude = 77.3715;
    let locationName = "Ghaziabad, Uttar Pradesh";

    if (contentType.includes("application/x-www-form-urlencoded")) {
      // Standard Twilio WhatsApp Webhook
      const formData = await req.formData();
      messageText = (formData.get("Body") as string) || "";
      mediaUrl = (formData.get("MediaUrl0") as string) || "";
      const latStr = formData.get("Latitude") as string;
      const lngStr = formData.get("Longitude") as string;
      if (latStr && lngStr) {
        latitude = parseFloat(latStr);
        longitude = parseFloat(lngStr);
        locationName = `GPS (${latitude.toFixed(4)}° N, ${longitude.toFixed(4)}° E)`;
      }
    } else {
      // JSON format (Meta Cloud API or direct test payload)
      const body = await req.json();
      messageText = body.text || body.message || "";
      mediaUrl = body.imageUrl || body.mediaUrl || "";
      if (body.latitude && body.longitude) {
        latitude = body.latitude;
        longitude = body.longitude;
        locationName = body.locationName || locationName;
      }
    }

    let detectedCategory: "garbage" | "pothole" | "streetlight" | "waterlogging" = "garbage";
    let detectedDetails = messageText || "Reported via live WhatsApp Bot";
    let bylawsCited = "UP Municipal Corporation Act 1959";

    // 1. If real image URL was sent, run real Gemini Vision AI
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey && mediaUrl) {
      try {
        const aiAnalysis = await analyzeImageWithGemini(mediaUrl, geminiKey, messageText);
        if (aiAnalysis && aiAnalysis.category) {
          detectedCategory = aiAnalysis.category;
          detectedDetails = aiAnalysis.detailsEn || detectedDetails;
          bylawsCited = aiAnalysis.detectedBylaws || bylawsCited;
        }
      } catch (aiErr: any) {
        console.warn("Gemini vision analysis failed for WhatsApp image:", aiErr.message);
      }
    } else {
      // Keyword classification fallback
      const lower = messageText.toLowerCase();
      if (lower.includes("pothole") || lower.includes("gaddha") || lower.includes("road")) {
        detectedCategory = "pothole";
      } else if (lower.includes("light") || lower.includes("batti") || lower.includes("dark")) {
        detectedCategory = "streetlight";
      } else if (lower.includes("water") || lower.includes("paani") || lower.includes("drain")) {
        detectedCategory = "waterlogging";
      }
    }

    // 2. Register real complaint in Snap2Solve Public Registry
    const newReport = await submitReport({
      category: detectedCategory,
      locationName,
      lat: latitude,
      lng: longitude,
      notes: detectedDetails,
      imageUrl: mediaUrl || "https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=700&q=80",
    });

    const host = req.headers.get("host") || "codesprint-13t1.onrender.com";
    const protocol = host.includes("localhost") ? "http" : "https";
    const trackingUrl = `${protocol}://${host}/c/${newReport.id}`;

    // 3. Compose real WhatsApp response with complaint ID, legal citation, target date, and map link
    const replyMessage = `*🏛️ NAGAR NIGAM GHAZIABAD CIVIC BOT (Snap2Solve)*\n\n✅ *Grievance Successfully Registered!*\n🆔 Complaint ID: *${newReport.id}*\n📍 Location: *${newReport.locationName}*\n⚠️ Category: *${newReport.category.toUpperCase()}*\n📜 Bylaw: *${bylawsCited}*\n\n⏱️ *7-Day Statutory Countdown Started.* Target: ${newReport.escalationDate}\n📨 Notice auto-dispatched to: *commissioner@nagarnigamghaziabad.in*\n\n🔗 *Track live dossier & public map:* \n${trackingUrl}`;

    // Return Twilio TwiML format if called by Twilio, otherwise JSON
    if (contentType.includes("application/x-www-form-urlencoded")) {
      const twiml = `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${replyMessage}</Message></Response>`;
      return new NextResponse(twiml, {
        headers: { "Content-Type": "application/xml" },
      });
    }

    return NextResponse.json({
      success: true,
      complaint: newReport,
      reply: replyMessage,
      trackingUrl,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
