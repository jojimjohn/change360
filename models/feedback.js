const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    emoji: {
      type: String,
      required: true,
    },
    feedbackText: {
      type: String,
      required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
      }
  }
);

const Feedback = mongoose.model("Feedback", feedbackSchema);

module.exports = Feedback;
