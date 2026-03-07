const express = require('express');
const router = express.Router();
const multer = require('multer');
const auth = require('../middleware/auth'); // Middleware to verify JWT
const userController = require('../controllers/userController');

// Set up Multer 
const upload = multer({ dest: 'uploads/' });

// USER ROUTES 

// Get the logged-in user's full profile (XP, Level, Badges)
router.get('/profile', auth, userController.getProfile);

// Update pantry/inventory manually
router.put('/pantry', auth, userController.updatePantry);

// Update profile and cover images
router.put('/update-images', auth, upload.fields([
    { name: 'profilePic', maxCount: 1 },
    { name: 'coverPic', maxCount: 1 }
]), userController.updateProfileImages);

// Fetch saved recipes for this specific user
router.get('/my-recipes', auth, userController.getMyRecipes);

module.exports = router;