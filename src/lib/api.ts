import { Complaint, WardStat, INITIAL_COMPLAINTS, WARDS_DATA } from "./mock-data";

// In-memory runtime cache for the active session
let runtimeComplaints: Complaint[] = [...INITIAL_COMPLAINTS];
const runtimeWards: WardStat[] = [...WARDS_DATA];

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getRandomDelay(min = 600, max = 1100) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export interface NewReportInput {
  category: "garbage" | "pothole" | "streetlight" | "waterlogging";
  locationName: string;
  lat: number;
  lng: number;
  wardId?: string;
  notes?: string;
  imageUrl?: string;
  lang?: "en" | "hi";
}

export interface DetectionResult {
  category: "garbage" | "pothole" | "streetlight" | "waterlogging";
  confidence: number;
  labelEn: string;
  labelHi: string;
  detailsEn: string;
  detailsHi: string;
  detectedBylaws: string;
}

/**
 * Simulate AI Vision detection with realistic civic classification
 */
export async function detectIssueFromImage(
  imageSource: string | File
): Promise<DetectionResult> {
  // Simulate 800-1200ms realistic computer vision pipeline delay
  await delay(900);

  // If a specific keyword is in filename or sample, match it; otherwise default intelligently
  const sourceStr = typeof imageSource === "string" ? imageSource.toLowerCase() : imageSource.name.toLowerCase();

  if (sourceStr.includes("pothole") || sourceStr.includes("road") || sourceStr.includes("crater")) {
    return {
      category: "pothole",
      confidence: 96,
      labelEn: "Hazardous Pothole / Road Crater",
      labelHi: "खतरनाक गड्ढा / टूटी सड़क",
      detailsEn: "Depression depth approx >10cm detected on bituminous surface. High hazard index for two-wheelers.",
      detailsHi: "डामर सड़क पर 10 सेमी से अधिक गहरा गड्ढा चिन्हित। दोपहिया वाहनों के लिए गंभीर खतरा।",
      detectedBylaws: "UP Municipal Corporation Act 1959, Section 243 (Road Maintenance)",
    };
  }

  if (sourceStr.includes("light") || sourceStr.includes("lamp") || sourceStr.includes("dark")) {
    return {
      category: "streetlight",
      confidence: 93,
      labelEn: "Non-functional Streetlight / Dark Stretch",
      labelHi: "खराब स्ट्रीटलाइट / अंधेरा मार्ग",
      detailsEn: "Overhead luminaire non-operational during required hours. Unlit public transit zone.",
      detailsHi: "स्ट्रीट लाइट का बल्ब बंद पाया गया। सार्वजनिक मार्ग पर अंधेरा।",
      detectedBylaws: "UP Municipalities Act, Section 7(1)(c) (Public Lighting)",
    };
  }

  if (sourceStr.includes("water") || sourceStr.includes("flood") || sourceStr.includes("drain")) {
    return {
      category: "waterlogging",
      confidence: 95,
      labelEn: "Severe Waterlogging / Choked Drain",
      labelHi: "गंभीर जलभराव / चोक नाली",
      detailsEn: "Surface runoff accumulation >15cm. Sewer backflow identified.",
      detailsHi: "15 सेमी से अधिक गंदा पानी भरा हुआ है। नाली चोक होने के प्रमाण।",
      detectedBylaws: "UP Water Supply & Sewerage Act 1975, Section 54",
    };
  }

  // Default to Garbage Dump (most common civic snapshot)
  return {
    category: "garbage",
    confidence: 94,
    labelEn: "Open Solid Waste Accumulation",
    labelHi: "खुला कचरा डंप / गंदगी का ढेर",
    detailsEn: "Mixed municipal solid waste encroaching public right-of-way. High biological hazard.",
    detailsHi: "सार्वजनिक रास्ते पर कचरे का बड़ा ढेर। संक्रामक बीमारियों का खतरा।",
    detectedBylaws: "Solid Waste Management Rules 2016, Rule 15(zg)",
  };
}

/**
 * Fetch complaints with optional filtering
 */
