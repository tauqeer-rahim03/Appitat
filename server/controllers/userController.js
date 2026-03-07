const User = require("../models/User");
const Recipe = require('../models/Recipe');

// Fetch the user's saved recipes
exports.getMyRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.find({ userId: req.user.userId });
        res.status(200).json(recipes);
    } catch (error) {
        res.status(500).json({ message: "Error fetching saved recipes", error: error.message });
    }
};

// Updated Pantry 
exports.updatePantry = async (req, res) => {
    try {
        const { ingredients, allergies } = req.body; // Added allergies here so user can update both
        
        const user = await User.findByIdAndUpdate(
            req.user.userId,
            { pantry: ingredients, allergies: allergies },
            { new: true }
        ).select('-password');

        res.status(200).json({ 
            message: "Profile updated successfully", 
            pantry: user.pantry,
            allergies: user.allergies 
        });
    } catch (error) {
        res.status(500).json({ message: "Error updating profile settings" });
    }
};

// Get Full Profile including XP, Level, and History
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId)
            .select('-password')
            .populate('history.recipeId');
            
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Error fetching profile" });
    }
};

// profile pic
exports.updateProfileImages = async (req, res) => {
    try {
        const userId = req.user.userId; // Get ID from auth middleware
        const { profilePic, coverPic } = req.body;
        let updates = {};

        // If a new profile picture was uploaded
        if (req.files?.profilePic) {
            updates.profilePic = req.files.profilePic[0].path;
        }

        // If a new cover picture was uploaded
        if (req.files?.coverPic) {
            updates.coverPic = req.files.coverPic[0].path;
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePic: profilePic, coverPic: coverPic },
            { new: true }
        ).select('-password');

        res.status(200).json({
            message: "Images updated successfully!",
            profilePic: updatedUser.profilePic,
            coverPic: updatedUser.coverPic
        });
    } catch (error) {
        res.status(500).json({ message: "Error updating images", error: error.message });
    }
};