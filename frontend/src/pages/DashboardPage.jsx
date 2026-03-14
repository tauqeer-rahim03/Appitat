import { useState, useCallback } from "react";
import { useApp } from "../context/AppContext";
import { aiAPI } from "../lib/api";
import {
    FiCamera,
    FiRefreshCw,
    FiClock,
    FiFileText,
    FiZap,
    FiChevronDown,
    FiChevronUp,
    FiFilter,
} from "react-icons/fi";
import { FaUtensils, FaFire, FaHeart, FaRegHeart } from "react-icons/fa6";
import {
    RECIPES,
    CUISINE_TAGS,
    DIET_TAGS,
    TIME_OPTIONS,
    SPICE_LEVELS,
    CALORIE_OPTIONS,
    SERVING_OPTIONS,
} from "../data/constants";
import { RecipeCard, RecipeCardSkeleton } from "../components/RecipeCard";
import { DashboardPreferencesSidebar } from "../components/DashboardPreferencesSidebar";

const QUICK_ADD_INGREDIENTS = [
    "Garlic",
    "Onion",
    "Chicken",
    "Eggs",
    "Olive Oil",
    "Tomatoes",
];

export default function DashboardPage() {
    const { user, navigate, saved, toggleSave, addXp, handleCookDay } =
        useApp();

    // New rich ingredient state
    const [ingredientInput, setIngredientInput] = useState("");
    const [qtyInput, setQtyInput] = useState("");
    const [imageInputs, setImageInputs] = useState([]); // Array<File>
    const [imagePreviews, setImagePreviews] = useState([]); // Array<DataURL>
    const [ingredients, setIngredients] = useState([]); // [{id, type: 'text'|'image', name, qty, image}]

    const [selectedCuisines, setSelectedCuisines] = useState([]);
    const [selectedDiets, setSelectedDiets] = useState([]);
    const [selectedTime, setSelectedTime] = useState("");
    const [selectedSpice, setSelectedSpice] = useState("");
    const [selectedCalories, setSelectedCalories] = useState("");
    const [selectedServings, setSelectedServings] = useState("");
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [results, setResults] = useState(RECIPES);
    const [aiIntro, setAiIntro] = useState("");
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
    });

    const activeFiltersCount =
        selectedCuisines.length +
        selectedDiets.length +
        (selectedTime ? 1 : 0) +
        (selectedSpice ? 1 : 0) +
        (selectedCalories ? 1 : 0) +
        (selectedServings ? 1 : 0);

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

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setImageInputs((prev) => [...prev, ...files]);

        const newPreviews = await Promise.all(
            files.map((file) => {
                return new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.readAsDataURL(file);
                });
            }),
        );

        setImagePreviews((prev) => [...prev, ...newPreviews]);

        // Auto-fill name if it is empty and only one image was uploaded
        if (!ingredientInput.trim() && files.length === 1) {
            setIngredientInput(files[0].name.split(".")[0]);
        }
    };

    const handleClearImage = (e, indexToRemove = null) => {
        e.preventDefault();
        e.stopPropagation();

        if (indexToRemove !== null) {
            setImageInputs((prev) =>
                prev.filter((_, i) => i !== indexToRemove),
            );
            setImagePreviews((prev) =>
                prev.filter((_, i) => i !== indexToRemove),
            );
        } else {
            setImageInputs([]);
            setImagePreviews([]);
        }
    };

    const addIngredient = (e) => {
        if (e) e.preventDefault();

        const nameVal = ingredientInput.trim();
        const qtyVal = qtyInput.trim();

        if (!nameVal && imageInputs.length === 0) return;

        const newIngredients = [];

        // If multiple images are uploaded, create an ingredient for each
        if (imageInputs.length > 0) {
            imageInputs.forEach((file, index) => {
                newIngredients.push({
                    id: Date.now().toString() + index,
                    type: "image",
                    name:
                        imageInputs.length === 1 && nameVal
                            ? nameVal
                            : file.name.split(".")[0],
                    qty: qtyVal || "1",
                    image: imagePreviews[index],
                });
            });
        } else {
            // Text only input
            newIngredients.push({
                id: Date.now().toString(),
                type: "text",
                name: nameVal || "Uploaded Image",
                qty: qtyVal || "1",
                image: null,
            });
        }

        setIngredients((p) => [...p, ...newIngredients]);

        // Reset form
        setIngredientInput("");
        setQtyInput("");
        setImageInputs([]);
        setImagePreviews([]);
    };

    const handleAddQuickIngredient = (ingredientName) => {
        if (
            ingredients.some(
                (i) => i.name.toLowerCase() === ingredientName.toLowerCase(),
            )
        ) {
            return;
        }

        const newIngredient = {
            id: `${Date.now()}-${Math.random()}`,
            type: "text",
            name: ingredientName,
            qty: "1",
            image: null,
        };
        setIngredients((p) => [...p, newIngredient]);
    };

    // Removed unused handleIngredientKey

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
                cuisine: selectedCuisines[0], // Backend currently handles single cuisine
                cookingTime: selectedTime,
                dietaryType: selectedDiets[0],
                spiceLevel: selectedSpice,
            });

            const aiRecipes = response.data.recipes || [];

            // Map backend structure to frontend structure if necessary
            const formattedResults = aiRecipes.map((r, index) => ({
                id: `ai-${Date.now()}-${index}`,
                ...r,
            }));

            setResults(formattedResults);
            setAiIntro("Here are some wonderful recipes crafted just for you!");
            setStream("Here are some wonderful recipes crafted just for you!");
        } catch (err) {
            console.error(err);
            setStream(
                "Error getting AI recommendations. Please check your connection: " +
                    err.message,
            );
            setAiIntro("Error getting AI recommendations.");
        }

        setLoading(false);

        // Gamification events
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
                    <div className="mb-8 bg-brand-card rounded-b-card rounded-t-button lg:rounded-t-none p-6 md:p-8 pt-6 md:pt-4 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-brand-primary/10 lg:border-t-0">
                        <form
                            onSubmit={addIngredient}
                            className="flex flex-col gap-4"
                        >
                            {/* Text Inputs Row */}
                            <div className="flex flex-col md:flex-row gap-3">
                                <input
                                    className="w-full md:flex-1 bg-brand-card border border-brand-primary/20 outline-none text-brand-primary text-sm font-sans px-4 h-[48px] rounded-input placeholder:text-brand-primary/50 focus:border-brand-accent transition-colors shadow-sm"
                                    placeholder="Ingredient name (e.g. Garlic)"
                                    value={ingredientInput}
                                    onChange={(e) =>
                                        setIngredientInput(e.target.value)
                                    }
                                    required={imageInputs.length === 0}
                                />
                                <div className="flex gap-3 h-[48px]">
                                    <input
                                        type="text"
                                        className="flex-1 md:w-[120px] bg-brand-card border border-brand-primary/20 outline-none text-brand-primary text-sm font-sans px-3 h-full rounded-input placeholder:text-brand-primary/50 focus:border-brand-accent transition-colors text-center shadow-sm"
                                        placeholder="Qty (e.g. 500g)"
                                        value={qtyInput}
                                        onChange={(e) =>
                                            setQtyInput(e.target.value)
                                        }
                                    />
                                    <button
                                        type="submit"
                                        className="w-[48px] h-full bg-brand-primary text-brand-bg hover:opacity-90 cursor-pointer !p-0 rounded-button shrink-0 flex items-center justify-center text-xl transition-all shadow-sm"
                                        disabled={
                                            !ingredientInput.trim() &&
                                            imageInputs.length === 0
                                        }
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Quick Add Chips Row */}
                            <div className="flex flex-wrap gap-2 items-center pb-2">
                                <span className="text-[13px] font-bold text-brand-primary/40 uppercase tracking-widest mr-1">
                                    Quick Add:
                                </span>
                                {QUICK_ADD_INGREDIENTS.filter(
                                    (chip) =>
                                        !ingredients.some(
                                            (i) =>
                                                i.name.toLowerCase() ===
                                                chip.toLowerCase(),
                                        ),
                                ).map((chip) => (
                                    <button
                                        key={chip}
                                        type="button"
                                        onClick={() =>
                                            handleAddQuickIngredient(chip)
                                        }
                                        className="text-[14px] font-bold text-brand-secondary bg-brand-secondary/10 hover:bg-brand-secondary border border-brand-secondary/20 hover:text-white px-3 py-1.5 rounded-full transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
                                    >
                                        + {chip}
                                    </button>
                                ))}
                            </div>

                            <div className="relative w-full min-h-[54px]">
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    id="ingredient-image"
                                    className="hidden"
                                    onChange={handleImageUpload}
                                />
                                <label
                                    htmlFor="ingredient-image"
                                    className={`flex items-center justify-center w-full h-full bg-brand-bg/50 hover:bg-brand-bg border-2 border-dashed border-brand-primary/20 rounded-card cursor-pointer transition-colors overflow-hidden group min-h-[54px] p-2 ${imagePreviews.length > 0 ? "justify-start border-solid" : ""}`}
                                >
                                    {imagePreviews.length > 0 ? (
                                        <div className="flex flex-wrap gap-2 w-full">
                                            {imagePreviews.map(
                                                (preview, index) => (
                                                    <div
                                                        key={index}
                                                        className="relative w-12 h-12 rounded-lg overflow-hidden border border-brand-primary/20 shrink-0 group/img slide-up"
                                                    >
                                                        <img
                                                            src={preview}
                                                            className="w-full h-full object-cover"
                                                            alt={`preview ${index}`}
                                                        />
                                                        <button
                                                            type="button"
                                                            className="absolute top-0.5 right-0.5 w-[20px] h-[20px] bg-brand-accent hover:bg-red-600 text-white rounded-full flex items-center justify-center text-[12px] font-bold shadow-md hover:scale-110 transition-all opacity-0 group-hover/img:opacity-100"
                                                            onClick={(e) =>
                                                                handleClearImage(
                                                                    e,
                                                                    index,
                                                                )
                                                            }
                                                            title="Remove image"
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                ),
                                            )}
                                            <div className="w-12 h-12 rounded-lg border-2 border-dashed border-brand-primary/30 flex items-center justify-center text-brand-primary/50 shrink-0 hover:bg-brand-primary/5 transition-colors">
                                                <span className="text-xl">
                                                    +
                                                </span>
                                            </div>
                                        </div>
                                    ) : (
                                        <span className="flex items-center gap-2 text-brand-primary/70 text-base py-3">
                                            <FiCamera className="text-xl" />{" "}
                                            Upload photo(s) of your ingredients
                                        </span>
                                    )}
                                </label>
                            </div>
                        </form>
                    </div>

                    {/* --- ADDED INGREDIENTS PREVIEW LIST --- */}
                    {ingredients.length > 0 && (
                        <div className="slide-up max-w-[700px] mx-auto text-left mb-10 pb-8 border-b border-brand-primary/10">
                            <div className="flex flex-wrap gap-2">
                                {ingredients.map((ing) => (
                                    <div
                                        key={ing.id}
                                        className="inline-flex items-center gap-2 bg-brand-bg border border-brand-primary/10 rounded-button p-1 pr-3 pr-8 relative group"
                                    >
                                        {/* Thumbnail rendering */}
                                        {ing.type === "image" && ing.image ? (
                                            <img
                                                src={ing.image}
                                                className="w-8 h-8 rounded-lg object-cover"
                                                alt={ing.name}
                                            />
                                        ) : (
                                            <div className="w-8 h-8 rounded-lg bg-brand-primary/5 flex items-center justify-center text-base text-brand-primary/60">
                                                <FiFileText />
                                            </div>
                                        )}

                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-brand-primary leading-tight max-w-[120px] truncate">
                                                {ing.name}
                                            </span>
                                            {ing.qty && (
                                                <span className="text-[12px] font-semibold text-brand-secondary">
                                                    {ing.qty}
                                                </span>
                                            )}
                                        </div>

                                        <button
                                            className="absolute -top-1.5 -right-1.5 w-[22px] h-[22px] bg-brand-accent text-white rounded-full flex items-center justify-center text-[12px] opacity-0 group-hover:opacity-100 transition-opacity font-bold shadow-md hover:scale-110"
                                            onClick={() =>
                                                removeIngredient(ing.id)
                                            }
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* --- 2. RIGHT COLUMN: PREFERENCES (Sticky) --- */}
                <div className="order-2 lg:order-none lg:col-span-5 lg:col-start-8 lg:row-start-1 lg:row-span-2 bg-brand-card lg:bg-transparent rounded-2xl lg:rounded-none border lg:border-none border-brand-primary/20 p-6 pb-28 lg:p-0 shadow-sm lg:shadow-none mb-4 lg:mb-0 lg:sticky lg:top-[120px] lg:h-max">
                    <div className="flex flex-col gap-0 lg:gap-6">
                        <DashboardPreferencesSidebar
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