export async function getReports(filters?: {
  category?: string;
  status?: string;
  wardId?: string;
  search?: string;
}): Promise<Complaint[]> {
  await delay(getRandomDelay(300, 700));

  let results = [...runtimeComplaints];

  if (filters?.category && filters.category !== "all") {
    results = results.filter((c) => c.category === filters.category);
  }

  if (filters?.status && filters.status !== "all") {
    results = results.filter((c) => c.status === filters.status);
  }

  if (filters?.wardId && filters.wardId !== "all") {
    results = results.filter((c) => c.wardId === filters.wardId);
  }

  if (filters?.search) {
    const q = filters.search.toLowerCase();
    results = results.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.titleHi.toLowerCase().includes(q) ||
        c.locationName.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q)
    );
  }

  return results;
}

/**
 * Fetch a single complaint by ID
 */
export async function getReportById(id: string): Promise<Complaint | null> {
  await delay(getRandomDelay(200, 500));
  const found = runtimeComplaints.find(
    (c) => c.id.toLowerCase() === id.toLowerCase()
  );
  return found || null;
}

/**
 * Fetch Ward Statistics
 */
export async function getWardStats(): Promise<WardStat[]> {
  await delay(getRandomDelay(300, 600));
  return [...runtimeWards];
}

/**
 * Get summary stats for hero strip
 */
export async function getCitySummaryMetrics() {
  await delay(200);
  const total = runtimeComplaints.length;
  const resolved = runtimeComplaints.filter((c) => c.status === "resolved").length;
  const escalated = runtimeComplaints.filter((c) => c.status === "escalated").length;
  const pending = runtimeComplaints.filter((c) => c.status === "pending").length;

  return {
    reportedThisMonth: 312, // historical municipal baseline
    fixedThisMonth: 187,
    escalatedThisMonth: 41,
    liveTotalTracked: total,
    liveResolved: resolved,
    liveEscalated: escalated,
    livePending: pending,
    avgResolutionDays: 4.6,
  };
}

/**
 * Submit a newly drafted complaint
 */
