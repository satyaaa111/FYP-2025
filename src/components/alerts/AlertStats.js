import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, Clock, TrendingUp } from "lucide-react";

export default function AlertStats({ alerts, activeAlerts, resolvedAlerts }) {
  const criticalAlerts = activeAlerts.filter(a => a.severity === "critical").length;
  const highAlerts = activeAlerts.filter(a => a.severity === "high").length;
  
  const stats = [
    {
      label: "Active Alerts",
      value: activeAlerts.length,
      icon: AlertTriangle,
      color: activeAlerts.length > 0 ? "text-red-600" : "text-gray-600",
      bgColor: activeAlerts.length > 0 ? "bg-red-100" : "bg-gray-100"
    },
    {
      label: "Critical",
      value: criticalAlerts,
      icon: AlertTriangle,
      color: criticalAlerts > 0 ? "text-red-600" : "text-gray-600", 
      bgColor: criticalAlerts > 0 ? "bg-red-100" : "bg-gray-100"
    },
    {
      label: "High Priority", 
      value: highAlerts,
      icon: Clock,
      color: highAlerts > 0 ? "text-orange-600" : "text-gray-600",
      bgColor: highAlerts > 0 ? "bg-orange-100" : "bg-gray-100"
    },
    {
      label: "Resolved Today",
      value: resolvedAlerts.filter(a => 
        new Date(a.resolved_at).toDateString() === new Date().toDateString()
      ).length,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100"
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => (
        <Card key={stat.label} className="bg-white/70 backdrop-blur border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-xs text-gray-600 font-medium">{stat.label}</p>
                <p className={`text-lg font-bold ${stat.color}`}>
                  {stat.value}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}