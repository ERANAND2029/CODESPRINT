"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { Camera, Map, BarChart2, Database, AlertTriangle } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const { lang, toggleLang } = useLanguage();

  const navLinks = [
    { href: "/", labelEn: "Home", labelHi: "होम" },
    { href: "/map", labelEn: "Public Map", labelHi: "मैप" },
    { href: "/whatsapp", labelEn: "WhatsApp Bot", labelHi: "व्हाट्सएप बॉट" },
    { href: "/wards", labelEn: "Ward Scorecard", labelHi: "वार्ड रिपोर्ट" },
    { href: "/open", labelEn: "Open Data", labelHi: "खुला डेटा" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#E0DCD9] border-b-2 border-[#141414]">
      {/* Top municipal emergency banner / notice strip */}
      <div className="bg-[#141414] text-[#E0DCD9] px-4 py-1 text-[11px] font-mono flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#E31E2D] animate-ping" />
          <span className="tracking-widest uppercase">
            GHAZIABAD MUNICIPAL JURISDICTION · LIVE CIVIC TRACKER
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-[10px] text-[#A8A29E]">
          <span>HELPLINE: 1533 / 0120-2790363</span>
          <span>·</span>
          <span>ZONE 1-6 ACTIVE</span>
        </div>
      </div>

      {/* Main Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
        {/* Brand Wordmark */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="border-2 border-[#141414] bg-white px-2 py-0.5 shadow-[2px_2px_0px_#141414] group-hover:translate-x-0.5 transition-transform">
            <span className="font-sans font-black text-xl sm:text-2xl tracking-tighter text-[#141414]">
              Snap<span className="text-[#E31E2D]">2</span>Solve
            </span>
          </div>
          <span className="hidden md:inline-block font-mono text-[10px] uppercase font-bold text-[#5C5C5C] border-l border-[#CFCAC6] pl-2">
            Civic Redressal
          </span>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-1 font-mono text-xs uppercase font-bold">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 transition-colors rounded-xs ${
                  isActive
                    ? "bg-[#141414] text-white shadow-[1px_1px_0px_#141414]"
                    : "text-[#141414] hover:bg-white/70"
                }`}
              >
                {lang === "hi" ? link.labelHi : link.labelEn}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions: Lang toggle + Report Issue button */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Bilingual Toggle */}
          <button
            type="button"
            onClick={toggleLang}
            className="px-2 sm:px-2.5 py-1 text-xs font-mono font-bold uppercase border border-[#141414] bg-white hover:bg-[#FAF8F5] shadow-[1px_1px_0px_#141414] rounded-xs flex items-center gap-1"
            title="Toggle English / Hindi"
          >
            <span className={lang === "en" ? "font-black text-[#E31E2D]" : "text-[#5C5C5C]"}>EN</span>
            <span className="text-[#888888]">/</span>
            <span className={lang === "hi" ? "font-black text-[#E31E2D]" : "text-[#5C5C5C]"}>हिन्दी</span>
          </button>

          {/* Primary Action Button (Desktop) */}
          <Link
            href="/report"
            className="hidden sm:inline-flex items-center gap-2 bg-[#E31E2D] hover:bg-[#C91A27] text-white text-xs font-mono font-black uppercase tracking-wider px-3.5 py-2 border-2 border-[#141414] shadow-[2px_2px_0px_#141414] rounded-xs transition-transform active:translate-y-0.5"
          >
            <Camera className="w-4 h-4" />
            <span>Report Issue / फोटो खींचें</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
