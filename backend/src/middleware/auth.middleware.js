const jwtUtil = require('../utils/jwt');
const User = require('../models/User');
const Driver = require('../models/Driver');
const AdminUser = require('../models/AdminUser');

async function authMiddleware(req, res, next){
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: 'No token' });
  const token = auth.split(' ')[1];
  try {
    const payload = jwtUtil.verify(token);
    req.user = payload;
    // optionally load user record
    if (payload.type === 'customer') req.userModel = await User.findById(payload.id);
    if (payload.type === 'driver') req.userModel = await Driver.findById(payload.id);
    if (payload.type === 'admin') req.userModel = await AdminUser.findById(payload.id);
    next();
  } catch(err){
    console.error(err);
    return res.status(401).json({ message: 'Invalid token' });
  }
}

module.exports = { authMiddleware };
