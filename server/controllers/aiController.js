const { GoogleGenerativeAI } = require("@google/generative-ai");
const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const fs = require("fs");
const User = require("../models/User");
const Recipe = require("../models/Recipe");
const axios = require("axios");

if (!process.env.GOOGLE_API_KEY) {
    console.error("CRITICAL: GOOGLE_API_KEY is not defined in .env");
}
if (!process.env.GROQ_API_KEY) {
    console.error("CRITICAL: GROQ_API_KEY is not defined in .env");
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");
const AI_MODEL = "gemini-3-flash-preview";

const handleError = (
    res,
    error,
    message = "Internal server error",
    status = 500,
) => {
    console.error(`${message}:`, error);
    res.status(status).json({
        message,
        error: error.message,
        ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
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
        const {
            cuisine,
            cookingTime,
            dietaryType,
            spiceLevel,
            mealType,
            ingredients: reqIngredients,
        } = req.body;

        const user = await User.findById(req.user.userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const finalIngredients = [
            ...new Set([...(user.pantry || []), ...(reqIngredients || [])]),
        ];
        if (finalIngredients.length === 0) {
            return res
                .status(400)
                .json({ message: "Your ingredient list is empty." });
        }

        const systemPrompt = `You are a professional master chef AI. Your ONLY output must be a single, valid JSON object with a 'recipes' key containing an array of recipe objects. Do not include any text, markdown, or explanation outside of the JSON object.`;

        const userPrompt = `Suggest 6 distinct, creative, and highly detailed recipes using: ${finalIngredients.join(", ")}.
EXCLUDE ingredients/dishes containing: ${(user.allergies || []).concat(user.neverShowMe || []).join(", ") || "None"}.
User Skill Level: ${user.experience || "beginner"}.
Preferences: Meal Type: ${mealType || "Any"}, Cuisine: ${cuisine || "Any"}, Max Cooking Time: ${cookingTime || "Any"}, Dietary Type: ${dietaryType || "None"}, Spice Level: ${spiceLevel || "Any"}.
For each recipe, provide 8-10 precise, professional, and detailed cooking steps.
Return a JSON object with a 'recipes' array. Each recipe object must have: title, emoji, description, cuisine, ingredients, steps, time, calories, difficulty, servings, accent, tags.`;

        console.log("[Groq] Generating recipes with openai/gpt-oss-120b...");
        let chatCompletion;
        try {
            chatCompletion = await groq.chat.completions.create({
                model: "openai/gpt-oss-120b",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userPrompt },
                ],
                response_format: { type: "json_object" },
                temperature: 0.8,
                max_tokens: 4096,
            });
        } catch (groqErr) {
            console.error("[Groq] API call failed:", groqErr.message);
            return res.status(503).json({
                message: "AI service is temporarily unavailable. Please try again in a moment.",
                error: groqErr.message,
            });
        }

        let parsed;
        try {
            parsed = JSON.parse(chatCompletion.choices[0].message.content);
        } catch (parseErr) {
            console.error("[Groq] Failed to parse JSON response:", parseErr.message);
            return res.status(502).json({ message: "AI returned malformed data. Please try again." });
        }

        const recipes = parsed.recipes;
        if (!Array.isArray(recipes) || recipes.length === 0) {
            console.error("[Groq] JSON had no 'recipes' array:", parsed);
            return res.status(502).json({ message: "AI didn't return any recipes. Please try again." });
        }

        res.status(200).json({ message: "Smart recipes generated!", recipes });
    } catch (error) {
        handleError(res, error, "Error generating recipe");
    }
};

// --- Streaming SSE endpoint: generates 4 recipes one-at-a-time ---
exports.getRecommendationStream = async (req, res) => {
    const {
        cuisine,
        cookingTime,
        dietaryType,
        spiceLevel,
        mealType,
        calories,
        servings,
        ingredients: reqIngredients,
    } = req.body;

    const user = await User.findById(req.user.userId);
    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
    }

    const finalIngredients = [
        ...new Set([...(user.pantry || []), ...(reqIngredients || [])]),
    ];
    if (finalIngredients.length === 0) {
        res.status(400).json({ message: "Your ingredient list is empty." });
        return;
    }

    // SSE headers
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");
    res.flushHeaders();

    const sendEvent = (event, data) => {
        res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
    };

    const exclusions =
        (user.allergies || []).concat(user.neverShowMe || []).join(", ") || "None";
    const systemPrompt = `You are a professional master chef AI. Your ONLY output must be a single, valid JSON object representing exactly ONE recipe. Do not include any text, markdown, or explanation outside of the JSON object.`;

    const TOTAL = 6;
    const generatedTitles = [];

    for (let i = 0; i < TOTAL; i++) {
        console.log(`[Groq] Streaming recipe ${i + 1}/${TOTAL}...`);

        const avoidClause =
            generatedTitles.length > 0
                ? `\nDo NOT suggest any of these already-generated recipes: ${generatedTitles.join(", ")}.`
                : "";

        const calorieConstraint = calories
            ? `CALORIE REQUIREMENT (CRITICAL — do NOT violate): The recipe MUST have a calorie count that fits "${calories}". This is a hard constraint. Design portion sizes, ingredients, and cooking methods to meet this target. The 'calories' field in your JSON must reflect the actual calorie count for the dish.`
            : "";
        const servingConstraint = servings ? `Target servings: ${servings}.` : "";

        const userPrompt = `Generate recipe #${i + 1} of ${TOTAL}. Make it distinct from any other recipe in this session.${avoidClause}
Available ingredients: ${finalIngredients.join(", ")}.
EXCLUDE ingredients/dishes containing: ${exclusions}.
User Skill Level: ${user.experience || "beginner"}.
Preferences: Meal Type: ${mealType || "Any"}, Cuisine: ${cuisine || "Any"}, Max Cooking Time: ${cookingTime || "Any"}, Dietary Type: ${dietaryType || "None"}, Spice Level: ${spiceLevel || "Any"}.
${calorieConstraint}
${servingConstraint}

Provide 8-10 precise, professional, and detailed cooking steps. Be creative and thorough — use all available tokens for quality.

Return a JSON object with these exact fields:
- title (string)
- emoji (a SINGLE emoji character only)
- description (string, 2 full sentences describing the dish)
- tip (string, 1 sentence — a practical chef's tip specific to this recipe, e.g. a technique, substitution, or timing trick)
- cuisine (string)
- ingredients (array of strings with quantities)
- steps (array of 8-10 detailed strings)
- time (string, e.g. "30 mins")
- calories (number — ${calories ? `MUST match the calorie requirement above: ${calories}` : "freely estimate the realistic calorie count for this specific dish based on its ingredients and portions — do NOT default to 420, vary it naturally"})
- difficulty (string: "Easy", "Medium", or "Hard")
- servings (number)
- accent (unique hex color string, e.g. "#FF6B6B")
- tags (array of strings)`;

        try {
            const chatCompletion = await groq.chat.completions.create({
                model: "llama-3.3-70b-versatile",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userPrompt },
                ],
                response_format: { type: "json_object" },
                temperature: 0.85,
                max_tokens: 8192,
            });

            const recipe = JSON.parse(chatCompletion.choices[0].message.content);
            generatedTitles.push(recipe.title);
            sendEvent("recipe", { recipe, index: i });
        } catch (err) {
            console.error(`[Groq] Recipe ${i + 1} failed:`, err.message);
            sendEvent("error", {
                index: i,
                message: `Recipe ${i + 1} could not be generated.`,
            });
        }
    }

    sendEvent("done", { total: TOTAL });
    res.end();
};

