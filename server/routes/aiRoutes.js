const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });


// ai Recommendation Route
router.post('/recommend', auth, aiController.getRecommendation)
router.get('/recommend', (req, res) => {
    res.send("<h1>AI Recommendations</h1>");
});

// save Recipe Route
router.post('/save', auth, aiController.saveRecipe);
router.get('/save', (req, res) => {
    res.send("<h1>Save Route is Active</h1>");
});

// get my recipes
router.get('/my-recipes', auth, userController.getMyRecipes);
router.get('/test-recipes', (req, res) => {
    res.send("<h1>Recipes Route is Active</h1>");
});

// pantry routes
router.get('/profile', auth, userController.getProfile);
router.put('/pantry', auth, userController.updatePantry);

// gemini vision route
router.post('/vision-recipe', auth, upload.single('image'), aiController.identifyIngredientsAndRecommend);
// get recipe by id
router.get('/recipe/:id', auth, aiController.getRecipeById);



module.exports = router;