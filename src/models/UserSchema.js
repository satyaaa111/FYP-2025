import mongoose from 'mongoose';

// We define a schema for our user.
// The user's original db.js stored users as an object with email as key.
// In MongoDB, we'll store them as documents in a collection.
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // Add any other fields from your original userData object here
  // e.g., role: String,
});

// This pattern prevents Mongoose from recompiling the model on hot-reloads
export default mongoose.models.User || mongoose.model('User', UserSchema);