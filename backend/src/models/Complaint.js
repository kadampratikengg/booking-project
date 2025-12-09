const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
  ride: { type: mongoose.Schema.Types.ObjectId, ref: 'Ride' },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
  type: { type: String, enum: ['over_charge','misbehavior','non_registered','wrong_route','other'] },
  description: { type: String },
  attachmentUrl: { type: String },
  status: { type: String, enum: ['open','in_review','resolved','rejected'], default: 'open' },
  createdAt: { type: Date, default: Date.now },
  resolvedAt: { type: Date }
});

module.exports = mongoose.model('Complaint', ComplaintSchema);
