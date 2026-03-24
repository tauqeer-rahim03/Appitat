const User = require("../models/User");
const Recipe = require("../models/Recipe");

// Helper for consistent error responses
const handleError = (res, error, message = "Internal server error", status = 500) => {
    console.error(`${message}:`, error);
    res.status(status).json({
        message,
        error: error.message,
        ...(process.env.NODE_ENV === "development" && { stack: error.stack })
    });
};

// Fetch the user's saved recipes
exports.getMyRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.find({ userId: req.user.userId });
        res.status(200).json(recipes);
    } catch (error) {
        handleError(res, error, "Error fetching saved recipes");
    }
};

// Update Pantry & Allergies (Legacy/Specific endpoint)
exports.updatePantry = async (req, res) => {
    try {
        const { ingredients, allergies } = req.body;

        const user = await User.findByIdAndUpdate(
            req.user.userId,
            { $set: { pantry: ingredients, allergies: allergies } },
            { new: true, runValidators: true },
        ).select("-password");

        res.status(200).json({
            message: "Pantry updated successfully",
            pantry: user.pantry,
            allergies: user.allergies,
        });
    } catch (error) {
        handleError(res, error, "Error updating pantry settings");
    }
};

// Get Full Profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json(user);
    } catch (error) {
        handleError(res, error, "Error fetching profile");
    }
};

// Update profile images (Multer + JSON fallback)
exports.updateProfileImages = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { profilePic, coverPic } = req.body;
        const updates = {};

        if (req.files?.profilePic) {
            updates.profilePic = req.files.profilePic[0].path.replace(/\\/g, "/");
        } else if (profilePic !== undefined) {
            updates.profilePic = profilePic;
        }

        if (req.files?.coverPic) {
            updates.coverPic = req.files.coverPic[0].path.replace(/\\/g, "/");
        } else if (coverPic !== undefined) {
            updates.coverPic = coverPic;
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: "No image updates provided" });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updates },
            { new: true },
        ).select("-password");

        res.status(200).json({
            message: "Images updated successfully!",
            profilePic: updatedUser.profilePic,
            coverPic: updatedUser.coverPic,
        });
    } catch (error) {
        handleError(res, error, "Error updating images");
    }
};

// Update basic profile info (Refactored with whitelist)
exports.updateProfile = async (req, res) => {
    try {
        const whitelist = [
            "name", "email", "age", "experience", "allergies", 
            "pantry", "neverShowMe", "profilePic", "coverPic", 
            "xp", "level", "cookDays"
        ];
        
        const updates = {};
        whitelist.forEach(field => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: "No valid update fields provided" });
        }

        const user = await User.findByIdAndUpdate(
            req.user.userId,
            { $set: updates },
            { new: true, runValidators: true },
        ).select("-password");

        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json({
            message: "Profile updated successfully",
            user,
        });
    } catch (error) {
        handleError(res, error, "Error updating profile");
    }
};

// Add XP - Dedicated atomic update
exports.addXp = async (req, res) => {
    try {
        const { amount } = req.body;
        if (amount === undefined || isNaN(amount)) {
            return res.status(400).json({ message: "Invalid XP amount" });
        }

        const user = await User.findById(req.user.userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.xp += Number(amount);
        
        // Recalculate level (500 XP per level)
        const newLevel = Math.floor(user.xp / 500) + 1;
        if (user.level !== newLevel) {
            user.level = newLevel;
        }

        await user.save();

        res.status(200).json({
            message: "XP added successfully",
            xp: user.xp,
            level: user.level,
            user,
        });
    } catch (error) {
        handleError(res, error, "Error adding XP");
    }
};

// Record a cooked recipe in user history
exports.recordCook = async (req, res) => {
    try {
        const { recipeId, title, emoji, cuisine, xpAwarded } = req.body;
        const safeEmoji = typeof emoji === "string" ? emoji : "🍳";

        const user = await User.findById(req.user.userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (!user.history) user.history = [];
        
        user.history.unshift({
            recipeId: String(recipeId),
            title,
            emoji: safeEmoji,
            cuisine,
            xpAwarded: Number(xpAwarded) || 0,
            cookedAt: new Date(),
        });

        // Limit history to last 20 items
        if (user.history.length > 20) {
            user.history = user.history.slice(0, 20);
        }

        await user.save();
        res.status(200).json({ message: "Cook recorded successfully", history: user.history });
    } catch (error) {
        handleError(res, error, "Error recording cook");
    }
};

// Sync Saved Recipes
exports.syncSavedRecipes = async (req, res) => {
    try {
        const { savedRecipes } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user.userId,
            { $set: { savedRecipes } },
            { new: true, runValidators: true }
        ).select("-password");

        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json({ message: "Saved recipes synced", savedRecipes: user.savedRecipes });
    } catch (error) {
        handleError(res, error, "Error syncing saved recipes");
    }
};
