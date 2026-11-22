"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { submitReport } from "@/lib/api";
import { Stamp } from "@/components/Stamp";
import {
  Send,
  Camera,
  MapPin,
  CheckCheck,
  ArrowLeft,
  Sparkles,
  Paperclip,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldAlert,
  Mail,
  RefreshCw,
} from "lucide-react";

interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text?: string;
  imageUrl?: string;
  location?: { name: string; lat: number; lng: number };
  complaintId?: string;
  category?: string;
  escalationDate?: string;
  emailSent?: boolean;
  timestamp: string;
}

const PRESET_SNAPS = [
  {
    label: "Garbage Dump (Indirapuram)",
    category: "garbage" as const,
    locationName: "Shakti Khand 2 Market, Indirapuram, Ward 14",
    lat: 28.6418,
    lng: 77.3715,
    imageUrl: "https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=700&q=80",
    text: "Shakti Khand 2 market ke samne bada kachra dump laga hai. Badbu aa rahi hai, sadak band hai.",
  },
  {
    label: "Road Crater / Pothole (Raj Nagar)",
    category: "pothole" as const,
    locationName: "Opposite DPS Gate 2, Raj Nagar Extension, Ward 31",
    lat: 28.7045,
    lng: 77.4368,
    imageUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=700&q=80",
    text: "DPS ke samne road par janleva 1 foot ka gaddha ho gaya hai. Kal raat 2 bikes slip hui.",
  },
  {
    label: "Broken Streetlight (Vaishali)",
    category: "streetlight" as const,
    locationName: "Sector 4 Main Promenade, Vaishali, Ward 22",
    lat: 28.6488,
    lng: 77.3402,
    imageUrl: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=700&q=80",
    text: "Sector 4 park ke bagal ki 12 lights 3 hafte se band hain. Raat ko pura andhera rehta hai.",
  },
  {
    label: "Sewer Waterlogging (Sahibabad)",
    category: "waterlogging" as const,
    locationName: "Plot 18/A Industrial Area, Site 4, Sahibabad, Ward 03",
    lat: 28.6755,
    lng: 77.3625,
    imageUrl: "https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=700&q=80",
    text: "Industrial Site 4 mein ganda naala overflow ho kar workshops ke samne bhara hua hai.",
  },
];

