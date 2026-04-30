const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const User = require("../models/User");
const Recipe = require("../models/Recipe");
const axios = require("axios");

if (!process.env.GOOGLE_API_KEY) {
    console.error("CRITICAL: GOOGLE_API_KEY is not defined in .env");
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");
const AI_MODEL = "gemini-2.0-flash-lite";

const handleError = (res, error, message = "Internal server error", status = 500) => {
    console.error(`${message}:`, error);
    res.status(status).json({
        message,
        error: error.message,
        ...(process.env.NODE_ENV === "development" && { stack: error.stack })
    });
};

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
        let rawText = result.response.text().replace(/```json|```/g, "").trim();

        let startIndex = rawText.indexOf('{');
        if (startIndex === -1) {
            console.error("Gemini returned no JSON object. Raw response:", rawText);
            return res.status(502).json({ message: "AI returned an unexpected response. Please try again." });
        }

        let braceCount = 0;
        let endIndex = -1;
        for (let i = startIndex; i < rawText.length; i++) {
            if (rawText[i] === '{') braceCount++;
            else if (rawText[i] === '}') braceCount--;

            if (braceCount === 0) {
                endIndex = i;
                break;
            }
        }

        if (endIndex === -1) {
            console.error("Gemini returned truncated/incomplete JSON. Raw response:", rawText);
            return res.status(502).json({ message: "AI response was incomplete. Please try again." });
        }

        const jsonStr = rawText.substring(startIndex, endIndex + 1);

        let parsed;
        try {
            parsed = JSON.parse(jsonStr);
        } catch (parseErr) {
            console.error("Failed to parse Gemini JSON:", parseErr.message, "\nRaw JSON string:", jsonStr);
            return res.status(502).json({ message: "AI returned malformed data. Please try again." });
        }

        const recipes = parsed.recipes;
        if (!Array.isArray(recipes) || recipes.length === 0) {
            console.error("Gemini JSON had no 'recipes' array:", parsed);
            return res.status(502).json({ message: "AI didn't return any recipes. Please try again." });
        }

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
