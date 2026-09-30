const express = require("express");
const router = express.Router();
const Student = require("../models/Student");

let students = [];

router.post("/register", async (req, res) => {
  try {
    if (req.app.locals.mongoConnected) {
      const student = await Student.create(req.body);
      return res.status(201).json({ message: "Registration successful", student });
    }
  } catch (e) {
    return res.status(400).json({ message: "Email may already exist" });
  }
  students.push({ ...req.body, _id: "stu" + Date.now() });
  res.status(201).json({ message: "Registration successful" });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (req.app.locals.mongoConnected) {
      const student = await Student.findOne({ email, password });
      if (!student) return res.status(401).json({ message: "Invalid email or password" });
      return res.json({ message: "Login successful", student });
    }
  } catch (e) {}
  const student = students.find(s => s.email === email && s.password === password);
  if (!student) {
    return res.json({
      message: "Demo login successful",
      student: { name: email.split("@")[0], email, qualification: "B.Sc IT", skills: "HTML, CSS, JavaScript" }
    });
  }
  res.json({ message: "Login successful", student });
});

module.exports = router;
