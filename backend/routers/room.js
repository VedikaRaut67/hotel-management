const express = require("express");

const router = express.Router();
const Room = require("../models/room");
const User = require("../models/User");

// GET ALL ROOMS
router.get("/", async (req, res) => {
  try {
    const rooms = await Room.find().populate(
      "students",
      "name email"
    );

    res.json(rooms);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// ADD ROOM
router.post("/", async (req, res) => {
  try {
    const { roomNumber } = req.body;

    if (!roomNumber) {
      return res.status(400).json({
        message: "Room number is required"
      });
    }

    const existingRoom = await Room.findOne({ roomNumber });

    if (existingRoom) {
      return res.status(400).json({
        message: "Room already exists"
      });
    }

    const room = await Room.create({
      roomNumber,
      capacity: 2,
      students: []
    });

    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// ALLOCATE STUDENT
router.post("/allocate", async (req, res) => {
  try {
    const { studentId, roomId } = req.body;

    if (!studentId || !roomId) {
      return res.status(400).json({
        message: "Student and room are required"
      });
    }

    // Check if student already has a room
    const existingRoom = await Room.findOne({
      students: studentId
    });

    if (existingRoom) {
      return res.status(400).json({
        message: "Student is already assigned to a room"
      });
    }

    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({
        message: "Room not found"
      });
    }

    if (room.students.length >= 2) {
      return res.status(400).json({
        message: "Room is full"
      });
    }

    const student = await User.findById(studentId);

    if (!student || student.role !== "student") {
      return res.status(400).json({
        message: "Invalid student"
      });
    }

    room.students.push(studentId);

    await room.save();

    res.json({
      message: "Student allocated successfully",
      room
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// GET STUDENT ROOM
router.get("/student/:studentId", async (req, res) => {
  try {
    const room = await Room.findOne({
      students: req.params.studentId
    }).populate("students", "name email");

    if (!room) {
      return res.json(null);
    }

    res.json(room);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

module.exports = router;