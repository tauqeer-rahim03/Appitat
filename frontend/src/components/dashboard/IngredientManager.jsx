import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { FiCamera, FiX, FiPlus, FiFileText } from "react-icons/fi";
import { aiAPI } from "../../lib/api";

const QUICK_ADD_INGREDIENTS = [
    "Garlic",
    "Onion",
    "Chicken",
    "Eggs",
    "Olive Oil",
    "Tomatoes",
];

export default function IngredientManager() {
    const { 
        ingredients, 
        setIngredients, 
        setResults, 
        syncUserXpAndLevel 
    } = useApp();
    const [ingredientInput, setIngredientInput] = useState("");
    const [qtyInput, setQtyInput] = useState("");
    const [scanning, setScanning] = useState(false);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setScanning(true);

        const formData = new FormData();
        formData.append("image", file);

        try {
            const response = await aiAPI.visionRecommend(formData);
            const { identifiedIngredients, recipes, savedRecipeId, xpStatus } = response.data;

            if (identifiedIngredients && identifiedIngredients.length > 0) {
                // Add identified ingredients as chips
                const newChips = identifiedIngredients.map(ing => ({
                    id: `${Date.now()}-${Math.random()}`,
                    type: "text",
                    name: ing,
                    qty: "1",
                    image: null
                }));

                setIngredients((prev) => {
                    const existingNames = new Set(prev.map((p) => p.name.toLowerCase()));
                    const filteredNew = newChips.filter((c) => !existingNames.has(c.name.toLowerCase()));
                    return [...prev, ...filteredNew];
                });

                // Set generated recipes in context
                if (recipes && recipes.length > 0) {
                    const mappedRecipes = recipes.map((recipe, idx) => ({
                        ...recipe,
                        id: idx === 0 ? savedRecipeId : `vision-${Date.now()}-${idx}`,
                        isAIGenerated: true
                    }));
                    setResults(mappedRecipes);
                }

                // Sync XP and levels
                if (xpStatus) {
                    syncUserXpAndLevel(xpStatus.xp, xpStatus.level);
                }

                alert(`Gemini identified ${identifiedIngredients.length} ingredients: ${identifiedIngredients.join(", ")}! +30 XP gained.`);
            } else {
                alert("Gemini scanned the image but couldn't identify any ingredients. Please try another photo.");
            }
        } catch (err) {
            console.error("Vision recognition error:", err);
            alert("Error scanning image: " + (err.response?.data?.message || err.message || "Unknown error"));
        } finally {
            setScanning(false);
            e.target.value = "";
        }
    };

    const addIngredient = (e) => {
        if (e) e.preventDefault();
        const nameVal = ingredientInput.trim();
        const qtyVal = qtyInput.trim();

        if (!nameVal) return;

        setIngredients((p) => [
            ...p,
            {
                id: Date.now().toString(),
                type: "text",
                name: nameVal,
                qty: qtyVal || "1",
                image: null,
            },
        ]);
        setIngredientInput("");
        setQtyInput("");
    };

    const handleAddQuickIngredient = (ingredientName) => {
        if (ingredients.some((i) => i.name.toLowerCase() === ingredientName.toLowerCase())) return;
        setIngredients((p) => [...p, {
            id: `${Date.now()}-${Math.random()}`,
            type: "text",
            name: ingredientName,
            qty: "1",
            image: null,
        }]);
    };

    const removeIngredient = (id) => {
        setIngredients((p) => p.filter((x) => x.id !== id));
    };

    return (
        <div className="relative bg-brand-card rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 shadow-2xl shadow-brand-primary/10 border-2 border-brand-primary/20 border-solid mb-6 md:mb-8">
            {scanning && (
                <div className="absolute inset-0 bg-brand-card/90 backdrop-blur-md z-50 rounded-2xl md:rounded-3xl flex flex-col items-center justify-center p-6 border-2 border-brand-primary/20 border-solid animate-fadeIn">
                    <div className="relative w-24 h-24 mb-6">
                        <div className="absolute inset-0 rounded-full border-4 border-brand-primary/20 border-t-brand-secondary animate-spin"></div>
                        <div className="absolute inset-2 bg-brand-secondary/10 rounded-full animate-pulse flex items-center justify-center">
                            <FiCamera size={36} className="text-brand-secondary animate-bounce" />
                        </div>
                    </div>
                    <h3 className="serif text-xl font-black text-brand-primary mb-2 text-center">
                        Scanning Image with Gemini AI...
                    </h3>
                    <p className="text-sm text-brand-primary/60 text-center max-w-[280px]">
                        Analyzing ingredients and planning your personalized recipes. This will take just a few seconds.
                    </p>
                </div>
            )}

            <form onSubmit={addIngredient}>
                <div className="flex flex-col gap-3 md:gap-4 mb-4 md:mb-6">
                    <div className="flex flex-col md:flex-row gap-3 md:gap-4">
                        <div className="flex-1 relative group">
                            <input
                                type="text"
                                placeholder="Ingredient name (e.g. Garlic)"
                                className="w-full bg-brand-bg/80 border-2 border-brand-primary/20 rounded-xl md:rounded-2xl px-4 md:px-5 py-3.5 md:py-4 text-brand-primary font-bold focus:border-brand-secondary focus:ring-4 focus:ring-brand-secondary/10 outline-none transition-all placeholder:text-brand-primary/40 shadow-sm"
                                value={ingredientInput}
                                onChange={(e) => setIngredientInput(e.target.value)}
                                disabled={scanning}
                            />
                        </div>
                        <div className="w-full md:w-40">
                            <input
                                type="text"
                                placeholder="Qty (e.g. 500g)"
                                className="w-full bg-brand-bg/80 border-2 border-brand-primary/20 rounded-xl md:rounded-2xl px-4 md:px-5 py-3.5 md:py-4 text-brand-primary font-bold focus:border-brand-secondary focus:ring-4 focus:ring-brand-secondary/10 outline-none transition-all placeholder:text-brand-primary/40 shadow-sm"
                                value={qtyInput}
                                onChange={(e) => setQtyInput(e.target.value)}
                                disabled={scanning}
                            />
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button
                            type="submit"
                            className="bg-brand-primary text-white px-6 min-h-[48px] rounded-xl md:rounded-2xl hover:bg-brand-primary/90 active:scale-95 transition-all flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group shadow-lg shadow-brand-primary/20 flex-1 md:flex-none"
                            style={{ minWidth: "64px" }}
                            disabled={!ingredientInput.trim() || scanning}
                        >
                            <FiPlus size={28} className="group-hover:rotate-90 transition-transform duration-300" />
                        </button>
                        <div className="relative">
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                id="ingredient-image"
                                onChange={handleImageUpload}
                                disabled={scanning}
                            />
                            <label
                                htmlFor="ingredient-image"
                                className="h-full min-h-[48px] bg-brand-bg border-2 border-brand-primary/20 rounded-xl md:rounded-2xl px-5 md:px-6 py-3 md:py-4 flex items-center gap-2 md:gap-3 cursor-pointer hover:border-brand-secondary hover:text-brand-secondary hover:bg-brand-secondary/5 transition-all text-brand-primary font-bold group shadow-sm"
                            >
                                <FiCamera size={22} className="group-hover:scale-110 transition-transform" />
                                <span className="hidden sm:inline">Add Photo</span>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 md:gap-3 overflow-x-auto hide-scrollbar pb-1 -mx-1 px-1">
                    <span className="text-[11px] md:text-[12px] font-black text-brand-primary/40 uppercase tracking-widest mr-1 md:mr-2 whitespace-nowrap shrink-0">
                        QUICK ADD:
                    </span>
                    {QUICK_ADD_INGREDIENTS.map((ing) => (
                        <button
                            key={ing}
                            type="button"
                            onClick={() => handleAddQuickIngredient(ing)}
                            className="px-3 md:px-4 py-2 md:py-1.5 rounded-full border border-brand-primary/10 text-[12px] md:text-[13px] font-bold text-brand-primary/60 hover:border-brand-secondary hover:text-brand-secondary hover:bg-brand-secondary/5 transition-all cursor-pointer whitespace-nowrap shrink-0 min-h-[36px] active:scale-95"
                            disabled={scanning}
                        >
                            + {ing}
                        </button>
                    ))}
                </div>
            </form>

            {/* Ingredient Chips */}
            {ingredients.length > 0 && (
                <div className="mt-8 pt-6 border-t border-brand-primary/10">
                    <div className="flex flex-wrap gap-3">
                        {ingredients.map((ing) => (
                            <div
                                key={ing.id}
                                className="group flex items-center gap-3 bg-brand-bg/80 border border-brand-primary/10 pl-2 pr-4 py-2 rounded-2xl hover:border-brand-secondary/30 transition-all hover:shadow-lg hover:shadow-brand-secondary/5 animate-slideUp"
                            >
                                <div className="w-10 h-10 rounded-xl bg-brand-primary/5 flex items-center justify-center text-brand-primary/40 shrink-0">
                                    <FiFileText size={18} />
                                </div>
                                <div className="leading-tight">
                                    <p className="text-[14px] font-black text-brand-primary capitalize">
                                        {ing.name}
                                    </p>
                                    <p className="text-[11px] font-bold text-brand-primary/40 uppercase">
                                        {ing.qty}
                                    </p>
                                </div>
                                <button
                                    onClick={() => removeIngredient(ing.id)}
                                    className="ml-2 w-6 h-6 rounded-full flex items-center justify-center text-brand-primary/20 hover:text-brand-secondary hover:bg-brand-secondary/10 transition-all cursor-pointer"
                                >
                                    <FiX size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
