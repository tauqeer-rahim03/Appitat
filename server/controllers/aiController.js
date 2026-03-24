const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const User = require("../models/User");
const Recipe = require("../models/Recipe");
const axios = require("axios");

if (!process.env.GOOGLE_API_KEY) {
    console.error("CRITICAL: GOOGLE_API_KEY is not defined in .env");
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");
const AI_MODEL = "gemini-3.1-flash-lite-preview";

// Helper for consistent error responses
const handleError = (res, error, message = "Internal server error", status = 500) => {
    console.error(`${message}:`, error);
    res.status(status).json({
        message,
        error: error.message,
        ...(process.env.NODE_ENV === "development" && { stack: error.stack })
    });
};

// Helper to update XP & Level (Standard: 500 XP per Level)
const awardXp = async (userId, amount) => {
    const user = await User.findById(userId);
    if (!user) return null;

    user.xp += Number(amount);
    const newLevel = Math.floor(user.xp / 500) + 1;
    const hasLeveledUp = user.level !== newLevel;
    
    if (hasLeveledUp) {
        user.level = newLevel;
    }

    await user.save();
    return { xp: user.xp, level: user.level, hasLeveledUp };
};

exports.getRecommendation = async (req, res) => {
    try {
        const { cuisine, cookingTime, dietaryType, spiceLevel, mealType, ingredients: reqIngredients } = req.body;

        const user = await User.findById(req.user.userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const finalIngredients = [...new Set([...(user.pantry || []), ...(reqIngredients || [])])];
        if (finalIngredients.length === 0) {
            return res.status(400).json({ message: "Your ingredient list is empty." });
        }

        const model = genAI.getGenerativeModel({
            model: AI_MODEL,
            generationConfig: { responseMimeType: "application/json" }
        });

        const prompt = `
            Act as a professional master chef. Suggest 4 distinct, creative, and highly detailed recipes using: ${finalIngredients.join(", ")}. 
            EXCLUDE: ${(user.allergies || []).concat(user.neverShowMe || []).join(", ") || "None"}.
            User Skill: ${user.experience || "beginner"}. 
            Preferences: Meal Type: ${mealType || "Any"}, Cuisine: ${cuisine || "Any"}, Max Time: ${cookingTime || "Any"}, Diet: ${dietaryType || "None"}, Spice: ${spiceLevel || "Any"}.
            
            IMPORTANT: For each recipe, provide a list of at least 8-10 precise, professional, and detailed steps. 
            Each step should be descriptive enough for a high-quality cooking experience.

            Response Format: Return a JSON object with 'recipes' array.
            Recipe fields: title, emoji, description (2 full sentences), cuisine, ingredients (array of strings with quantities), steps (array of 8-10 detailed strings), time, calories (number), difficulty, servings (number), accent (hex), tags.
        `;

        const result = await model.generateContent(prompt);
        const text = result.response.text().replace(/```json|```/g, "").trim();
        const recipes = JSON.parse(text).recipes;

        res.status(200).json({
            message: "Smart recipes generated!",
            recipes
        });
    } catch (error) {
        handleError(res, error, "Error generating recipe");
    }
};

exports.identifyIngredientsAndRecommend = async (req, res) => {
    try {
        let imageData;
        const imageUrl = req.body.imageUrl;

        if (req.file) {
            imageData = {
                inlineData: {
                    data: Buffer.from(fs.readFileSync(req.file.path)).toString("base64"),
                    mimeType: req.file.mimetype,
                },
            };
        } else if (imageUrl) {
            const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
            imageData = {
                inlineData: {
                    data: Buffer.from(response.data).toString("base64"),
                    mimeType: response.headers["content-type"] || "image/jpeg",
                },
            };
        } else {
            return res.status(400).json({ message: "No image provided" });
        }

        const model = genAI.getGenerativeModel({ 
            model: AI_MODEL,
            generationConfig: { responseMimeType: "application/json" }
        });

        const prompt = `Analyze this image. List ingredients seen and suggest 3 distinct recipes. 
        Return ONLY a JSON object with 'identifiedIngredients' (array) and 'recipes' (array of recipe objects).`;

        const result = await model.generateContent([prompt, imageData]);
        const text = result.response.text().replace(/```json|```/g, "").trim();
        const aiResponse = JSON.parse(text);

        const primaryRecipe = aiResponse.recipes[0];
        const newRecipe = new Recipe({
            userId: req.user.userId,
            ...primaryRecipe,
            recipeImage: req.file ? req.file.path : imageUrl,
            identifiedIngredients: aiResponse.identifiedIngredients,
            isAIGenerated: true,
        });

        const savedRecipe = await newRecipe.save();
        const xpStatus = await awardXp(req.user.userId, 30);

        res.status(200).json({
            message: "Ingredients identified and recipes generated!",
            identifiedIngredients: aiResponse.identifiedIngredients,
            recipes: aiResponse.recipes,
            savedRecipeId: savedRecipe._id,
            xpStatus
        });
    } catch (error) {
        handleError(res, error, "Error processing image");
    }
};

exports.saveRecipe = async (req, res) => {
    try {
        const userId = req.user.userId;
        const newRecipe = new Recipe({ userId, ...req.body });
        const savedRecipe = await newRecipe.save();

        const xpStatus = await awardXp(userId, 50);

        res.status(201).json({
            message: "Recipe saved and XP awarded!",
            recipe: savedRecipe,
            xpGained: 50,
            xpStatus
        });
    } catch (error) {
        handleError(res, error, "Error saving recipe");
    }
};

exports.getRecipeById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;

        const recipe = await Recipe.findById(id);
        if (!recipe) return res.status(404).json({ message: "Recipe not found" });

        await User.findByIdAndUpdate(userId, {
            $push: {
                recentlyViewed: {
                    $each: [{ recipeId: id }],
                    $position: 0,
                    $slice: 5,
                },
            },
        });

        res.status(200).json(recipe);
    } catch (error) {
        handleError(res, error, "Error fetching recipe");
    }
};

// exports.getMyRecipes moved to userController.js
