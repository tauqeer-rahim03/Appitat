const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // Personalization & Imagery
    profilePic: { type: String, default: "" },
    coverPic: { type: String, default: "" },
    pantry: [String],
    allergies: [String],
    age: { type: Number },
    experience: {
        type: String,
        enum: ["beginner", "intermediate", "advanced", "pro"],
        default: "beginner",
    },
    neverShowMe: [String],

    // Gamification
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    badges: [
        {
            name: String,
            emoji: String,
            unlockedAt: { type: Date, default: Date.now },
        },
    ],

    // History
    recentlyViewed: [
        {
            recipeId: { type: mongoose.Schema.Types.ObjectId, ref: "Recipe" },
            viewedAt: { type: Date, default: Date.now },
        },
    ],
});

module.exports = mongoose.model("User", userSchema);
