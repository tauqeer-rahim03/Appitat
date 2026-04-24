require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const app = express();
const userRoutes = require("./routes/userRoutes");

connectDB();

app.use(
    cors({
        origin: [
            process.env.FRONTEND_URL,       
            "https://appitat.vercel.app",
            "http://localhost:5173",
            "http://localhost:5174",
        ].filter(Boolean),
    }),
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use("/uploads", express.static("uploads"));

// Mount Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/ai", require("./routes/aiRoutes"));
app.use("/api/user", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.get("/", (req, res) => {
    res.send("Welcome to the AI Recipe Recommender API");
});
