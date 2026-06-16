const getBaseUrl = () => {
    if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
    if (typeof window !== "undefined" && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
        return "https://appitat-backend.onrender.com/api";
    }
    return "http://localhost:5000/api";
};

const API_URL = getBaseUrl().replace(/\/api$/, "");

/**
 * Resolves a picture URL. If it's a relative path from the backend (starting with "uploads/"),
 * it prepends the API Base URL.
 */
export const resolvePic = (path) => {
    if (!path) return "";
    if (path.startsWith("http") || path.startsWith("data:")) return path;
    
    // Normalize slashes for consistency (especially on Windows)
    let normalizedPath = path.replace(/\\/g, "/");
    
    // Remove leading slash for startsWith check
    if (normalizedPath.startsWith("/")) {
        normalizedPath = normalizedPath.substring(1);
    }
    
    if (normalizedPath.startsWith("uploads")) return `${API_URL}/${normalizedPath}`;
    return normalizedPath;
};

/** Returns true if a value is safe to render as a React child (string, number, bool, null) */
const isSafeChild = (v) => v === null || v === undefined || typeof v === "string" || typeof v === "number" || typeof v === "boolean";

/**
 * Sanitizes a user object loaded from localStorage or the API.
 * Strips any non-primitive (object/array) values from history entries and
 * savedRecipes fields that could cause "Objects are not valid as a React child" errors.
 */
export const sanitizeUser = (user) => {
    if (!user || typeof user !== "object") return user;

    const sanitized = { ...user };

    // Sanitize history entries
    if (Array.isArray(sanitized.history)) {
        sanitized.history = sanitized.history.map((h) => {
            if (!h || typeof h !== "object") return h;
            return {
                ...h,
                recipeId: isSafeChild(h.recipeId) ? h.recipeId : String(h.recipeId ?? ""),
                title: isSafeChild(h.title) ? h.title : String(h.title ?? ""),
                emoji: typeof h.emoji === "string" ? h.emoji : "🍳",
                cuisine: isSafeChild(h.cuisine) ? h.cuisine : String(h.cuisine ?? ""),
                xpAwarded: Number(h.xpAwarded) || 0,
                cookedAt: h.cookedAt ? String(h.cookedAt) : null,
            };
        });
    }

    // Sanitize savedRecipes entries
    if (Array.isArray(sanitized.savedRecipes)) {
        sanitized.savedRecipes = sanitized.savedRecipes.map((r) => {
            if (!r || typeof r !== "object") return r;
            return {
                ...r,
                id: isSafeChild(r.id) ? r.id : String(r.id ?? ""),
                title: isSafeChild(r.title) ? r.title : String(r.title ?? ""),
                emoji: typeof r.emoji === "string" ? r.emoji : "🍽️",
                cuisine: isSafeChild(r.cuisine) ? r.cuisine : String(r.cuisine ?? ""),
                description: typeof r.description === "string" ? r.description : "",
                time: isSafeChild(r.time) ? r.time : String(r.time ?? ""),
                calories: isSafeChild(r.calories) ? r.calories : String(r.calories ?? ""),
                accent: typeof r.accent === "string" ? r.accent : "#F5824A",
                tags: Array.isArray(r.tags) ? r.tags.map((t) => (typeof t === "string" ? t : String(t ?? ""))) : [],
            };
        });
    }

    // Sanitize top-level scalar user fields
    if (!isSafeChild(sanitized.name)) sanitized.name = String(sanitized.name ?? "");
    if (!isSafeChild(sanitized.email)) sanitized.email = String(sanitized.email ?? "");
    if (!isSafeChild(sanitized.experience)) sanitized.experience = typeof sanitized.experience === "string" ? sanitized.experience : "";
    if (!isSafeChild(sanitized.age)) sanitized.age = Number(sanitized.age) || null;

    return sanitized;
};
