// src/components/plant/CameraAnalysisCard.js
"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, Clock, Camera, Loader2 } from "lucide-react";

/**
 * Displays an ESP32-CAM auto-captured photo alongside its CNN analysis result.
 *
 * Props:
 *   photo    — Photo object from Firebase { url, filename, captured_at, size }
 *   result   — Analysis result from analyzeImageFromUrl(), or null while loading
 *   loading  — bool: true while inference is running
 *   error    — string: error message if inference failed
 */
export default function CameraAnalysisCard({ photo, result, loading, error }) {
  const isHealthy  = result?.status === "Healthy";
  const hasDisease = result?.status === "Disease Detected";

  function formatTime(iso) {
    try {
      return new Date(iso).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch {
      return iso || "—";
    }
  }

  function formatSize(bytes) {
    if (!bytes) return "—";
    return bytes >= 1024 ? (bytes / 1024).toFixed(1) + " KB" : bytes + " B";
  }

  function severityColor(severity) {
    switch (severity) {
      case "high":   return "bg-red-100 text-red-700 border-red-200";
      case "medium": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "low":    return "bg-green-100 text-green-700 border-green-200";
      default:       return "bg-gray-100 text-gray-600 border-gray-200";
    }
  }

  return (
    <Card className="bg-white/70 backdrop-blur border-green-200 overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row gap-0">

          {/* ── Left: Image ── */}
          <div className="relative w-full md:w-52 shrink-0 aspect-[4/3] md:aspect-auto bg-gray-100">
            <Image
              src={photo.url}
              alt={photo.filename || "ESP32 capture"}
              fill
              className="object-cover"
              unoptimized
            />
            {/* Camera source badge */}
            <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/60 text-white text-[10px] font-mono px-2 py-0.5 rounded-sm">
              <Camera className="w-3 h-3" />
              Auto
            </div>
          </div>

          {/* ── Right: Info ── */}
          <div className="flex-1 p-5 flex flex-col gap-3">

            {/* Header row */}
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <div>
                <p className="text-xs text-gray-400 font-mono mb-0.5">
                  {formatTime(photo.captured_at)} · {formatSize(photo.size)}
                </p>
                <p className="text-sm text-gray-500 font-mono truncate max-w-xs">
                  {photo.filename || photo.url.split("/").pop()?.split("?")[0] || "capture.jpg"}
                </p>
              </div>

              {/* Status badge */}
              {loading ? (
                <Badge className="bg-blue-100 text-blue-700 border border-blue-200 gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Analyzing…
                </Badge>
              ) : error ? (
                <Badge className="bg-red-100 text-red-600 border border-red-200">
                  Analysis Failed
                </Badge>
              ) : result ? (
                <Badge
                  className={`border gap-1 ${
                    isHealthy
                      ? "bg-green-100 text-green-700 border-green-200"
                      : "bg-red-100 text-red-700 border-red-200"
                  }`}
                >
                  {isHealthy ? (
                    <CheckCircle className="w-3 h-3" />
                  ) : (
                    <AlertTriangle className="w-3 h-3" />
                  )}
                  {result.status}
                </Badge>
              ) : (
                <Badge className="bg-gray-100 text-gray-500 border border-gray-200 gap-1">
                  <Clock className="w-3 h-3" />
                  Pending
                </Badge>
              )}
            </div>

            {/* Analysis result */}
            {loading && (
              <div className="flex items-center gap-2 text-sm text-blue-600">
                <Loader2 className="w-4 h-4 animate-spin" />
                Running CNN analysis…
              </div>
            )}

            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                <strong>Error:</strong> {error}
              </div>
            )}

            {result && !loading && !error && (
              <div className="space-y-2">
                {/* Disease / Healthy */}
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-lg font-semibold text-gray-800">
                    {isHealthy ? "Healthy Leaf" : result.disease}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full border font-medium ${severityColor(result.severity)}`}
                  >
                    {result.severity
                      ? result.severity.charAt(0).toUpperCase() + result.severity.slice(1) + " Severity"
                      : ""}
                  </span>
                </div>

                {/* Confidence bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Confidence</span>
                    <span className="font-mono font-semibold">{result.confidence}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        isHealthy ? "bg-green-500" : result.severity === "high" ? "bg-red-500" : "bg-yellow-500"
                      }`}
                      style={{ width: `${result.confidence}%` }}
                    />
                  </div>
                </div>

                {/* Recommendation */}
                <p className="text-sm text-gray-600 bg-green-50 border border-green-100 rounded-md px-3 py-2">
                  💡 {result.recommendation}
                </p>
              </div>
            )}

            {/* Zone tag */}
            {result?.zone && (
              <div className="mt-auto pt-1">
                <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-0.5 rounded-sm">
                  {result.zone}
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
