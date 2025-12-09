const crypto = require('crypto');

const OTP_STORE = new Map(); // in-memory - production: redis

function generateOTP(mobile) {
  const otp = (Math.floor(100000 + Math.random()*900000)).toString();
  const expires = Date.now() + 5*60*1000;
  OTP_STORE.set(mobile, { otp, expires });
  return otp;
}
function verifyOTP(mobile, code) {
  const rec = OTP_STORE.get(mobile);
  if (!rec) return false;
  if (rec.expires < Date.now()) { OTP_STORE.delete(mobile); return false; }
  if (rec.otp === code) { OTP_STORE.delete(mobile); return true; }
  return false;
}
module.exports = { generateOTP, verifyOTP };
