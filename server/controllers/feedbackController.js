const { sendFeedbackNotification } = require("../utils/emailService");

// POST /api/feedback — Submit feedback and notify the owner via email
exports.submitFeedback = async (req, res) => {
    try {
        const { rating, categories, message } = req.body;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: "A rating between 1 and 5 is required." });
        }

        const userName = req.user?.name || "Anonymous";
        const userEmail = req.user?.email || "";

        await sendFeedbackNotification({
            userName,
            userEmail,
            rating,
            categories: categories || [],
            message: message || "",
        });

        res.status(200).json({ message: "Thank you for your feedback!" });
    } catch (err) {
        console.error("Feedback submission error:", err);
        res.status(500).json({ message: "Failed to submit feedback. Please try again." });
    }
};
