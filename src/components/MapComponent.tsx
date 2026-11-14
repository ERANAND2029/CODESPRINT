"use client";

import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import { Complaint } from "@/lib/mock-data";

// Custom pin icons using HTML / SVG DivIcon
function createCustomPin(status: "pending" | "escalated" | "resolved", category: string, isSelected: boolean) {
  const colorMap = {
    escalated: "#E31E2D",
    pending: "#C98A00",
    resolved: "#2F7D4F",
  };

  const bg = colorMap[status] || "#141414";
  const scale = isSelected ? "scale(1.25)" : "scale(1)";
  const stroke = isSelected ? "#FFFFFF" : "#141414";

  // Category symbol
  const symbolMap: Record<string, string> = {
    garbage: "G",
    pothole: "P",
    streetlight: "L",
    waterlogging: "W",
  };
  const sym = symbolMap[category] || "•";

  const html = `
    <div style="transform: ${scale}; transform-origin: bottom center; transition: transform 0.15s ease;" class="custom-leaflet-marker">
      <div style="background-color: ${bg}; color: #ffffff; border: 2px solid ${stroke}; box-shadow: 2px 2px 0px #141414; width: 26px; height: 32px; border-radius: 4px 4px 14px 14px; display: flex; flex-direction: column; align-items: center; justify-content: center; font-family: monospace; font-weight: 900; font-size: 11px;">
        <span>${sym}</span>
      </div>
      <div style="width: 2px; height: 6px; background-color: #141414; margin: 0 auto;"></div>
    </div>
  `;

  return L.divIcon({
    html,
    className: "custom-div-icon",
    iconSize: [26, 38],
    iconAnchor: [13, 38],
  });
}

// Map center adjuster when selected item changes
function MapController({ selectedLocation }: { selectedLocation?: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    if (selectedLocation) {
      map.flyTo(selectedLocation, 15, { duration: 0.8 });
    }
  }, [selectedLocation, map]);
  return null;
}

interface MapProps {
  complaints: Complaint[];
  selectedComplaint?: Complaint | null;
  onSelectComplaint?: (complaint: Complaint) => void;
  center?: [number, number];
  zoom?: number;
  height?: string;
}

export default function MapComponent({
  complaints,
  selectedComplaint,
  onSelectComplaint,
  center = [28.6692, 77.4100],
  zoom = 13,
  height = "100%",
}: MapProps) {
  return (
    <div className="w-full h-full relative" style={{ height }}>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        className="w-full h-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {selectedComplaint && (
          <MapController selectedLocation={[selectedComplaint.lat, selectedComplaint.lng]} />
        )}

        {complaints.map((c) => {
          const isSelected = selectedComplaint?.id === c.id;
          const pinIcon = createCustomPin(c.status, c.category, isSelected);

          return (
            <Marker
              key={c.id}
              position={[c.lat, c.lng]}
              icon={pinIcon}
              eventHandlers={{
                click: () => {
                  if (onSelectComplaint) {
                    onSelectComplaint(c);
                  }
                },
              }}
            />
          );
        })}
      </MapContainer>
    </div>
  );
}
