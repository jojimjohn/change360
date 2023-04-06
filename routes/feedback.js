const express = require("express");
const feedbackController = require("../controllers/feedbackController");

const router = express.Router();

router.post("/", feedbackController.createFeedback);
router.get("/", feedbackController.getFeedbacks);

module.exports = router;
