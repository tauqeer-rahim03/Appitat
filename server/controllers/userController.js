const User = require("../models/User");
const Recipe = require("../models/Recipe");

// Fetch the user's saved recipes
exports.getMyRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.find({ userId: req.user.userId });
        res.status(200).json(recipes);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching saved recipes",
            error: error.message,
        });
    }
};

// Updated Pantry
exports.updatePantry = async (req, res) => {
    try {
        const { ingredients, allergies } = req.body; // Added allergies here so user can update both

        const user = await User.findByIdAndUpdate(
            req.user.userId,
            { pantry: ingredients, allergies: allergies },
            { new: true },
        ).select("-password");

        res.status(200).json({
            message: "Profile updated successfully",
            pantry: user.pantry,
            allergies: user.allergies,
        });
    } catch (error) {
        res.status(500).json({ message: "Error updating profile settings" });
    }
};

// Get Full Profile including XP, Level, and History
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId)
            .select("-password")
            .populate("history.recipeId");

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Error fetching profile" });
    }
};

// profile pic
exports.updateProfileImages = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { profilePic, coverPic } = req.body;
        let updates = {};

        // If a new profile picture was uploaded via Multer
        if (req.files?.profilePic) {
            updates.profilePic = req.files.profilePic[0].path;
        } else if (profilePic !== undefined) {
            updates.profilePic = profilePic;
        }

        // If a new cover picture was uploaded via Multer
        if (req.files?.coverPic) {
            updates.coverPic = req.files.coverPic[0].path;
        } else if (coverPic !== undefined) {
            updates.coverPic = coverPic;
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: "No image updates provided" });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updates,
            { new: true },
        ).select("-password");

        res.status(200).json({
            message: "Images updated successfully!",
            profilePic: updatedUser.profilePic,
            coverPic: updatedUser.coverPic,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error updating images",
            error: error.message,
        });
    }
};

// Update basic profile info (name, age, experience, neverShowMe)
exports.updateProfile = async (req, res) => {
    try {
        const { name, email, age, experience, allergies, pantry, neverShowMe, profilePic, coverPic } = req.body;
        console.log("[DEBUG] updateProfile incoming fields:", Object.keys(req.body));

        const updates = {};
        if (name !== undefined) updates.name = name;
        if (email !== undefined) updates.email = email;
        if (age !== undefined) updates.age = age;
        if (experience !== undefined) updates.experience = experience;
        if (allergies !== undefined) updates.allergies = allergies;
        if (pantry !== undefined) updates.pantry = pantry;
        if (neverShowMe !== undefined) updates.neverShowMe = neverShowMe;
        if (profilePic !== undefined) updates.profilePic = profilePic;
        if (coverPic !== undefined) updates.coverPic = coverPic;

        const user = await User.findByIdAndUpdate(
            req.user.userId,
            updates,
            { new: true },
        ).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "Profile updated successfully",
            user,
        });
    } catch (error) {
        console.error("UPDATE PROFILE ERROR:", error);
        res.status(500).json({ message: "Error updating profile" });
    }
};
