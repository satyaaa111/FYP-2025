import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity, Droplets, AlertTriangle, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function QuickStats({ sensorData, plantHealth, alerts, loading }) {
  const stats = [
    {
      label: "System Status",
      value: "Online",
      icon: Activity,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      label: "Soil Moisture",
      value: loading ? "--" : `${sensorData?.soil_moisture || 0}%`,
      icon: Droplets,
      color: "text-blue-600", 
      bgColor: "bg-blue-100"
    },
    {
      label: "Plant Health",
      value: loading ? "--" : (plantHealth?.health_status === "healthy" ? "Good" : "Alert"),
      icon: plantHealth?.health_status === "healthy" ? CheckCircle : AlertTriangle,
      color: plantHealth?.health_status === "healthy" ? "text-green-600" : "text-yellow-600",
      bgColor: plantHealth?.health_status === "healthy" ? "bg-green-100" : "bg-yellow-100"
    },
    {
      label: "Active Alerts",
      value: alerts.length,
      icon: AlertTriangle,
      color: alerts.length > 0 ? "text-red-600" : "text-gray-600",
      bgColor: alerts.length > 0 ? "bg-red-100" : "bg-gray-100"
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card className="bg-white/70 backdrop-blur border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium">{stat.label}</p>
                  {loading && stat.label !== "System Status" && stat.label !== "Active Alerts" ? (
                    <Skeleton className="h-5 w-12 mt-1" />
                  ) : (
                    <p className={`text-lg font-bold ${stat.color}`}>
                      {stat.value}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}