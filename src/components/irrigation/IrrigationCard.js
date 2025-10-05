import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Droplets, Play, Square, Settings, Clock } from "lucide-react";
import { format } from "date-fns";

const eventTypeConfig = {
  pump_on: { icon: Play, label: "Pump Started", color: "bg-green-100 text-green-700" },
  pump_off: { icon: Square, label: "Pump Stopped", color: "bg-gray-100 text-gray-700" },
  manual_override: { icon: Settings, label: "Manual Override", color: "bg-blue-100 text-blue-700" },
  auto_trigger: { icon: Droplets, label: "Auto Irrigation", color: "bg-purple-100 text-purple-700" }
};

export default function IrrigationCard({ event }) {
  const config = eventTypeConfig[event.event_type] || eventTypeConfig.pump_on;

  return (
    <Card className="bg-white/70 backdrop-blur border-blue-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <config.icon className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <Badge className={config.color}>
                {config.label}
              </Badge>
              <p className="text-sm text-gray-600 mt-1">
                {event.trigger_reason}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              {format(new Date(event.created_date), "MMM d, HH:mm")}
            </div>
            {event.duration_minutes && (
              <div className="text-sm font-medium text-blue-600 mt-1">
                {event.duration_minutes} min
              </div>
            )}
            {event.water_amount_liters && (
              <div className="text-xs text-gray-600">
                {event.water_amount_liters}L used
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}