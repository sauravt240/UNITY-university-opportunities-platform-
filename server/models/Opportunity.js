const mongoose = require('mongoose');

const opportunitySchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Research', 'Internship', 'Project', 'Teaching Assistant', 'Field Work', 'Data Collection', 'Survey', 'Other'],
    required: true
  },
  department: { type: String, required: true },
  description: { type: String, required: true },
  
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  university: { type: String, required: true },
  
  location: {
    city: String,
    state: String,
    country: String,
    geo: {
      type: { type: String, enum: ['Point'] },
      coordinates: { type: [Number] } // [longitude, latitude]
    }
  },

  compensation: {
    type: { type: String, enum: ['Unpaid', 'Certificate Only', 'Stipend', 'Project Allowance', 'Full Salary', 'Mixed'] },
    amount: { type: String },
    benefits: [{ type: String }],
    duration: { type: String }
  },

  requirements: {
    minQualification: { type: String, enum: ['Undergraduate', 'Postgraduate', 'PhD', 'Any'] },
    skills: [{ type: String }],
    preferredDepartment: { type: String },
    minCgpa: { type: String },
    yearOfStudy: { type: String },
    languageProficiency: [{ type: String }],
    certifications: { type: String },
    positionsAvailable: { type: Number, default: 1 }
  },

  applicationSettings: {
    deadline: { type: Date, required: true },
    mode: { type: String, enum: ['Apply on Platform', 'External Link', 'Email'], default: 'Apply on Platform' },
    externalLink: { type: String },
    customQuestions: [{ type: String }]
  },

  status: { type: String, enum: ['Open', 'Closed', 'Filled'], default: 'Open' },
  applicantsCount: { type: Number, default: 0 }
}, { timestamps: true });

opportunitySchema.index({ 'location.geo': '2dsphere' });

module.exports = mongoose.model('Opportunity', opportunitySchema);
