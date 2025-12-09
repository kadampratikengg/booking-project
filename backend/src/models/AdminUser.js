const mongoose = require("mongoose");

const AdminUserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["SuperAdmin", "DriverApprover", "CustomerSupport", "Accounts"],
      default: "CustomerSupport"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("AdminUser", AdminUserSchema);
