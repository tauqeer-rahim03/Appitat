import { useState, useEffect, Suspense, lazy } from "react";
import {
    Routes,
    Route,
    useNavigate,
    useLocation,
    Navigate,
} from "react-router-dom";
import { AppContext } from "./context/AppContext";
import Navbar from "./components/Navbar";
import BackToTopButton from "./components/BackToTopButton";
import MobileBottomNav from "./components/MobileBottomNav";

const HeroPage = lazy(() => import("./pages/HeroPage"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const RecipeDetailPage = lazy(() => import("./pages/RecipeDetailPage"));
const SavedPage = lazy(() => import("./pages/SavedPage"));
const AccountPage = lazy(() => import("./pages/AccountPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
import { calculateUserBadges } from "./data/badges";
import { RECIPES } from "./data/constants";
import { FiCheckCircle, FiX } from "react-icons/fi";
import { userAPI } from "./lib/api";

import useLocalStorage from "./hooks/useLocalStorage";
import useTheme from "./hooks/useTheme";

export default function App() {
    const navigate = useNavigate();
    const location = useLocation();
    const { theme, toggleTheme } = useTheme();

    const [currentRecipe, setCurrentRecipe] = useLocalStorage("appitat_current_recipe", null);
    const [user, setUser] = useLocalStorage("appitat_user", null);
    const [saved, setSaved] = useLocalStorage("appitat_saved", []);
    const [achievedBadge, setAchievedBadge] = useState(null);

    const [dashIngredients, setDashIngredients] = useState([]);
    const [dashResults, setDashResults] = useState(RECIPES);
    const [dashAiIntro, setDashAiIntro] = useState("");
    const [dashSelectedCuisines, setDashSelectedCuisines] = useState([]);
    const [dashSelectedDiets, setDashSelectedDiets] = useState([]);
    const [dashSelectedTime, setDashSelectedTime] = useState("");
    const [dashSelectedSpice, setDashSelectedSpice] = useState("");
    const [dashSelectedCalories, setDashSelectedCalories] = useState("");
    const [dashSelectedServings, setDashSelectedServings] = useState("");
    const [dashSelectedMealType, setDashSelectedMealType] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem("appitat_token");
            if (token) {
                try {
                    const response = await userAPI.getProfile();
                    setUser(response.data);
                    if (response.data.savedRecipes) {
                        setSaved(response.data.savedRecipes);
                    }
                } catch (err) {
                    console.error("Session expired or invalid token");
                    localStorage.removeItem("appitat_token");
                    setUser(null);
                }
            }
        };
        fetchProfile();
    }, []);

    // Wake up the Render server on first load (free tier spins down after inactivity)
    useEffect(() => {
        fetch('https://appitat.onrender.com')
            .then(() => console.log("Server wake-up signal sent"))
            .catch((err) => console.error("Wake-up failed", err));
    }, []);


    const handleNavigate = (path, data) => {
        if (data) setCurrentRecipe(data);
        if (path === "hero" && user) {
            navigate("/dashboard");
        } else {
            navigate(path === "hero" ? "/" : `/${path}`);
        }
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const login = async (u, token) => {
        setUser(u);
        if (token) {
            try {
                const response = await userAPI.getProfile();
                setUser(response.data);
            } catch (err) {
                console.error("Failed to fetch full profile after login", err);
            }
        }
    };
    const updateUser = async (data, shouldSync = false) => {
        setUser((prev) => {
            if (!prev) return prev;
            return { ...prev, ...data };
        });

        if (shouldSync) {
            try {
                await userAPI.updateProfile(data);
                console.log("Profile auto-synced successfully");
            } catch (err) {
                console.error("Failed to auto-sync profile:", err);
            }
        }
    };
    const logout = () => {
        localStorage.removeItem("appitat_token");
        setUser(null);
        setSaved([]);
        navigate("/");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const toggleSave = async (r) => {
        setSaved((p) => {
            const newList = p.find((x) => x.id === r.id)
                ? p.filter((x) => x.id !== r.id)
                : [...p, r];
            
            // Sync to backend if logged in
            if (user) {
                userAPI.syncSavedRecipes(newList).catch(err => 
                    console.error("Failed to sync saved recipes:", err)
                );
            }
            return newList;
        });
    };

    const checkBadgeUnlocks = (oldUser, newUser) => {
        if (!oldUser || !newUser) return;
        const oldBadges = calculateUserBadges(
            oldUser.xp || 0,
            oldUser.cookDays || 0,
        );
        const newBadges = calculateUserBadges(
            newUser.xp || 0,
            newUser.cookDays || 0,
        );

        const newlyUnlocked = newBadges.find(
            (nb) =>
                nb.isUnlocked &&
                !oldBadges.find((ob) => ob.id === nb.id)?.isUnlocked,
        );

        if (newlyUnlocked) {
            setAchievedBadge(newlyUnlocked);
            setTimeout(() => setAchievedBadge(null), 6000);
        }
    };

    const addXp = async (amount, recipeMetadata = null) => {
        if (!user) return;
        
        const currentXp = user.xp || 0;
        const newXp = currentXp + amount;
        const newLevel = Math.floor(newXp / 500) + 1;

        const updatedUser = {
            ...user,
            xp: newXp,
            level: newLevel
        };

        setUser(updatedUser);
        checkBadgeUnlocks(user, updatedUser);

        try {
            const res = await userAPI.addXp(amount);
            
            if (recipeMetadata) {
                try {
                    const recordRes = await userAPI.recordCook({
                        recipeId: recipeMetadata.id,
                        title: recipeMetadata.title,
                        emoji: typeof recipeMetadata.emoji === 'string' ? recipeMetadata.emoji : "🍳",
                        cuisine: recipeMetadata.cuisine,
                        xpAwarded: amount
                    });
                    if (recordRes.data?.user) {
                        setUser(recordRes.data.user);
                        return; // Done
                    }
                } catch (recordErr) {
                    console.error("Failed to record cook history:", recordErr);
                }
            }

            // Fallback: Update local state with the authoritative values from the DB if recordCook didn't
            if (res.data?.user) {
                setUser(res.data.user);
            }
        } catch (err) {
            console.error("Failed to sync progress to backend:", err.response?.data || err.message);
            if (err.response?.status === 401) {
                alert("Your session has expired. Please log in again to save your progress.");
                logout();
            }
        }
    };

    const handleCookDay = async () => {
        if (!user) return;
        
        const newCookDays = (user.cookDays || 0) + 1;
        const updatedLocal = {
            ...user,
            cookDays: newCookDays
        };
        
        setUser(updatedLocal);
        checkBadgeUnlocks(user, updatedLocal);

        try {
            await userAPI.updateProfile({ cookDays: newCookDays });
        } catch (err) {
            console.error("Failed to sync cook days to backend:", err);
        }
    };

    const showNav =
        location.pathname !== "/login" && location.pathname !== "/signup";

    return (
        <AppContext.Provider
            value={{
                user,
                login,
                logout,
                updateUser,
                addXp,
                handleCookDay,
                saved,
                toggleSave,
                currentRecipe,
                navigate: handleNavigate,
                unlockedBadges: user
                    ? calculateUserBadges(user.xp, user.cookDays).filter(
                          (b) => b.isUnlocked,
                      )
                    : [],
                theme,
                toggleTheme,
                ingredients: dashIngredients,
                setIngredients: setDashIngredients,
                results: dashResults,
                setResults: setDashResults,
                aiIntro: dashAiIntro,
                setAiIntro: setDashAiIntro,
                selectedCuisines: dashSelectedCuisines,
                setSelectedCuisines: setDashSelectedCuisines,
                selectedDiets: dashSelectedDiets,
                setSelectedDiets: setDashSelectedDiets,
                selectedTime: dashSelectedTime,
                setSelectedTime: setDashSelectedTime,
                selectedSpice: dashSelectedSpice,
                setSelectedSpice: setDashSelectedSpice,
                selectedCalories: dashSelectedCalories,
                setSelectedCalories: setDashSelectedCalories,
                selectedServings: dashSelectedServings,
                setSelectedServings: setDashSelectedServings,
                selectedMealType: dashSelectedMealType,
                setSelectedMealType: setDashSelectedMealType,
            }}
        >
            {achievedBadge && (
                <div
                    className="fixed bottom-6 right-6 z-[100] slide-up"
                    onClick={() => setAchievedBadge(null)}
                >
                    <div className="bg-brand-card rounded-2xl p-4 shadow-2xl border border-brand-primary/10 flex items-center gap-4 max-w-sm">
                        <div
                            className={`w-14 h-14 rounded-full flex shrink-0 items-center justify-center text-[28px] ${achievedBadge.bg}`}
                            style={{
                                color: achievedBadge.color,
                            }}
                        >
                            {achievedBadge.emoji}
                        </div>
                        <div className="flex-1 pr-4">
                            <p className="text-[10px] text-brand-secondary font-bold uppercase tracking-wider mb-0.5 flex items-center gap-1">
                                <FiCheckCircle size={10} /> Badge Unlocked!
                            </p>
                            <h4 className="text-[15px] font-black text-brand-primary leading-tight mb-0.5">
                                {achievedBadge.title}
                            </h4>
                            <p className="text-[12px] text-brand-primary/70 leading-snug">
                                {achievedBadge.description}
                            </p>
                        </div>
                    </div>
                    <button
                        className="absolute top-2 right-2 text-brand-primary/30 hover:text-brand-primary transition-colors cursor-pointer"
                        onClick={(e) => {
                            e.stopPropagation();
                            setAchievedBadge(null);
                        }}
                    >
                        <FiX size={14} />
                    </button>
                </div>
            )}

            {showNav && <Navbar />}
            {showNav && <MobileBottomNav />}
            <Suspense
                fallback={
                    <div className="min-h-screen bg-brand-bg flex items-center justify-center">
                        <div className="w-12 h-12 border-4 border-brand-primary/20 border-t-brand-secondary rounded-full animate-spin"></div>
                    </div>
                }
            >
                <Routes>
                    <Route
                        path="/"
                        element={
                            user ? (
                                <Navigate to="/dashboard" replace />
                            ) : (
                                <HeroPage />
                            )
                        }
                    />
                    <Route path="/login" element={<AuthPage mode="login" />} />
                    <Route
                        path="/signup"
                        element={<AuthPage mode="signup" />}
                    />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route
                        path="/recipe"
                        element={<RecipeDetailPage recipe={currentRecipe} />}
                    />
                    <Route path="/saved" element={<SavedPage />} />
                    <Route path="/account" element={<AccountPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </Suspense>
        </AppContext.Provider>
    );
}
