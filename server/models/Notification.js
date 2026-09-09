const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['ApplicationUpdate', 'NewApplication', 'DeadlineApproaching', 'System'] },
  relatedEntityId: { type: mongoose.Schema.Types.ObjectId }, // Can refer to Opportunity or Application
  isRead: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
