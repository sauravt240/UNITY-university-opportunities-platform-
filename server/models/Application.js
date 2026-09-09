const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  opportunity: { type: mongoose.Schema.Types.ObjectId, ref: 'Opportunity', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  resumeUrl: { type: String },
  coverNote: { type: String, required: true },
  
  customAnswers: [{
    question: { type: String },
    answer: { type: String }
  }],
  
  status: { 
    type: String, 
    enum: ['Applied', 'Under Review', 'Shortlisted', 'Accepted', 'Rejected'],
    default: 'Applied'
  },
  
  appliedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Prevent multiple applications from same student to same opportunity
applicationSchema.index({ opportunity: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
