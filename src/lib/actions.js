"use server"; // 👈 Most important line: Marks all functions in this file as Server Actions

import { SensorR } from "@/lib/entities/SensorReading"; // Your existing DB logic
import { PlantHealthR } from "@/lib/entities/PlantHealthRecord"; // Your existing DB logic
import { SystemA } from "@/lib/entities/SystemAlert"; // Your existing DB logic
import { IrrigationE } from "@/lib/entities/IrrigationEvent"; // Your existing DB logic


const INFERENCE_URL =
  process.env.INFERENCE_SERVER_URL || "http://localhost:5000/predict";

// Class names must match the order in your balanced_tea_model.pth
// Indices: 0=Algal, 1=Brown, 2=Gray, 3=Helopeltis, 4=Red Spider, 5=Green Bug, 6=Healthy
const CLASS_NAMES = [
  "Tea Algal Leaf Spot",
  "Brown Blight",
  "Gray Blight",
  "Helopeltis",
  "Red Spider",
  "Green Mirid Bug",
  "Healthy Leaf",
];

const SEVERITY_MAP = {
  "Tea Algal Leaf Spot": "medium",
  "Brown Blight":        "high",
  "Gray Blight":         "high",
  "Helopeltis":          "high",
  "Red Spider":          "medium",
  "Green Mirid Bug":     "medium",
  "Healthy Leaf":        "low",
};

const RECOMMENDATION_MAP = {
  "Tea Algal Leaf Spot":
    "Apply copper-based fungicide. Improve air circulation between plants.",
  "Brown Blight":
    "Remove infected leaves immediately. Apply Bordeaux mixture. Avoid overhead irrigation.",
  "Gray Blight":
    "Prune affected branches. Apply mancozeb fungicide. Improve drainage.",
  "Helopeltis":
    "Apply systemic insecticide (imidacloprid). Monitor surrounding plants.",
  "Red Spider":
    "Apply miticide spray. Increase humidity around plants. Introduce predatory mites.",
  "Green Mirid Bug":
    "Apply pyrethroid insecticide in early morning. Remove weed hosts nearby.",
  "Healthy Leaf":
    "No treatment needed. Continue regular monitoring schedule.",
};



// A helper to safely serialize data for the client
function serialize(data) {
  return JSON.parse(JSON.stringify(data));
}

export async function getDashboardData(selectedZone) {
 try {
  const [healthRecords, systemAlerts] = await Promise.all([
  PlantHealthR.filter({ zone_id: selectedZone }, "-created_date", 1),
  SystemA.filter({ zone_id: selectedZone, resolved: false }, "-created_date", 5)
 ]);

  return serialize({
    plantHealth: healthRecords[0] || null,
    alerts: systemAlerts
  });
  } catch (error) {
    console.error("Error in getDashboardData:", error);
    return { error: error.message, sensorData: null, plantHealth: null, alerts: [] };
  }
}

export async function getAnalyticsData(selectedZone, timeRange) {
  try {
    const limit = timeRange === "24h" ? 24 : timeRange === "7d" ? 50 : 100;
    
    const [sensors, irrigation, alerts] = await Promise.all([
      SensorR.filter({ zone_id: selectedZone }, "-created_date", limit),
      IrrigationE.filter({ zone_id: selectedZone }, "-created_date", limit),
      SystemA.filter({ zone_id: selectedZone }, "-created_date", limit)
    ]);
    
    return serialize({
      sensorData: sensors,
      irrigationData: irrigation,
      alertData: alerts
    });
  } catch (error) {
    console.error("Error in getAnalyticsData:", error);
    return { error: error.message, sensorData: [], irrigationData: [], alertData: [] };
  }
}

export async function getPlantHealthData(selectedZone) {
  try {
    const records = await PlantHealthR.filter(
      { zone_id: selectedZone }, 
      "-created_date", 
      10
    );
    return serialize({ records });
  } catch (error) {
    console.error("Error in getPlantHealthData:", error);
    return { error: error.message, records: [] };
  }
}


export async function getAlertsData(filter, severityFilter) {
  try {
    let query = {};
    if (filter === "active") {
      query.resolved = false;
    } else if (filter === "resolved") {
      query.resolved = true;
    }
    
    if (severityFilter !== "all") {
      query.severity = severityFilter;
    }

    const alertsData = await SystemA.filter(query, "-created_date", 50);
    return JSON.parse(JSON.stringify({ alerts: alertsData }));
  } catch (error) {
    console.error("Error in getAlertsData:", error);
    return { error: error.message, alerts: [] };
  }
}

export async function resolveAlert(alertId) {
  try {
    const updatedAlert = await SystemA.update(alertId, { 
      resolved: true, 
      resolved_at: new Date().toISOString() 
    });

    if (!updatedAlert) {
      throw new Error("Alert not found or could not be updated.");
    }

    return JSON.parse(JSON.stringify({ success: true, alert: updatedAlert }));
  } catch (error) {
    console.error("Error in resolveAlert:", error);
    return { error: error.message, success: false };
  }
}