exports.identifyIngredientsAndRecommend = async (req, res) => {
    try {
        let imageData;
        const imageUrl = req.body.imageUrl;

        if (req.file) {
            imageData = {
                inlineData: {
                    data: Buffer.from(fs.readFileSync(req.file.path)).toString(
                        "base64",
                    ),
                    mimeType: req.file.mimetype,
                },
            };
        } else if (imageUrl) {
            const response = await axios.get(imageUrl, {
                responseType: "arraybuffer",
            });
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
            generationConfig: { responseMimeType: "application/json" },
        });

        const prompt = `Analyze this image. List ingredients seen and suggest 3 distinct recipes.
        Return ONLY a JSON object with 'identifiedIngredients' (array of strings) and 'recipes' (array of recipe objects).
        Each recipe object inside the 'recipes' array must have the following exact fields:
        - title (string)
        - emoji (string, a single emoji character)
        - description (string, 2 sentences)
        - cuisine (string)
        - ingredients (array of strings with quantities)
        - steps (array of strings, detailing 8-10 cooking steps)
        - time (string, e.g. "30 mins")
        - calories (number)
        - difficulty (string: "Easy", "Medium", or "Hard")
        - servings (number)
        - accent (string, a hex color code, e.g. "#FF6B6B")
        - tags (array of strings)`;

        const result = await model.generateContent([prompt, imageData]);
        const text = result.response
            .text()
            .replace(/```json|```/g, "")
            .trim();
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
            xpStatus,
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
            xpStatus,
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
        if (!recipe)
            return res.status(404).json({ message: "Recipe not found" });

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
