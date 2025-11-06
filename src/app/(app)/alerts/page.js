"use client";
import React, { useState, useEffect, useCallback } from "react";
// import { SystemAlert } from "@/lib/entities/SystemAlert";
import { getAlertsData, resolveAlert } from "@/lib/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, CheckCircle, AlertTriangle, Filter } from "lucide-react";

import AlertCard from "@/components/alerts/AlertCard";
import AlertStats from "@/components/alerts/AlertStats";

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [filter, setFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const loadAlerts = useCallback(async () => {
    setLoading(true);
    try {
      // let query = {};
      
      // if (filter === "active") {
      //   query.resolved = false;
      // } else if (filter === "resolved") {
      //   query.resolved = true;
      // }
      
      // if (severityFilter !== "all") {
      //   query.severity = severityFilter;
      // }

      // const alertsData = await SystemAlert.filter(query, "-created_date", 50);
      const { alerts: alertsData, error } = await getAlertsData(filter, severityFilter);

      if (error) {
        throw new Error(error);
      }
      setAlerts(alertsData);
    } catch (error) {
      console.error("Error loading alerts:", error);
    }
    setLoading(false);
  }, [filter, severityFilter]); // Dependencies for useCallback

  useEffect(() => {
    loadAlerts();
  }, [loadAlerts]); // Now loadAlerts is a stable dependency

  const handleResolveAlert = async (alertId) => {
    try {
      const { success, error } = await resolveAlert(alertId);

      if (error) {
        throw new Error(error);
      }
      if (success) {
        // Refresh the list after a successful update
        loadAlerts();
      }
    } catch (error) {
      console.error("Error resolving alert:", error);
    }
  };

  const activeAlerts = alerts.filter(a => !a.resolved);
  const resolvedAlerts = alerts.filter(a => a.resolved);

  return (
    <div className="p-4 md:p-8 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-700 to-orange-600 bg-clip-text text-transparent">
              System Alerts
            </h1>
            <p className="text-red-600 mt-2">Monitor and manage system notifications</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-600" />
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-32 bg-white/60">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Alerts</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-32 bg-white/60">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <AlertStats 
          alerts={alerts}
          activeAlerts={activeAlerts}
          resolvedAlerts={resolvedAlerts}
        />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">
              {filter === "all" ? "All Alerts" : 
               filter === "active" ? "Active Alerts" : "Resolved Alerts"}
            </h2>
            <Badge variant="outline" className="text-gray-600">
              {alerts.length} total
            </Badge>
          </div>

          {loading ? (
            <div className="space-y-4">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <Card className="bg-white/70 backdrop-blur">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2 flex-1">
                          <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                        </div>
                        <div className="h-6 bg-gray-300 rounded w-20"></div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          ) : alerts.length === 0 ? (
            <Card className="bg-white/70 backdrop-blur border-green-200">
              <CardContent className="p-12 text-center">
                <Bell className="w-16 h-16 mx-auto mb-4 text-green-400" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No Alerts Found
                </h3>
                <p className="text-gray-600">
                  {filter === "active" 
                    ? "All systems are running smoothly!" 
                    : "No alerts match your current filters."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {alerts.map((alert) => (
                <AlertCard 
                  key={alert.id} 
                  alert={alert} 
                  onResolve={handleResolveAlert}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
