"use client";

import React, { useState, useEffect, useCallback } from "react";
import { PlantHealthRecord } from "@/lib/entities/PlantHealthRecord";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sprout, Camera, RefreshCw, Upload } from "lucide-react";

import ZoneSelector from "@/components/dashboard/ZoneSelector";
import PlantHealthCard from "@/components/plant/PlantHealthCard";
import ImageUpload from "@/components/plant/ImageUpload";

export default function PlantHealth() {
  const [selectedZone, setSelectedZone] = useState("Zone 1");
  const [healthRecords, setHealthRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);

  const loadHealthData = useCallback(async () => {
    setLoading(true);
    try {
      const records = await PlantHealthRecord.filter(
        { zone_id: selectedZone }, 
        "-created_date", 
        10
      );
      setHealthRecords(records);
    } catch (error) {
      console.error("Error loading plant health data:", error);
    }
    setLoading(false);
  }, [selectedZone]); // Dependency: selectedZone

  useEffect(() => {
    loadHealthData();
  }, [loadHealthData]); // Dependency: loadHealthData (memoized by useCallback)

  const zones = ["Zone 1", "Zone 2", "Zone 3"];

  return (
    <div className="p-4 md:p-8 bg-gradient-to-br from-green-50 via-blue-50 to-green-100 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-700 to-green-600 bg-clip-text text-transparent">
              Plant Health Monitor
            </h1>
            <p className="text-green-600 mt-2">AI-powered disease detection and plant analysis</p>
          </div>
          
          <div className="flex items-center gap-4">
            <ZoneSelector 
              zones={zones}
              selectedZone={selectedZone}
              onZoneChange={setSelectedZone}
            />
            <Button 
              onClick={() => setShowUpload(!showUpload)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Upload className="w-4 h-4 mr-2" />
              New Analysis
            </Button>
          </div>
        </div>

        {showUpload && (
          <ImageUpload 
            zone={selectedZone}
            onComplete={() => {
              setShowUpload(false);
              loadHealthData();
            }}
          />
        )}

        <div className="grid gap-6">
          {loading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse">
                <Card className="bg-white/70 backdrop-blur border-green-200">
                  <CardContent className="p-6">
                    <div className="flex gap-6">
                      <div className="w-48 h-32 bg-gray-300 rounded-lg"></div>
                      <div className="flex-1 space-y-4">
                        <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))
          ) : healthRecords.length === 0 ? (
            <Card className="bg-white/70 backdrop-blur border-green-200">
              <CardContent className="p-12 text-center">
                <Sprout className="w-16 h-16 mx-auto mb-4 text-green-300" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No Plant Health Records
                </h3>
                <p className="text-gray-600 mb-4">
                  Start monitoring your plants by uploading the first image for analysis.
                </p>
                <Button 
                  onClick={() => setShowUpload(true)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Start Analysis
                </Button>
              </CardContent>
            </Card>
          ) : (
            healthRecords.map((record) => (
              <PlantHealthCard key={record.id} record={record} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
