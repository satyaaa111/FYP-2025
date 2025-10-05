import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Droplets } from "lucide-react";
import { format, startOfDay, subDays } from "date-fns";

export default function IrrigationAnalytics({ data, timeRange, loading }) {
  const generateChartData = () => {
    const days = timeRange === "24h" ? 1 : timeRange === "7d" ? 7 : 30;
    const periods = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(startOfDay(new Date()), i);
      const dayEvents = data.filter(event => {
        const eventDate = startOfDay(new Date(event.created_date));
        return eventDate.getTime() === date.getTime();
      });
      
      periods.push({
        date: format(date, timeRange === "24h" ? "HH:mm" : "MMM d"),
        events: dayEvents.length,
        water: dayEvents.reduce((sum, event) => sum + (event.water_amount_liters || 0), 0),
        duration: dayEvents.reduce((sum, event) => sum + (event.duration_minutes || 0), 0)
      });
    }
    
    return periods;
  };

  const chartData = generateChartData();

  if (loading) {
    return (
      <Card className="bg-white/70 backdrop-blur border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Droplets className="w-5 h-5" />
            Irrigation Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-48 bg-gray-300 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalWater = chartData.reduce((sum, day) => sum + day.water, 0);
  const totalEvents = chartData.reduce((sum, day) => sum + day.events, 0);

  return (
    <Card className="bg-white/70 backdrop-blur border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <Droplets className="w-5 h-5" />
          Irrigation Analytics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-700">{totalWater}L</div>
            <div className="text-blue-600 text-sm">Total Water Used</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-700">{totalEvents}</div>
            <div className="text-green-600 text-sm">Irrigation Events</div>
          </div>
        </div>
        
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => [
                name === "water" ? `${value}L` : value,
                name === "water" ? "Water Used" : "Events"
              ]}
            />
            <Bar dataKey="water" fill="#3B82F6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}