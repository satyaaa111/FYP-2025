import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Droplets } from "lucide-react";
import { format, subDays, startOfDay } from "date-fns";

export default function WaterUsageChart({ events }) {
  const generateChartData = () => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = subDays(startOfDay(new Date()), i);
      const dayEvents = events.filter(event => {
        const eventDate = startOfDay(new Date(event.created_date));
        return eventDate.getTime() === date.getTime();
      });
      
      const totalWater = dayEvents.reduce((sum, event) => sum + (event.water_amount_liters || 0), 0);
      const totalEvents = dayEvents.length;
      
      last7Days.push({
        date: format(date, "MMM d"),
        water: totalWater,
        events: totalEvents
      });
    }
    return last7Days;
  };

  const data = generateChartData();

  return (
    <Card className="bg-white/70 backdrop-blur border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <Droplets className="w-5 h-5" />
          Water Usage (Last 7 Days)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => [`${value}L`, "Water Used"]}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Bar dataKey="water" fill="#3B82F6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}