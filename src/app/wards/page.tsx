"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { WARDS_DATA, WardStat } from "@/lib/mock-data";
import { WardRow } from "@/components/WardRow";
import { Stamp } from "@/components/Stamp";
import {
  Award,
  AlertTriangle,
  ArrowUpDown,
  Search,
  BarChart2,
  Filter,
} from "lucide-react";

export default function WardsPage() {
  const { lang, t } = useLanguage();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"solveRate" | "speed" | "total">("solveRate");

  // Filter & sort wards
  const sortedWards = useMemo(() => {
    let list = [...WARDS_DATA];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (w) =>
          w.name.toLowerCase().includes(q) ||
          w.nameHi.toLowerCase().includes(q) ||
          w.officerInCharge.toLowerCase().includes(q) ||
          w.zone.toLowerCase().includes(q)
      );
    }

    if (sortBy === "solveRate") {
      list.sort((a, b) => b.solveRatePercent - a.solveRatePercent);
    } else if (sortBy === "speed") {
      list.sort((a, b) => a.avgDaysToFix - b.avgDaysToFix);
    } else if (sortBy === "total") {
      list.sort((a, b) => b.totalComplaints - a.totalComplaints);
    }

    return list;
  }, [search, sortBy]);

  // Find top and worst performers overall
  const topPerformer = WARDS_DATA.reduce((prev, curr) =>
    curr.solveRatePercent > prev.solveRatePercent ? curr : prev
  );
  const lowestPerformer = WARDS_DATA.reduce((prev, curr) =>
    curr.solveRatePercent < prev.solveRatePercent ? curr : prev
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
      {/* Page Header */}
      <div className="border-b-2 border-[#141414] pb-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs uppercase tracking-wider text-[#5C5C5C]">
            GHAZIABAD MUNICIPAL SCOREBOARD · NOVEMBER 2026 AUDIT
          </span>
          <Stamp label="PUBLIC AUDIT" variant="neutral" rotation="-rotate-1" />
        </div>
        <h1 className="font-extrabold text-2xl sm:text-4xl uppercase tracking-tight text-[#141414]">
          {t("Ward Report Card / वार्ड रिपोर्ट कार्ड", "वार्ड रिपोर्ट कार्ड एवं रैंकिंग")}
        </h1>
        <p className="text-xs sm:text-sm text-[#5C5C5C] max-w-2xl leading-relaxed">
          {t(
            "An unvarnished public leaderboard tracking how quickly each municipal ward resolves citizen complaints. No political spin — grades are calculated strictly from verified remediation times and citizen confirmations.",
            "सभी वार्डों की कार्यकुशलता का खुला ऑडिट। ग्रेडिंग सीधे शिकायतों के निस्तारण समय और नागरिकों द्वारा पुष्टि पर आधारित है।"
          )}
        </p>
      </div>

      {/* Top vs Worst Spotlight Strip (Honest civic feedback) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Best Performer */}
        <div className="bg-white border-2 border-[#2F7D4F] p-4 rounded-sm shadow-[3px_3px_0px_#2F7D4F] space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase font-bold text-[#2F7D4F] tracking-wider flex items-center gap-1">
              <Award className="w-4 h-4" />
              TOP PERFORMING WARD / सर्वश्रेष्ठ प्रदर्शन
            </span>
            <span className="font-mono text-sm font-black text-white bg-[#2F7D4F] px-2 py-0.5 rounded-xs">
              GRADE {topPerformer.grade}
            </span>
          </div>
          <h3 className="font-extrabold text-lg text-[#141414]">
            {topPerformer.name}
          </h3>
          <p className="text-xs text-[#5C5C5C]">
            Officer in charge: <strong className="text-[#141414]">{topPerformer.officerInCharge}</strong>
          </p>
          <div className="pt-1 flex items-center justify-between text-xs font-mono border-t border-dashed border-[#CFCAC6]">
            <span>Solve Rate: <strong className="text-[#2F7D4F]">{topPerformer.solveRatePercent}%</strong></span>
            <span>Avg Speed: <strong className="text-[#141414]">{topPerformer.avgDaysToFix} days</strong></span>
          </div>
        </div>

        {/* Lowest Performer */}
        <div className="bg-white border-2 border-[#E31E2D] p-4 rounded-sm shadow-[3px_3px_0px_#E31E2D] space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase font-bold text-[#E31E2D] tracking-wider flex items-center gap-1">
              <AlertTriangle className="w-4 h-4" />
              CRITICAL ATTENTION NEEDED / सबसे धीमी कार्रवाई
            </span>
            <span className="font-mono text-sm font-black text-white bg-[#E31E2D] px-2 py-0.5 rounded-xs">
              GRADE {lowestPerformer.grade}
            </span>
          </div>
          <h3 className="font-extrabold text-lg text-[#141414]">
            {lowestPerformer.name}
          </h3>
          <p className="text-xs text-[#5C5C5C]">
            Officer in charge: <strong className="text-[#141414]">{lowestPerformer.officerInCharge}</strong>
          </p>
          <div className="pt-1 flex items-center justify-between text-xs font-mono border-t border-dashed border-[#CFCAC6]">
            <span>Solve Rate: <strong className="text-[#E31E2D]">{lowestPerformer.solveRatePercent}%</strong></span>
            <span>Avg Speed: <strong className="text-[#E31E2D]">{lowestPerformer.avgDaysToFix} days</strong></span>
          </div>
        </div>
      </div>

      {/* Control Bar: Search & Sort Tabs */}
      <div className="bg-[#FAF8F5] border-2 border-[#141414] p-3 rounded-xs shadow-[2px_2px_0px_#141414] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#5C5C5C] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search ward, locality, or officer name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs font-mono border border-[#141414] rounded-xs bg-white"
          />
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-1.5 font-mono text-xs">
          <span className="text-[10px] text-[#5C5C5C] font-bold uppercase hidden md:inline">
            SORT BY:
          </span>
          <button
            type="button"
            onClick={() => setSortBy("solveRate")}
            className={`px-2.5 py-1 font-bold border rounded-xs transition-colors ${
              sortBy === "solveRate"
                ? "bg-[#141414] text-white border-[#141414]"
                : "bg-white text-[#141414] border-[#CFCAC6]"
            }`}
          >
            Solve Rate %
          </button>
          <button
            type="button"
            onClick={() => setSortBy("speed")}
            className={`px-2.5 py-1 font-bold border rounded-xs transition-colors ${
              sortBy === "speed"
                ? "bg-[#141414] text-white border-[#141414]"
                : "bg-white text-[#141414] border-[#CFCAC6]"
            }`}
          >
            Fix Speed
          </button>
          <button
            type="button"
            onClick={() => setSortBy("total")}
            className={`px-2.5 py-1 font-bold border rounded-xs transition-colors ${
              sortBy === "total"
                ? "bg-[#141414] text-white border-[#141414]"
                : "bg-white text-[#141414] border-[#CFCAC6]"
            }`}
          >
            Total Complaints
          </button>
        </div>
      </div>

      {/* Scoreboard List */}
      <div className="border-2 border-[#141414] rounded-sm overflow-hidden shadow-[4px_5px_0px_#141414] bg-white divide-y divide-[#141414]">
        {sortedWards.map((ward) => (
          <WardRow
            key={ward.id}
            ward={ward}
            isTopPerformer={ward.id === topPerformer.id}
            isLowestPerformer={ward.id === lowestPerformer.id}
          />
        ))}

        {sortedWards.length === 0 && (
          <div className="p-8 text-center font-mono text-xs text-[#5C5C5C]">
            No ward matched &ldquo;{search}&rdquo;.
          </div>
        )}
      </div>

      {/* Explanatory Methodology Footnote */}
      <div className="p-4 bg-[#FAF8F5] border border-[#141414] rounded-xs font-mono text-xs text-[#5C5C5C] space-y-1">
        <strong className="text-[#141414] uppercase block">
          Scorecard Methodology / मूल्यांकन नियम:
        </strong>
        <p>
          Grades are computed via automated rubric: A+ (≥90% solved within 4 days), A (80-89%), B (70-79%), C (50-69%), D (40-49%), F (&lt;40% resolution rate or &gt;8 days average delay). Verified directly through public citizen co-confirmations.
        </p>
      </div>
    </div>
  );
}
