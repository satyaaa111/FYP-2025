import mongoose from 'mongoose';

const IrrigationEventSchema = new mongoose.Schema({
  zone_id: {
    type: String,
    required: true,
    index: true, // Add index for faster queries on zone_id
  },
  event_type: {
    type: String,
    required: true,
    enum: ['pump_on', 'pump_off', 'scheduled_start', 'scheduled_end'],
  },
  duration_minutes: {
    type: Number,
  },
  trigger_reason: {
    type: String,
  },
  water_amount_liters: {
    type: Number,
  },
  created_date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.IrrigationEvent || mongoose.model('IrrigationEvent', IrrigationEventSchema);