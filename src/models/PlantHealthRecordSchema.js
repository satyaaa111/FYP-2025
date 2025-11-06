import mongoose from 'mongoose';

const PlantHealthRecordSchema = new mongoose.Schema({
  zone_id: {
    type: String,
    required: true,
    index: true,
  },
  health_status: {
    type: String,
    required: true,
    enum: ['healthy', 'at_risk', 'diseased'],
  },
  diagnosis_id: {
    type: String,
  },
  confidence_score: {
    type: Number,
  },
  image_url: {
    type: String,
  },
  created_date: {
    type: Date,
    default: Date.now,
    index: true,
  },
  // Add any other fields from your PlantHealthRecord.json
});

export default mongoose.models.PlantHealthRecord || mongoose.model('PlantHealthRecord', PlantHealthRecordSchema);