"use client";
import React, { useState, useEffect, useCallback } from "react";
// import { SensorReading } from "@/lib/entities/SensorReading";
// import { IrrigationEvent } from "@/lib/entities/IrrigationEvent";
// import { SystemAlert } from "@/lib/entities/SystemAlert";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, BarChart3, Activity, Calendar } from "lucide-react";
import { getAnalyticsData } from '@/lib/actions';
import ZoneSelector from "@/components/dashboard/ZoneSelector";
import SensorTrendChart from "@/components/analytics/SensorTrendChart";
import IrrigationAnalytics from "@/components/analytics/IrrigationAnalytics";
import AlertTrends from "@/components/analytics/AlertTrends";

export default function Analytics() {
  const [selectedZone, setSelectedZone] = useState("Zone 1");
  const [timeRange, setTimeRange] = useState("7d");
  const [sensorData, setSensorData] = useState([]);
  const [irrigationData, setIrrigationData] = useState([]);
  const [alertData, setAlertData] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAnalyticsData = useCallback(async () => {
    setLoading(true);
    try {
      const limit = timeRange === "24h" ? 24 : timeRange === "7d" ? 50 : 100;
      
      const { sensorData, irrigationData, alertData, error } = await getAnalyticsData(selectedZone, timeRange);

      if (error) {
        throw new Error(error);
      }
      
      setSensorData(sensorData);
      setIrrigationData(irrigationData);
      setAlertData(alertData);
    } catch (error) {
      console.error("Error loading analytics data:", error);
    }
    setLoading(false);
  }, [selectedZone, timeRange]); // Dependencies for useCallback

  useEffect(() => {
    loadAnalyticsData();
  }, [loadAnalyticsData]); // useEffect now depends on the memoized function

  const zones = ["Zone 1", "Zone 2", "Zone 3"];

  return (
    <div className="p-4 md:p-8 bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-700 to-blue-600 bg-clip-text text-transparent">
              Data Analytics
            </h1>
            <p className="text-purple-600 mt-2">Historical insights and performance trends</p>
          </div>
          
          <div className="flex items-center gap-4">
            <ZoneSelector 
              zones={zones}
              selectedZone={selectedZone}
              onZoneChange={setSelectedZone}
            />
            
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-600" />
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32 bg-white/60 backdrop-blur border-purple-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">Last 24h</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          <SensorTrendChart 
            data={sensorData}
            timeRange={timeRange}
            loading={loading}
          />
          
          <div className="grid lg:grid-cols-2 gap-6">
            <IrrigationAnalytics 
              data={irrigationData}
              timeRange={timeRange}
              loading={loading}
            />
            
            <AlertTrends 
              data={alertData}
              timeRange={timeRange}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
