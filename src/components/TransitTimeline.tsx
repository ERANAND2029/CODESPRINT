import React from "react";

export function TransitTimeline() {
  const steps = [
    {
      step: "01",
      titleEn: "Photo",
      titleHi: "फोटो",
      descEn: "Citizen snaps picture with geo-coordinates",
      descHi: "जीपीएस निर्देशांकों के साथ फोटो खींचें",
      stationCode: "SNP",
    },
    {
      step: "02",
      titleEn: "Issue Detected",
      titleHi: "जांच",
      descEn: "Vision model maps category & civic bylaws",
      descHi: "कचरा/गड्ढा/लाइट का स्वचालित वर्गीकरण",
      stationCode: "DET",
    },
    {
      step: "03",
      titleEn: "Complaint Drafted",
      titleHi: "प्रारूप",
      descEn: "Formal legal letter drafted in EN & Hindi",
      descHi: "संबद्ध जोनल अधिकारी के नाम वैधानिक पत्र",
      stationCode: "DFT",
    },
    {
      step: "04",
      titleEn: "Sent + 7-Day Clock",
      titleHi: "प्रेषित + उल्टी गिनती",
      descEn: "Dispatched to JE; escalation clock begins",
      descHi: "अधिकारी को प्रेषित; 7 दिन में हल न होने पर उच्चाधिकारी को",
      stationCode: "CLK",
      highlight: true,
    },
    {
      step: "05",
      titleEn: "Public Open Map",
      titleHi: "सार्वजनिक मैप",
      descEn: "Logged on public registry for neighborhood verification",
      descHi: "पब्लिक डैशबोर्ड पर लाइव ट्रैकिंग",
      stationCode: "MAP",
    },
  ];

  return (
    <div className="w-full bg-[#FAF8F5] border-2 border-[#141414] p-4 sm:p-6 rounded-sm shadow-[2px_3px_0px_#141414]">
      <div className="flex items-center justify-between border-b border-[#141414] pb-3 mb-6">
        <div>
          <span className="font-mono text-xs text-[#5C5C5C] uppercase tracking-wider block">
            TRANSIT LINE 01 · CIVIC REDRESSAL PROTOCOL
          </span>
          <h3 className="font-extrabold text-base sm:text-lg tracking-tight uppercase text-[#141414]">
            HOW IT WORKS / कार्य प्रणाली
          </h3>
        </div>
        <span className="font-mono text-xs font-bold uppercase bg-[#E0DCD9] px-2 py-0.5 border border-[#141414] rounded-xs">
          5 STATIONS
        </span>
      </div>

      {/* Railway/Transit Line Container */}
      <div className="relative">
        {/* Desktop line */}
        <div className="hidden lg:block absolute top-[28px] left-[5%] right-[5%] h-2 bg-[#141414] z-0" />

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-4 relative z-10">
          {steps.map((st, i) => (
            <div key={st.step} className="flex flex-col relative group">
              {/* Station node on transit track */}
              <div className="flex items-center gap-3 lg:flex-col lg:items-start mb-2">
                <div
                  className={`w-14 h-14 rounded-xs border-2 border-[#141414] flex flex-col items-center justify-center font-mono font-black transition-transform group-hover:-translate-y-0.5 ${
                    st.highlight
                      ? "bg-[#E31E2D] text-white shadow-[2px_2px_0px_#141414]"
                      : "bg-white text-[#141414] shadow-[1px_1px_0px_#141414]"
                  }`}
                >
                  <span className="text-[10px] opacity-75">{st.stationCode}</span>
                  <span className="text-sm">{st.step}</span>
                </div>

                <div className="lg:mt-3">
                  <div className="font-extrabold text-sm uppercase tracking-tight text-[#141414] flex items-center gap-1.5">
                    <span>{st.titleEn}</span>
                    <span className="text-xs text-[#5C5C5C] font-normal">/ {st.titleHi}</span>
                  </div>
                </div>
              </div>

              {/* Station Description */}
              <p className="text-xs text-[#5C5C5C] leading-snug font-sans pl-[68px] lg:pl-0">
                {st.descEn}
              </p>
              <p className="text-[11px] text-[#888888] leading-snug font-sans mt-0.5 pl-[68px] lg:pl-0">
                {st.descHi}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