export async function submitReport(input: NewReportInput): Promise<Complaint> {
  await delay(getRandomDelay(800, 1200));

  const randomNum = Math.floor(4300 + Math.random() * 600);
  const newId = `S2S-GZB-00${randomNum}`;

  const today = new Date();
  const dateReportedStr = today.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const escalationDateObj = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  const escalationDateStr = escalationDateObj.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  // Assign ward according to coords or fallback
  const matchedWard =
    WARDS_DATA.find((w) => w.id === input.wardId) ||
    WARDS_DATA[3]; // Ward 14 Indirapuram fallback

  const categoryTitlesEn = {
    garbage: "Open solid waste accumulation near thoroughfare",
    pothole: "Severe road crater endangering commuters",
    streetlight: "Broken streetlight fixture causing black-out stretch",
    waterlogging: "Severe dirty water accumulation and choked drainage",
  };

  const categoryTitlesHi = {
    garbage: "सार्वजनिक मार्ग के पास खुला कचरा डंप",
    pothole: "यातायात के लिए खतरनाक गहरा गड्ढा",
    streetlight: "खराब स्ट्रीटलाइट के कारण मार्ग पर अंधेरा",
    waterlogging: "गंभीर जलभराव एवं नाली जाम की समस्या",
  };

  const formalLetterEn = `TO:
The Zonal Officer, ${matchedWard.zone},
Nagar Nigam Ghaziabad - 201001

SUBJECT: STATUTORY GRIEVANCE NOTICE (REF: ${newId}) - ${categoryTitlesEn[input.category].toUpperCase()} AT ${input.locationName.toUpperCase()}.

Sir/Madam,

Please take formal notice under Uttar Pradesh Municipal Corporation Act 1959 regarding ${categoryTitlesEn[input.category].toLowerCase()} documented at ${input.locationName} (${input.lat.toFixed(4)}° N, ${input.lng.toFixed(4)}° E).

Field details:
- Category: ${input.category.toUpperCase()}
- Location: ${input.locationName}
- Ward: ${matchedWard.name}
- Additional citizen remarks: ${input.notes || "Recorded via live field upload"}

As mandated by standard municipal citizens charter, a 7-day remediation window has commenced today (${dateReportedStr}). If unaddressed by ${escalationDateStr}, this complaint automatically escalates to the Municipal Commissioner and Ward Officer for statutory accountability.

Generated via Snap2Solve Civic Protocol.`;

  const formalLetterHi = `सेवा में:
जोनल अधिकारी, ${matchedWard.zone},
नगर निगम गाजियाबाद - 201001

विषय: वैधानिक शिकायत नोटिस (क्रमांक: ${newId}) - ${input.locationName} पर ${categoryTitlesHi[input.category]} बाबत।

महोदय/महोदया,

उत्तर प्रदेश नगर निगम अधिनियम 1959 के अंतर्गत ${input.locationName} (${input.lat.toFixed(4)}° N, ${input.lng.toFixed(4)}° E) पर ${categoryTitlesHi[input.category]} के संबंध में यह औपचारिक शिकायत दर्ज की जा रही है।

- श्रेणी: ${input.category}
- स्थान: ${input.locationName}
- वार्ड: ${matchedWard.nameHi}
- नागरिक टिप्पणी: ${input.notes || "नागरिक द्वारा सीधे अपलोड"}

7-दिवसीय समय-सीमा आज (${dateReportedStr}) से प्रारंभ हो चुकी है। यदि ${escalationDateStr} तक समस्या का समाधान नहीं होता है, तो यह मामला स्वतः नगर आयुक्त स्तर पर एस्केलेट हो जाएगा।

Snap2Solve नागरिक सेवा द्वारा सत्यापित।`;

  const newComplaint: Complaint = {
    id: newId,
    title: `${categoryTitlesEn[input.category]} at ${input.locationName}`,
    titleHi: `${input.locationName} पर ${categoryTitlesHi[input.category]}`,
    description: input.notes || `Citizen reported ${input.category} issue with geo-tagged verification.`,
    descriptionHi: input.notes || `नागरिक द्वारा जीपीएस प्रमाणित शिकायत दर्ज।`,
    category: input.category,
    status: "pending",
    escalationLevel: "JE",
    daysOpen: 0,
    reportedCount: 1,
    dateReported: dateReportedStr,
    escalationDate: escalationDateStr,
    lat: input.lat,
    lng: input.lng,
    locationName: input.locationName,
    locationNameHi: input.locationName,
    wardId: matchedWard.id,
    wardName: matchedWard.name,
    authority: `Nagar Nigam Ghaziabad – ${matchedWard.zone}`,
    officialRef: `NNG/GZB/2026/${newId.split("-")[2]}`,
    imageUrl:
      input.imageUrl ||
      "https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=700&q=80",
    formalLetterEn,
    formalLetterHi,
    confirmations: [],
    timeline: [
      {
        day: 0,
        title: "Complaint Dispatched & 7-Day Clock Started",
        titleHi: "शिकायत दर्ज एवं 7-दिवसीय घड़ी प्रारंभ",
        desc: `Dispatched to ${matchedWard.officerInCharge}. Formal letter generated.`,
        status: "current",
        timestamp: "Just now",
      },
      {
        day: 3,
        title: "JE Automated Reminder",
        titleHi: "कनिष्ठ अभियंता को स्वतः रिमाइंडर",
        desc: "Digital reminder triggers if field officer has not closed ticket.",
        status: "upcoming",
        timestamp: "In 3 days",
      },
      {
        day: 7,
        title: "Escalation to Municipal Commissioner",
        titleHi: "नगर आयुक्त को स्वतः एस्केलेशन",
        desc: "Breach alert dispatched to administrative headquarters.",
        status: "upcoming",
        timestamp: escalationDateStr,
      },
    ],
  };

  // Prepend to runtime complaints so it shows up first!
  runtimeComplaints = [newComplaint, ...runtimeComplaints];

  return newComplaint;
}

/**
 * Community confirmation: citizen confirms whether fix is true or still broken
 */
export async function confirmReportFix(
  id: string,
  stillBroken: boolean,
  userName = "Citizen Inspector",
  comment = ""
): Promise<Complaint | null> {
  await delay(500);

  const idx = runtimeComplaints.findIndex((c) => c.id === id);
  if (idx === -1) return null;

  const target = { ...runtimeComplaints[idx] };
  target.confirmations = [
    {
      userName,
      avatar: userName.substring(0, 2).toUpperCase(),
      comment:
        comment ||
        (stillBroken
          ? "Inspected on ground: Issue is NOT resolved. Garbage/pothole remains untreated."
          : "Verified in person: Municipal team came and cleared this completely!"),
      isFixed: !stillBroken,
      timestamp: "Just now",
    },
    ...target.confirmations,
  ];

  if (stillBroken && target.status === "resolved") {
    // Reopen and escalate!
    target.status = "escalated";
    target.escalationLevel = "COMMISSIONER";
    target.reportedCount += 1;
  }

  runtimeComplaints[idx] = target;
  return target;
}
