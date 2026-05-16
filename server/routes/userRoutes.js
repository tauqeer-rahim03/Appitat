const express = require("express");
const router = express.Router();
const multer = require("multer");
const auth = require("../middleware/auth");
const userController = require("../controllers/userController");

const path = require("path");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname) || ".jpg";
        cb(null, file.fieldname + "-" + uniqueSuffix + ext);
    },
});
const upload = multer({ storage: storage });

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
