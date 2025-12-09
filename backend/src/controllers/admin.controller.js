const VehicleDocument = require("../models/VehicleDocument");
const Driver = require("../models/Driver");
const User = require("../models/User"); // if used
const Ride = require("../models/Ride"); // if used

// -------------------------------------------------------
// ADMIN DASHBOARD STATS
// -------------------------------------------------------
exports.getAdminStats = async (req, res) => {
  try {
    const totalDrivers = await Driver.countDocuments();
    const pendingDrivers = await Driver.countDocuments({ docStatus: "pending" });
    const approvedDrivers = await Driver.countDocuments({ docStatus: "approved" });

    const pendingDocuments = await VehicleDocument.countDocuments({ status: "pending" });
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
        totalRides
      },
    });
  } catch (err) {
    console.error("Admin Stats Error:", err);
    res.status(500).json({ status: false, message: "Server Error" });
  }
};

// -------------------------------------------------------
// LIST PENDING DOCUMENTS
// -------------------------------------------------------
exports.listPendingDocs = async (req, res) => {
  try {
    const docs = await VehicleDocument.find({ status: "pending" }).populate("driver");

    return res.json({ status: true, docs });
  } catch (error) {
    console.error("Error listing pending docs:", error);
    res.status(500).json({ status: false, message: "Server Error" });
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
    if (!doc) return res.status(404).json({ status: false, message: "Document not found" });

    doc.status = action === "approve" ? "approved" : "rejected";
    await doc.save();

    // Update driver's overall document status
    const driver = await Driver.findById(doc.driver);
    const allDocs = await VehicleDocument.find({ driver: driver._id });

    if (allDocs.length > 0 && allDocs.every((d) => d.status === "approved")) {
      driver.docStatus = "approved";
      driver.active = true;
    } else {
      driver.docStatus = allDocs.some((d) => d.status === "pending") ? "pending" : "rejected";
      driver.active = false;
    }

    await driver.save();

    res.json({ status: true, doc, driver });
  } catch (error) {
    console.error("Document approval error:", error);
    res.status(500).json({ status: false, message: "Server Error" });
  }
};
