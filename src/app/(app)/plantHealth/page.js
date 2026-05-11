// src/app/(app)/plantHealth/page.js
"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sprout, Camera, Upload, Wifi } from "lucide-react";
import { getPlantHealthData } from "@/lib/actions";
import ZoneSelector from "@/components/dashboard/ZoneSelector";
import PlantHealthCard from "@/components/plant/PlantHealthCard";
import ImageUpload from "@/components/plant/ImageUpload";
import CameraFeedSection from "@/components/plant/CameraFeedSection";

// ── Tabs ────────────────────────────────────────────────────────────────────
const TABS = [
  {
    id: "manual",
    label: "Manual Upload",
    icon: Upload,
    description: "Upload a photo for instant AI analysis",
  },
  {
    id: "camera",
    label: "Camera Feed",
    icon: Wifi,
    description: "Automated ESP32-CAM field monitoring",
  },
];

export default function PlantHealth() {
  const [activeTab, setActiveTab]       = useState("manual");
  const [selectedZone, setSelectedZone] = useState("Zone 1");
  const [healthRecords, setHealthRecords] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [showUpload, setShowUpload]     = useState(false);

  const zones = ["Zone 1", "Zone 2", "Zone 3"];

  // ── Load manual-upload records ───────────────────────────────────────────
  const loadHealthData = useCallback(async () => {
    setLoading(true);
    try {
      const { records, error } = await getPlantHealthData(selectedZone);
      if (error) throw new Error(error);
      setHealthRecords(records);
    } catch (err) {
      console.error("Error loading plant health data:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedZone]);

  useEffect(() => {
    // Only fetch manual records when on the manual tab (or always — your call)
    if (activeTab === "manual") {
      loadHealthData();
    }
  }, [activeTab, loadHealthData]);

  return (
    <div className="p-4 md:p-8 bg-gradient-to-br from-green-50 via-blue-50 to-green-100 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* ── Page header ── */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-700 to-green-600 bg-clip-text text-transparent">
              Plant Health Monitor
            </h1>
            <p className="text-green-600 mt-1">
              AI-powered disease detection and plant analysis
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <ZoneSelector
              zones={zones}
              selectedZone={selectedZone}
              onZoneChange={setSelectedZone}
            />
            {/* Only show "New Analysis" button on manual tab */}
            {activeTab === "manual" && (
              <Button
                onClick={() => setShowUpload(!showUpload)}
                className="bg-green-600 hover:bg-green-700 gap-2"
              >
                <Upload className="w-4 h-4" />
                New Analysis
              </Button>
            )}
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-1 p-1 bg-white/60 backdrop-blur rounded-xl border border-green-200 w-fit">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`
                flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium
                transition-all duration-200
                ${
                  activeTab === id
                    ? "bg-green-600 text-white shadow-sm"
                    : "text-green-700 hover:bg-green-100"
                }
              `}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* ── Tab: Manual Upload ── */}
        {activeTab === "manual" && (
          <div className="space-y-6">
            {/* Upload form (collapsible) */}
            {showUpload && (
              <ImageUpload
                zone={selectedZone}
                onComplete={() => {
                  setShowUpload(false);
                  loadHealthData();
                }}
              />
            )}

            {/* Records list */}
            <div className="grid gap-6">
              {loading ? (
                Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <Card className="bg-white/70 backdrop-blur border-green-200">
                        <CardContent className="p-6">
                          <div className="flex gap-6">
                            <div className="w-48 h-32 bg-gray-300 rounded-lg" />
                            <div className="flex-1 space-y-4">
                              <div className="h-4 bg-gray-300 rounded w-1/4" />
                              <div className="h-4 bg-gray-300 rounded w-1/2" />
                              <div className="h-4 bg-gray-300 rounded w-3/4" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))
              ) : healthRecords.length === 0 ? (
                <Card className="bg-white/70 backdrop-blur border-green-200">
                  <CardContent className="p-12 text-center">
                    <Sprout className="w-16 h-16 mx-auto mb-4 text-green-300" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                      No Plant Health Records
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Start monitoring your plants by uploading the first image for
                      analysis.
                    </p>
                    <Button
                      onClick={() => setShowUpload(true)}
                      className="bg-green-600 hover:bg-green-700 gap-2"
                    >
                      <Camera className="w-4 h-4" />
                      Start Analysis
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                healthRecords.map((record) => (
                  <PlantHealthCard key={record.id} record={record} />
                ))
              )}
            </div>
          </div>
        )}

        {/* ── Tab: Automated Camera Feed ── */}
        {activeTab === "camera" && (
          <CameraFeedSection zone={selectedZone} />
        )}
      </div>
    </div>
  );
}