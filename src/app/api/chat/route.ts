import { NextRequest, NextResponse } from "next/server";
import { getReportById, getReports } from "@/lib/api";

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();
    const userText = (message || "").trim();

    if (!userText) {
      return NextResponse.json({ reply: "Kripya apna sandesh ya photo bhejein." });
    }

    const lower = userText.toLowerCase();

    // 1. Check if user is asking for a complaint status by ID (e.g. S2S-GZB-004217)
    const idMatch = userText.match(/S2S-GZB-\d+/i);
    if (idMatch) {
      const complaintId = idMatch[0].toUpperCase();
      const report = await getReportById(complaintId);
      if (report) {
        const reply = `🔍 *COMPLAINT STATUS FOUND*\n\n🆔 *ID:* ${report.id}\n📍 *Location:* ${report.locationName}\n⚠️ *Category:* ${report.category.toUpperCase()}\n\n📊 *Status:* ${report.status.toUpperCase()} (${report.status === "escalated" ? `Escalated to ${report.escalationLevel}` : `Day ${report.daysOpen} of 7`})\n⏱️ *Escalation Target:* ${report.escalationDate}\n\n🔗 *Full Dossier:* https://codesprint-13t1.onrender.com/c/${report.id}`;
        return NextResponse.json({ reply });
      } else {
        return NextResponse.json({
          reply: `⚠️ Complaint ID *${complaintId}* hamare record mein nahi mila. Kripya sahi ID check karein ya naye issue ki photo bhejein.`,
        });
      }
    }

    // 2. Check for Greetings
    if (
      lower === "hi" ||
      lower === "hello" ||
      lower === "hey" ||
      lower.startsWith("namaste") ||
      lower.startsWith("namaskar") ||
      lower === "start" ||
      lower === "help"
    ) {
      const reply = `🙏 *Namaste! Main Nagar Nigam Ghaziabad ka Civic Assistant hoon (Snap2Solve).*\n\nAap kisi bhi civic issue ki complaint seedha yahan darj kar sakte hain:\n\n📸 *Photo bhejein:* Sadak ka gaddha, khula kachra, band streetlight ya jalbhav.\n📍 *Location bhejein:* Jahan ki problem hai.\n🔍 *Status dekhein:* Apna Complaint ID (jaise S2S-GZB-004217) yahan type karein.\n\nNeeche camera icon daba kar photo bhejiye!`;
      return NextResponse.json({ reply });
    }

    // 3. If Gemini API key is available, call Gemini for intelligent conversational response
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      try {
        const prompt = `You are the official civic AI assistant for Nagar Nigam Ghaziabad (Snap2Solve app).
User said: "${userText}"
Respond concisely (under 4 lines) in conversational Hindi/Hinglish.
Explain politely that they can send a photograph of the issue (pothole, garbage, streetlight, waterlogging) or their Complaint ID to track status.
Be polite, professional, and confident.`;

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (reply) {
            return NextResponse.json({ reply });
          }
        }
      } catch (geminiErr) {
        console.warn("Gemini chat fallback:", geminiErr);
      }
    }

    // 4. Helpful natural fallback
    if (lower.includes("gaddha") || lower.includes("pothole") || lower.includes("sadak")) {
      return NextResponse.json({
        reply: `⚠️ Aapne sadak ke gaddhe ke baare mein likha hai. Kripya us gaddhe ki ek *PHOTO* camera icon se attach karke bhejein taaki AI uski depth aur danger classify karke official notice draft kar sake!`,
      });
    }

    if (lower.includes("kachra") || lower.includes("garbage") || lower.includes("kuda") || lower.includes("dustbin")) {
      return NextResponse.json({
        reply: `⚠️ Aapne kachre ki samasya ke baare mein bataya hai. Kripya us jagah ki ek *PHOTO* camera icon se kheench kar bhejein taaki Solid Waste Management Rules ke tehat 7-day clock chalu kiya ja sake!`,
      });
    }

    if (lower.includes("light") || lower.includes("batti") || lower.includes("andhera")) {
      return NextResponse.json({
        reply: `⚠️ Kharab streetlight ya andhere stretch ki complaint ke liye kripya khambhe ya raste ki *PHOTO* attach karein. Hum Electrical division ko seedha notice bhejenge!`,
      });
    }

    return NextResponse.json({
      reply: `🙏 Ji, main samajh gaya. Is samasya ko Nagar Nigam mein formal darj karne ke liye kripya neeche **Camera icon** daba kar uski photo bhejiye, ya apna Complaint ID type karein status janne ke liye.`,
    });
  } catch (err: any) {
    return NextResponse.json({ reply: "Shama karein, ek takneeki samasya aayi. Kripya dobara photo ya sandesh bhejein." });
  }
}
