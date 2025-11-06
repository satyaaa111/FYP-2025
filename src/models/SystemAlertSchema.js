import mongoose from 'mongoose';

// Based on your SystemAlert.js and SystemAlert.json
const SystemAlertSchema = new mongoose.Schema({
  zone_id: {
    type: String,
    index: true,
  },
  level: {
    type: String,
    required: true,
    enum: ['info', 'warning', 'critical'],
  },
  message: {
    type: String,
    required: true,
  },
  is_read: {
    type: Boolean,
    default: false,
  },
  created_date: {
    type: Date,
    default: Date.now,
    index: true,
  },
  // Add any other fields from your SystemAlert.json
});

export default mongoose.models.SystemAlert || mongoose.model('SystemAlert', SystemAlertSchema);