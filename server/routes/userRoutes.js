const express = require("express");
const router = express.Router();
const multer = require("multer");
const auth = require("../middleware/auth");
const userController = require("../controllers/userController");

const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Cloudinary Storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "appitat_user_uploads",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
        public_id: (req, file) => {
            const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
            return file.fieldname + "-" + uniqueSuffix;
        },
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
