const mongoose = require("mongoose");

const userQueueSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },

    tokenNumber: Number,

    joinedAt: {
      type: Date,
      default: Date.now,
    },

    status: {
      type: String,
      enum: ["waiting", "served", "skipped"],
      default: "waiting",
    },

    notified: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false },
);

const queueSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    venueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Venues",
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    averageServiceTime: {
      type: Number,
      default: 180,
    },

    nowServing: {
      type: Number,
      default: 0,
    },

    lastTokenNumber: {
      type: Number,
      default: 0,
    },

    queue: [userQueueSchema],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Queue", queueSchema);
