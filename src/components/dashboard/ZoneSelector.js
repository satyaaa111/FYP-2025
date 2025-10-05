import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin } from "lucide-react";

export default function ZoneSelector({ zones, selectedZone, onZoneChange }) {
  return (
    <div className="flex items-center gap-2">
      <MapPin className="w-4 h-4 text-green-600" />
      <Select value={selectedZone} onValueChange={onZoneChange}>
        <SelectTrigger className="w-32 bg-white/60 backdrop-blur border-green-200">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {zones.map((zone) => (
            <SelectItem key={zone} value={zone}>
              {zone}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}