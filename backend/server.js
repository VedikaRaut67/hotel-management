const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routers/auth");
const roomRoutes = require("./routers/room");
const complaintRoutes = require("./routers/Complaint");
const roomChangeRoutes = require("./routers/roomChange");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Hostel Management API is running"
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/room-change", roomChangeRoutes);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully");

    app.listen(5000, () => {
      console.log(
        "Server running on http://localhost:5000"
      );
    });
  })
  .catch((error) => {
    console.log(
      "MongoDB connection failed:",
      error.message
    );
  });