const mongoose = require("mongoose");

const RideSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    driverId: { type: mongoose.Schema.Types.ObjectId, ref: "Driver" },

    pickup: String,
    drop: String,
    distanceKm: Number,
    fare: Number,
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Started", "Completed", "Cancelled"],
      default: "Pending"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ride", RideSchema);
