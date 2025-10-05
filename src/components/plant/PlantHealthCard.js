import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, Clock } from "lucide-react";
import { format } from "date-fns";

const healthStatusConfig = {
  healthy: {
    color: "bg-green-100 text-green-700 border-green-200",
    icon: "🌱",
    label: "Healthy Plant"
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
    label: "Analysis Pending"
  }
};

export default function PlantHealthCard({ record }) {
  const config = healthStatusConfig[record.health_status] || healthStatusConfig.unknown;

  return (
    <Card className="bg-white/70 backdrop-blur border-green-200 hover:shadow-lg transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
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
          
          <div className="flex-1 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{config.icon}</span>
                <Badge className={`${config.color} border font-medium`}>
                  {config.label}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                {format(new Date(record.created_date), "MMM d, yyyy 'at' HH:mm")}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-700 mb-1">Zone</h4>
                <p className="text-green-600 font-semibold">{record.zone_id}</p>
              </div>
              
              {record.confidence_score && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-1">Confidence</h4>
                  <p className="text-gray-800">{record.confidence_score}%</p>
                </div>
              )}
              
              {record.disease_type && (
                <div className="md:col-span-2">
                  <h4 className="font-medium text-gray-700 mb-1">Disease Type</h4>
                  <p className="text-red-600 font-medium">{record.disease_type}</p>
                </div>
              )}
              
              {record.recommendations && (
                <div className="md:col-span-2">
                  <h4 className="font-medium text-gray-700 mb-1">Recommendations</h4>
                  <p className="text-gray-800 text-sm leading-relaxed">
                    {record.recommendations}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}