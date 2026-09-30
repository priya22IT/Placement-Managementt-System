const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  qualification: String,
  skills: String,
  phone: String
}, { timestamps: true });

module.exports = mongoose.model("Student", studentSchema);
