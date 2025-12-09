const mongoose = require("mongoose");

const VehicleDocumentsSchema = new mongoose.Schema(
  {
    driverId: { type: mongoose.Schema.Types.ObjectId, ref: "Driver" },

    rc: {
      number: String,
      fileUrl: String,
      expiry: Date,
      status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" }
    },

    insurance: {
      number: String,
      fileUrl: String,
      expiry: Date,
      status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" }
    },

    puc: {
      number: String,
      fileUrl: String,
      expiry: Date,
      status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" }
    },

    license: {
      number: String,
      fileUrl: String,
      expiry: Date,
      status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" }
    },

    panCard: {
      number: String,
      fileUrl: String,
      status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("VehicleDocuments", VehicleDocumentsSchema);
