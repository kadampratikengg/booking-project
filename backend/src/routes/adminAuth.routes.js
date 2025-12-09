const express = require('express');
const router = express.Router();
const AdminUser = require('../models/AdminUser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Admin Register (optional)
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const exists = await AdminUser.findOne({ email });
    if (exists)
      return res.status(400).json({ message: 'Admin already exists' });

    const hashed = await bcrypt.hash(password, 10);

    await AdminUser.create({ email, password: hashed, name });

    res.json({ message: 'Admin registered' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await AdminUser.findOne({ email });
    if (!admin) return res.status(400).json({ message: 'Invalid email' });

    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.status(400).json({ message: 'Invalid password' });

    // include admin type and roles in token payload for role checks
    const payload = {
      id: admin._id,
      type: 'admin',
      roles: [String(admin.role || 'superadmin')],
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    // return token and safe admin info
    const safeAdmin = {
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    };
    res.json({ token, admin: safeAdmin });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Forgot Password (send link)
router.post('/forgot', async (req, res) => {
  return res.json({
    message: 'Dummy Forgot Password API — configure SMTP later',
  });
});

module.exports = router;
