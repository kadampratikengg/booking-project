const mongoose = require('mongoose');

const WalletTransactionSchema = new mongoose.Schema({
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', required: true },
  type: { type: String, enum: ['credit','debit'], required: true },
  amount: { type: Number, required: true },
  description: { type: String },
  metadata: { type: Object },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('WalletTransaction', WalletTransactionSchema);
