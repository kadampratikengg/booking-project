const mongoose = require("mongoose");

const DriverSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    vehicleType: { type: String, enum: ["BIKE", "AUTO", "CAR"], required: true },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending"
    },

    walletBalance: { type: Number, default: 0 },
    isBlocked: { type: Boolean, default: false },

    complaintLocked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Driver", DriverSchema);
