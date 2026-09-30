require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const studentRoutes = require("./routes/studentRoutes");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/placementDB";

app.use(cors());
app.use(express.json());
app.locals.mongoConnected = false;

app.get("/", (req, res) => {
  res.json({
    message: "Placement Management System API is running",
    stack: "MERN",
    status: app.locals.mongoConnected ? "MongoDB Connected" : "Demo Mode"
  });
});

app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/students", studentRoutes);

mongoose.connect(MONGO_URI)
  .then(() => {
    app.locals.mongoConnected = true;
    console.log("MongoDB connected");
  })
  .catch(() => {
    console.log("MongoDB not connected - running in Demo Mode with sample data");
  });

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
