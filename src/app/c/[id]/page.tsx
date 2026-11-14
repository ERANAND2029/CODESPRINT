"use client";

import React, { useEffect, useState, use, Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { getReportById, confirmReportFix } from "@/lib/api";
import { Complaint, INITIAL_COMPLAINTS } from "@/lib/mock-data";
import { Stamp } from "@/components/Stamp";
import { StatusBadge } from "@/components/StatusBadge";
import { ComplaintLetter } from "@/components/ComplaintLetter";
import {
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  ArrowLeft,
  Share2,
  ThumbsUp,
  ThumbsDown,
  UserCheck,
  ShieldAlert,
  FileText,
} from "lucide-react";

function ComplaintDetailContent({ id }: { id: string }) {
  const { lang, t } = useLanguage();
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmStatus, setConfirmStatus] = useState<string | null>(null);
  const [isVoting, setIsVoting] = useState(false);

  useEffect(() => {
    async function fetchComplaint() {
      try {
        const item = await getReportById(id);
        setComplaint(item);
      } catch (err) {
        console.error("Failed to load complaint", err);
      } finally {
        setLoading(false);
      }
    }
    fetchComplaint();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center font-mono text-xs">
        <div className="w-8 h-8 border-2 border-[#141414] border-t-[#E31E2D] rounded-full animate-spin mx-auto mb-3" />
        <span>Loading municipal dossier {id}...</span>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="max-w-md mx-auto my-16 bg-white border-2 border-[#141414] p-6 text-center rounded-sm shadow-[3px_3px_0px_#141414]">
        <AlertTriangle className="w-8 h-8 text-[#E31E2D] mx-auto mb-2" />
        <h2 className="font-extrabold text-base uppercase text-[#141414]">
          Dossier Not Found / शिकायत नहीं मिली
        </h2>
        <p className="text-xs text-[#5C5C5C] mt-1 font-mono">
          Identifier &ldquo;{id}&rdquo; does not match any logged municipal notice.
        </p>
        <Link
          href="/map"
          className="inline-block mt-4 px-4 py-2 bg-[#141414] text-white font-mono text-xs uppercase font-bold rounded-xs"
        >
          Return to Public Map
        </Link>
      </div>
    );
  }

  // Handle citizen confirmation (Before/After check)
  const handleVerify = async (stillBroken: boolean) => {
    setIsVoting(true);
    try {
      const updated = await confirmReportFix(
        complaint.id,
        stillBroken,
        "Citizen Inspector (You)",
        stillBroken
          ? "I inspected the location in person: The issue remains UNRESOLVED and hazardous."
          : "I inspected the location in person: Fully cleared by municipal crew!"
      );
      if (updated) {
        setComplaint(updated);
        setConfirmStatus(
          stillBroken
            ? "Your verification that this issue is STILL BROKEN has been added to the escalation dossier!"
            : "Thank you for confirming resolution! Community verification logged."
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
      {/* Back button & dossier bar */}
      <div className="flex items-center justify-between border-b-2 border-[#141414] pb-3">
        <Link
          href="/map"
          className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-[#141414] hover:text-[#E31E2D] uppercase"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Public Map</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-[#5C5C5C] hidden sm:inline">
            STATUS:
          </span>
          <Stamp
            label={
              complaint.status === "resolved"
                ? "RESOLVED"
                : complaint.status === "escalated"
                ? `ESCALATED TO ${complaint.escalationLevel}`
                : `DAY ${complaint.daysOpen} OF 7`
            }
            variant={complaint.status}
            rotation="-rotate-2"
          />
        </div>
      </div>

      {/* Header Profile Box */}
      <div className="bg-[#FAF8F5] border-2 border-[#141414] p-4 sm:p-6 rounded-sm shadow-[3px_4px_0px_#141414] space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="font-mono text-xs font-bold text-[#5C5C5C]">
            OFFICIAL DOSSIER: <span className="text-[#141414] font-black">{complaint.id}</span>
          </div>
          <div className="text-xs font-mono text-[#5C5C5C]">
            Ref: {complaint.officialRef} · Logged {complaint.dateReported}
          </div>
        </div>

        <h1 className="font-extrabold text-xl sm:text-3xl text-[#141414] uppercase tracking-tight leading-tight">
          {lang === "hi" ? complaint.titleHi : complaint.title}
        </h1>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono text-[#5C5C5C]">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-[#E31E2D]" />
            <strong className="text-[#141414]">{complaint.locationName}</strong>
          </span>
          <span>·</span>
          <span>{complaint.wardName}</span>
          <span>·</span>
          <span>Authority: {complaint.authority}</span>
        </div>
      </div>

      {/* Grid: Photo & Metadata + Vertical Escalation Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: Evidence photo + Before/After Check */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Evidence Photo */}
          <div className="bg-white border-2 border-[#141414] p-3 rounded-sm shadow-[3px_3px_0px_#141414] space-y-2">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-[#5C5C5C]">
              <span>ORIGINAL GEOTAGGED PHOTO / फोटो प्रमाण</span>
              <span className="text-[#141414]">GPS TIMESTAMPED</span>
            </div>
            <div className="relative aspect-[16/10] bg-[#2B2F36] border border-[#141414] rounded-xs overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={complaint.imageUrl}
                alt={complaint.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 bg-black/85 text-white font-mono text-[10px] px-2 py-1 rounded-xs border border-white/20">
                Lat: {complaint.lat.toFixed(4)} · Lng: {complaint.lng.toFixed(4)}
              </div>
            </div>
            <p className="text-xs text-[#2B2F36] font-serif p-2 bg-[#FAF8F5] border border-[#CFCAC6] rounded-xs leading-relaxed">
              {lang === "hi" ? complaint.descriptionHi : complaint.description}
            </p>
          </div>

          {/* Before / After Check Section */}
          <div className="bg-white border-2 border-[#141414] p-4 sm:p-5 rounded-sm shadow-[3px_3px_0px_#141414] space-y-4">
            <div className="border-b border-[#141414] pb-2 flex items-center justify-between">
              <div>
                <span className="font-mono text-xs font-bold uppercase text-[#5C5C5C] block">
                  COMMUNITY AUDIT & VERIFICATION
                </span>
                <h3 className="font-extrabold text-base uppercase text-[#141414]">
                  Before / After Check · मौके की जांच
                </h3>
              </div>
              <UserCheck className="w-5 h-5 text-[#2F7D4F]" />
            </div>

            {/* Resolved comparison if resolved image exists */}
            {complaint.resolvedImageUrl && (
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div>
                  <span className="block text-[10px] uppercase text-[#E31E2D] font-bold mb-1">
                    BEFORE (REPORTED)
                  </span>
                  <div className="aspect-[4/3] bg-black border border-[#141414] overflow-hidden rounded-xs">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={complaint.imageUrl}
                      alt="Before"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div>
                  <span className="block text-[10px] uppercase text-[#2F7D4F] font-bold mb-1">
                    AFTER (RESOLVED)
                  </span>
                  <div className="aspect-[4/3] bg-black border border-[#141414] overflow-hidden rounded-xs">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={complaint.resolvedImageUrl}
                      alt="After fix"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Existing Nearby Citizen Confirmations */}
            <div className="space-y-2.5">
              <span className="text-xs font-mono font-bold uppercase text-[#5C5C5C] block">
                Local Citizen Field Confirmations ({complaint.confirmations.length}):
              </span>

              {complaint.confirmations.length === 0 ? (
                <div className="text-xs font-mono text-[#888888] italic p-3 bg-[#FAF8F5] border border-dashed border-[#CFCAC6] rounded-xs">
                  No citizen inspection reviews logged yet. Be the first neighbor to verify!
                </div>
              ) : (
                complaint.confirmations.map((conf, i) => (
                  <div
                    key={i}
                    className="p-2.5 bg-[#FAF8F5] border border-[#141414] rounded-xs space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between font-mono">
                      <div className="flex items-center gap-1.5 font-bold text-[#141414]">
                        <span className="w-5 h-5 bg-[#141414] text-white flex items-center justify-center text-[10px] rounded-xs">
                          {conf.avatar}
                        </span>
                        <span>{conf.userName}</span>
                      </div>
                      <span className="text-[10px] text-[#5C5C5C]">{conf.timestamp}</span>
                    </div>
                    <p className="font-sans text-xs text-[#2B2F36]">{conf.comment}</p>
                    <div className="text-[10px] font-mono font-bold">
                      {conf.isFixed ? (
                        <span className="text-[#2F7D4F]">✓ Verified Fixed</span>
                      ) : (
                        <span className="text-[#E31E2D]">✗ Flagged as STILL BROKEN</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Interactive Citizen Action */}
            <div className="border-t border-dashed border-[#CFCAC6] pt-3 space-y-2">
              <span className="text-xs font-mono font-bold text-[#141414] block">
                Have you passed by this spot today? Cast your audit vote:
              </span>

              <div className="grid grid-cols-2 gap-2 font-mono text-xs font-bold">
                <button
                  type="button"
                  onClick={() => handleVerify(false)}
                  disabled={isVoting}
                  className="py-2.5 px-3 bg-white hover:bg-[#2F7D4F]/10 text-[#2F7D4F] border-2 border-[#2F7D4F] rounded-xs shadow-[1px_1px_0px_#141414] flex items-center justify-center gap-1.5"
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>I Confirm Fixed</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleVerify(true)}
                  disabled={isVoting}
                  className="py-2.5 px-3 bg-white hover:bg-[#E31E2D]/10 text-[#E31E2D] border-2 border-[#E31E2D] rounded-xs shadow-[1px_1px_0px_#141414] flex items-center justify-center gap-1.5"
                >
                  <ThumbsDown className="w-4 h-4" />
                  <span>Still Broken / टूटा है</span>
                </button>
              </div>

              {confirmStatus && (
                <div className="p-2.5 bg-[#141414] text-white font-mono text-xs rounded-xs mt-2">
                  {confirmStatus}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right column: Vertical Escalation Timeline */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#FAF8F5] border-2 border-[#141414] p-4 sm:p-5 rounded-sm shadow-[3px_4px_0px_#141414] space-y-4">
            <div className="border-b border-[#141414] pb-2 flex items-center justify-between">
              <div>
                <span className="font-mono text-xs font-bold uppercase text-[#5C5C5C] block">
                  LEGAL REDRESSAL PROGRESS
                </span>
                <h3 className="font-extrabold text-base uppercase text-[#141414]">
                  Vertical Escalation Track
                </h3>
              </div>
              <Clock className="w-5 h-5 text-[#E31E2D]" />
            </div>

            {/* Vertical timeline steps */}
            <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-[#141414]">
              {complaint.timeline.map((step, idx) => {
                const isCurrent = step.status === "current";
                const isCompleted = step.status === "completed";

                return (
                  <div key={idx} className="relative group">
                    <div
                      className={`absolute -left-[24px] top-0.5 w-6 h-6 rounded-xs border-2 border-[#141414] flex items-center justify-center font-mono text-[10px] font-black ${
                        isCurrent
                          ? "bg-[#E31E2D] text-white shadow-[1px_2px_0px_#141414] animate-pulse"
                          : isCompleted
                          ? "bg-[#141414] text-white"
                          : "bg-[#E0DCD9] text-[#888888] border-[#CFCAC6]"
                      }`}
                    >
                      {isCompleted ? "✓" : `D${step.day}`}
                    </div>

                    <div className="pl-3">
                      <div className="flex items-center justify-between gap-1">
                        <span
                          className={`font-mono text-xs uppercase font-extrabold ${
                            isCurrent ? "text-[#E31E2D]" : "text-[#141414]"
                          }`}
                        >
                          {lang === "hi" ? step.titleHi : step.title}
                        </span>
                        <span className="text-[10px] font-mono text-[#5C5C5C]">
                          {step.timestamp}
                        </span>
                      </div>
                      <p className="text-xs text-[#5C5C5C] font-sans mt-0.5 leading-snug">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* RTI Draft trigger block */}
            <div className="border border-[#141414] bg-white p-3 rounded-xs space-y-2 mt-4">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#141414]">
                <FileText className="w-4 h-4 text-[#E31E2D]" />
                <span>RTI APPLICATION DRAFT / जन सूचना प्रपत्र</span>
              </div>
              <p className="text-[11px] text-[#5C5C5C] leading-snug">
                If not addressed by Day 14, an automated UP RTI Section 6(1) inquiry is queued requesting official names of delinquent contractors and engineers.
              </p>
              <div className="font-mono text-[10px] font-bold text-[#E31E2D] bg-[#E31E2D]/5 px-2 py-1 border border-[#E31E2D]/30 rounded-xs">
                UP RIGHT TO INFORMATION DOCKET #S2S-{complaint.id.split("-")[2]} READY
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Official Municipal Formal Letter View */}
      <section className="space-y-3">
        <div className="border-b-2 border-[#141414] pb-2">
          <span className="font-mono text-xs uppercase font-bold text-[#5C5C5C] block">
            STATUTORY CORRESPONDENCE
          </span>
          <h2 className="font-extrabold text-xl uppercase tracking-tight text-[#141414]">
            Official Dispatched Notice to Municipal Corporation
          </h2>
        </div>

        <ComplaintLetter
          complaintId={complaint.id}
          officialRef={complaint.officialRef}
          category={complaint.category}
          locationName={complaint.locationName}
          wardName={complaint.wardName}
          lat={complaint.lat}
          lng={complaint.lng}
          dateStr={complaint.dateReported}
          escalationDateStr={complaint.escalationDate}
          letterEn={complaint.formalLetterEn}
          letterHi={complaint.formalLetterHi}
          status={complaint.status}
        />
      </section>
    </div>
  );
}

function ParamResolver({ paramsPromise }: { paramsPromise: Promise<{ id: string }> }) {
  const resolved = use(paramsPromise);
  return <ComplaintDetailContent id={resolved.id} />;
}

export default function ComplaintDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="max-w-4xl mx-auto px-4 py-16 text-center font-mono text-xs">
          Loading municipal dossier...
        </div>
      }
    >
      <ParamResolver paramsPromise={params} />
    </Suspense>
  );
}
