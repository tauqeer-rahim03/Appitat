import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add the auth token to every request
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
};

export const aiAPI = {
    getRecommendations: (data) => api.post("/ai/recommend", data),
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

export default api;