export async function getIrrigationPageData(selectedZone) {
  try {
    const [events, sensors] = await Promise.all([
      IrrigationE.filter({ zone_id: selectedZone }, "-created_date", 10),
      SensorR.filter({ zone_id: selectedZone }, "-created_date", 1)
    ]);
    
    return serialize({
      irrigationEvents: events,
      sensorData: sensors[0] || null
    });
  } catch (error) {
    console.error("Error in getIrrigationPageData:", error);
    return { error: error.message, irrigationEvents: [], sensorData: null };
  }
}

export async function triggerManualPump(selectedZone, action) {
  try {
    const eventData = {
      zone_id: selectedZone,
      event_type: action === "start" ? "pump_on" : "pump_off",
      trigger_reason: "Manual override",
      duration_minutes: action === "start" ? null : 5 
    };

    const newEvent = await IrrigationE.create(eventData);

    if (!newEvent) {
      throw new Error("Could not create irrigation event.");
    }
    return serialize({ success: true, event: newEvent });

  } catch (error) {
    console.error("Error in triggerManualPump:", error);
    return { error: error.message, success: false };
  }
}

async function UploadFile(file) {
  console.log(`[Server Action] "Uploading" file: ${file.name}`);
  await new Promise(resolve => setTimeout(resolve, 1000)); 
  return { file_url: `https://placeholder.storage.com/${Date.now()}_${file.name}` };
}

async function InvokeLLM(config) {
  console.log(`[Server Action] "Analyzing" file: ${config.file_urls[0]}`);
  await new Promise(resolve => setTimeout(resolve, 2000));
  return {
    health_status: "diseased",
    disease_type: "Powdery Mildew",
    confidence_score: 85.5,
    recommendations: "Apply a fungicide and increase air circulation."
  };
}

export async function analyzePlantImage(formData) {
  try {
    const file = formData.get("file");
    const zone = formData.get("zone");

    if (!file || !zone) {
      throw new Error("File and zone are required.");
    }

    const { file_url } = await UploadFile(file);

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

    const newRecord = await PlantHealthR.create({
      zone_id: zone,
      image_url: file_url,
      health_status: analysis.health_status || "unknown",
      disease_type: analysis.disease_type || "N/A",
      confidence_score: analysis.confidence_score || 0,
      recommendations: analysis.recommendations || "No recommendations available."
    });

    return serialize({ success: true, record: newRecord });

  } catch (error) {
    console.error("Error analyzing plant image:", error);
    return { error: error.message, success: false };
  }
}

export async function analyzePlantImage(formData) {
  try {
    const file = formData.get("file");
    const zone = formData.get("zone");

    if (!file || !zone) throw new Error("File and zone are required.");

    // ── 1. Upload image to Firebase Storage ──────────────────────────────
    // We import dynamically to keep this a pure server action
    // (firebase-admin or firebase/storage works; here we use firebase/storage
    //  via the existing client SDK since we're in a server action that can
    //  import from @/lib/firebase)
    const { storage } = await import("@/lib/firebase");
    const { ref, uploadBytes, getDownloadURL } = await import("firebase/storage");

    const filename = `manual_uploads/${Date.now()}_${file.name}`;
    const storageRef = ref(storage, filename);
    const arrayBuffer = await file.arrayBuffer();
    await uploadBytes(storageRef, new Uint8Array(arrayBuffer), {
      contentType: file.type || "image/jpeg",
    });
    const imageUrl = await getDownloadURL(storageRef);

    // ── 2. POST to inference server ──────────────────────────────────────
    const inferFormData = new FormData();
    inferFormData.append(
      "file",
      new Blob([arrayBuffer], { type: file.type || "image/jpeg" }),
      file.name
    );

    const inferRes = await fetch(INFERENCE_URL, {
      method: "POST",
      body: inferFormData,
      signal: AbortSignal.timeout(30000),
    });

    if (!inferRes.ok) {
      const errText = await inferRes.text();
      throw new Error(`Inference server error ${inferRes.status}: ${errText}`);
    }

    const inferData = await inferRes.json();
    // inferData: { predicted_class, class_name, confidence, all_probabilities }

    const className = inferData.class_name || CLASS_NAMES[inferData.predicted_class] || "Unknown";
    const confidence = typeof inferData.confidence === "number"
      ? parseFloat((inferData.confidence * 100).toFixed(1))
      : 0;
    const isHealthy = className === "Healthy Leaf";

    // ── 3. Save to DB ────────────────────────────────────────────────────
    const newRecord = await PlantHealthR.create({
      zone_id:          zone,
      image_url:        imageUrl,
      health_status:    isHealthy ? "healthy" : "diseased",
      disease_type:     isHealthy ? "N/A" : className,
      confidence_score: confidence,
      recommendations:  RECOMMENDATION_MAP[className] || "Consult an agronomist.",
      severity:         SEVERITY_MAP[className] || "unknown",
      all_probabilities: JSON.stringify(inferData.all_probabilities || {}),
    });

    return serialize({ success: true, record: newRecord });

  } catch (error) {
    console.error("[analyzePlantImage]", error);
    return { error: error.message, success: false };
  }
}