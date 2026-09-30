const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  website: String,
  location: String
}, { timestamps: true });

module.exports = mongoose.model("Company", companySchema);
