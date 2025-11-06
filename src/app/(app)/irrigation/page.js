"use client";

import React, { useState, useEffect, useCallback } from "react";
// import { IrrigationE } from "@/lib/entities/IrrigationEvent";
// import { SensorR } from "@/lib/entities/SensorReading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Droplets, Play, Square, Clock, Gauge } from "lucide-react";
import { format } from "date-fns";
import { getIrrigationPageData, triggerManualPump } from "@/lib/actions";
import ZoneSelector from "@/components/dashboard/ZoneSelector";
import IrrigationCard from "@/components/irrigation/IrrigationCard";
import WaterUsageChart from "@/components/irrigation/WaterUsageChart";

export default function Irrigation() {
  const [selectedZone, setSelectedZone] = useState("Zone 1");
  const [irrigationEvents, setIrrigationEvents] = useState([]);
  const [sensorData, setSensorData] = useState(null);
  const [pumpStatus, setPumpStatus] = useState("off");
  const [autoMode, setAutoMode] = useState(true);
  const [loading, setLoading] = useState(true);

  const loadIrrigationData = useCallback(async () => {
    setLoading(true);
    try {
      const { irrigationEvents, sensorData, error } = await getIrrigationPageData(selectedZone);
      
      if (error) {
        throw new Error(error);
      }
      
      setIrrigationEvents(irrigationEvents);
      setSensorData(sensorData);
    } catch (error) {
      console.error("Error loading irrigation data:", error);
    }
    setLoading(false);
  }, [selectedZone]); // Dependency: selectedZone

  useEffect(() => {
    loadIrrigationData();
  }, [loadIrrigationData]); // Dependency: loadIrrigationData function (memoized with useCallback)

  const handleManualPump = async (action) => {
    try {
      const { success, error } = await triggerManualPump(selectedZone, action);

      if (error) {
        throw new Error(error);
      }

      if (success) {
        setPumpStatus(action === "start" ? "on" : "off");
        loadIrrigationData(); // Reload data after manual pump action
      }
    } catch (error) {
      console.error("Error controlling pump:", error);
    }
  };

  const zones = ["Zone 1", "Zone 2", "Zone 3"];

  return (
    <div className="p-4 md:p-8 bg-gradient-to-br from-green-50 via-blue-50 to-green-100 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-700 to-blue-600 bg-clip-text text-transparent">
              Irrigation Control
            </h1>
            <p className="text-blue-600 mt-2">Smart water management and pump control</p>
          </div>
          
          <ZoneSelector 
            zones={zones}
            selectedZone={selectedZone}
            onZoneChange={setSelectedZone}
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Pump Control Panel */}
          <Card className="bg-white/70 backdrop-blur border-blue-200 dark:text-gray-600">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 dark:text-blue-800">
                <Droplets className="w-5 h-5" />
                Pump Control
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Auto Mode</span>
                <Switch 
                  checked={autoMode} 
                  onCheckedChange={setAutoMode}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="font-medium">Pump Status</span>
                <Badge className={pumpStatus === "on" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
                  {pumpStatus === "on" ? "Running" : "Off"}
                </Badge>
              </div>

              {!autoMode && (
                <div className="space-y-2">
                  <Button
                    onClick={() => handleManualPump("start")}
                    disabled={pumpStatus === "on"}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start Pump
                  </Button>
                  <Button
                    onClick={() => handleManualPump("stop")}
                    disabled={pumpStatus === "off"}
                    variant="outline"
                    className="w-full"
                  >
                    <Square className="w-4 h-4 mr-2" />
                    Stop Pump
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Current Conditions */}
          <Card className="bg-white/70 backdrop-blur border-blue-200 dark:text-gray-600">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 dark:text-blue-800">
                <Gauge className="w-5 h-5" />
                Current Conditions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Soil Moisture</span>
                <span className="font-semibold text-blue-600">
                  {sensorData?.soil_moisture || 0}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Temperature</span>
                <span className="font-semibold text-red-600">
                  {sensorData?.temperature || 0}°C
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Humidity</span>
                <span className="font-semibold text-green-600">
                  {sensorData?.humidity || 0}%
                </span>
              </div>
              
              <div className="pt-2 border-t">
                <div className="text-sm text-gray-600 mb-1">Irrigation Recommendation</div>
                <Badge className={
                  (sensorData?.soil_moisture || 0) < 40 
                    ? "bg-red-100 text-red-700" 
                    : "bg-green-100 text-green-700"
                }>
                  {(sensorData?.soil_moisture || 0) < 40 ? "Irrigation Needed" : "Adequate Moisture"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="bg-white/70 backdrop-blur border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 dark:text-blue-800">
                <Clock className="w-5 h-5" />
                Today's Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Irrigation Events</span>
                <span className="font-semibold text-blue-600">
                  {irrigationEvents.filter(e => 
                    new Date(e.created_date).toDateString() === new Date().toDateString()
                  ).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Water Used</span>
                <span className="font-semibold text-blue-600">
                  {irrigationEvents
                    .filter(e => new Date(e.created_date).toDateString() === new Date().toDateString())
                    .reduce((sum, e) => sum + (e.water_amount_liters || 0), 0)} L
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Irrigation</span>
                <span className="font-semibold text-gray-600 text-sm">
                  {irrigationEvents[0] 
                    ? format(new Date(irrigationEvents[0].created_date), "HH:mm")
                    : "None today"
                  }
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Irrigation Events</h3>
            <div className="space-y-3">
              {irrigationEvents.slice(0, 5).map((event) => (
                <IrrigationCard key={event.id} event={event} />
              ))}
            </div>
          </div>
          
          <WaterUsageChart events={irrigationEvents} />
        </div>
      </div>
    </div>
  );
}
