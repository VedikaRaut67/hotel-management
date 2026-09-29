const express = require("express");

const router = express.Router();

const RoomChangeRequest = require("../models/RoomChangeRequest");
const Room = require("../models/room");

// STUDENT - CREATE REQUEST
router.post("/request", async (req, res) => {
  try {
    const {
      studentId,
      requestedRoomId,
      reason
    } = req.body;

    if (!studentId || !requestedRoomId || !reason) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    // Find current room
    const currentRoom = await Room.findOne({
      students: studentId
    });

    if (!currentRoom) {
      return res.status(400).json({
        message: "Student is not assigned to a room"
      });
    }

    // Same room check
    if (
      currentRoom._id.toString() ===
      requestedRoomId.toString()
    ) {
      return res.status(400).json({
        message: "You are already in this room"
      });
    }

    // Pending request check
    const pendingRequest =
      await RoomChangeRequest.findOne({
        student: studentId,
        status: "Pending"
      });

    if (pendingRequest) {
      return res.status(400).json({
        message:
          "You already have a pending room change request"
      });
    }

    // Target room
    const requestedRoom =
      await Room.findById(requestedRoomId);

    if (!requestedRoom) {
      return res.status(404).json({
        message: "Target room not found"
      });
    }

    // Capacity check
    if (requestedRoom.students.length >= 2) {
      return res.status(400).json({
        message: "Target room is full"
      });
    }

    const request =
      await RoomChangeRequest.create({
        student: studentId,
        currentRoom: currentRoom._id,
        requestedRoom: requestedRoom._id,
        reason
      });

    res.status(201).json({
      message: "Room change request submitted",
      request
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// STUDENT - VIEW REQUESTS
router.get("/student/:studentId", async (req, res) => {
  try {
    const requests =
      await RoomChangeRequest.find({
        student: req.params.studentId
      })
        .populate("currentRoom")
        .populate("requestedRoom")
        .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// ADMIN - VIEW ALL REQUESTS
router.get("/all", async (req, res) => {
  try {
    const requests =
      await RoomChangeRequest.find()
        .populate("student", "name email")
        .populate("currentRoom")
        .populate("requestedRoom")
        .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// ADMIN - APPROVE
router.put("/approve/:requestId", async (req, res) => {
  try {
    const request =
      await RoomChangeRequest.findById(
        req.params.requestId
      );

    if (!request) {
      return res.status(404).json({
        message: "Request not found"
      });
    }

    if (request.status !== "Pending") {
      return res.status(400).json({
        message: "Request already processed"
      });
    }

    const oldRoom =
      await Room.findById(request.currentRoom);

    const newRoom =
      await Room.findById(request.requestedRoom);

    if (!oldRoom || !newRoom) {
      return res.status(404).json({
        message: "Room not found"
      });
    }

    // IMPORTANT:
    // Check capacity AGAIN during approval.
    if (newRoom.students.length >= 2) {
      return res.status(400).json({
        message:
          "Cannot approve. Target room is now full."
      });
    }

    // Make sure student is still in old room
    const studentIndex =
      oldRoom.students.findIndex(
        (id) =>
          id.toString() ===
          request.student.toString()
      );

    if (studentIndex === -1) {
      return res.status(400).json({
        message:
          "Student is no longer assigned to the original room"
      });
    }

    // Remove from old room
    oldRoom.students.splice(studentIndex, 1);

    // Add to new room
    newRoom.students.push(request.student);

    await oldRoom.save();
    await newRoom.save();

    request.status = "Approved";

    await request.save();

    res.json({
      message: "Room change approved successfully",
      request
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// ADMIN - REJECT
router.put("/reject/:requestId", async (req, res) => {
  try {
    const request =
      await RoomChangeRequest.findById(
        req.params.requestId
      );

    if (!request) {
      return res.status(404).json({
        message: "Request not found"
      });
    }

    if (request.status !== "Pending") {
      return res.status(400).json({
        message: "Request already processed"
      });
    }

    request.status = "Rejected";

    await request.save();

    res.json({
      message: "Room change request rejected",
      request
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

module.exports = router;