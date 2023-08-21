import mongoose from "mongoose";

// creating User Schema 
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
}, {
  timestamps: true,
});

export const User = mongoose.model('User', userSchema);
