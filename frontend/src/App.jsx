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

// Lazy-loaded routes for performance optimization
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

export default function App() {
    const navigate = useNavigate();
    const location = useLocation();

    const [currentRecipe, setCurrentRecipe] = useState(() => {
        const storedRec = localStorage.getItem("appitat_current_recipe");
        try {
            const parsed = storedRec ? JSON.parse(storedRec) : null;
            return parsed
                ? RECIPES.find((r) => r.id === parsed.id) || parsed
                : null;
        } catch {
            return null;
        }
    });
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("appitat_user");
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [saved, setSaved] = useState(() => {
        try {
            const savedRecipes = localStorage.getItem("appitat_saved");
            const parsed = savedRecipes ? JSON.parse(savedRecipes) : [];
            if (Array.isArray(parsed)) {
                return parsed.map(
                    (p) => RECIPES.find((r) => r.id === p.id) || p,
                );
            }
            return [];
        } catch {
            return [];
        }
    });
    const [achievedBadge, setAchievedBadge] = useState(null);
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem("appitat_theme") || "light";
    });

    // Fetch user profile on mount if token exists
    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem("appitat_token");
            if (token && !user) {
                try {
                    const response = await userAPI.getProfile();
                    setUser(response.data);

                    // Also fetch saved recipes if not already in user object
                    const savedResponse = await userAPI.getMyRecipes();
                    setSaved(savedResponse.data || []);
                } catch (err) {
                    console.error("Session expired or invalid token");
                    localStorage.removeItem("appitat_token");
                    setUser(null);
                }
            }
        };
        fetchProfile();
    }, []);

    // Sync state to localStorage whenever it changes
    useEffect(() => {
        if (user) {
            localStorage.setItem("appitat_user", JSON.stringify(user));
        } else {
            localStorage.removeItem("appitat_user");
        }
    }, [user]);

    useEffect(() => {
        localStorage.setItem("appitat_saved", JSON.stringify(saved));
    }, [saved]);

    useEffect(() => {
        if (currentRecipe) {
            localStorage.setItem(
                "appitat_current_recipe",
                JSON.stringify(currentRecipe),
            );
        } else {
            localStorage.removeItem("appitat_current_recipe");
        }
    }, [currentRecipe]);

    // Handle Light/Dark Mode Toggle
    useEffect(() => {
        localStorage.setItem("appitat_theme", theme);
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
    };

    const handleNavigate = (path, data) => {
        if (data) setCurrentRecipe(data);
        if (path === "hero" && user) {
            navigate("/dashboard");
        } else {
            navigate(path === "hero" ? "/" : `/${path}`);
        }
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const login = (u) => setUser(u);
    const updateUser = (data) => setUser((prev) => ({ ...prev, ...data }));
    const logout = () => {
        localStorage.removeItem("appitat_token");
        setUser(null);
        setSaved([]);
        navigate("/");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const toggleSave = (r) => {
        setSaved((p) =>
            p.find((x) => x.id === r.id)
                ? p.filter((x) => x.id !== r.id)
                : [...p, r],
        );
    };

    const checkBadgeUnlocks = (oldUser, newUser) => {
        if (!oldUser || !newUser) return;
        const oldBadges = calculateUserBadges(
            oldUser.xp || 0,
            oldUser.cookDays || 14,
        );
        const newBadges = calculateUserBadges(
            newUser.xp || 0,
            newUser.cookDays || 14,
        );

        const newlyUnlocked = newBadges.find(
            (nb) =>
                nb.isUnlocked &&
                !oldBadges.find((ob) => ob.id === nb.id)?.isUnlocked,
        );

        if (newlyUnlocked) {
            setAchievedBadge(newlyUnlocked);
            // Auto dismiss after 6 seconds
            setTimeout(() => setAchievedBadge(null), 6000);
        }
    };

    const addXp = (amount) => {
        setUser((prev) => {
            if (!prev) return prev;
            const updated = {
                ...prev,
                xp: (prev.xp || 0) + amount,
            };
            checkBadgeUnlocks(prev, updated);
            return updated;
        });
    };

    const handleCookDay = () => {
        setUser((prev) => {
            if (!prev) return prev;
            const updated = {
                ...prev,
                cookDays: (prev.cookDays || 14) + 1,
            };
            checkBadgeUnlocks(prev, updated);
            return updated;
        });
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
            }}
        >
            {/* Global Badge Unlock Notification Toaster */}
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
