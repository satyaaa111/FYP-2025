import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Camera, X, Loader2 } from "lucide-react";
import { analyzePlantImage } from "@/lib/actions";

const STEPS = [
  { at: 10, label: "Preparing image…" },
  { at: 30, label: "Uploading to storage…" },
  { at: 60, label: "Running disease model…" },
  { at: 90, label: "Saving result…" },
];

export default function ImageUpload({ zone, onComplete }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stepLabel, setStepLabel] = useState("");
  const [error, setError] = useState(null);

  const handleFileSelect = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.type.startsWith("image/")) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError(null);

    // Animate through steps
    let stepIdx = 0;
    const tick = setInterval(() => {
      if (stepIdx < STEPS.length) {
        setProgress(STEPS[stepIdx].at);
        setStepLabel(STEPS[stepIdx].label);
        stepIdx++;
      }
    }, 900);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("zone", zone);

      const result = await analyzePlantImage(formData);
      clearInterval(tick);

      if (result.error) throw new Error(result.error);

      setProgress(100);
      setStepLabel("Done!");
      setTimeout(() => {
        onComplete();
      }, 800);
    } catch (err) {
      clearInterval(tick);
      setError(err.message || "Analysis failed. Please try again.");
      setUploading(false);
      setProgress(0);
    }
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setProgress(0);
    setStepLabel("");
    setError(null);
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
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Upload Plant Image</h3>
            <p className="text-gray-500 mb-4 text-sm">
              Take or upload a photo for AI-powered tea disease detection
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="plant-upload"
            />
            <Button className="bg-green-600 hover:bg-green-700" asChild>
              <label htmlFor="plant-upload" className="cursor-pointer flex items-center gap-2">
                <Camera className="w-4 h-4" />
                Choose Image
              </label>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Preview */}
            <div className="relative">
              <img
                src={preview}
                alt="Plant to analyse"
                className="w-full h-64 object-cover rounded-lg"
              />
              {!uploading && (
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute top-2 right-2 bg-white/80"
                  onClick={reset}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>

            {/* Progress bar */}
            {uploading && (
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    {stepLabel}
                  </span>
                  <span className="font-medium">{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
                ⚠️ {error}
              </p>
            )}

            {/* Actions */}
            {!uploading && (
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={reset}>
                  Cancel
                </Button>
                <Button
                  onClick={handleUpload}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Start Analysis
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}