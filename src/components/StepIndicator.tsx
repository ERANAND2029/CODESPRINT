import React from "react";

interface StepIndicatorProps {
  currentStep: 1 | 2 | 3;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  const steps = [
    { num: 1, labelEn: "1. Capture", labelHi: "1. फोटो व स्थान" },
    { num: 2, labelEn: "2. Draft Notice", labelHi: "2. पत्र प्रारूप" },
    { num: 3, labelEn: "3. Clock Started", labelHi: "3. 7-दिन की घड़ी" },
  ];

  return (
    <div className="w-full bg-white border-b border-[#141414] py-3 px-4">
      <div className="max-w-2xl mx-auto flex items-center justify-between relative">
        {/* Connecting track line */}
        <div className="absolute top-1/2 left-6 right-6 h-[2px] bg-[#CFCAC6] -translate-y-1/2 z-0" />
        
        {steps.map((step) => {
          const isActive = currentStep === step.num;
          const isDone = currentStep > step.num;

          return (
            <div key={step.num} className="relative z-10 flex flex-col items-center">
              <div
                className={`w-7 h-7 rounded-sm flex items-center justify-center font-mono text-xs font-bold transition-all ${
                  isActive
                    ? "bg-[#E31E2D] text-white border-2 border-[#141414] shadow-[1px_2px_0px_#141414]"
                    : isDone
                    ? "bg-[#141414] text-white border border-[#141414]"
                    : "bg-[#E0DCD9] text-[#5C5C5C] border border-[#CFCAC6]"
                }`}
              >
                {isDone ? "✓" : step.num}
              </div>
              <span
                className={`text-[11px] mt-1 font-semibold tracking-tight ${
                  isActive
                    ? "text-[#141414] font-bold"
                    : isDone
                    ? "text-[#2B2F36]"
                    : "text-[#888888]"
                }`}
              >
                {step.labelEn}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
