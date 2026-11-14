import React from "react";

interface StatusBadgeProps {
  status: "pending" | "escalated" | "resolved";
  daysOpen?: number;
  className?: string;
}

export function StatusBadge({ status, daysOpen, className = "" }: StatusBadgeProps) {
  if (status === "resolved") {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider bg-[#2F7D4F]/10 text-[#2F7D4F] border border-[#2F7D4F]/30 rounded-xs font-mono ${className}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#2F7D4F]"></span>
        RESOLVED
      </span>
    );
  }

  if (status === "escalated") {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider bg-[#E31E2D]/10 text-[#E31E2D] border border-[#E31E2D]/30 rounded-xs font-mono ${className}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#E31E2D] animate-ping"></span>
        ESCALATED {daysOpen ? `(DAY ${daysOpen})` : ""}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider bg-[#C98A00]/10 text-[#8C6000] border border-[#C98A00]/30 rounded-xs font-mono ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-[#C98A00]"></span>
      DAY {daysOpen || 1} OF 7
    </span>
  );
}
