// src/components/plant/CameraFeedSection.js
"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wifi, WifiOff, Loader2, Radio, RefreshCw } from "lucide-react";
import { usePhotos } from "@/hooks/usePhotos";
import { analyzeImageFromUrl } from "@/lib/actions";
import CameraAnalysisCard from "@/components/plant/CameraAnalysisCard";

/**
 * Shows the ESP32-CAM live feed with automatic CNN analysis.
 * New photos trigger analysis automatically.
 *
 * Props:
 *   zone — currently selected zone (string, passed from parent page)
 */
export default function CameraFeedSection({ zone }) {
  const { photos, status, newPhoto } = usePhotos();

  // Map of photo.key → { result, loading, error }
  const [analyses, setAnalyses] = useState({});

  // How many photos to show
  const [showCount, setShowCount] = useState(5);

  // Track which keys we've already triggered analysis for (avoid re-runs)
  const analyzedKeys = useRef(new Set());

  // ── Auto-analyze whenever a NEW photo arrives ──────────────────────────
  useEffect(() => {
    if (!newPhoto || analyzedKeys.current.has(newPhoto.key)) return;
    triggerAnalysis(newPhoto);
  }, [newPhoto]); // eslint-disable-line react-hooks/exhaustive-deps

  async function triggerAnalysis(photo) {
    if (analyzedKeys.current.has(photo.key)) return;
    analyzedKeys.current.add(photo.key);

    // Mark as loading
    setAnalyses((prev) => ({
      ...prev,
      [photo.key]: { result: null, loading: true, error: null },
    }));

    const { result, error } = await analyzeImageFromUrl(
      photo.url,
      photo.filename,
      photo.captured_at,
      zone
    );

    setAnalyses((prev) => ({
      ...prev,
      [photo.key]: { result, loading: false, error },
    }));
  }

  const displayedPhotos = photos.slice(0, showCount);

  // Connection indicator
  const connectionBadge = {
    connecting: {
      icon: <Loader2 className="w-3 h-3 animate-spin" />,
      label: "Connecting to Firebase…",
      cls: "text-blue-600 bg-blue-50 border-blue-200",
    },
    live: {
      icon: <Radio className="w-3 h-3 animate-pulse" />,
      label: `Live · ${photos.length} capture${photos.length !== 1 ? "s" : ""}`,
      cls: "text-green-700 bg-green-50 border-green-200",
    },
    error: {
      icon: <WifiOff className="w-3 h-3" />,
      label: "Firebase connection error",
      cls: "text-red-600 bg-red-50 border-red-200",
    },
  }[status];

  return (
    <div className="space-y-4">
      {/* ── Section header ── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-green-800 flex items-center gap-2">
            <Wifi className="w-5 h-5" />
            Automated Camera Feed
          </h2>
          <p className="text-sm text-green-600 mt-0.5">
            ESP32-CAM photos are analyzed automatically as they arrive
          </p>
        </div>

        {/* Connection badge */}
        <div
          className={`flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-full border ${connectionBadge.cls}`}
        >
          {connectionBadge.icon}
          {connectionBadge.label}
        </div>
      </div>

      {/* ── Content ── */}
      {status === "connecting" && photos.length === 0 ? (
        // Skeleton while connecting
        <div className="space-y-4">
          {[0, 1].map((i) => (
            <Card key={i} className="bg-white/70 backdrop-blur border-green-200">
              <CardContent className="p-5">
                <div className="flex gap-4 animate-pulse">
                  <div className="w-48 h-32 bg-gray-200 rounded-lg shrink-0" />
                  <div className="flex-1 space-y-3 pt-1">
                    <div className="h-3 bg-gray-200 rounded w-1/3" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : photos.length === 0 ? (
        // No captures yet
        <Card className="bg-white/70 backdrop-blur border-green-200">
          <CardContent className="p-12 text-center">
            <Wifi className="w-14 h-14 mx-auto mb-4 text-green-300" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Waiting for Camera
            </h3>
            <p className="text-sm text-gray-500 max-w-sm mx-auto">
              No photos received yet. The ESP32-CAM will upload automatically at its
              configured interval (default 30 s). Make sure it's powered and on WiFi.
            </p>
          </CardContent>
        </Card>
      ) : (
        // Photo list
        <div className="space-y-4">
          {displayedPhotos.map((photo) => {
            const analysis = analyses[photo.key] || {
              result: null,
              loading: false,
              error: null,
            };

            return (
              <div key={photo.key} className="relative">
                {/* "New" pill on the latest photo */}
                {photo.key === photos[0]?.key && (
                  <span className="absolute -top-2 left-4 z-10 text-[10px] font-mono uppercase tracking-wider bg-green-500 text-white px-2 py-0.5 rounded-full">
                    Latest
                  </span>
                )}

                <CameraAnalysisCard
                  photo={photo}
                  result={analysis.result}
                  loading={analysis.loading}
                  error={analysis.error}
                />

                {/* Manual re-analyze button (if analysis failed or not yet run) */}
                {!analysis.loading && (analysis.error || !analysis.result) && (
                  <div className="flex justify-end mt-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        // Allow retry by removing from the analyzed set
                        analyzedKeys.current.delete(photo.key);
                        triggerAnalysis(photo);
                      }}
                      className="text-xs text-green-700 hover:text-green-800 gap-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      {analysis.error ? "Retry Analysis" : "Analyze"}
                    </Button>
                  </div>
                )}
              </div>
            );
          })}

          {/* Load more */}
          {photos.length > showCount && (
            <div className="flex justify-center pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCount((n) => n + 5)}
                className="border-green-300 text-green-700 hover:bg-green-50 text-xs"
              >
                Show more ({photos.length - showCount} remaining)
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
