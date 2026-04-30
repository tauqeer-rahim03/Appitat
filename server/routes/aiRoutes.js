const express = require("express");
const router = express.Router();
const aiController = require("../controllers/aiController");
const userController = require("../controllers/userController");
const auth = require("../middleware/auth");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.post("/recommend", auth, aiController.getRecommendation);

router.post("/save", auth, aiController.saveRecipe);

router.post(
    "/vision-recipe",
    auth,
    upload.single("image"),
    aiController.identifyIngredientsAndRecommend,
);
router.get("/recipe/:id", auth, aiController.getRecipeById);

module.exports = router;
