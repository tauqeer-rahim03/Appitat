require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const { Ollama } = require("ollama");
const app = express();

// Configure Ollama to use the cloud-hosted API with authentication
const ollama = new Ollama({
    host: process.env.OLLAMA_HOST || "http://localhost:11434",
    headers: {
        ...(process.env.OLLAMA_API_KEY && {
            Authorization: `Bearer ${process.env.OLLAMA_API_KEY}`,
        }),
    },
});
const userRoutes = require("./routes/userRoutes");

// Pre-warm the Ollama model so it's ready for recipe generation
const warmupOllama = async () => {
    const MODEL = "gpt-oss:120b-cloud";
    console.log(`[Ollama] Warming up model: ${MODEL}...`);
    try {
        const result = await ollama.generate({
            model: MODEL,
            prompt: "Respond with just the word: ready",
            stream: false,
        });
        console.log(`[Ollama] Model ${MODEL} is ready! Response: "${result.response.trim()}"`);
    } catch (error) {
        console.error(`[Ollama] Warmup failed: ${error.message}`);
        console.error("[Ollama] Make sure 'ollama serve' is running. Retrying in 5 seconds...");
        setTimeout(warmupOllama, 5000);
    }
};

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

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/ai", require("./routes/aiRoutes"));
app.use("/api/user", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    warmupOllama(); // Pre-load the Ollama model on startup
});

app.get("/", (req, res) => {
    res.send("Welcome to the AI Recipe Recommender API");
});
