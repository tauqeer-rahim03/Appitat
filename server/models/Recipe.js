const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    title: { type: String, required: true },
    ingredients: { type: [String], required: true },
    instructions: { type: String, required: true },
    servings: { type: Number, default: 1 },

    // To store the local path or URL of the uploaded fridge/ingredient photo
    recipeImage: { type: String },

    // To track the raw ingredients identified by Gemini Vision
    identifiedIngredients: { type: [String] },

    // Boolean to flag if this was a Vision-based discovery
    isAIGenerated: { type: Boolean, default: false },

    cuisine: { type: String },
    cookingTime: { type: String },
    dietaryType: { type: String },
    spiceLevel: { type: String },

    // To specifically handle the "Allergy-Safe" status
    excludedAllergies: { type: [String] },

    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Recipe", recipeSchema);
