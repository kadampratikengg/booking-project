const VehicleDocument = require('../models/VehicleDocument');
const Driver = require('../models/Driver');
const User = require('../models/User'); // if used
const Ride = require('../models/Ride'); // if used
const AdminUser = require('../models/AdminUser');
const bcrypt = require('bcryptjs');

// -------------------------------------------------------
// ADMIN DASHBOARD STATS
// -------------------------------------------------------
exports.getAdminStats = async (req, res) => {
  try {
    const totalDrivers = await Driver.countDocuments();
    const pendingDrivers = await Driver.countDocuments({
      docStatus: 'pending',
    });
    const approvedDrivers = await Driver.countDocuments({
      docStatus: 'approved',
    });

    const pendingDocuments = await VehicleDocument.countDocuments({
      status: 'pending',
    });
    const totalDocs = await VehicleDocument.countDocuments();

    const totalRides = Ride ? await Ride.countDocuments() : 0;

    res.json({
      status: true,
      stats: {
        totalDrivers,
        approvedDrivers,
        pendingDrivers,
        pendingDocuments,
        totalDocs,
        totalRides,
      },
    });
  } catch (err) {
    console.error('Admin Stats Error:', err);
    res.status(500).json({ status: false, message: 'Server Error' });
  }
};

// -------------------------------------------------------
// LIST PENDING DOCUMENTS
// -------------------------------------------------------
exports.listPendingDocs = async (req, res) => {
  try {
    const docs = await VehicleDocument.find({ status: 'pending' }).populate(
      'driver'
    );

    return res.json({ status: true, docs });
  } catch (error) {
    console.error('Error listing pending docs:', error);
    res.status(500).json({ status: false, message: 'Server Error' });
  }
};

// -------------------------------------------------------
// APPROVE / REJECT DOCUMENT
// -------------------------------------------------------
exports.approveDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body; // approve | reject

    const doc = await VehicleDocument.findById(id);
    if (!doc)
      return res
        .status(404)
        .json({ status: false, message: 'Document not found' });

    doc.status = action === 'approve' ? 'approved' : 'rejected';
    await doc.save();

    // Update driver's overall document status
    const driver = await Driver.findById(doc.driver);
    const allDocs = await VehicleDocument.find({ driver: driver._id });

    if (allDocs.length > 0 && allDocs.every((d) => d.status === 'approved')) {
      driver.docStatus = 'approved';
      driver.active = true;
    } else {
      driver.docStatus = allDocs.some((d) => d.status === 'pending')
        ? 'pending'
        : 'rejected';
      driver.active = false;
    }

    await driver.save();

    res.json({ status: true, doc, driver });
  } catch (error) {
    console.error('Document approval error:', error);
    res.status(500).json({ status: false, message: 'Server Error' });
  }
};

// -------------------------------------------------------
// CREATE ADMIN USER (superadmin only)
// -------------------------------------------------------
exports.createAdminUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password)
      return res
        .status(400)
        .json({ status: false, message: 'Missing required fields' });

    const exists = await AdminUser.findOne({ email });
    if (exists)
      return res
        .status(400)
        .json({ status: false, message: 'Admin user already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await AdminUser.create({
      name,
      email,
      password: hashed,
      role,
    });

    const safe = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    res.json({ status: true, user: safe });
  } catch (error) {
    console.error('Create admin user error:', error);
    res.status(500).json({ status: false, message: 'Server Error' });
  }
};

// -------------------------------------------------------
// LIST ADMIN USERS (superadmin only)
// -------------------------------------------------------
exports.listAdminUsers = async (req, res) => {
  try {
    const users = await AdminUser.find({}, '-password').sort({ createdAt: -1 });
    res.json({ status: true, users });
  } catch (error) {
    console.error('List admin users error:', error);
    res.status(500).json({ status: false, message: 'Server Error' });
  }
};
