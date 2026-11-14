"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { Stamp } from "@/components/Stamp";
import { GithubIcon } from "@/components/GithubIcon";
import {
  Code2,
  Download,
  Copy,
  Check,
  ExternalLink,
  Terminal,
  FileJson,
  GitPullRequest,
  Database,
} from "lucide-react";

const CITY_SCHEMA_SNIPPET = `{
  "city": "Ghaziabad",
  "state": "Uttar Pradesh",
  "authority": "Nagar Nigam Ghaziabad",
  "municipal_act": "UP Municipal Corporation Act 1959",
  "default_escalation_days": 7,
  "contacts": {
    "commissioner_email": "commissioner@nagarnigamghaziabad.in",
    "control_room_phone": "0120-2790363",
    "whatsapp_bot": "+919458902000"
  },
  "zones": [
    {
      "zone_id": "zone-3",
      "zone_name": "Trans-Hindon",
      "wards": ["ward-14", "ward-22", "ward-18"],
      "zonal_officer": "Er. K.P. Verma",
      "email": "zone3.nng@gmail.com"
    }
  ]
}`;

export default function OpenDataPage() {
  const { lang, t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const handleCopySchema = () => {
    navigator.clipboard.writeText(CITY_SCHEMA_SNIPPET);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadDataset = () => {
    // Generate JSON download blob
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(
      JSON.stringify({
        project: "Snap2Solve Open Civic Registry",
        city: "Ghaziabad",
        generatedAt: new Date().toISOString(),
        license: "MIT / Open Government Data License",
        maintainer: "Team Tech Astra, ABES Engineering College",
        repo: "https://github.com/pannapurna041-hash/Snap2Solve_Codesprint",
      }, null, 2)
    );
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "snap2solve-ghaziabad-civic-audit.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
      {/* Header */}
      <div className="border-b-2 border-[#141414] pb-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs uppercase tracking-wider text-[#5C5C5C]">
            TRANSPARENT CIVIC INFRASTRUCTURE
          </span>
          <Stamp label="OPEN SOURCE MIT" variant="resolved" rotation="-rotate-1" />
        </div>
        <h1 className="font-extrabold text-2xl sm:text-4xl uppercase tracking-tight text-[#141414]">
          {t("Open Data & Extensibility / खुला डेटा", "ओपन डेटा एवं विस्तार")}
        </h1>
        <p className="text-xs sm:text-sm text-[#5C5C5C] max-w-2xl leading-relaxed">
          {t(
            "Snap2Solve is fully open source. All municipal templates, escalation rules, and authority contacts are plain JSON files versioned in GitHub. Anyone can add their city or inspect our civic tracking code.",
            "Snap2Solve पूरी तरह से ओपन सोर्स है। कोई भी नागरिक अपने शहर के नगर निगम का डेटा JSON फॉर्मेट में पुल रिक्वेस्ट के माध्यम से जोड़ सकता है।"
          )}
        </p>
      </div>

      {/* GitHub Repository Banner */}
      <div className="bg-white border-2 border-[#141414] p-5 sm:p-6 rounded-sm shadow-[4px_4px_0px_#141414] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#141414] pb-3">
          <div className="flex items-center gap-2.5">
            <GithubIcon className="w-6 h-6 text-[#141414]" />
            <div>
              <h2 className="font-mono text-sm sm:text-base font-black text-[#141414]">
                pannapurna041-hash/Snap2Solve_Codesprint
              </h2>
              <span className="text-[11px] font-mono text-[#5C5C5C]">
                Built by Team Tech Astra · ABES Engineering College
              </span>
            </div>
          </div>

          <a
            href="https://github.com/pannapurna041-hash/Snap2Solve_Codesprint"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#141414] hover:bg-[#2B2F36] text-white font-mono text-xs font-bold uppercase tracking-wider rounded-xs shadow-[2px_2px_0px_#141414] active:translate-y-0.5 transition-transform"
          >
            <span>View on GitHub</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <p className="text-xs sm:text-sm text-[#2B2F36] leading-relaxed">
          Every municipality runs on different local acts (e.g. UP Municipalities Act, Delhi MCD Act, Karnataka KMC Act). Snap2Solve separates the core grievance dispatch engine from the city data schema, so deploying to a new city takes under 15 minutes.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            type="button"
            onClick={handleDownloadDataset}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#E0DCD9] hover:bg-[#CFCAC6] text-[#141414] font-mono text-xs font-bold border border-[#141414] rounded-xs shadow-[1px_1px_0px_#141414]"
          >
            <Download className="w-4 h-4 text-[#E31E2D]" />
            <span>Download Raw Audit Dataset (JSON)</span>
          </button>
        </div>
      </div>

      {/* "Add Your City with a Pull Request" Section */}
      <div className="bg-[#FAF8F5] border-2 border-[#141414] p-5 sm:p-6 rounded-sm shadow-[3px_4px_0px_#141414] space-y-4">
        <div className="flex items-center justify-between border-b border-[#141414] pb-2">
          <div className="flex items-center gap-2">
            <GitPullRequest className="w-5 h-5 text-[#E31E2D]" />
            <h2 className="font-extrabold text-base sm:text-lg uppercase text-[#141414]">
              How to add your city via Pull Request / अपना शहर कैसे जोड़ें
            </h2>
          </div>
          <span className="font-mono text-xs font-bold text-[#5C5C5C] hidden sm:inline">
            PR STEP GUIDE
          </span>
        </div>

        <ol className="list-decimal list-inside space-y-2 text-xs sm:text-sm text-[#2B2F36] font-sans leading-relaxed">
          <li>
            Fork the repository on GitHub: <code className="bg-[#E0DCD9] px-1 py-0.5 rounded-xs font-mono font-bold text-xs">github.com/pannapurna041-hash/Snap2Solve_Codesprint</code>
          </li>
          <li>
            Create a file under <code className="bg-[#E0DCD9] px-1 py-0.5 rounded-xs font-mono font-bold text-xs">config/cities/your-city.json</code> matching the specification below.
          </li>
          <li>
            Include the verified official email addresses for the Municipal Commissioner, Zonal Officers, and local ward boundaries.
          </li>
          <li>
            Submit a Pull Request. Once merged, citizens in your municipality can immediately begin filing legally-binding 7-day grievances!
          </li>
        </ol>

        {/* Code Snippet Box */}
        <div className="border border-[#141414] rounded-xs overflow-hidden bg-[#141414] text-[#E0DCD9]">
          <div className="bg-[#2B2F36] px-3 py-1.5 flex items-center justify-between border-b border-[#141414] text-[11px] font-mono">
            <span className="flex items-center gap-1.5 text-white font-bold">
              <FileJson className="w-3.5 h-3.5 text-[#E31E2D]" />
              <span>config/cities/ghaziabad.json (Specification Standard)</span>
            </span>

            <button
              type="button"
              onClick={handleCopySchema}
              className="text-white hover:text-[#E31E2D] flex items-center gap-1"
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
          </div>

          <pre className="p-4 font-mono text-xs overflow-x-auto text-[#FAF8F5] leading-relaxed">
            {CITY_SCHEMA_SNIPPET}
          </pre>
        </div>
      </div>

      {/* Live Hackathon Pitch Note */}
      <div className="p-4 bg-white border border-[#141414] rounded-xs font-mono text-xs text-[#5C5C5C] space-y-1">
        <div className="flex items-center gap-2 text-[#141414] font-bold uppercase">
          <Terminal className="w-4 h-4 text-[#E31E2D]" />
          <span>Architecture & Backend Pluggability Note:</span>
        </div>
        <p className="leading-relaxed">
          All client calls route through <code className="text-[#141414] font-bold">/lib/api.ts</code> with simulated real-world network latency (600-1200ms) and automated computer vision parsing. When the FastAPI microservice is deployed, changing just the endpoints in <code className="text-[#141414] font-bold">/lib/api.ts</code> connects the production AI model without altering a single UI line.
        </p>
      </div>
    </div>
  );
}
