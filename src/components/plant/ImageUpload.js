import React, { useState } from "react";
import { PlantHealthRecord } from "@/lib/entities/PlantHealthRecord";
// import { UploadFile, InvokeLLM } from "@/integrations/Core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// import { Progress } from "@/components/ui/progress";
import { Upload, Camera, X } from "lucide-react";

export default function ImageUpload({ zone, onComplete }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    setProgress(10);

    try {
    // Upload image
    //   const { file_url } = await UploadFile({ file });
    //   setProgress(40);

      // Analyze image with AI
      const analysisPrompt = `
        Analyze this plant image for health status and diseases.
        Look for signs of:
        - Leaf discoloration or spots
        - Wilting or drooping
        - Pest damage
        - Fungal infections
        - Nutrient deficiencies
        
        Determine if the plant is healthy or has issues.
        If diseased, identify the specific disease type.
        Provide actionable recommendations.
      `;

      const analysis = await InvokeLLM({
        prompt: analysisPrompt,
        file_urls: [file_url],
        response_json_schema: {
          type: "object",
          properties: {
            health_status: {
              type: "string", 
              enum: ["healthy", "diseased", "warning", "unknown"]
            },
            disease_type: { type: "string" },
            confidence_score: { 
              type: "number",
              minimum: 0,
              maximum: 100
            },
            recommendations: { type: "string" }
          }
        }
      });

      setProgress(80);
    var file_url="https://example.com/plant.jpg"

    // Save to database
      await PlantHealthRecord.create({
        zone_id: zone,
        image_url: file_url,
        health_status: analysis.health_status || "unknown",
        disease_type: analysis.disease_type || "N/A",
        confidence_score: analysis.confidence_score || 0,
        recommendations: analysis.recommendations || "No recommendations available."
      });

      setProgress(100);
      setTimeout(() => {
        onComplete();
      }, 1000);

    } catch (error) {
      console.error("Error analyzing plant image:", error);
    }

    setUploading(false);
    setProgress(0);
    setFile(null);
  };

  return (
    <Card className="bg-white/70 backdrop-blur border-green-200 mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-800">
          <Camera className="w-5 h-5" />
          Plant Health Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!file ? (
          <div className="border-2 border-dashed border-green-300 rounded-lg p-8 text-center">
            <Upload className="w-12 h-12 mx-auto mb-4 text-green-400" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Upload Plant Image
            </h3>
            <p className="text-gray-600 mb-4">
              Take or upload a photo of your plants for AI health analysis
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="plant-upload"
            />
            <label htmlFor="plant-upload">
              <Button className="bg-green-600 hover:bg-green-700" asChild>
                <span>
                  <Camera className="w-4 h-4 mr-2" />
                  Choose Image
                </span>
              </Button>
            </label>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <img 
                src={URL.createObjectURL(file)}
                alt="Plant to analyze"
                className="w-full h-64 object-cover rounded-lg"
              />
              <Button
                variant="outline"
                size="icon"
                className="absolute top-2 right-2 bg-white/80"
                onClick={() => setFile(null)}
                disabled={uploading}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {uploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Analyzing image...</span>
                  <span>{progress}%</span>
                </div>
                {/* <Progress value={progress} className="h-2" /> */}
                *progress Card*
              </div>
            )}

            <div className="flex justify-end gap-3">
              <Button 
                variant="outline" 
                onClick={() => setFile(null)}
                disabled={uploading}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleUpload}
                disabled={uploading}
                className="bg-green-600 hover:bg-green-700"
              >
                {uploading ? "Analyzing..." : "Start Analysis"}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}