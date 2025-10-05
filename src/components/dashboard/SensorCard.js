import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

const colorClasses = {
  blue: {
    bg: "from-blue-500 to-blue-600",
    text: "text-blue-700",
    badge: {
      good: "bg-green-100 text-green-700",
      warning: "bg-yellow-100 text-yellow-700", 
      critical: "bg-red-100 text-red-700"
    }
  },
  red: {
    bg: "from-red-500 to-red-600",
    text: "text-red-700",
    badge: {
      good: "bg-green-100 text-green-700",
      warning: "bg-yellow-100 text-yellow-700",
      critical: "bg-red-100 text-red-700"
    }
  },
  green: {
    bg: "from-green-500 to-green-600", 
    text: "text-green-700",
    badge: {
      good: "bg-green-100 text-green-700",
      warning: "bg-yellow-100 text-yellow-700",
      critical: "bg-red-100 text-red-700"
    }
  },
  yellow: {
    bg: "from-yellow-500 to-yellow-600",
    text: "text-yellow-700",
    badge: {
      good: "bg-green-100 text-green-700",
      warning: "bg-yellow-100 text-yellow-700",
      critical: "bg-red-100 text-red-700"
    }
  }
};

export default function SensorCard({ 
  title, 
  value, 
  unit, 
  icon: Icon, 
  color, 
  optimal,
  loading 
}) {
  const getStatus = () => {
    if (!value || !optimal) return "unknown";
    if (value >= optimal.min && value <= optimal.max) return "good";
    if (value < optimal.min * 0.8 || value > optimal.max * 1.2) return "critical";
    return "warning";
  };

  const status = getStatus();
  const colors = colorClasses[color] || colorClasses.blue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-white/70 backdrop-blur border-green-200 hover:shadow-lg transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 bg-gradient-to-br ${colors.bg} rounded-xl flex items-center justify-center`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            {status !== "unknown" && (
              <Badge className={colors.badge[status]} variant="secondary">
                {status === "good" ? "Optimal" : status === "warning" ? "Warning" : "Critical"}
              </Badge>
            )}
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
            {loading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="flex items-baseline gap-1">
                <span className={`text-2xl font-bold ${colors.text}`}>
                  {value || "--"}
                </span>
                <span className="text-gray-500 text-sm">{unit}</span>
              </div>
            )}
            
            {optimal && (
              <div className="text-xs text-gray-500 mt-2">
                Optimal: {optimal.min}-{optimal.max}{unit}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}