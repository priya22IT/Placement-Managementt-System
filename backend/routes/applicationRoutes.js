const express = require("express");
const router = express.Router();
const Application = require("../models/Application");

let applications = [];

router.get("/", async (req, res) => {
  try {
    if (req.app.locals.mongoConnected) {
      const data = await Application.find().sort({ createdAt: -1 });
      return res.json(data);
    }
  } catch (e) {}
  res.json(applications);
});

router.post("/", async (req, res) => {
  const data = {
    ...req.body,
    status: "Applied",
    appliedDate: new Date().toLocaleDateString("en-IN")
  };
  try {
    if (req.app.locals.mongoConnected) {
      const app = await Application.create(data);
      return res.status(201).json(app);
    }
  } catch (e) {}
  const app = { ...data, _id: "app" + Date.now() };
  applications.unshift(app);
  res.status(201).json(app);
});

router.patch("/:id", async (req, res) => {
  try {
    if (req.app.locals.mongoConnected) {
      const app = await Application.findByIdAndUpdate(req.params.id, req.body, { new: true });
      return res.json(app);
    }
  } catch (e) {}
  const app = applications.find(a => a._id === req.params.id);
  if (app) Object.assign(app, req.body);
  res.json(app || {});
});

module.exports = router;
