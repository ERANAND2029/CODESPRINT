"use client";

import React, { useEffect, useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { getReports } from "@/lib/api";
import { Complaint, WARDS_DATA } from "@/lib/mock-data";
import { DynamicMap } from "@/components/DynamicMap";
import { Stamp } from "@/components/Stamp";
import { StatusBadge } from "@/components/StatusBadge";
import {
  Filter,
  X,
  MapPin,
  Clock,
  Users,
  ChevronRight,
  Layers,
  ArrowUpRight,
  ShieldAlert,
} from "lucide-react";

function MapPageContent() {
  const { lang, t } = useLanguage();
  const searchParams = useSearchParams();
  const initialWardParam = searchParams.get("ward") || "all";

  const [allComplaints, setAllComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedWard, setSelectedWard] = useState<string>(initialWardParam);

  // Selected Pin / Drawer State
  const [activeComplaint, setActiveComplaint] = useState<Complaint | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getReports();
        setAllComplaints(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Update selected ward if query param changes
  useEffect(() => {
    if (initialWardParam) {
      setSelectedWard(initialWardParam);
    }
  }, [initialWardParam]);

  // Filtered complaints
  const filteredComplaints = useMemo(() => {
    return allComplaints.filter((c) => {
      if (selectedCategory !== "all" && c.category !== selectedCategory) return false;
      if (selectedStatus !== "all" && c.status !== selectedStatus) return false;
      if (selectedWard !== "all" && c.wardId !== selectedWard) return false;
      return true;
    });
  }, [allComplaints, selectedCategory, selectedStatus, selectedWard]);

  // Counts for category chips
  const categoryCounts = useMemo(() => {
    return {
      all: allComplaints.length,
      garbage: allComplaints.filter((c) => c.category === "garbage").length,
      pothole: allComplaints.filter((c) => c.category === "pothole").length,
      streetlight: allComplaints.filter((c) => c.category === "streetlight").length,
      waterlogging: allComplaints.filter((c) => c.category === "waterlogging").length,
    };
  }, [allComplaints]);

  return (
    <div className="relative w-full h-[calc(100vh-100px)] md:h-[calc(100vh-66px)] flex flex-col overflow-hidden bg-[#E0DCD9]">
      {/* Top Filter Floating Control Bar */}
      <div className="z-10 bg-[#FAF8F5]/95 backdrop-blur-xs border-b-2 border-[#141414] p-3 shadow-[0px_2px_4px_rgba(0,0,0,0.1)]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs font-mono">
            <span className="text-[11px] font-bold text-[#5C5C5C] uppercase mr-1 hidden lg:inline">
              CATEGORY:
            </span>
            {[
              { id: "all", labelEn: `All (${categoryCounts.all})`, labelHi: `सभी (${categoryCounts.all})` },
              { id: "garbage", labelEn: `Garbage (${categoryCounts.garbage})`, labelHi: `कचरा (${categoryCounts.garbage})` },
              { id: "pothole", labelEn: `Potholes (${categoryCounts.pothole})`, labelHi: `गड्ढे (${categoryCounts.pothole})` },
              { id: "streetlight", labelEn: `Lights (${categoryCounts.streetlight})`, labelHi: `लाइटें (${categoryCounts.streetlight})` },
              { id: "waterlogging", labelEn: `Waterlog (${categoryCounts.waterlogging})`, labelHi: `जलभराव (${categoryCounts.waterlogging})` },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-2.5 py-1 rounded-xs font-bold whitespace-nowrap border transition-all ${
                  selectedCategory === cat.id
                    ? "bg-[#141414] text-white border-[#141414] shadow-[1px_1px_0px_#141414]"
                    : "bg-white text-[#141414] border-[#CFCAC6] hover:border-[#141414]"
                }`}
              >
                {lang === "hi" ? cat.labelHi : cat.labelEn}
              </button>
            ))}
          </div>

          {/* Status & Ward Dropdowns */}
          <div className="flex items-center gap-2 text-xs font-mono">
            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-2 py-1 bg-white border border-[#141414] rounded-xs font-mono text-xs font-bold"
            >
              <option value="all">Status: All Statuses</option>
              <option value="escalated">🔴 Escalated (Breached)</option>
              <option value="pending">🟡 Pending (Clock Running)</option>
              <option value="resolved">🟢 Resolved (Verified)</option>
            </select>

            {/* Ward Filter */}
            <select
              value={selectedWard}
              onChange={(e) => setSelectedWard(e.target.value)}
              className="px-2 py-1 bg-white border border-[#141414] rounded-xs font-mono text-xs font-bold max-w-[150px] sm:max-w-none truncate"
            >
              <option value="all">Ward: All Ghaziabad</option>
              {WARDS_DATA.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>

            <span className="text-[11px] font-bold text-[#5C5C5C] hidden sm:inline ml-1 tabular">
              Showing {filteredComplaints.length}
            </span>
          </div>
        </div>
      </div>

      {/* Main Map Canvas Area */}
      <div className="relative flex-1 w-full h-full">
        <DynamicMap
          complaints={filteredComplaints}
          selectedComplaint={activeComplaint}
          onSelectComplaint={(c) => setActiveComplaint(c)}
        />

        {/* Floating Legend / Guide Indicator (Desktop bottom-left) */}
        <div className="hidden sm:block absolute bottom-4 left-4 z-20 bg-white/95 border-2 border-[#141414] p-2.5 rounded-xs shadow-[2px_2px_0px_#141414] font-mono text-[11px] space-y-1">
          <div className="font-bold text-[#141414] uppercase border-b border-[#CFCAC6] pb-1">
            MARKER COLOR KEY
          </div>
          <div className="flex items-center gap-2 text-[#E31E2D] font-bold">
            <span className="w-2.5 h-2.5 bg-[#E31E2D] rounded-full inline-block" />
            <span>Escalated to Commissioner (Past 7 Days)</span>
          </div>
          <div className="flex items-center gap-2 text-[#9A6700] font-bold">
            <span className="w-2.5 h-2.5 bg-[#C98A00] rounded-full inline-block" />
            <span>Pending Remediation (Clock Active)</span>
          </div>
          <div className="flex items-center gap-2 text-[#2F7D4F] font-bold">
            <span className="w-2.5 h-2.5 bg-[#2F7D4F] rounded-full inline-block" />
            <span>Resolved & Community Verified</span>
          </div>
        </div>

        {/* Selected Complaint Bottom Sheet (Mobile) & Side Panel (Desktop) */}
        {activeComplaint && (
          <aside className="absolute z-30 bottom-0 left-0 right-0 sm:bottom-4 sm:right-4 sm:left-auto sm:w-[380px] bg-white border-2 border-[#141414] shadow-[4px_4px_0px_#141414] rounded-t-sm sm:rounded-sm max-h-[75vh] sm:max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom sm:slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="sticky top-0 bg-white border-b-2 border-[#141414] p-3 flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-black text-[#141414]">
                  {activeComplaint.id}
                </span>
                <Stamp
                  label={
                    activeComplaint.status === "resolved"
                      ? "RESOLVED"
                      : activeComplaint.status === "escalated"
                      ? "ESCALATED"
                      : `DAY ${activeComplaint.daysOpen} OF 7`
                  }
                  variant={activeComplaint.status}
                  rotation="-rotate-2"
                />
              </div>

              <button
                type="button"
                onClick={() => setActiveComplaint(null)}
                className="w-7 h-7 flex items-center justify-center border border-[#141414] hover:bg-[#E0DCD9] rounded-xs"
                title="Close drawer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Photo Thumbnail */}
            <div className="relative aspect-[16/9] bg-[#2B2F36] border-b border-[#141414]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeComplaint.imageUrl}
                alt={activeComplaint.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2 bg-black/80 text-white font-mono text-[10px] uppercase font-bold px-2 py-0.5 border border-white/20 rounded-xs">
                {activeComplaint.category}
              </div>
            </div>

            {/* Content Details */}
            <div className="p-4 space-y-3 text-[#141414]">
              <h3 className="font-extrabold text-base leading-snug tracking-tight">
                {lang === "hi" ? activeComplaint.titleHi : activeComplaint.title}
              </h3>

              <div className="flex items-start gap-1.5 text-xs text-[#5C5C5C]">
                <MapPin className="w-3.5 h-3.5 text-[#E31E2D] shrink-0 mt-0.5" />
                <span className="leading-tight">{activeComplaint.locationName}</span>
              </div>

              <p className="text-xs text-[#2B2F36] leading-relaxed bg-[#FAF8F5] p-2.5 border border-[#CFCAC6] rounded-xs font-serif">
                {lang === "hi" ? activeComplaint.descriptionHi : activeComplaint.description}
              </p>

              {/* Duplicate & Citizen Pressure Counter */}
              <div className="border border-[#141414] bg-[#FAF8F5] p-2.5 rounded-xs flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-1.5 font-bold">
                  <Users className="w-4 h-4 text-[#E31E2D]" />
                  <span>{activeComplaint.reportedCount} CITIZENS FLAGGED</span>
                </div>
                <span className="text-[10px] text-[#5C5C5C]">(Adds legal weight)</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono border-t border-dashed border-[#CFCAC6] pt-2">
                <div>
                  <span className="text-[#5C5C5C] block">MUNICIPAL WARD:</span>
                  <span className="font-bold truncate block">{activeComplaint.wardName.split("–")[0]}</span>
                </div>
                <div>
                  <span className="text-[#5C5C5C] block">ESCALATION TARGET:</span>
                  <span className="font-bold text-[#E31E2D]">{activeComplaint.escalationDate}</span>
                </div>
              </div>

              {/* Action Link to Full Complaint Detail */}
              <div className="pt-2">
                <Link
                  href={`/c/${activeComplaint.id}`}
                  className="w-full py-2.5 px-4 bg-[#141414] hover:bg-[#2B2F36] text-white font-mono text-xs font-bold uppercase tracking-wider border-2 border-[#141414] shadow-[2px_2px_0px_#141414] rounded-xs flex items-center justify-center gap-2"
                >
                  <span>View Full Letter & Timeline / पूरा ब्यौरा</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

export default function MapPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full h-[calc(100vh-100px)] flex items-center justify-center bg-[#E0DCD9] font-mono text-xs">
          Loading Public Civic Map...
        </div>
      }
    >
      <MapPageContent />
    </Suspense>
  );
}
