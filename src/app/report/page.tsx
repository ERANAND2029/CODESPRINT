"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { StepIndicator } from "@/components/StepIndicator";
import { ComplaintLetter } from "@/components/ComplaintLetter";
import { Stamp } from "@/components/Stamp";
import { detectIssueFromImage, submitReport, DetectionResult } from "@/lib/api";
import { Complaint, WARDS_DATA } from "@/lib/mock-data";
import {
  Camera,
  Upload,
  MapPin,
  CheckCircle,
  AlertCircle,
  Clock,
  ArrowRight,
  RefreshCw,
  Share2,
  FileText,
  Navigation,
} from "lucide-react";

// Preset test civic images for quick hackathon pitch demos
const DEMO_PRESETS = [
  {
    label: "Garbage Dump (Indirapuram)",
    category: "garbage",
    imageUrl: "https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=700&q=80",
    locationName: "Shakti Khand 2 Market, Indirapuram",
    lat: 28.6418,
    lng: 77.3715,
    wardId: "ward-14",
  },
  {
    label: "Road Crater / Pothole (Raj Nagar)",
    category: "pothole",
    imageUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=700&q=80",
    locationName: "Opposite DPS Gate 2, Raj Nagar Extension",
    lat: 28.7045,
    lng: 77.4368,
    wardId: "ward-31",
  },
  {
    label: "Broken Streetlight (Vaishali)",
    category: "streetlight",
    imageUrl: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=700&q=80",
    locationName: "Sector 4 Promenade, Vaishali",
    lat: 28.6488,
    lng: 77.3402,
    wardId: "ward-22",
  },
  {
    label: "Drain Waterlogging (Sahibabad)",
    category: "waterlogging",
    imageUrl: "https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=700&q=80",
    locationName: "Site 4 Industrial Area, Sahibabad",
    lat: 28.6755,
    lng: 77.3625,
    wardId: "ward-03",
  },
];

