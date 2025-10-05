import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";
import { format } from "date-fns";

export default function SensorTrendChart({ data, timeRange, loading }) {
  const formatData = () => {
    return data.slice().reverse().map(reading => ({
      time: format(new Date(reading.created_date), timeRange === "24h" ? "HH:mm" : "MMM d"),
      moisture: reading.soil_moisture || 0,
      temperature: reading.temperature || 0,
      humidity: reading.humidity || 0,
      ph: reading.soil_ph || 0
    }));
  };

  const chartData = formatData();

  if (loading) {
    return (
      <Card className="bg-white/70 backdrop-blur border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-800">
            <TrendingUp className="w-5 h-5" />
            Sensor Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-64 bg-gray-300 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/70 backdrop-blur border-purple-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-800">
          <TrendingUp className="w-5 h-5" />
          Sensor Trends - {timeRange === "24h" ? "Last 24 Hours" : timeRange === "7d" ? "Last 7 Days" : "Last 30 Days"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="moisture" 
              stroke="#3B82F6" 
              strokeWidth={2}
              name="Soil Moisture (%)"
            />
            <Line 
              type="monotone" 
              dataKey="temperature" 
              stroke="#EF4444" 
              strokeWidth={2}
              name="Temperature (°C)"
            />
            <Line 
              type="monotone" 
              dataKey="humidity" 
              stroke="#10B981" 
              strokeWidth={2}
              name="Humidity (%)"
            />
            <Line 
              type="monotone" 
              dataKey="ph" 
              stroke="#8B5CF6" 
              strokeWidth={2}
              name="Soil pH"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}