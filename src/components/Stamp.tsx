import React from "react";

interface StampProps {
  label: string;
  variant?: "escalated" | "resolved" | "pending" | "neutral";
  className?: string;
  rotation?: string; // e.g. "-rotate-2" or "-rotate-3"
}

export function Stamp({
  label,
  variant = "neutral",
  className = "",
  rotation = "-rotate-2",
}: StampProps) {
  const variantStyles = {
    escalated: "border-[#E31E2D] text-[#E31E2D] bg-[#E31E2D]/5 shadow-[1px_2px_0px_rgba(227,30,45,0.2)]",
    resolved: "border-[#2F7D4F] text-[#2F7D4F] bg-[#2F7D4F]/5 shadow-[1px_2px_0px_rgba(47,125,79,0.2)]",
    pending: "border-[#C98A00] text-[#9A6700] bg-[#C98A00]/8 shadow-[1px_2px_0px_rgba(201,138,0,0.2)]",
    neutral: "border-[#2B2F36] text-[#2B2F36] bg-[#2B2F36]/5 shadow-[1px_2px_0px_rgba(43,47,54,0.15)]",
  };

  return (
    <span
      className={`inline-block font-mono text-xs font-black uppercase tracking-wider px-2 py-0.5 border-2 ${variantStyles[variant]} ${rotation} transition-transform ${className}`}
      style={{
        boxDecorationBreak: "clone",
        WebkitBoxDecorationBreak: "clone",
      }}
    >
      {label}
    </span>
  );
}