export default function WhatsAppBotPage() {
  const { lang, t } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-1",
      sender: "bot",
      text: "Namaste! Main Nagar Nigam Ghaziabad ka automated Civic Assistant hoon (Snap2Solve).\n\n📸 Apne aas-paas ke kachre, tooti sadak, ya band streetlight ki photo aur live location bhejiye. Hum turant formal municipal notice draft karke 7-day clock shuru karenge.",
      timestamp: "10:00 AM",
    },
  ]);

  const [inputMsg, setInputMsg] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isProcessing]);

  // Handle preset one-click demo snap
  const handleSendPreset = async (preset: typeof PRESET_SNAPS[0]) => {
    if (isProcessing) return;

    const userTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMsgId = `user-${Date.now()}`;

    // Add user message with photo + location
    setMessages((prev) => [
      ...prev,
      {
        id: userMsgId,
        sender: "user",
        text: preset.text,
        imageUrl: preset.imageUrl,
        location: {
          name: preset.locationName,
          lat: preset.lat,
          lng: preset.lng,
        },
        timestamp: userTime,
      },
    ]);

    setIsProcessing(true);

    try {
      // 1. Call AI Vision Detection & auto-submit complaint
      const report = await submitReport({
        category: preset.category,
        locationName: preset.locationName,
        lat: preset.lat,
        lng: preset.lng,
        notes: preset.text,
        imageUrl: preset.imageUrl,
      });

      const botTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

      // 2. Bot reply with full drafted notice, legal references, and live link
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: "bot",
          complaintId: report.id,
          category: report.category,
          escalationDate: report.escalationDate,
          emailSent: true,
          text: `✅ *COMPLAINT REGISTERED VIA CIVIC AI*\n\n🆔 *Ref ID:* ${report.id}\n⚠️ *Detected Category:* ${report.category.toUpperCase()}\n📍 *Location:* ${preset.locationName}\n📜 *Statutory Authority:* Nagar Nigam Ghaziabad (Zone 3 / UP Municipal Act 1959)\n\n⏱️ *7-Day Escalation Clock Started!* Target: ${report.escalationDate}\n📨 *Official notice auto-dispatched to:* commissioner@nagarnigamghaziabad.in\n\nAb ye public map par live dikh raha hai:`,
          timestamp: botTime,
        },
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCustomSend = async () => {
    if (!inputMsg.trim() || isProcessing) return;
    const text = inputMsg;
    setInputMsg("");

    const userTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMessages((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        sender: "user",
        text,
        timestamp: userTime,
      },
    ]);

    setIsProcessing(true);

    try {
      const lower = text.toLowerCase();
      let cat: "garbage" | "pothole" | "streetlight" | "waterlogging" = "garbage";
      if (lower.includes("pothole") || lower.includes("gaddha") || lower.includes("sadak")) {
        cat = "pothole";
      } else if (lower.includes("light") || lower.includes("batti") || lower.includes("andhera")) {
        cat = "streetlight";
      } else if (lower.includes("water") || lower.includes("paani") || lower.includes("drain")) {
        cat = "waterlogging";
      }

      const report = await submitReport({
        category: cat,
        locationName: "Indirapuram, Ghaziabad",
        lat: 28.6418,
        lng: 77.3715,
        notes: text,
      });

      const botTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: "bot",
          complaintId: report.id,
          category: report.category,
          escalationDate: report.escalationDate,
          emailSent: true,
          text: `✅ *GRIEVANCE REGISTERED!*\n🆔 *ID:* ${report.id}\n⚠️ *Category:* ${report.category.toUpperCase()}\n\n⏱️ *7-Day Clock Started!* Target date: ${report.escalationDate}\n📨 Official complaint drafted and emailed to Zonal Officer & Municipal Commissioner.`,
          timestamp: botTime,
        },
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-4 sm:py-8 space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b-2 border-[#141414] pb-3">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-[#141414] hover:text-[#E31E2D] uppercase"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-[#5C5C5C] hidden sm:inline">INTEGRATION:</span>
          <Stamp label="WHATSAPP BOT + VISION AI" variant="escalated" rotation="-rotate-1" />
        </div>
      </div>

      {/* Main WhatsApp Simulator Card */}
      <div className="bg-[#EFEAE2] border-2 border-[#141414] rounded-sm shadow-[4px_5px_0px_#141414] overflow-hidden flex flex-col h-[78vh] sm:h-[82vh]">
        {/* WhatsApp Header */}
        <div className="bg-[#075E54] text-white px-4 py-2.5 flex items-center justify-between border-b border-[#141414]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#128C7E] border border-white/40 flex items-center justify-center font-mono font-black text-sm">
              S2S
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm sm:text-base leading-tight">
                  Nagar Nigam Ghaziabad · Civic Bot
                </span>
                <CheckCircle2 className="w-4 h-4 text-[#25D366] fill-[#25D366] stroke-white" />
              </div>
              <span className="text-[11px] text-[#A7F3D0] block">
                Snap2Solve AI Vision Engine · Online
              </span>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono bg-black/20 px-2.5 py-1 rounded-xs">
            <span>OFFICIAL COMPLAINT DISPATCH GATEWAY</span>
          </div>
        </div>

        {/* Demo Fast Triggers Strip (Judges / Presentation Friendly) */}
        <div className="bg-[#FAF8F5] border-b border-[#CFCAC6] p-2.5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#5C5C5C] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#E31E2D]" />
              TAP TO SIMULATE SENDING CITIZEN SNAP (HACKATHON QUICK DEMO):
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            {PRESET_SNAPS.map((snap) => (
              <button
                key={snap.label}
                type="button"
                onClick={() => handleSendPreset(snap)}
                disabled={isProcessing}
                className="p-1.5 text-left text-xs font-mono border border-[#141414] rounded-xs bg-white hover:bg-[#E0DCD9] transition-all shadow-[1px_1px_0px_#141414] disabled:opacity-50"
              >
                <div className="font-bold truncate text-[11px] text-[#141414]">{snap.label.split("(")[0]}</div>
                <div className="text-[9px] text-[#5C5C5C] truncate">{snap.locationName.split(",")[0]}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 font-sans text-xs sm:text-sm">
          {messages.map((m) => {
            const isBot = m.sender === "bot";
            return (
              <div
                key={m.id}
                className={`flex flex-col ${isBot ? "items-start" : "items-end"} animate-in fade-in duration-150`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[70%] p-3 rounded-lg shadow-xs relative ${
                    isBot
                      ? "bg-white text-[#141414] border border-[#CFCAC6] rounded-tl-none"
                      : "bg-[#DCF8C6] text-[#141414] border border-[#A7E298] rounded-tr-none"
                  }`}
                >
                  {/* Photo if sent */}
                  {m.imageUrl && (
                    <div className="mb-2 rounded-md overflow-hidden border border-black/20 aspect-[16/10] bg-black">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={m.imageUrl}
                        alt="Citizen snap"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Location card if attached */}
                  {m.location && (
                    <div className="mb-2 p-2 bg-black/5 rounded border border-black/10 flex items-start gap-1.5 text-xs font-mono">
                      <MapPin className="w-4 h-4 text-[#E31E2D] shrink-0 mt-0.5" />
                      <div>
                        <strong className="block text-[#141414]">{m.location.name}</strong>
                        <span className="text-[10px] text-[#5C5C5C]">
                          GPS: {m.location.lat.toFixed(4)}, {m.location.lng.toFixed(4)}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Text body */}
                  <div className="whitespace-pre-wrap leading-relaxed font-sans">{m.text}</div>

                  {/* Auto-Email Confirmation Pill */}
                  {m.emailSent && (
                    <div className="mt-2 pt-2 border-t border-dashed border-[#CFCAC6] flex items-center gap-1.5 text-[11px] font-mono text-[#2F7D4F] font-bold">
                      <Mail className="w-3.5 h-3.5" />
                      <span>Statutory Notice Emailed to Commissioner & JE</span>
                    </div>
                  )}

                  {/* Clickable Live Link to public map / complaint detail */}
                  {m.complaintId && (
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      <Link
                        href={`/c/${m.complaintId}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#141414] hover:bg-[#2B2F36] text-white font-mono text-xs uppercase font-bold rounded-xs shadow-[1px_1px_0px_#141414]"
                      >
                        <span>View Live Dossier & Timeline</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>

                      <Link
                        href="/map"
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-[#E0DCD9] text-[#141414] font-mono text-xs uppercase font-bold border border-[#141414] rounded-xs shadow-[1px_1px_0px_#141414]"
                      >
                        <MapPin className="w-3.5 h-3.5 text-[#E31E2D]" />
                        <span>Track on Public Map</span>
                      </Link>
                    </div>
                  )}

                  <div className="text-[10px] text-[#5C5C5C] text-right mt-1 font-mono flex items-center justify-end gap-1">
                    <span>{m.timestamp}</span>
                    {!isBot && <CheckCheck className="w-3.5 h-3.5 text-[#34B7F1]" />}
                  </div>
                </div>
              </div>
            );
          })}

          {/* AI Analyzing Loading State */}
          {isProcessing && (
            <div className="flex flex-col items-start animate-pulse">
              <div className="bg-white border border-[#CFCAC6] p-3 rounded-lg rounded-tl-none shadow-xs text-xs font-mono space-y-1">
                <div className="flex items-center gap-2 text-[#E31E2D] font-bold">
                  <div className="w-3.5 h-3.5 border-2 border-[#E31E2D] border-t-transparent rounded-full animate-spin" />
                  <span>AI VISION SCANNING CIVIC ISSUE...</span>
                </div>
                <div className="text-[11px] text-[#5C5C5C]">
                  Mapping municipal bylaws & drafting bilingual notice...
                </div>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* WhatsApp Message Input Bar */}
        <div className="bg-[#F0F2F5] border-t border-[#CFCAC6] p-2.5 flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleSendPreset(PRESET_SNAPS[0])}
            className="p-2 text-[#5C5C5C] hover:text-[#141414] hover:bg-white rounded-full transition-colors"
            title="Attach sample evidence photo"
          >
            <Camera className="w-5 h-5" />
          </button>

          <input
            type="text"
            placeholder="Type complaint or location (e.g. Garbage near Shakti Khand market)..."
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCustomSend();
            }}
            disabled={isProcessing}
            className="flex-1 bg-white border border-[#CFCAC6] rounded-full px-4 py-2 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#075E54]"
          />

          <button
            type="button"
            onClick={handleCustomSend}
            disabled={isProcessing || !inputMsg.trim()}
            className="w-9 h-9 rounded-full bg-[#075E54] hover:bg-[#128C7E] text-white flex items-center justify-center transition-colors disabled:opacity-50"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
