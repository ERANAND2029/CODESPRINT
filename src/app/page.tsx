"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { getReports, getCitySummaryMetrics } from "@/lib/api";
import { Complaint } from "@/lib/mock-data";
import { Stamp } from "@/components/Stamp";
import { StatusBadge } from "@/components/StatusBadge";
import { TransitTimeline } from "@/components/TransitTimeline";
import { DynamicMap } from "@/components/DynamicMap";
import { Camera, MapPin, ArrowRight, Clock, ShieldAlert, CheckCircle, ExternalLink } from "lucide-react";
import { GithubIcon } from "@/components/GithubIcon";

export default function HomePage() {
  const { lang, t } = useLanguage();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [metrics, setMetrics] = useState({
    reportedThisMonth: 312,
    fixedThisMonth: 187,
    escalatedThisMonth: 41,
    avgResolutionDays: 4.6,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [reportsData, metricsData] = await Promise.all([
          getReports(),
          getCitySummaryMetrics(),
        ]);
        setComplaints(reportsData);
        setMetrics(metricsData);
      } catch (err) {
        console.error("Failed to load home data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Filter 4 notable recent complaints for the live feed
  const recentComplaints = complaints.slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8 space-y-6 sm:space-y-10">
      {/* 1. Live Municipal Counter Strip */}
      <section className="bg-white border-2 border-[#141414] shadow-[3px_3px_0px_#141414] p-3 sm:p-4 rounded-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E31E2D] animate-ping" />
            <span className="font-extrabold uppercase text-[#141414]">
              {t("GHAZIABAD NOVEMBER 2026 AUDIT", "गाजियाबाद नवंबर 2026 ऑडिट")}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-bold text-[#141414] tabular">
            <span>
              <strong className="text-base sm:text-lg">{metrics.reportedThisMonth}</strong>{" "}
              <span className="text-[#5C5C5C] font-normal font-sans">
                {t("reported", "दर्ज किए गए")}
              </span>
            </span>
            <span className="text-[#CFCAC6]">·</span>
            <span>
              <strong className="text-base sm:text-lg text-[#2F7D4F]">{metrics.fixedThisMonth}</strong>{" "}
              <span className="text-[#5C5C5C] font-normal font-sans">
                {t("fixed", "हल हुए")}
              </span>
            </span>
            <span className="text-[#CFCAC6]">·</span>
            <span>
              <strong className="text-base sm:text-lg text-[#E31E2D]">{metrics.escalatedThisMonth}</strong>{" "}
              <span className="text-[#5C5C5C] font-normal font-sans">
                {t("escalated to Commissioner", "आयुक्त को एस्केलेटेड")}
              </span>
            </span>
          </div>
        </div>
      </section>

      {/* 2. Primary Action Hero Box (Not a SaaS landing page; confident municipal signage) */}
      <section className="bg-[#FAF8F5] border-2 border-[#141414] shadow-[4px_5px_0px_#141414] p-5 sm:p-8 rounded-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#E0DCD9] border border-[#141414] rounded-xs text-[11px] font-mono uppercase font-bold tracking-wider">
              <span>{t("Ghaziabad Nagar Nigam Public Registry", "गाजियाबाद नगर निगम सार्वजनिक पोर्टल")}</span>
            </div>

            <h1 className="font-extrabold text-2xl sm:text-4xl lg:text-5xl tracking-tight text-[#141414] leading-[1.08] uppercase">
              {t("Snap it. Report it. Fix it.", "फोटो खींचो. नोटिस भेजो. काम कराओ.")}
            </h1>

            <p className="text-sm sm:text-base text-[#2B2F36] leading-relaxed max-w-xl">
              {t(
                "A citizen photographs an open garbage dump, road crater, or dark streetlight. Snap2Solve locates the ward, drafts an official statutory notice under UP Municipal Act, starts an unrelenting 7-day escalation clock, and tracks it openly on the city map.",
                "कचरा, गड्ढा या बंद स्ट्रीटलाइट की फोटो खींचें। Snap2Solve संबंधित जोनल अधिकारी के नाम वैधानिक पत्र तैयार कर 7 दिन की सख्त उल्टी गिनती शुरू करता है। यदि समय पर समाधान न हो, तो मामला सीधे नगर आयुक्त को प्रेषित होता है।"
              )}
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Giant Primary Action Button */}
              <Link
                href="/report"
                className="inline-flex items-center justify-center gap-3 bg-[#E31E2D] hover:bg-[#C91A27] text-white font-mono font-black text-sm sm:text-base uppercase tracking-wider px-6 py-4 border-2 border-[#141414] shadow-[3px_4px_0px_#141414] rounded-sm active:translate-y-0.5 transition-all text-center"
              >
                <Camera className="w-5 h-5 stroke-[2.5]" />
                <span>
                  {t("Photo kheencho / Snap a photo", "फोटो खींचो / Snap a photo")}
                </span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>

              <Link
                href="/map"
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-[#E0DCD9] text-[#141414] font-mono font-bold text-xs sm:text-sm uppercase tracking-wider px-4 py-3.5 border-2 border-[#141414] shadow-[2px_2px_0px_#141414] rounded-sm transition-colors text-center"
              >
                <MapPin className="w-4 h-4 text-[#E31E2D]" />
                <span>{t("Explore Public Map", "पब्लिक मैप देखें")}</span>
              </Link>
            </div>
          </div>

          {/* Quick Notice Board / Mini Fact */}
          <div className="lg:col-span-5 bg-white border-2 border-[#141414] p-4 sm:p-5 rounded-xs space-y-3 shadow-[2px_2px_0px_#141414]">
            <div className="flex items-center justify-between border-b border-[#141414] pb-2">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#5C5C5C]">
                {t("Statutory Enforcement", "सख्त प्रशासनिक समय-सीमा")}
              </span>
              <Stamp label="7-DAY RULE" variant="escalated" rotation="-rotate-1" />
            </div>

            <p className="text-xs sm:text-sm text-[#141414] font-serif leading-relaxed">
              &ldquo;{t(
                "Every complaint generates a legally verifiable letter sent directly to the Zonal Officer. If unfixed in 7 days, it automatically escalates to the Municipal Commissioner with local citizen co-signers.",
                "प्रत्येक शिकायत का एक कानूनी पत्र संबंधित जोनल अधिकारी को भेजा जाता है। 7 दिनों में समाधान न होने पर यह स्वतः नगर आयुक्त को एस्केलेट हो जाता है।"
              )}&rdquo;
            </p>

            <div className="border-t border-dashed border-[#CFCAC6] pt-2 flex items-center justify-between text-[11px] font-mono text-[#5C5C5C]">
              <span>UP Mun. Corp Act 1959</span>
              <span className="text-[#2F7D4F] font-bold">100% Open Data</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. "How it Works" - Transit Line Metaphor */}
      <section>
        <TransitTimeline />
      </section>

      {/* 4. Live Map Preview + Recent Reports Grid */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b-2 border-[#141414] pb-2">
          <div>
            <span className="font-mono text-xs text-[#5C5C5C] uppercase tracking-wider block">
              {t("LIVE GHAZIABAD AUDIT MAP", "गाजियाबाद लाइव निगरानी")}
            </span>
            <h2 className="font-extrabold text-lg sm:text-2xl uppercase tracking-tight text-[#141414]">
              {t("Active Civic Complaints & Fixes", "सक्रिय समस्याएं एवं समाधान")}
            </h2>
          </div>
          <Link
            href="/map"
            className="text-xs font-mono font-bold uppercase text-[#141414] hover:text-[#E31E2D] flex items-center gap-1"
          >
            <span>{t("Open Full Interactive Map →", "पूरा इंटरैक्टिव नक्शा खोलें →")}</span>
          </Link>
        </div>

        {/* Small Live Map Preview (Height ~300px) */}
        <div className="h-[280px] sm:h-[340px] border-2 border-[#141414] shadow-[3px_4px_0px_#141414] rounded-sm overflow-hidden">
          <DynamicMap complaints={complaints} zoom={12} />
        </div>

        {/* Recent Complaints Feed (Varied rhythm, real Ghaziabad localities) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {recentComplaints.map((c) => (
            <Link
              key={c.id}
              href={`/c/${c.id}`}
              className="bg-white border-2 border-[#141414] p-4 rounded-sm shadow-[2px_3px_0px_#141414] hover:bg-[#FAF8F5] transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="font-mono text-xs font-bold text-[#5C5C5C] group-hover:text-[#141414]">
                    {c.id}
                  </span>
                  <Stamp
                    label={
                      c.status === "resolved"
                        ? "RESOLVED"
                        : c.status === "escalated"
                        ? `ESCALATED (${c.escalationLevel})`
                        : `DAY ${c.daysOpen} OF 7`
                    }
                    variant={c.status}
                    rotation="-rotate-2"
                  />
                </div>

                <h3 className="font-extrabold text-sm sm:text-base text-[#141414] leading-snug tracking-tight">
                  {lang === "hi" ? c.titleHi : c.title}
                </h3>

                <div className="flex items-center gap-1.5 text-xs text-[#5C5C5C] mt-2 font-mono">
                  <MapPin className="w-3.5 h-3.5 text-[#E31E2D] shrink-0" />
                  <span className="truncate">{c.locationName}</span>
                </div>
              </div>

              <div className="border-t border-dashed border-[#CFCAC6] mt-3 pt-2 flex items-center justify-between text-xs text-[#5C5C5C] font-mono">
                <span>{c.wardName.split("–")[0]}</span>
                <span className="font-bold text-[#141414]">
                  {c.reportedCount} {t("citizens flagged", "नागरिकों ने पुष्टि की")}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. Minimal, Honest Footer */}
      <footer className="border-t-2 border-[#141414] pt-6 pb-8 text-xs font-mono text-[#5C5C5C] space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="font-bold text-[#141414]">Snap2Solve</span> · Open source civic grievance infrastructure.
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/pannapurna041-hash/Snap2Solve_Codesprint"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[#141414] hover:underline font-bold"
            >
              <GithubIcon className="w-3.5 h-3.5" />
              <span>GitHub (MIT License)</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <Link href="/open" className="text-[#141414] hover:underline font-bold">
              Open Data API
            </Link>
          </div>
        </div>
        <div className="text-[11px] text-[#888888]">
          Built by Team Tech Astra, ABES Engineering College for civic hackathon pitch. No SaaS cookies or proprietary tracking.
        </div>
      </footer>
    </div>
  );
}
