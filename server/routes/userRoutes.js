const express = require("express");
const router = express.Router();
const multer = require("multer");
const auth = require("../middleware/auth");
const userController = require("../controllers/userController");

const upload = multer({ dest: "uploads/" });

router.get("/profile", auth, userController.getProfile);

router.put("/pantry", auth, userController.updatePantry);

router.put(
    "/update-images",
    auth,
    upload.fields([
        { name: "profilePic", maxCount: 1 },
        { name: "coverPic", maxCount: 1 },
    ]),
    userController.updateProfileImages,
);

router.get("/my-recipes", auth, userController.getMyRecipes);

router.put("/profile", auth, userController.updateProfile);

router.post("/add-xp", auth, userController.addXp);

router.post("/record-cook", auth, userController.recordCook);

router.post("/sync-saved", auth, userController.syncSavedRecipes);

module.exports = router;
