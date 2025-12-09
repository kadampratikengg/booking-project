const User = require('../models/User');
const Driver = require('../models/Driver');
const { generateOTP, verifyOTP } = require('../utils/otp');
const { signAccess, signRefresh } = require('../utils/jwt');
const bcrypt = require('bcryptjs');
const AdminUser = require('../models/AdminUser');

exports.sendOtp = async (req,res)=>{
  const { mobile } = req.body;
  if (!mobile) return res.status(400).json({ message: 'mobile required' });
  const otp = generateOTP(mobile);
  // TODO: integrate real SMS provider
  console.log(`OTP for ${mobile}: ${otp}`);
  res.json({ ok: true, message: 'OTP sent (dev-console)' });
};

exports.verifyOtp = async (req,res)=>{
  const { mobile, code, role='customer' } = req.body;
  if (!verifyOTP(mobile, code)) return res.status(400).json({ message: 'Invalid OTP' });

  if (role === 'customer') {
    let user = await User.findOne({ mobile });
    if (!user) user = await User.create({ mobile, name: 'Unknown' });
    user.otpVerified = true;
    await user.save();
    const access = signAccess({ id: user._id, type: 'customer' });
    const refresh = signRefresh({ id: user._id, type: 'customer' });
    return res.json({ access, refresh, user });
  } else if (role === 'driver') {
    let driver = await Driver.findOne({ mobile });
    if (!driver) driver = await Driver.create({ mobile, name: 'Driver', vehicle:'bike' });
    driver.otpVerified = true;
    await driver.save();
    const access = signAccess({ id: driver._id, type: 'driver' });
    const refresh = signRefresh({ id: driver._id, type: 'driver' });
    return res.json({ access, refresh, driver });
  } else if (role === 'admin') {
    let admin = await AdminUser.findOne({ email: mobile }); // for admin use email in mobile field — not ideal
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    const access = signAccess({ id: admin._id, type: 'admin', roles: admin.roles });
    const refresh = signRefresh({ id: admin._id, type: 'admin', roles: admin.roles });
    return res.json({ access, refresh, admin });
  }
};
