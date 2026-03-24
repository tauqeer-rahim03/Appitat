import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { FiCamera, FiX, FiPlus, FiFileText } from "react-icons/fi";

const QUICK_ADD_INGREDIENTS = [
    "Garlic",
    "Onion",
    "Chicken",
    "Eggs",
    "Olive Oil",
    "Tomatoes",
];

export default function IngredientManager() {
    const { ingredients, setIngredients } = useApp();
    const [ingredientInput, setIngredientInput] = useState("");
    const [qtyInput, setQtyInput] = useState("");
    const [imageInputs, setImageInputs] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);

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

        if (!ingredientInput.trim() && files.length === 1) {
            setIngredientInput(files[0].name.split(".")[0]);
        }
    };

    const handleClearImage = (e, indexToRemove = null) => {
        e.preventDefault();
        e.stopPropagation();

        if (indexToRemove !== null) {
            setImageInputs((prev) => prev.filter((_, i) => i !== indexToRemove));
            setImagePreviews((prev) => prev.filter((_, i) => i !== indexToRemove));
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
        if (imageInputs.length > 0) {
            imageInputs.forEach((file, index) => {
                newIngredients.push({
                    id: Date.now().toString() + index,
                    type: "image",
                    name: imageInputs.length === 1 && nameVal ? nameVal : file.name.split(".")[0],
                    qty: qtyVal || "1",
                    image: imagePreviews[index],
                });
            });
        } else {
            newIngredients.push({
                id: Date.now().toString(),
                type: "text",
                name: nameVal || "Uploaded Image",
                qty: qtyVal || "1",
                image: null,
            });
        }

        setIngredients((p) => [...p, ...newIngredients]);
        setIngredientInput("");
        setQtyInput("");
        setImageInputs([]);
        setImagePreviews([]);
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
        <div className="bg-brand-card rounded-3xl p-6 lg:p-8 shadow-2xl shadow-brand-primary/10 border-2 border-brand-primary/20 border-solid mb-8">
            <form onSubmit={addIngredient}>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1 relative group">
                        <input
                            type="text"
                            placeholder="Ingredient name (e.g. Garlic)"
                            className="w-full bg-brand-bg/80 border-2 border-brand-primary/20 rounded-2xl px-5 py-4 text-brand-primary font-bold focus:border-brand-secondary focus:ring-4 focus:ring-brand-secondary/10 outline-none transition-all placeholder:text-brand-primary/40 shadow-sm"
                            value={ingredientInput}
                            onChange={(e) => setIngredientInput(e.target.value)}
                        />
                    </div>
                    <div className="w-full md:w-40">
                        <input
                            type="text"
                            placeholder="Qty (e.g. 500g)"
                            className="w-full bg-brand-bg/80 border-2 border-brand-primary/20 rounded-2xl px-5 py-4 text-brand-primary font-bold focus:border-brand-secondary focus:ring-4 focus:ring-brand-secondary/10 outline-none transition-all placeholder:text-brand-primary/40 shadow-sm"
                            value={qtyInput}
                            onChange={(e) => setQtyInput(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-brand-primary text-white px-6 rounded-2xl hover:bg-brand-primary/90 hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group shadow-lg shadow-brand-primary/20"
                        style={{ minWidth: "64px" }}
                        disabled={!ingredientInput.trim() && imageInputs.length === 0}
                    >
                        <FiPlus size={28} className="group-hover:rotate-90 transition-transform duration-300" />
                    </button>
                    <div className="relative">
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            id="ingredient-image"
                            onChange={handleImageUpload}
                        />
                        <label
                            htmlFor="ingredient-image"
                            className="h-full bg-brand-bg border-2 border-brand-primary/20 rounded-2xl px-6 py-4 flex items-center gap-3 cursor-pointer hover:border-brand-secondary hover:text-brand-secondary hover:bg-brand-secondary/5 transition-all text-brand-primary font-bold group shadow-sm"
                        >
                            <FiCamera size={22} className="group-hover:scale-110 transition-transform" />
                            <span className="hidden sm:inline">Add Photo</span>
                        </label>
                    </div>
                </div>

                {imagePreviews.length > 0 && (
                    <div className="flex flex-wrap gap-3 mb-6 animate-fadeIn">
                        {imagePreviews.map((prev, idx) => (
                            <div key={idx} className="relative group">
                                <img
                                    src={prev}
                                    alt="Preview"
                                    className="w-20 h-20 object-cover rounded-xl border-2 border-brand-secondary ring-4 ring-brand-secondary/10"
                                />
                                <button
                                    onClick={(e) => handleClearImage(e, idx)}
                                    className="absolute -top-2 -right-2 bg-brand-secondary text-white w-6 h-6 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer border-2 border-brand-card"
                                >
                                    <FiX size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex flex-wrap items-center gap-3">
                    <span className="text-[12px] font-black text-brand-primary/40 uppercase tracking-widest mr-2">
                        QUICK ADD:
                    </span>
                    {QUICK_ADD_INGREDIENTS.map((ing) => (
                        <button
                            key={ing}
                            type="button"
                            onClick={() => handleAddQuickIngredient(ing)}
                            className="px-4 py-1.5 rounded-full border border-brand-primary/10 text-[13px] font-bold text-brand-primary/60 hover:border-brand-secondary hover:text-brand-secondary hover:bg-brand-secondary/5 transition-all cursor-pointer"
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
                                {ing.type === "image" ? (
                                    <div className="w-10 h-10 rounded-xl overflow-hidden border border-brand-primary/10 shadow-sm relative shrink-0">
                                        <img src={ing.image} className="w-full h-full object-cover" alt={ing.name} />
                                    </div>
                                ) : (
                                    <div className="w-10 h-10 rounded-xl bg-brand-primary/5 flex items-center justify-center text-brand-primary/40 shrink-0">
                                        <FiFileText size={18} />
                                    </div>
                                )}
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
