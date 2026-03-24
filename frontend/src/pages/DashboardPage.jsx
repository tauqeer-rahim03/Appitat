import { useState, useCallback } from "react";
import { useApp } from "../context/AppContext";
import { aiAPI } from "../lib/api";
import {
    FiRefreshCw,
    FiClock,
    FiZap,
    FiChevronDown,
    FiChevronUp,
    FiFilter,
} from "react-icons/fi";
import { FaUtensils, FaFire, FaHeart, FaRegHeart } from "react-icons/fa6";
import { RECIPES } from "../data/constants";
import { RecipeCard, RecipeCardSkeleton } from "../components/RecipeCard";
import IngredientManager from "../components/dashboard/IngredientManager";
import { DashboardPreferencesSidebar as PreferenceSidebar } from "../components/dashboard/PreferencesSidebar";

export default function DashboardPage() {
    const {
        user,
        navigate,
        saved,
        toggleSave,
        addXp,
        handleCookDay,
        ingredients,
        setIngredients,
        results,
        setResults,
        aiIntro,
        setAiIntro,
        selectedCuisines,
        setSelectedCuisines,
        selectedDiets,
        setSelectedDiets,
        selectedTime,
        setSelectedTime,
        selectedSpice,
        setSelectedSpice,
        selectedCalories,
        setSelectedCalories,
        selectedServings,
        setSelectedServings,
        selectedMealType,
        setSelectedMealType,
    } = useApp();

    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [loading, setLoading] = useState(false);
    const [stream, setStream] = useState("");

    // Toggle states for preference categories
    const [openCategories, setOpenCategories] = useState({
        cuisine: false,
        time: false,
        diet: false,
        spice: false,
        calories: false,
        servings: false,
        mealType: false,
    });

    const activeFiltersCount =
        selectedCuisines.length +
        selectedDiets.length +
        (selectedTime ? 1 : 0) +
        (selectedSpice ? 1 : 0) +
        (selectedCalories ? 1 : 0) +
        (selectedServings ? 1 : 0) +
        (selectedMealType ? 1 : 0);

    const toggleCategory = useCallback((cat) => {
        setOpenCategories((prev) => ({
            ...prev,
            [cat]: !prev[cat],
        }));
    }, []);

    const toggleTag = useCallback((list, set, t) => {
        set(
            list.includes(t) ? list.filter((item) => item !== t) : [...list, t],
        );
    }, []);

    const removeIngredient = useCallback((id) => {
        setIngredients((p) => p.filter((x) => x.id !== id));
    }, []);

    const search = async () => {
        setLoading(true);
        setStream("");
        setAiIntro("");

        const prefs = [];
        if (ingredients.length) {
            const ingStrings = ingredients.map((i) => `${i.qty} ${i.name}`);
            prefs.push(`ingredients available: ${ingStrings.join(", ")}`);
        }
        if (selectedCuisines.length)
            prefs.push(`preferred cuisine: ${selectedCuisines.join(", ")}`);
        if (selectedDiets.length)
            prefs.push(`dietary needs: ${selectedDiets.join(", ")}`);
        if (selectedTime) prefs.push(`time available: ${selectedTime}`);
        if (selectedSpice) prefs.push(`spice level: ${selectedSpice}`);
        if (selectedServings) prefs.push(`servings: ${selectedServings}`);
        if (selectedMealType) prefs.push(`meal type: ${selectedMealType}`);

        // Add Personalization Data securely if present
        if (user?.experience) prefs.push(`skill level: ${user.experience}`);
        if (user?.age)
            prefs.push(`user age: ${user.age} (adjust tone appropriately)`);
        if (user?.pantry?.length)
            prefs.push(
                `pantry staples available (use these freely): ${user.pantry.join(", ")}`,
            );
        if (user?.allergies?.length)
            prefs.push(
                `CRITICAL ALLERGIES TO AVOID: ${user.allergies.join(", ")}`,
            );
        if (user?.neverShowMe?.length)
            prefs.push(
                `STRICTLY DO NOT use these ingredients: ${user.neverShowMe.join(", ")}`,
            );

        try {
            const response = await aiAPI.getRecommendations({
                ingredients: ingredients.map(i => i.name),
                cuisine: selectedCuisines[0],
                cookingTime: selectedTime,
                dietaryType: selectedDiets[0],
                spiceLevel: selectedSpice,
                mealType: selectedMealType,
            });

            const aiRecipes = response.data.recipes || [];
            const formattedResults = aiRecipes.map((r, index) => ({
                id: `ai-${Date.now()}-${index}`,
                ...r,
            }));

            setResults(formattedResults);
            setAiIntro("Here are some wonderful recipes crafted just for you!");
            setStream("Here are some wonderful recipes crafted just for you!");
        } catch (err) {
            console.error("AI Recommendation Error:", err);
            const errorMessage = err.response?.data?.message || err.message;
            setStream("I'm sorry, I'm having trouble connecting to my creative kitchen: " + errorMessage);
            setAiIntro("Connection issue.");
            setResults([]);
        }

        setLoading(false);
        addXp(50);
        handleCookDay();
    };

    return (
        <div className="min-h-screen bg-brand-bg">
            {/* --- HERO IMAGE HEADER --- */}
            <div
                className="relative w-full h-[380px] bg-cover bg-center flex flex-col items-center justify-center -mt-[60px] pt-[60px]"
                style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2653&auto=format&fit=crop')`,
                }}
            >
                {/* Gradient Overlays for readability and seamless fading */}
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-brand-bg/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-brand-bg to-transparent" />

                {/* AI Aura Glows — ambient light that drifts */}
                <div
                    className="ai-aura w-[300px] h-[300px] bottom-0 left-[10%]"
                    style={{
                        background:
                            "radial-gradient(circle, rgba(160,58,19,0.3), transparent 70%)",
                        animationDelay: "2s",
                    }}
                />
                <div
                    className="ai-aura w-[250px] h-[250px] top-0 right-[15%]"
                    style={{
                        background:
                            "radial-gradient(circle, rgba(245,130,74,0.2), transparent 70%)",
                        animationDelay: "6s",
                    }}
                />

                <div className="relative z-10 text-center px-4 md:px-6 -mt-10">
                    <h1 className="serif slide-up text-[clamp(32px,8vw,56px)] font-black text-white mb-3 drop-shadow-lg tracking-tight">
                        What's Cooking?
                    </h1>
                    <p className="slide-up stagger-1 text-white/90 text-[16px] md:text-[18px] max-w-[500px] mx-auto drop-shadow-md font-medium">
                        Tell us what you have, and we'll craft the perfect
                        recipe for you.
                    </p>
                </div>
            </div>

            <div className="max-w-[1400px] flex flex-col lg:grid lg:grid-cols-12 gap-8 lg:gap-12 lg:items-start mx-auto px-6 relative z-20 pb-32 lg:pb-20 -mt-16">
                {/* --- 1. LEFT COLUMN: INGREDIENTS FORM --- */}
                <div className="order-1 lg:col-span-7 lg:col-start-1">
                    <IngredientManager />

                    {/* AI Time-Based Quote Section */}
                    <div className="mt-12 mb-8 px-4 md:px-0">
                        <div className="relative p-8 rounded-3xl bg-gradient-to-br from-brand-primary/5 to-brand-secondary/5 border border-brand-primary/10 overflow-hidden group">
                            <div className="absolute -right-4 -top-4 text-brand-primary/5 opacity-20 group-hover:scale-110 transition-transform duration-700">
                                <FaUtensils size={120} />
                            </div>
                            <div className="relative z-10">
                                <span className="inline-block px-3 py-1 rounded-full bg-brand-secondary/10 text-brand-secondary text-[11px] font-black uppercase tracking-[0.2em] mb-4">
                                    {new Date().getHours() < 11 ? "Morning Inspiration" : 
                                     new Date().getHours() < 16 ? "Midday Fuel" : 
                                     new Date().getHours() < 21 ? "Evening Comfort" : "Late Night Cravings"}
                                </span>
                                <h3 className="serif text-[20px] md:text-[24px] text-brand-primary italic leading-relaxed font-medium">
                                    {new Date().getHours() < 11 ? "“Breakfast is where the day begins — simple ingredients, fresh energy, and a quiet kind of comfort.”" : 
                                     new Date().getHours() < 15 ? "“A good lunch is a beautiful pause in the day, a chance to refuel and find joy in the middle of it all.”" :
                                     new Date().getHours() < 18 ? "“The golden hour of the kitchen: where the day slows down and the aromas of dinner begin to rise.”" :
                                     new Date().getHours() < 22 ? "“Dinner is the heart's way of saying the day was well spent. Share a plate, share a story.”" :
                                     "“The quiet of the night makes every flavor sharper. A midnight snack is the soul's little secret.”"}
                                </h3>
                                <div className="mt-4 flex items-center gap-2 text-brand-primary/40 font-bold text-[13px]">
                                    <div className="w-8 h-[1px] bg-brand-primary/20" />
                                    <span>AI Inspired • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- 2. RIGHT COLUMN: PREFERENCES (Sticky) --- */}
                <div className="order-2 lg:order-none lg:col-span-5 lg:col-start-8 lg:row-start-1 lg:row-span-2 bg-brand-card lg:bg-transparent rounded-2xl lg:rounded-none border lg:border-none border-brand-primary/20 p-6 pb-28 lg:p-0 shadow-sm lg:shadow-none mb-4 lg:mb-0 lg:sticky lg:top-[120px] lg:h-max">
                    <div className="flex flex-col gap-0 lg:gap-6">
                        <PreferenceSidebar
                            activeFiltersCount={activeFiltersCount}
                            showMobileFilters={showMobileFilters}
                            setShowMobileFilters={setShowMobileFilters}
                            openCategories={openCategories}
                            toggleCategory={toggleCategory}
                            selectedCuisines={selectedCuisines}
                            setSelectedCuisines={setSelectedCuisines}
                            selectedDiets={selectedDiets}
                            setSelectedDiets={setSelectedDiets}
                            selectedTime={selectedTime}
                            setSelectedTime={setSelectedTime}
                            selectedSpice={selectedSpice}
                            setSelectedSpice={setSelectedSpice}
                            selectedCalories={selectedCalories}
                            setSelectedCalories={setSelectedCalories}
                            selectedServings={selectedServings}
                            setSelectedServings={setSelectedServings}
                            selectedMealType={selectedMealType}
                            setSelectedMealType={setSelectedMealType}
                            toggleTag={toggleTag}
                        />

                        {/* Big Search Button (Sticky on Mobile) */}
                        <div className="fixed bottom-0 left-0 right-0 p-4 bg-brand-card/90 backdrop-blur-md border-t border-brand-primary/10 z-50 lg:relative lg:p-0 lg:bg-transparent lg:border-none lg:z-auto lg:mt-8">
                            <button
                                className="w-full h-[56px] rounded-xl bg-brand-secondary text-white font-bold text-base flex items-center justify-center gap-2.5 transition-all shadow-md lg:shadow-md disabled:opacity-50 cursor-pointer hover:scale-105 hover:shadow-[0_0_20px_6px_rgba(160,58,19,0.4)] active:scale-95"
                                onClick={search}
                                disabled={loading}
                            >
                                {loading ? (
                                    "Searching..."
                                ) : (
                                    <>
                                        <FiZap className="text-[18px]" /> Find
                                        Recipes
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* --- 3. MAIN CONTENT: RECIPES (Scrolls under left column on desktop) --- */}
                <div className="order-3 lg:col-span-7 lg:col-start-1 lg:row-start-2 mt-4 md:mt-8 pb-20 -mx-6 px-6 lg:mx-0 lg:px-0">
                    {(stream || loading) && (
                        <div className="slide-up ai-response-container p-5 mb-7 flex items-start gap-3">
                            <div
                                className="w-9 h-9 rounded-full flex items-center justify-center font-black text-[11px] shrink-0 text-white"
                                style={{
                                    background:
                                        "linear-gradient(135deg, #a03a13, #f5824a)",
                                }}
                            >
                                AI
                            </div>
                            {loading && !stream ? (
                                <div className="flex gap-1.5 items-center py-2">
                                    {[0, 1, 2, 3, 4].map((i) => (
                                        <div
                                            key={i}
                                            className="bounce rounded-full bg-brand-accent"
                                            style={{
                                                width: `${6 + (i % 3) * 2}px`,
                                                height: `${6 + (i % 3) * 2}px`,
                                                animationDelay: `${i * 0.1}s`,
                                                opacity: 0.7 + (i % 3) * 0.1,
                                            }}
                                        />
                                    ))}
                                    <span className="text-brand-primary/60 text-[13px] ml-3 font-medium tracking-wide">
                                        Thinking with AI…
                                    </span>
                                </div>
                            ) : (
                                <p className="text-base text-brand-primary leading-relaxed italic">
                                    {stream}
                                    {stream !== aiIntro && (
                                        <span className="animate-pulse">|</span>
                                    )}
                                </p>
                            )}
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-20">
                        {loading ? (
                            <>
                                {[1, 2, 3, 4].map((i) => (
                                    <RecipeCardSkeleton key={i} />
                                ))}
                            </>
                        ) : (
                            results.map((r, i) => (
                                <RecipeCard
                                    key={r.id}
                                    r={r}
                                    index={i}
                                    isSaved={!!saved.find((s) => s.id === r.id)}
                                    toggleSave={toggleSave}
                                    navigate={navigate}
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
