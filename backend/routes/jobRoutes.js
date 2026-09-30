const express = require("express");
const router = express.Router();
const Job = require("../models/Job");

let jobs = [
  {
    _id: "job1",
    title: "Python Developer Intern",
    company: "TechNova Solutions",
    location: "Mumbai",
    type: "Internship",
    qualification: "B.Sc IT / BCA / B.Tech",
    skills: "Python, Django, SQL",
    experience: "Fresher",
    salary: "₹15,000/month",
    description: "Work with the development team to build web applications and APIs.",
    lastDate: "30/09/2026",
    applyLink: "#",
    status: "Approved"
  },
  {
    _id: "job2",
    title: "Frontend Developer Intern",
    company: "WebCraft Technologies",
    location: "Pune",
    type: "Internship",
    qualification: "B.Sc IT / BCA / B.Tech",
    skills: "HTML, CSS, JavaScript, React",
    experience: "Fresher",
    salary: "₹18,000/month",
    description: "Create responsive user interfaces and learn React development.",
    lastDate: "05/10/2026",
    applyLink: "#",
    status: "Approved"
  },
  {
    _id: "job3",
    title: "Java Developer - Fresher",
    company: "CodeBridge Pvt Ltd",
    location: "Mumbai",
    type: "Full Time",
    qualification: "B.Sc IT / BCA / B.Tech",
    skills: "Java, SQL, JDBC",
    experience: "Fresher",
    salary: "₹4 LPA",
    description: "Join the software team as a fresher Java developer.",
    lastDate: "10/10/2026",
    applyLink: "#",
    status: "Approved"
  },
  {
    _id: "job4",
    title: "Data Analyst Intern",
    company: "InsightWorks",
    location: "Remote",
    type: "Internship",
    qualification: "Any Degree",
    skills: "Excel, SQL, Python",
    experience: "Fresher",
    salary: "₹12,000/month",
    description: "Assist the analytics team with reports, data cleaning and dashboards.",
    lastDate: "15/10/2026",
    applyLink: "#",
    status: "Approved"
  }
];

router.get("/", async (req, res) => {
  try {
    if (req.app.locals.mongoConnected) {
      const data = await Job.find({ status: "Approved" }).sort({ createdAt: -1 });
      return res.json(data);
    }
  } catch (e) {}
  res.json(jobs.filter(j => j.status === "Approved"));
});

router.post("/", async (req, res) => {
  const jobData = { ...req.body, status: "Approved" };
  try {
    if (req.app.locals.mongoConnected) {
      const job = await Job.create(jobData);
      return res.status(201).json(job);
    }
  } catch (e) {}
  const job = { ...jobData, _id: "job" + Date.now() };
  jobs.unshift(job);
  res.status(201).json(job);
});

module.exports = router;