export default function ReportPage() {
  const router = useRouter();
  const { lang, t } = useLanguage();

  // Current Step: 1 (Capture), 2 (Draft), 3 (Done)
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [selectedImage, setSelectedImage] = useState<string>(DEMO_PRESETS[0].imageUrl);
  const [locationName, setLocationName] = useState(DEMO_PRESETS[0].locationName);
  const [lat, setLat] = useState(DEMO_PRESETS[0].lat);
  const [lng, setLng] = useState(DEMO_PRESETS[0].lng);
  const [selectedWardId, setSelectedWardId] = useState(DEMO_PRESETS[0].wardId);
  const [notes, setNotes] = useState("");

  // AI Detection State
  const [isDetecting, setIsDetecting] = useState(false);
  const [detection, setDetection] = useState<DetectionResult>({
    category: "garbage",
    confidence: 94,
    labelEn: "Open Solid Waste Accumulation",
    labelHi: "खुला कचरा डंप / गंदगी का ढेर",
    detailsEn: "Mixed municipal solid waste encroaching public right-of-way. High biological hazard.",
    detailsHi: "सार्वजनिक रास्ते पर कचरे का बड़ा ढेर। संक्रामक बीमारियों का खतरा।",
    detectedBylaws: "Solid Waste Management Rules 2016, Rule 15(zg)",
  });

  // Manual category override
  const [category, setCategory] = useState<"garbage" | "pothole" | "streetlight" | "waterlogging">("garbage");

  // Submitted Report State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReport, setSubmittedReport] = useState<Complaint | null>(null);

  // Trigger AI detection simulation
  const handleDetect = async (imgUrl: string, sampleCategory?: string) => {
    setIsDetecting(true);
    try {
      const res = await detectIssueFromImage(sampleCategory || imgUrl);
      setDetection(res);
      setCategory(res.category);
    } catch (err) {
      console.error("Detection error", err);
    } finally {
      setIsDetecting(false);
    }
  };

  // Switch demo preset
  const handleSelectPreset = (preset: typeof DEMO_PRESETS[0]) => {
    setSelectedImage(preset.imageUrl);
    setLocationName(preset.locationName);
    setLat(preset.lat);
    setLng(preset.lng);
    setSelectedWardId(preset.wardId);
    handleDetect(preset.imageUrl, preset.category);
  };

  // File Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedImage(url);
      handleDetect(file.name);
    }
  };

  // Submit and start 7-day clock
  const handleSubmitAndStartClock = async () => {
    setIsSubmitting(true);
    try {
      const report = await submitReport({
        category,
        locationName,
        lat,
        lng,
        wardId: selectedWardId,
        notes,
        imageUrl: selectedImage,
        lang,
      });
      setSubmittedReport(report);
      setStep(3);
    } catch (err) {
      console.error("Submission failed", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const matchedWard = WARDS_DATA.find((w) => w.id === selectedWardId) || WARDS_DATA[0];

  return (
    <div className="min-h-screen bg-[#E0DCD9] pb-12">
      {/* Step Tracker */}
      <StepIndicator currentStep={step} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* ================= STEP 1: CAPTURE & DETECTION ================= */}
        {step === 1 && (
          <div className="space-y-6">
            {/* Header info */}
            <div className="border-b-2 border-[#141414] pb-3">
              <span className="font-mono text-xs uppercase tracking-wider text-[#5C5C5C] block">
                STEP 01 OF 03 · CIVIC EVIDENCE COLLECTION
              </span>
              <h2 className="font-extrabold text-xl sm:text-2xl uppercase tracking-tight text-[#141414]">
                {t("Capture Civic Problem / फोटो खींचें", "समस्या की फोटो खींचें")}
              </h2>
              <p className="text-xs sm:text-sm text-[#5C5C5C] mt-1">
                {t(
                  "Snap a photo or select a test sample. Our model will auto-classify the grievance and pinpoint the municipal ward.",
                  "फोटो अपलोड करें या डेमो के लिए नीचे दिए सैंपल में से चुनें। मॉडल समस्या की पहचान कर संबंधित वार्ड तय करेगा।"
                )}
              </p>
            </div>

            {/* Quick Demo Presets Strip (Essential for smooth hackathon pitches) */}
            <div className="bg-white border-2 border-[#141414] p-3 rounded-xs shadow-[2px_2px_0px_#141414]">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#5C5C5C] block mb-2">
                ⚡ HACKATHON LIVE DEMO PRESETS / तुरंत टेस्ट करें:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {DEMO_PRESETS.map((preset) => {
                  const isSelected = selectedImage === preset.imageUrl;
                  return (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => handleSelectPreset(preset)}
                      className={`p-2 text-left text-xs font-mono border rounded-xs transition-all ${
                        isSelected
                          ? "bg-[#141414] text-white border-[#141414] shadow-[1px_2px_0px_#141414]"
                          : "bg-[#FAF8F5] text-[#141414] border-[#CFCAC6] hover:border-[#141414]"
                      }`}
                    >
                      <span className="font-bold block truncate">{preset.label.split("(")[0]}</span>
                      <span className="text-[10px] opacity-75 truncate block">
                        {preset.locationName.split(",")[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Photo Preview & Upload Box */}
            <div className="bg-white border-2 border-[#141414] p-4 sm:p-5 rounded-xs shadow-[3px_4px_0px_#141414] space-y-4">
              <div className="relative aspect-[4/3] sm:aspect-[16/9] bg-[#2B2F36] border border-[#141414] rounded-xs overflow-hidden flex items-center justify-center">
                {selectedImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={selectedImage}
                    alt="Civic issue preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-6 text-white font-mono text-xs">
                    <Camera className="w-8 h-8 mx-auto mb-2 text-[#CFCAC6]" />
                    <span>No image captured yet</span>
                  </div>
                )}

                {/* AI Scanning Overlay */}
                {isDetecting && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex flex-col items-center justify-center p-4 text-center">
                    <div className="w-10 h-10 border-3 border-white border-t-[#E31E2D] rounded-full animate-spin mb-3" />
                    <span className="font-mono text-xs uppercase font-extrabold text-white tracking-widest animate-pulse">
                      AI VISION SCANNING VIOLATION...
                    </span>
                    <span className="font-mono text-[11px] text-[#CFCAC6] mt-1">
                      कचरा / गड्ढा / लाइट विश्लेषण जारी...
                    </span>
                  </div>
                )}

                {/* Live Confidence Watermark */}
                {!isDetecting && detection && (
                  <div className="absolute top-3 left-3 bg-[#141414]/90 text-white font-mono text-[11px] px-2.5 py-1 border border-white/30 rounded-xs flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-[#2F7D4F]" />
                    <span>AI MATCH: {detection.confidence}% CONFIDENCE</span>
                  </div>
                )}
              </div>

              {/* Upload Input Button */}
              <div className="flex items-center gap-3">
                <label className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-[#FAF8F5] text-[#141414] font-mono text-xs uppercase font-bold border border-[#141414] rounded-xs shadow-[1px_1px_0px_#141414] cursor-pointer">
                  <Upload className="w-4 h-4" />
                  <span>{t("Upload another photo / फोटो बदलें", "फोटो अपलोड करें")}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                <button
                  type="button"
                  onClick={() => handleDetect(selectedImage, category)}
                  disabled={isDetecting}
                  className="px-3 py-2.5 bg-[#E0DCD9] hover:bg-[#CFCAC6] text-[#141414] font-mono text-xs font-bold border border-[#141414] rounded-xs shadow-[1px_1px_0px_#141414]"
                  title="Re-run classification"
                >
                  <RefreshCw className={`w-4 h-4 ${isDetecting ? "animate-spin" : ""}`} />
                </button>
              </div>
            </div>

            {/* AI Classification & Location Result Card */}
            <div className="bg-[#FAF8F5] border-2 border-[#141414] p-4 sm:p-5 rounded-xs shadow-[2px_3px_0px_#141414] space-y-4">
              <div className="flex items-center justify-between border-b border-[#141414] pb-2">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#5C5C5C]">
                  {t("Automated Municipal Assessment", "स्वचालित नगर निगम जांच")}
                </span>
                <span className="font-mono text-xs font-bold text-[#2F7D4F] bg-[#2F7D4F]/10 px-2 py-0.5 border border-[#2F7D4F]/30 rounded-xs">
                  {detection.detectedBylaws.split(",")[0]}
                </span>
              </div>

              {/* Detected Category Selector (Allows user correction) */}
              <div>
                <label className="block text-xs font-mono font-bold uppercase text-[#5C5C5C] mb-1.5">
                  Detected Category (Tap to correct / गलत हो तो बदलें):
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: "garbage", labelEn: "Garbage Dump", labelHi: "कचरा डंप" },
                    { id: "pothole", labelEn: "Road Crater", labelHi: "सड़क गड्ढा" },
                    { id: "streetlight", labelEn: "Broken Light", labelHi: "खराब लाइट" },
                    { id: "waterlogging", labelEn: "Waterlogging", labelHi: "जलभराव" },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id as any)}
                      className={`p-2 text-left font-mono text-xs border rounded-xs transition-colors ${
                        category === cat.id
                          ? "bg-[#141414] text-white border-[#141414] font-bold shadow-[1px_1px_0px_#141414]"
                          : "bg-white text-[#141414] border-[#CFCAC6] hover:bg-[#FAF8F5]"
                      }`}
                    >
                      <div>{cat.labelEn}</div>
                      <div className="text-[10px] opacity-75">{cat.labelHi}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* GPS Coordinates Box */}
              <div className="border border-[#141414] bg-white p-3 rounded-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#141414]">
                    <Navigation className="w-3.5 h-3.5 text-[#E31E2D]" />
                    <span>GPS CAPTURED / स्थान सत्यापित</span>
                  </div>
                  <span className="font-mono text-[11px] text-[#5C5C5C] tabular">
                    {lat.toFixed(4)}° N, {lng.toFixed(4)}° E
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="block text-[10px] font-mono text-[#5C5C5C] uppercase">
                      Street Address / क्षेत्र:
                    </label>
                    <input
                      type="text"
                      value={locationName}
                      onChange={(e) => setLocationName(e.target.value)}
                      className="w-full mt-0.5 p-1.5 border border-[#141414] rounded-xs font-sans text-xs bg-[#FAF8F5]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-[#5C5C5C] uppercase">
                      Assigned Municipal Ward:
                    </label>
                    <select
                      value={selectedWardId}
                      onChange={(e) => setSelectedWardId(e.target.value)}
                      className="w-full mt-0.5 p-1.5 border border-[#141414] rounded-xs font-mono text-xs bg-[#FAF8F5]"
                    >
                      {WARDS_DATA.map((w) => (
                        <option key={w.id} value={w.id}>
                          {w.name} ({w.zone})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Optional Citizen Remarks */}
              <div>
                <label className="block text-xs font-mono font-bold uppercase text-[#5C5C5C] mb-1">
                  Optional notes / अतिरिक्त विवरण (e.g. school bus blocked, 10 days old):
                </label>
                <input
                  type="text"
                  placeholder="e.g. School route blocked; foul smell entering houses"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2 border border-[#141414] rounded-xs font-sans text-xs bg-white"
                />
              </div>
            </div>

            {/* Next Action Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full py-3.5 px-6 bg-[#141414] hover:bg-[#2B2F36] text-white font-mono font-bold text-sm uppercase tracking-wider border-2 border-[#141414] shadow-[3px_3px_0px_#141414] rounded-xs flex items-center justify-center gap-2 active:translate-y-0.5 transition-transform"
              >
                <span>Draft Formal Complaint Notice / कानूनी पत्र तैयार करें</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 2: FORMAL COMPLAINT DRAFT ================= */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="border-b-2 border-[#141414] pb-3 flex items-center justify-between">
              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-[#5C5C5C] block">
                  STEP 02 OF 03 · STATUTORY NOTICE GENERATION
                </span>
                <h2 className="font-extrabold text-xl sm:text-2xl uppercase tracking-tight text-[#141414]">
                  {t("Formal Municipal Notice / पत्र प्रारूप", "वैधानिक सूचना पत्र")}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs font-mono font-bold underline text-[#5C5C5C] hover:text-[#141414]"
              >
                ← Edit Photo & Location
              </button>
            </div>

            {/* The Real Municipal Notice Component */}
            <ComplaintLetter
              complaintId="S2S-GZB-DRAFT"
              officialRef="NNG/Z3/2026/GRIEVANCE"
              category={category}
              locationName={locationName}
              wardName={matchedWard.name}
              lat={lat}
              lng={lng}
              dateStr={new Date().toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
              escalationDateStr="7 Days from dispatch"
              letterEn={`TO:
The Zonal Officer (${matchedWard.zone}),
Nagar Nigam Ghaziabad - 201001

SUBJECT: STATUTORY GRIEVANCE NOTICE UNDER UP MUNICIPAL CORPORATION ACT 1959 REGARDING ${category.toUpperCase()} AT ${locationName.toUpperCase()}.

Sir/Madam,

This formal grievance is lodged regarding acute public nuisance and failure of civic upkeep at ${locationName} (Coordinates: ${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E, Ward: ${matchedWard.name}).

Category Identified: ${category.toUpperCase()}
Violations Referenced: ${detection.detectedBylaws}
Citizen notes: ${notes || "Reported with GPS verified visual evidence."}

Please take notice that pursuant to the citizens charter, a strict 7-day remediation period begins upon receipt of this transmission. If remediation is not executed within 7 days, this complaint will automatically escalate to the Municipal Commissioner and Ward Officer for statutory accountability.

Issued via Snap2Solve Civic Redressal Protocol.`}
              letterHi={`सेवा में:
जोनल अधिकारी (${matchedWard.zone}),
नगर निगम गाजियाबाद - 201001

विषय: उत्तर प्रदेश नगर निगम अधिनियम 1959 के तहत ${locationName} पर ${category} की समस्या के संबंध में वैधानिक सूचना।

महोदय/महोदया,

यह औपचारिक शिकायत ${locationName} (निर्देशांक: ${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E, वार्ड: ${matchedWard.nameHi}) पर सार्वजनिक समस्या के संबंध में दर्ज की जा रही है।

समस्या श्रेणी: ${category}
संबद्ध नियम: ${detection.detectedBylaws}
नागरिक विवरण: ${notes || "जीपीएस प्रमाणित फोटो सहित प्रेषित।"}

कृपया संज्ञान लें कि नागरिक घोषणापत्र के तहत 7 दिन की समय-सीमा निर्धारित है। यदि 7 दिनों के भीतर समस्या का निस्तारण नहीं होता है, तो यह मामला स्वतः नगर आयुक्त स्तर पर एस्केलेट हो जाएगा।

Snap2Solve नागरिक सेवा द्वारा जारी।`}
              isEditable={true}
            />

            {/* Submit Action Box */}
            <div className="bg-[#FAF8F5] border-2 border-[#141414] p-4 sm:p-5 rounded-xs shadow-[2px_3px_0px_#141414] space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#E31E2D]">
                <Clock className="w-4 h-4" />
                <span>START 7-DAY AUTOMATIC ESCALATION CLOCK</span>
              </div>
              <p className="text-xs text-[#5C5C5C] leading-relaxed">
                Clicking the button below registers the complaint into the Ghaziabad public registry, starts the 7-day countdown, and assigns a permanent verification URL.
              </p>
              <button
                type="button"
                onClick={handleSubmitAndStartClock}
                disabled={isSubmitting}
                className="w-full py-4 px-6 bg-[#E31E2D] hover:bg-[#C91A27] text-white font-mono font-black text-sm uppercase tracking-wider border-2 border-[#141414] shadow-[3px_4px_0px_#141414] rounded-xs flex items-center justify-center gap-2 active:translate-y-0.5 transition-transform"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Transmitting to Nagar Nigam Gateway...</span>
                  </>
                ) : (
                  <>
                    <span>Submit & Start 7-Day Clock / दर्ज करें और घड़ी शुरू करें</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 3: DONE & STAMP LANDED ================= */}
        {step === 3 && submittedReport && (
          <div className="space-y-6">
            {/* Stamp Lands Celebration Box */}
            <div className="bg-white border-2 border-[#141414] p-6 sm:p-8 rounded-sm shadow-[4px_6px_0px_#141414] text-center space-y-4 relative overflow-hidden">
              {/* Realistic Stamp Mark Animated/Prominent */}
              <div className="inline-block transform -rotate-3 border-4 border-[#2F7D4F] text-[#2F7D4F] bg-[#2F7D4F]/10 px-5 py-2 font-mono font-black text-base sm:text-xl uppercase tracking-widest shadow-[2px_3px_0px_rgba(47,125,79,0.3)] animate-bounce">
                RECEIVED · 7-DAY CLOCK STARTED
              </div>

              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-[#5C5C5C] block">
                  PERMANENT COMPLAINT IDENTIFIER
                </span>
                <div className="font-mono text-2xl sm:text-3xl font-black text-[#141414] mt-1 select-all">
                  {submittedReport.id}
                </div>
              </div>

              {/* 7-Day Target Countdown Card */}
              <div className="bg-[#FAF8F5] border-2 border-[#141414] p-4 rounded-xs max-w-md mx-auto text-left space-y-2">
                <div className="flex items-center justify-between text-xs font-mono font-bold text-[#141414]">
                  <span>ESCALATION TARGET:</span>
                  <span className="text-[#E31E2D]">{submittedReport.escalationDate}</span>
                </div>
                <div className="w-full bg-[#E0DCD9] h-2 rounded-xs overflow-hidden border border-[#141414]">
                  <div className="bg-[#C98A00] h-full w-[14%]" />
                </div>
                <div className="flex justify-between text-[11px] font-mono text-[#5C5C5C]">
                  <span>Day 1 of 7</span>
                  <span>Escalates to Municipal Commissioner</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#2B2F36] max-w-lg mx-auto leading-relaxed">
                {t(
                  `Notice has been logged for ${submittedReport.locationName}. If field officers fail to remediate the ${submittedReport.category} within 7 days, this dossier automatically escalates to the Municipal Commissioner with neighborhood co-signers.`,
                  `आपकी शिकायत दर्ज कर ली गई है। 7 दिनों में समाधान न होने पर यह मामला स्वतः नगर आयुक्त को प्रेषित हो जाएगा।`
                )}
              </p>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
                <Link
                  href={`/c/${submittedReport.id}`}
                  className="px-5 py-3 bg-[#141414] hover:bg-[#2B2F36] text-white font-mono text-xs uppercase font-bold border-2 border-[#141414] shadow-[2px_2px_0px_#141414] rounded-xs text-center"
                >
                  Track Complaint Dossier →
                </Link>

                <Link
                  href="/map"
                  className="px-5 py-3 bg-white hover:bg-[#FAF8F5] text-[#141414] font-mono text-xs uppercase font-bold border-2 border-[#141414] shadow-[2px_2px_0px_#141414] rounded-xs text-center"
                >
                  View on Public Map
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setSubmittedReport(null);
                  }}
                  className="px-4 py-3 bg-[#E0DCD9] hover:bg-[#CFCAC6] text-[#141414] font-mono text-xs uppercase font-bold border border-[#141414] rounded-xs text-center"
                >
                  Report Another Issue
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
