"use client";

import React, { useState } from "react";
import { Copy, Mail, MessageSquare, Check, Printer } from "lucide-react";
import { Stamp } from "./Stamp";

interface ComplaintLetterProps {
  complaintId: string;
  officialRef?: string;
  category: string;
  locationName: string;
  wardName: string;
  lat: number;
  lng: number;
  dateStr: string;
  escalationDateStr?: string;
  letterEn: string;
  letterHi: string;
  onBodyChange?: (newText: string) => void;
  isEditable?: boolean;
  status?: "pending" | "escalated" | "resolved";
}

export function ComplaintLetter({
  complaintId,
  officialRef = "NNG/Z3/2026/GRIEVANCE",
  category,
  locationName,
  wardName,
  lat,
  lng,
  dateStr,
  escalationDateStr,
  letterEn,
  letterHi,
  onBodyChange,
  isEditable = false,
  status = "pending",
}: ComplaintLetterProps) {
  const [lang, setLang] = useState<"en" | "hi">("en");
  const [copied, setCopied] = useState(false);
  const [customText, setCustomText] = useState(lang === "en" ? letterEn : letterHi);

  // Sync if lang changes
  const handleLangToggle = (selectedLang: "en" | "hi") => {
    setLang(selectedLang);
    setCustomText(selectedLang === "en" ? letterEn : letterHi);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCustomText(e.target.value);
    if (onBodyChange) {
      onBodyChange(e.target.value);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(customText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // WhatsApp dispatch link
  const waText = encodeURIComponent(
    `*CIVIC GRIEVANCE NOTICE (Snap2Solve)*\nID: ${complaintId}\nCategory: ${category.toUpperCase()}\nLocation: ${locationName} (${lat.toFixed(4)}, ${lng.toFixed(4)})\nWard: ${wardName}\n\n${customText}`
  );
  // Ghaziabad Nagar Nigam Public Grievance Helpline / Control Room simulation
  const waLink = `https://wa.me/919458902000?text=${waText}`;

  // Email dispatch link
  const emailSubject = encodeURIComponent(
    `[STATUTORY GRIEVANCE ${complaintId}] ${category.toUpperCase()} at ${locationName} (Ward: ${wardName})`
  );
  const emailBody = encodeURIComponent(
    `Formal Grievance Registered via Snap2Solve Civic Protocol\nRef ID: ${complaintId}\nCoordinates: ${lat}, ${lng}\nDate: ${dateStr}\n\n${customText}`
  );
  const mailtoLink = `mailto:commissioner@nagarnigamghaziabad.in,grievances.nng@gmail.com?subject=${emailSubject}&body=${emailBody}`;

  return (
    <div className="bg-white border-2 border-[#141414] shadow-[3px_4px_0px_#141414] rounded-sm p-4 sm:p-6 text-[#141414] relative">
      {/* Top Bar with Language switcher & controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#141414] pb-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#5C5C5C]">
            Notice Language / भाषा:
          </span>
          <div className="inline-flex border border-[#141414] rounded-xs overflow-hidden">
            <button
              type="button"
              onClick={() => handleLangToggle("en")}
              className={`px-2.5 py-1 text-xs font-bold uppercase transition-colors ${
                lang === "en"
                  ? "bg-[#141414] text-white"
                  : "bg-white text-[#141414] hover:bg-[#E0DCD9]"
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => handleLangToggle("hi")}
              className={`px-2.5 py-1 text-xs font-bold transition-colors ${
                lang === "hi"
                  ? "bg-[#141414] text-white"
                  : "bg-white text-[#141414] hover:bg-[#E0DCD9]"
              }`}
            >
              हिंदी
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-medium border border-[#141414] bg-white hover:bg-[#E0DCD9] rounded-xs"
            title="Copy letter to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#2F7D4F]" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-medium border border-[#141414] bg-white hover:bg-[#E0DCD9] rounded-xs"
            title="Print formal letter"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Official Letter Header / Letterhead */}
      <div className="border-b border-[#CFCAC6] pb-4 mb-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-[10px] font-mono tracking-widest text-[#5C5C5C] uppercase">
              GOVERNMENT OF UTTAR PRADESH · MUNICIPAL ADMINISTRATION
            </div>
            <h3 className="font-extrabold text-sm sm:text-base tracking-tight uppercase text-[#141414]">
              OFFICE OF THE MUNICIPAL CORPORATION, GHAZIABAD
            </h3>
            <p className="text-xs text-[#5C5C5C]">
              Statutory Civic Grievance & Citizen Remediation System
            </p>
          </div>

          <div className="text-right flex flex-col items-end">
            <span className="font-mono text-xs font-bold bg-[#E0DCD9] px-2 py-0.5 border border-[#141414] rounded-xs">
              {complaintId}
            </span>
            <span className="text-[10px] font-mono text-[#5C5C5C] mt-1">
              Ref: {officialRef}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 pt-3 border-t border-dashed border-[#CFCAC6] text-[11px] font-mono">
          <div>
            <span className="text-[#5C5C5C] block">FILING DATE:</span>
            <span className="font-bold">{dateStr}</span>
          </div>
          <div>
            <span className="text-[#5C5C5C] block">WARD:</span>
            <span className="font-bold">{wardName.split("–")[0]}</span>
          </div>
          <div>
            <span className="text-[#5C5C5C] block">GPS COORDS:</span>
            <span className="font-bold">{lat.toFixed(4)}, {lng.toFixed(4)}</span>
          </div>
          <div>
            <span className="text-[#5C5C5C] block">7-DAY CLOCK:</span>
            <span className="font-bold text-[#E31E2D]">
              {escalationDateStr || "Active"}
            </span>
          </div>
        </div>
      </div>

      {/* Stamped Received Mark */}
      <div className="absolute right-6 top-24 pointer-events-none opacity-85 rotate-[-12deg]">
        <div className="border-2 border-dashed border-[#E31E2D] text-[#E31E2D] font-mono text-[10px] sm:text-xs font-black uppercase px-2 py-1 bg-white/90">
          RECEIVED & SERVED
          <div className="text-[8px] text-center">{dateStr}</div>
        </div>
      </div>

      {/* Letter Body */}
      <div className="space-y-3 font-serif text-sm sm:text-base leading-relaxed text-[#141414]">
        {isEditable ? (
          <div>
            <label className="block text-xs font-sans font-bold text-[#5C5C5C] uppercase mb-1">
              Formal Letter Draft (Editable by citizen / संपादन योग्य):
            </label>
            <textarea
              value={customText}
              onChange={handleTextChange}
              rows={10}
              className="w-full p-3 font-mono text-xs sm:text-sm border border-[#141414] bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#141414] rounded-xs"
            />
          </div>
        ) : (
          <div className="whitespace-pre-wrap font-sans text-xs sm:text-sm bg-[#FAF8F5] p-3 sm:p-4 border border-[#CFCAC6] rounded-xs leading-relaxed text-[#2B2F36]">
            {customText}
          </div>
        )}
      </div>

      {/* Action Dispatch Buttons */}
      <div className="mt-5 pt-4 border-t-2 border-[#141414] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Stamp
            label={
              status === "resolved"
                ? "CLOSED & FIXED"
                : status === "escalated"
                ? "ESCALATED TO JE"
                : "7-DAY CLOCK ACTIVE"
            }
            variant={
              status === "resolved"
                ? "resolved"
                : status === "escalated"
                ? "escalated"
                : "pending"
            }
          />
        </div>

        <div className="flex items-center gap-2.5">
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 py-2 bg-[#25D366] hover:bg-[#1EBE5D] text-black font-sans font-bold text-xs uppercase tracking-wider border border-[#141414] rounded-xs shadow-[2px_2px_0px_#141414] transition-transform active:translate-y-0.5"
          >
            <MessageSquare className="w-4 h-4 fill-black" />
            <span>Send on WhatsApp</span>
          </a>

          <a
            href={mailtoLink}
            className="inline-flex items-center gap-2 px-3 py-2 bg-[#141414] hover:bg-[#2B2F36] text-white font-sans font-bold text-xs uppercase tracking-wider border border-[#141414] rounded-xs shadow-[2px_2px_0px_#141414] transition-transform active:translate-y-0.5"
          >
            <Mail className="w-4 h-4" />
            <span>Send by Email</span>
          </a>
        </div>
      </div>
    </div>
  );
}
