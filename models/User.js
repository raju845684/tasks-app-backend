const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String }, // null for Google OAuth users
    avatar: { type: String, default: "" },
    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    googleId: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
