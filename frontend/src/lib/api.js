import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000/api",
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
    updatePantry: (data) => api.put("/user/pantry", data),
    getMyRecipes: () => api.get("/user/my-recipes"),
    updateImages: (formData) =>
        api.put("/user/update-images", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }),
};

export default api;
