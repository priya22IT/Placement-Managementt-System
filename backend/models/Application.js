const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  studentName: String,
  studentEmail: String,
  jobId: String,
  jobTitle: String,
  company: String,
  status: { type: String, default: "Applied" },
  appliedDate: { type: String, default: () => new Date().toLocaleDateString("en-IN") }
}, { timestamps: true });

module.exports = mongoose.model("Application", applicationSchema);
