const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, default: "Mumbai" },
  type: { type: String, default: "Internship" },
  qualification: { type: String, default: "B.Sc IT / BCA / B.Tech" },
  skills: { type: String, default: "HTML, CSS, JavaScript" },
  experience: { type: String, default: "Fresher" },
  salary: { type: String, default: "₹15,000/month" },
  description: { type: String, default: "" },
  lastDate: { type: String, default: "30/09/2026" },
  applyLink: { type: String, default: "#" },
  status: { type: String, default: "Approved" }
}, { timestamps: true });

module.exports = mongoose.model("Job", jobSchema);
