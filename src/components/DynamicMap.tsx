"use client";

import dynamic from "next/dynamic";
import React from "react";
import { Complaint } from "@/lib/mock-data";

const MapComponent = dynamic(() => import("./MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[300px] bg-[#E0DCD9] border border-[#141414] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-6 h-6 border-2 border-[#141414] border-t-[#E31E2D] rounded-full animate-spin mb-3" />
      <span className="font-mono text-xs uppercase font-bold text-[#141414] tracking-wider">
        Loading Ghaziabad OpenStreetMap Tiles...
      </span>
      <span className="font-mono text-[11px] text-[#5C5C5C] mt-1">
        नक्शा लोड हो रहा है · GPS Bounds: 28.66°N, 77.41°E
      </span>
    </div>
  ),
});

interface DynamicMapProps {
  complaints: Complaint[];
  selectedComplaint?: Complaint | null;
  onSelectComplaint?: (complaint: Complaint) => void;
  center?: [number, number];
  zoom?: number;
  height?: string;
}

export function DynamicMap(props: DynamicMapProps) {
  return <MapComponent {...props} />;
}
