import axios from "axios";

const getBaseUrl = () => {
    if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
    if (typeof window !== "undefined" && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
        return "https://appitat-backend.onrender.com/api";
    }
    return "http://localhost:5000/api";
};

const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("appitat_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

export const authAPI = {
    signup: (data) => api.post("/auth/signup", data),
    login: (data) => api.post("/auth/login", data),
    googleLogin: (data) => api.post("/auth/google", data),
    forgotPassword: (data) => api.post("/auth/forgot-password", data),
    resetPassword: (data) => api.post("/auth/reset-password", data),
    verifyEmail: (data) => api.post("/auth/verify-email", data),
};

export const aiAPI = {
    getRecommendations: (data) => api.post("/ai/recommend", data),
    getRecommendationStream: (data) => {
        const token = localStorage.getItem("appitat_token");
        const baseURL = getBaseUrl();
        return fetch(`${baseURL}/ai/recommend-stream`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                ...(token && { Authorization: `Bearer ${token}` }),
            },
            body: JSON.stringify(data),
        });
    },
    visionRecommend: (formData) =>
        api.post("/ai/vision-recipe", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }),
    saveRecipe: (data) => api.post("/ai/save", data),
};

export const userAPI = {
    getProfile: () => api.get("/user/profile"),
    updateProfile: (data) => api.put("/user/profile", data),
    addXp: (amount) => api.post("/user/add-xp", { amount }),
    updatePantry: (data) => api.put("/user/pantry", data),
    getMyRecipes: () => api.get("/user/my-recipes"),
    recordCook: (recipeData) => api.post("/user/record-cook", recipeData),
    updateImages: (formData) =>
        api.put("/user/update-images", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }),
    syncSavedRecipes: (savedRecipes) => api.post("/user/sync-saved", { savedRecipes }),
};

export const feedbackAPI = {
    submit: (data) => api.post("/feedback", data),
};

export default api;
