const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    title: { type: String, required: true },
    description: { type: String },
    ingredients: { type: [String], required: true },
    instructions: { type: String },
    steps: { type: [String], required: true },
    servings: { type: Number, default: 1 },
    calories: { type: Number },
    time: { type: String },
    difficulty: { type: String },
    cuisine: { type: String },
    emoji: { type: String },
    accent: { type: String },
    tags: { type: [String] },

    recipeImage: { type: String },
    identifiedIngredients: { type: [String] },
    isAIGenerated: { type: Boolean, default: false },

    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Recipe", recipeSchema);
