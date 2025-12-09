const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Admin Register (optional)
router.post("/register", async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const exists = await Admin.findOne({ email });
    if (exists) return res.status(400).json({ message: "Admin already exists" });

    const hashed = await bcrypt.hash(password, 10);

    await Admin.create({ email, password: hashed, name });

    res.json({ message: "Admin registered" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: "Invalid email" });

    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ token, admin });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Forgot Password (send link)
router.post("/forgot", async (req, res) => {
  return res.json({
    message: "Dummy Forgot Password API — configure SMTP later",
  });
});

module.exports = router;
