import mongoose from 'mongoose';

// Based on your SensorReading.js records and SensorReadingSchema.json
const SensorReadingSchema = new mongoose.Schema({
  zone_id: {
    type: String,
    required: true,
    index: true,
  },
  soil_moisture: {
    type: Number,
  },
  temperature: {
    type: Number,
  },
  humidity: {
    type: Number,
  },
  soil_ph: {
    type: Number,
  },
  nitrogen: {
    type: Number,
  },
  phosphorus: {
    type: Number,
  },
  potassium: {
    type: Number,
  },
  light_intensity: {
    type: Number,
  },
  wind_speed: {
    type: Number,
  },
  created_date: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

export default mongoose.models.SensorReading || mongoose.model('SensorReading', SensorReadingSchema);