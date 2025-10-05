"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Sprout, Camera, ExternalLink } from "lucide-react";
import Link from "next/link";
import { createPageUrl } from "@/utils/createPageURL";

const healthStatusConfig = {
  healthy: {
    color: "bg-green-100 text-green-700 border-green-200",
    icon: "🌱",
    label: "Healthy"
  },
  diseased: {
    color: "bg-red-100 text-red-700 border-red-200", 
    icon: "🦠",
    label: "Disease Detected"
  },
  warning: {
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
    icon: "⚠️", 
    label: "Needs Attention"
  },
  unknown: {
    color: "bg-gray-100 text-gray-700 border-gray-200",
    icon: "❓",
    label: "Unknown"
  }
};

export default function PlantHealthWidget({ plantHealth, loading }) {
  const status = plantHealth?.health_status || "unknown";
  const config = healthStatusConfig[status];

  return (
    <Card className="bg-white/70 backdrop-blur border-green-200">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-green-800 dark:text-gray-600">
          <Sprout className="w-5 h-5" />
          Plant Health Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-32 w-full rounded-lg" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>
        ) : (
          <div className="space-y-4">
            {plantHealth?.image_url && (
              <div className="relative">
                <img 
                  src={plantHealth.image_url} 
                  alt="Plant health analysis"
                  className="w-full h-32 object-cover rounded-lg dark:text-gray-600"
                />
                <div className="absolute top-2 right-2">
                  <Camera className="w-4 h-4 text-white bg-black/50 p-1 rounded" />
                </div>
              </div>
            )}
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">{config.icon}</span>
                <Badge className={`${config.color} border font-medium`}>
                  {config.label}
                </Badge>
              </div>

              {plantHealth?.confidence_score && (
                <div className="text-sm text-gray-600">
                  Confidence: {plantHealth.confidence_score}%
                </div>
              )}

              {plantHealth?.disease_type && (
                <div className="text-sm">
                  <span className="text-gray-600">Disease: </span>
                  <span className="font-medium text-red-700">{plantHealth.disease_type}</span>
                </div>
              )}

              {plantHealth?.recommendations && (
                <div className="text-sm">
                  <span className="text-gray-600">Recommendation: </span>
                  <span className="text-gray-800">{plantHealth.recommendations}</span>
                </div>
              )}
            </div>

            <Link href={createPageUrl("PlantHealth")}>
              <Button variant="outline" size="sm" className="w-full mt-4">
                <ExternalLink className="w-4 h-4 mr-2" />
                View Details
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}