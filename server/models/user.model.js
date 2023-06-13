const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  { 
    id:{ type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", userSchema);
