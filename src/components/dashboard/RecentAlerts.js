"use client"; // Needed because we use hooks and client-side interactivity

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Bell, ExternalLink } from "lucide-react";
import Link from "next/link"; // <-- Next.js Link
import { createPageUrl } from "@/utils/createPageURL";
import { format } from "date-fns";

const severityConfig = {
  low: "bg-blue-100 text-blue-700 border-blue-200",
  medium: "bg-yellow-100 text-yellow-700 border-yellow-200", 
  high: "bg-orange-100 text-orange-700 border-orange-200",
  critical: "bg-red-100 text-red-700 border-red-200"
};

export default function RecentAlerts({ alerts, loading }) {
  return (
    <Card className="bg-white/70 backdrop-blur border-green-200">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-green-800">
            <Bell className="w-5 h-5" />
            Recent Alerts
          </div>
          {alerts.length > 0 && (
            <Badge className="bg-red-100 text-red-700 border-red-200">
              {alerts.length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-24" />
              </div>
            ))}
          </div>
        ) : alerts.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No active alerts</p>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.slice(0, 3).map((alert) => (
              <div key={alert.id} className="p-3 bg-gray-50/50 rounded-lg">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <Badge className={`${severityConfig[alert.severity]} border text-xs`}>
                    {alert.severity}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {format(new Date(alert.created_date), "MMM d, HH:mm")}
                  </span>
                </div>
                <p className="text-sm text-gray-700">{alert.message}</p>
              </div>
            ))}

            <Link href={createPageUrl("Alerts")}>
              <Button variant="outline" size="sm" className="w-full mt-3">
                <ExternalLink className="w-4 h-4 mr-2" />
                View All Alerts
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
