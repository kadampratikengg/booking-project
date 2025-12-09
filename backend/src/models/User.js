const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: String,
    mobile: { type: String, required: true, unique: true },
    email: { type: String, unique: true },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
