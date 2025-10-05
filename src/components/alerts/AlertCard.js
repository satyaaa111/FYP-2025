import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangle, 
  Droplets, 
  Thermometer, 
  WifiOff, 
  Battery, 
  FlaskConical,
  CheckCircle,
  Sprout
} from "lucide-react";
import { format } from "date-fns";

const severityConfig = {
  low: "bg-blue-100 text-blue-700 border-blue-200",
  medium: "bg-yellow-100 text-yellow-700 border-yellow-200", 
  high: "bg-orange-100 text-orange-700 border-orange-200",
  critical: "bg-red-100 text-red-700 border-red-200"
};

const alertTypeIcons = {
  low_moisture: Droplets,
  high_temperature: Thermometer,
  disease_detected: Sprout,
  pump_failure: AlertTriangle,
  sensor_offline: WifiOff,
  low_battery: Battery,
  high_ph: FlaskConical,
  low_ph: FlaskConical
};

export default function AlertCard({ alert, onResolve }) {
  const Icon = alertTypeIcons[alert.alert_type] || AlertTriangle;
  const severityClass = severityConfig[alert.severity];

  return (
    <Card className="bg-white/70 backdrop-blur border-orange-200 hover:shadow-lg transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              alert.resolved ? 'bg-green-100' : 
              alert.severity === 'critical' ? 'bg-red-100' : 
              alert.severity === 'high' ? 'bg-orange-100' : 
              alert.severity === 'medium' ? 'bg-yellow-100' : 'bg-blue-100'
            }`}>
              {alert.resolved ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <Icon className={`w-6 h-6 ${
                  alert.severity === 'critical' ? 'text-red-600' : 
                  alert.severity === 'high' ? 'text-orange-600' : 
                  alert.severity === 'medium' ? 'text-yellow-600' : 'text-blue-600'
                }`} />
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge className={`${severityClass} border font-medium`}>
                  {alert.severity.toUpperCase()}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {alert.zone_id}
                </Badge>
                {alert.resolved && (
                  <Badge className="bg-green-100 text-green-700 border-green-200">
                    Resolved
                  </Badge>
                )}
              </div>
              
              <h3 className="font-semibold text-gray-800 mb-1">
                {alert.alert_type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {alert.message}
              </p>
              
              <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                <span>
                  Created: {format(new Date(alert.created_date), "MMM d, yyyy 'at' HH:mm")}
                </span>
                {alert.resolved_at && (
                  <span>
                    Resolved: {format(new Date(alert.resolved_at), "MMM d, yyyy 'at' HH:mm")}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {!alert.resolved && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onResolve(alert.id)}
              className="text-green-600 border-green-200 hover:bg-green-50"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Resolve
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}