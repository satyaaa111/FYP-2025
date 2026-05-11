import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { format, parseISO } from "date-fns";

const STATUS_CONFIG = {
  healthy: {
    color: "bg-green-100 text-green-700 border-green-200",
    bar: "bg-green-500",
    icon: "🌱",
    label: "Healthy Plant",
  },
  diseased: {
    color: "bg-red-100 text-red-700 border-red-200",
    bar: "bg-red-500",
    icon: "🦠",
    label: "Disease Detected",
  },
  warning: {
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
    bar: "bg-yellow-500",
    icon: "⚠️",
    label: "Needs Attention",
  },
  unknown: {
    color: "bg-gray-100 text-gray-700 border-gray-200",
    bar: "bg-gray-400",
    icon: "❓",
    label: "Analysis Pending",
  },
};

function safeDate(record) {
  const raw = record.created_at || record.created_date;
  if (!raw) return null;
  try {
    return typeof raw === "string" ? parseISO(raw) : new Date(raw);
  } catch {
    return null;
  }
}

export default function PlantHealthCard({ record }) {
  const config = STATUS_CONFIG[record.health_status] || STATUS_CONFIG.unknown;
  const date = safeDate(record);
  const [showBreakdown, setShowBreakdown] = useState(false);

  // all_probabilities may be stored as JSON string or object
  let allProbs = null;
  if (record.all_probabilities) {
    try {
      allProbs =
        typeof record.all_probabilities === "string"
          ? JSON.parse(record.all_probabilities)
          : record.all_probabilities;
    } catch {
      allProbs = null;
    }
  }

  return (
    <Card className="bg-white/70 backdrop-blur border-green-200 hover:shadow-lg transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Image */}
          <div className="md:w-48 flex-shrink-0">
            {record.image_url ? (
              <img
                src={record.image_url}
                alt="Plant analysis"
                className="w-full h-32 md:h-40 object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-32 md:h-40 bg-gray-100 rounded-lg flex items-center justify-center">
                <Camera className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex-1 space-y-4">
            {/* Header row */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{config.icon}</span>
                <Badge className={`${config.color} border font-medium`}>
                  {config.label}
                </Badge>
              </div>
              {date && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  {format(date, "MMM d, yyyy 'at' HH:mm")}
                </div>
              )}
            </div>

            {/* Grid info */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-500 text-xs uppercase tracking-wide mb-1">Zone</h4>
                <p className="text-green-700 font-semibold">{record.zone_id}</p>
              </div>

              {record.confidence_score != null && (
                <div>
                  <h4 className="font-medium text-gray-500 text-xs uppercase tracking-wide mb-1">
                    Confidence
                  </h4>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                      <div
                        className={`${config.bar} h-1.5 rounded-full`}
                        style={{ width: `${Math.min(record.confidence_score, 100)}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {Number(record.confidence_score).toFixed(1)}%
                    </span>
                  </div>
                </div>
              )}

              {record.disease_type && record.disease_type !== "N/A" && (
                <div className="md:col-span-2">
                  <h4 className="font-medium text-gray-500 text-xs uppercase tracking-wide mb-1">
                    Disease Identified
                  </h4>
                  <p className="text-red-600 font-semibold">{record.disease_type}</p>
                </div>
              )}

              {record.recommendations && (
                <div className="md:col-span-2">
                  <h4 className="font-medium text-gray-500 text-xs uppercase tracking-wide mb-1">
                    Recommendations
                  </h4>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {record.recommendations}
  </p>
                </div>
              )}
            </div>

            {/* Class probability breakdown (optional) */}
            {allProbs && (
              <div>
                <button
                  onClick={() => setShowBreakdown((v) => !v)}
                  className="flex items-center gap-1 text-xs text-green-700 hover:text-green-900 font-medium"
                >
                  {showBreakdown ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  {showBreakdown ? "Hide" : "Show"} model breakdown
                </button>
                {showBreakdown && (
                  <div className="mt-2 space-y-1">
                    {Object.entries(allProbs)
                      .sort(([, a], [, b]) => b - a)
                      .map(([name, prob]) => (
                        <div key={name} className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 w-40 truncate">{name}</span>
                          <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                            <div
                              className="bg-green-400 h-1.5 rounded-full"
                              style={{ width: `${(prob * 100).toFixed(1)}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-600 w-10 text-right">
                            {(prob * 100).toFixed(1)}%
                          </span>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}