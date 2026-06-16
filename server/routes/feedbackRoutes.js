const express = require("express");
const router = express.Router();
const optionalAuth = require("../middleware/optionalAuth");
const feedbackController = require("../controllers/feedbackController");

// POST /api/feedback — Submit feedback (emails the owner, works for logged-in & anonymous users)
router.post("/", optionalAuth, feedbackController.submitFeedback);

module.exports = router;
