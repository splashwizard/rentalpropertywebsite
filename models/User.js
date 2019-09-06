const bcrypt = require("bcrypt-nodejs");
const crypto = require("crypto");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true },
    password: String,
    passwordResetToken: String,
    passwordResetExpires: Date,
    userType: {
      type: String,
      enum: ["Landlord", "Tenant", "Contractor", "Admin", "SuperAdmin"]
    },
    status: {
      type: String,
      enum: ["Active", "Deleted"],
      default: "Active"
    },
    region: String, // Will update it
    profile: {
      name: String,
      gender: String,
      location: String,
      picture: {
        imageURL: String,
        imageID: String
      }
    },
    provider: {
      type: String,
      default: "local"
    },
    // facebook: Object,
    // twitter: String,
    // google: Object,
    // github: String,
    // instagram: String,
    // linkedin: Object,
    // steam: String,
    // tokens: Array
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
