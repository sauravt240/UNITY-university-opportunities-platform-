const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Admin', 'Faculty', 'Student'], required: true },
  university: { type: String, required: true },
  
  // Student Specific
  degree: { type: String },
  year: { type: String },
  skills: [{ type: String }],
  interests: [{ type: String }],
  resumeUrl: { type: String },
  location: { type: String },
  
  // Faculty Specific
  department: { type: String },
  researchInterests: [{ type: String }],
  bio: { type: String },
  
  isVerified: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
