"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { Home, Map, Camera, BarChart2, FileText } from "lucide-react";

export function MobileNav() {
  const pathname = usePathname();
  const { lang } = useLanguage();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#FAF8F5] border-t-2 border-[#141414] pb-safe">
      <div className="grid grid-cols-5 h-16 items-center">
        {/* Home */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center h-full text-center ${
            pathname === "/" ? "text-[#E31E2D] font-bold" : "text-[#5C5C5C]"
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-mono mt-1">
            {lang === "hi" ? "होम" : "Home"}
          </span>
        </Link>

        {/* Map */}
        <Link
          href="/map"
          className={`flex flex-col items-center justify-center h-full text-center ${
            pathname === "/map" ? "text-[#E31E2D] font-bold" : "text-[#5C5C5C]"
          }`}
        >
          <Map className="w-5 h-5" />
          <span className="text-[10px] font-mono mt-1">
            {lang === "hi" ? "मैप" : "Map"}
          </span>
        </Link>

        {/* Center Prominent Snap Action */}
        <div className="flex justify-center items-center -mt-5">
          <Link
            href="/report"
            className="w-14 h-14 rounded-sm bg-[#E31E2D] text-white border-2 border-[#141414] shadow-[2px_3px_0px_#141414] flex flex-col items-center justify-center active:scale-95 transition-transform"
            aria-label="Snap Photo to Report"
          >
            <Camera className="w-6 h-6 stroke-[2.2]" />
            <span className="text-[9px] font-mono font-black uppercase mt-0.5 tracking-tight">
              Snap
            </span>
          </Link>
        </div>

        {/* Wards */}
        <Link
          href="/wards"
          className={`flex flex-col items-center justify-center h-full text-center ${
            pathname === "/wards" ? "text-[#E31E2D] font-bold" : "text-[#5C5C5C]"
          }`}
        >
          <BarChart2 className="w-5 h-5" />
          <span className="text-[10px] font-mono mt-1">
            {lang === "hi" ? "वार्ड" : "Wards"}
          </span>
        </Link>

        {/* Open Data */}
        <Link
          href="/open"
          className={`flex flex-col items-center justify-center h-full text-center ${
            pathname === "/open" ? "text-[#E31E2D] font-bold" : "text-[#5C5C5C]"
          }`}
        >
          <FileText className="w-5 h-5" />
          <span className="text-[10px] font-mono mt-1">
            {lang === "hi" ? "डेटा" : "Open"}
          </span>
        </Link>
      </div>
    </nav>
  );
}
