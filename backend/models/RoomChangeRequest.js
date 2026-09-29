const mongoose = require("mongoose");

const roomChangeRequestSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    currentRoom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true
    },

    requestedRoom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true
    },

    reason: {
      type: String,
      required: true,
      trim: true
    },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "RoomChangeRequest",
  roomChangeRequestSchema
);