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
    cookDays: { type: Number, default: 0 },
    recentlyViewed: [
        {
            recipeId: String,
            viewedAt: { type: Date, default: Date.now },
        },
    ],
    history: [
        {
            recipeId: String,
            title: String,
            emoji: String,
            cuisine: String,
            xpAwarded: { type: Number, default: 0 },
            cookedAt: { type: Date, default: Date.now },
        },
    ],
    badges: [
        {
            name: String,
            emoji: String,
            unlockedAt: { type: Date, default: Date.now },
        },
    ],
    savedRecipes: [Object],

});

module.exports = mongoose.model("User", userSchema);
