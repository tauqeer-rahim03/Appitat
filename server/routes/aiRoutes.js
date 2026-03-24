const express = require("express");
const router = express.Router();
const aiController = require("../controllers/aiController");
const userController = require("../controllers/userController");
const auth = require("../middleware/auth");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

// ai Recommendation Route
router.post("/recommend", auth, aiController.getRecommendation);

// save Recipe Route
router.post("/save", auth, aiController.saveRecipe);

// gemini vision route
router.post(
    "/vision-recipe",
    auth,
    upload.single("image"),
    aiController.identifyIngredientsAndRecommend,
);
// get recipe by id
router.get("/recipe/:id", auth, aiController.getRecipeById);

module.exports = router;
