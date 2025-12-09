const mongoose = require('mongoose');

const RatesSchema = new mongoose.Schema({
  perKm: {
    bike: { type: Number, default: Number(process.env.PER_KM_RATE_BIKE || 6) },
    auto: { type: Number, default: Number(process.env.PER_KM_RATE_AUTO || 10) },
    car: { type: Number, default: Number(process.env.PER_KM_RATE_CAR || 12) }
  },
  minFare: {
    bike: { type: Number, default: Number(process.env.MIN_FARE_BIKE || 35) },
    auto: { type: Number, default: Number(process.env.MIN_FARE_AUTO || 50) },
    car: { type: Number, default: Number(process.env.MIN_FARE_CAR || 60) }
  },
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Rates', RatesSchema);
