const Feedback = require("../models/feedback");

exports.createFeedback = async (req, res) => {
  try {
    const { userId, emoji, feedbackText } = req.body;
    const feedback = new Feedback({
        userId,
        emoji,
        feedbackText,
        });

    await feedback.save();
    res.status(201).json({
      status: "success",
      data: {
        feedback,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find();
    // const feedback[] = feedbacks.map((rewardPoint) => ({
    //     actionType: feedback.emoji,
    //     feedbackText: feedback.feedbackText,
    //   }));
    res.status(200).json({
      status: "success",
      feedbacks: feedbacks
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
