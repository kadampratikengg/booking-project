const Rates = require('../models/Rates');

const GST = Number(process.env.GST_PERCENT || 18);
const PLATFORM_USER = Number(process.env.PLATFORM_FEE_PER_USER || 1);
const PLATFORM_DRIVER = Number(process.env.PLATFORM_FEE_PER_DRIVER || 1);

async function getRates() {
  let rates = await Rates.findOne();
  if (!rates) {
    rates = await Rates.create({});
  }
  return rates;
}

/**
 * calculateFare
 * vehicleType: bike|auto|car
 * distanceKm: number
 */
async function calculateFare(vehicleType, distanceKm) {
  const rates = await getRates();
  const perKm = rates.perKm[vehicleType];
  const minFare = rates.minFare[vehicleType];
  const base = Math.max(minFare, +(perKm * distanceKm).toFixed(2));

  const platformFeeCustomer = +(PLATFORM_USER + (PLATFORM_USER * GST / 100)).toFixed(2);
  const platformFeeDriver = +(PLATFORM_DRIVER + (PLATFORM_DRIVER * GST / 100)).toFixed(2);

  const totalFareCustomer = +(base + platformFeeCustomer).toFixed(2);

  return {
    baseFare: base,
    platformFeeCustomer,
    platformFeeDriver,
    totalFareCustomer
  };
}

module.exports = { calculateFare, getRates };
