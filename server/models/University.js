const mongoose = require('mongoose');

const universitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true } // [longitude, latitude]
  },
  website: { type: String },
  isApproved: { type: Boolean, default: true } // Auto-approve for demo
}, { timestamps: true });

universitySchema.index({ location: '2dsphere' });

module.exports = mongoose.model('University', universitySchema);
