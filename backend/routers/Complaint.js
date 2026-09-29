const express = require("express");

const router = express.Router();

const Complaint = require("../models/Complaint");
const Room = require("../models/room");

// STUDENT - CREATE COMPLAINT
router.post("/", async (req, res) => {
  try {
    const {
      studentId,
      description
    } = req.body;

    const room = await Room.findOne({
      students: studentId
    });

    if (!room) {
      return res.status(400).json({
        message:
          "Only assigned students can submit complaints"
      });
    }

    const complaint =
      await Complaint.create({
        student: studentId,
        room: room._id,
        description
      });

    res.status(201).json({
      message: "Complaint submitted",
      complaint
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// ADMIN - GET COMPLAINTS
router.get("/", async (req, res) => {
  try {
    const complaints =
      await Complaint.find()
        .populate("student", "name email")
        .populate("room")
        .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// ADMIN - RESOLVE
router.put("/:id/resolve", async (req, res) => {
  try {
    const complaint =
      await Complaint.findByIdAndUpdate(
        req.params.id,
        { status: "Resolved" },
        { new: true }
      );

    res.json({
      message: "Complaint resolved",
      complaint
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

module.exports = router;