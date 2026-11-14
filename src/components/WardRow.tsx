import React from "react";
import Link from "next/link";
import { WardStat } from "@/lib/mock-data";

interface WardRowProps {
  ward: WardStat;
  isTopPerformer?: boolean;
  isLowestPerformer?: boolean;
}

export function WardRow({ ward, isTopPerformer, isLowestPerformer }: WardRowProps) {
  // Grade styling
  const gradeColors: Record<string, string> = {
    "A+": "bg-[#2F7D4F] text-white border-[#141414]",
    "A": "bg-[#2F7D4F]/90 text-white border-[#141414]",
    "B+": "bg-[#4B88A2] text-white border-[#141414]",
    "B": "bg-[#4B88A2]/80 text-white border-[#141414]",
    "C": "bg-[#C98A00] text-white border-[#141414]",
    "C-": "bg-[#C98A00]/90 text-white border-[#141414]",
    "D": "bg-[#E31E2D]/80 text-white border-[#141414]",
    "F": "bg-[#E31E2D] text-white border-[#141414]",
  };

  return (
    <div
      className={`p-3 sm:p-4 border border-[#141414] bg-white transition-all hover:bg-[#FAF8F5] ${
        isTopPerformer
          ? "border-l-4 border-l-[#2F7D4F]"
          : isLowestPerformer
          ? "border-l-4 border-l-[#E31E2D]"
          : ""
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Ward Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-extrabold text-sm sm:text-base tracking-tight text-[#141414] truncate">
              {ward.name}
            </h4>
            {isTopPerformer && (
              <span className="font-mono text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 bg-[#2F7D4F]/10 text-[#2F7D4F] border border-[#2F7D4F]/40 rounded-xs">
                BEST PERFORMER
              </span>
            )}
            {isLowestPerformer && (
              <span className="font-mono text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 bg-[#E31E2D]/10 text-[#E31E2D] border border-[#E31E2D]/40 rounded-xs">
                ATTENTION NEEDED
              </span>
            )}
          </div>
          <div className="text-xs text-[#5C5C5C] flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
            <span>{ward.zone}</span>
            <span>·</span>
            <span>Officer: {ward.officerInCharge}</span>
            <span>·</span>
            <span className="italic">{ward.statusNote}</span>
          </div>
        </div>

        {/* Metrics & Grade */}
        <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-[#CFCAC6]">
          <div className="text-right">
            <div className="text-xs font-mono font-bold text-[#141414] tabular">
              {ward.resolvedComplaints}/{ward.totalComplaints} fixed ({ward.solveRatePercent}%)
            </div>
            <div className="text-[11px] text-[#5C5C5C] tabular">
              Avg fix: <strong className="text-[#141414]">{ward.avgDaysToFix} days</strong>
            </div>
            {/* Thin bar indicator */}
            <div className="w-24 sm:w-28 h-1.5 bg-[#E0DCD9] rounded-xs mt-1 overflow-hidden">
              <div
                className={`h-full ${
                  ward.solveRatePercent >= 75
                    ? "bg-[#2F7D4F]"
                    : ward.solveRatePercent >= 50
                    ? "bg-[#C98A00]"
                    : "bg-[#E31E2D]"
                }`}
                style={{ width: `${ward.solveRatePercent}%` }}
              />
            </div>
          </div>

          {/* Grade Badge */}
          <div
            className={`w-10 h-10 flex items-center justify-center font-mono font-black text-base border-2 rounded-xs shadow-[1px_1px_0px_#141414] ${
              gradeColors[ward.grade] || "bg-[#2B2F36] text-white"
            }`}
          >
            {ward.grade}
          </div>

          <Link
            href={`/map?ward=${ward.id}`}
            className="text-xs font-mono font-bold underline text-[#141414] hover:text-[#E31E2D] whitespace-nowrap"
          >
            View Map →
          </Link>
        </div>
      </div>
    </div>
  );
}
