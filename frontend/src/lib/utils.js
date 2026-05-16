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
