# tea-disease-service/inference_server.py
# Flask inference server for the EfficientNet-B3 tea disease model.
# Receives a JPEG via multipart POST, returns JSON with prediction.
#
# Run: python inference_server.py
# Default port: 5000 (matches INFERENCE_SERVER_URL in actions.js)

import io
import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image
from flask import Flask, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)  # Allow requests from Next.js dev server

# ── Device ──────────────────────────────────────────────────────────────────
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"[inference_server] Using device: {device}")

# ── Class names (must match training order) ──────────────────────────────────
# Indices: 0=Algal, 1=Brown, 2=Gray, 3=Helopeltis, 4=Red Spider, 5=Green Bug, 6=Healthy
CLASS_NAMES = [
    "Tea Algal Leaf Spot",
    "Brown Blight",
    "Gray Blight",
    "Helopeltis",
    "Red Spider",
    "Green Mirid Bug",
    "Healthy Leaf",
]

# ── Load model ───────────────────────────────────────────────────────────────
MODEL_PATH = os.path.join(os.path.dirname(__file__), "balanced_tea_model.pth")

model = models.efficientnet_b3(weights=None)
num_ftrs = model.classifier[1].in_features
model.classifier[1] = nn.Linear(num_ftrs, len(CLASS_NAMES))  # 7 classes

model.load_state_dict(torch.load(MODEL_PATH, map_location=device))
model.to(device)
model.eval()
print(f"[inference_server] Model loaded from {MODEL_PATH}")

# ── Preprocessing ────────────────────────────────────────────────────────────
transform = transforms.Compose([
    transforms.Resize((300, 300)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
])

# ── Routes ───────────────────────────────────────────────────────────────────

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "device": str(device)})


@app.route("/predict", methods=["POST"])
def predict():
    """
    Accepts: multipart/form-data with field 'file' (JPEG/PNG image)
    Returns:
    {
        "predicted_class":    int,
        "class_name":         str,
        "confidence":         float,   # 0.0 – 1.0
        "all_probabilities":  { class_name: float, ... }
    }
    """
    if "file" not in request.files:
        return jsonify({"error": "No file field in request"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "Empty filename"}), 400

    try:
        img = Image.open(io.BytesIO(file.read())).convert("RGB")
    except Exception as e:
        return jsonify({"error": f"Cannot open image: {str(e)}"}), 400

    # Preprocess and run inference
    tensor = transform(img).unsqueeze(0).to(device)

    with torch.no_grad():
        outputs = model(tensor)
        probs   = torch.nn.functional.softmax(outputs, dim=1)[0]

    confidence, idx = torch.max(probs, 0)
    idx        = idx.item()
    confidence = confidence.item()

    all_probs = {
        name: round(probs[i].item(), 4)
        for i, name in enumerate(CLASS_NAMES)
    }

    return jsonify({
        "predicted_class":   idx,
        "class_name":        CLASS_NAMES[idx],
        "confidence":        round(confidence, 4),
        "all_probabilities": all_probs,
    })


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print(f"[inference_server] Starting on http://0.0.0.0:{port}")
    app.run(host="0.0.0.0", port=port, debug=False)
