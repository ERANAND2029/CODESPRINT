import { NextRequest, NextResponse } from "next/server";
import { submitReport } from "@/lib/api";

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

// Webhook Message Handler
export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let messageText = "";
    let mediaUrl = "";
    let latitude = 28.6418;
    let longitude = 77.3715;
    let locationName = "Indirapuram, Ghaziabad";

    if (contentType.includes("application/x-www-form-urlencoded")) {
      // Standard Twilio Webhook format
      const formData = await req.formData();
      messageText = (formData.get("Body") as string) || "";
      mediaUrl = (formData.get("MediaUrl0") as string) || "";
      const latStr = formData.get("Latitude") as string;
      const lngStr = formData.get("Longitude") as string;
      if (latStr && lngStr) {
        latitude = parseFloat(latStr);
        longitude = parseFloat(lngStr);
        locationName = `GPS Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;
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

    // Determine category from message or default
    let category: "garbage" | "pothole" | "streetlight" | "waterlogging" = "garbage";
    const lower = messageText.toLowerCase();
    if (lower.includes("pothole") || lower.includes("gaddha") || lower.includes("road")) {
      category = "pothole";
    } else if (lower.includes("light") || lower.includes("batti") || lower.includes("dark")) {
      category = "streetlight";
    } else if (lower.includes("water") || lower.includes("paani") || lower.includes("drain")) {
      category = "waterlogging";
    }

    // Auto-register complaint into Snap2Solve registry
    const newReport = await submitReport({
      category,
      locationName,
      lat: latitude,
      lng: longitude,
      notes: messageText || "Reported via WhatsApp Civic Bot",
      imageUrl: mediaUrl || "https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=700&q=80",
    });

    const host = req.headers.get("host") || "codesprint-13t1.onrender.com";
    const protocol = host.includes("localhost") ? "http" : "https";
    const trackingUrl = `${protocol}://${host}/c/${newReport.id}`;

    const replyMessage = `*🏛️ NAGAR NIGAM GHAZIABAD CIVIC BOT (Snap2Solve)*\n\n✅ *Grievance Successfully Registered!*\n🆔 Complaint ID: *${newReport.id}*\n📍 Location: *${newReport.locationName}*\n⚠️ Category: *${newReport.category.toUpperCase()}*\n\n⏱️ *7-Day Statutory Countdown Started.* Target: ${newReport.escalationDate}\n📨 Official notice served to: *commissioner@nagarnigamghaziabad.in*\n\n🔗 *Track live dossier & community verification:* \n${trackingUrl}`;

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
