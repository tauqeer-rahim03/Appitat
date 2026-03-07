import { useState } from "react";
import confetti from "canvas-confetti";
import { useApp } from "../context/AppContext";
import { FiClock, FiShoppingCart, FiHeart } from "react-icons/fi";
import { FaUtensils, FaFire, FaHeart, FaCheck, FaStar } from "react-icons/fa6";

export default function RecipeDetailPage({ recipe }) {
    const { navigate, saved, toggleSave, addXp } = useApp();

    const [showXpToast, setShowXpToast] = useState(false);
    const [earnedXp, setEarnedXp] = useState(0);

    if (!recipe) {
        return (
            <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center p-6 text-center">
                <div className="text-[60px] mb-4">🍽️</div>
                <h2 className="serif text-2xl font-black text-brand-primary mb-2">
                    Recipe Not Found
                </h2>
                <p className="text-brand-primary/60 mb-6 text-sm">
                    We couldn't find the recipe you're looking for.
                </p>
                <button
                    className="btn-primary"
                    onClick={() => navigate("dashboard")}
                >
                    Back to Dashboard
                </button>
            </div>
        );
    }

    const isSaved = saved.find((s) => s.id === recipe.id);

    const handleCooked = () => {x``
        let xpAmount = 50; // Easy
        if (recipe.difficulty === "Medium") xpAmount = 100;
        if (recipe.difficulty === "Hard") xpAmount = 150;

        addXp(xpAmount);
        setEarnedXp(xpAmount);
        setShowXpToast(true);

        // Fire confetti
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: [recipe.accent, "#F5C842", "#4CAF50"],
        });

        setTimeout(() => setShowXpToast(false), 3000);
    };

    return (
        <div className="min-h-screen bg-brand-bg">
            <div className="h-1.5" style={{ background: recipe.accent }} />
            <div className="max-w-[1000px] mx-auto px-6 py-12">
                <button
                    className="inline-flex items-center gap-2 bg-none border-none cursor-pointer text-brand-primary/80 text-sm font-semibold mb-8 hover:text-brand-secondary transition-colors"
                    onClick={() => navigate("dashboard")}
                >
                    ← Back to recipes
                </button>

                <div className="slide-up bg-brand-card rounded-3xl overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.08)]">
                    <div
                        className="p-6 md:p-10 pb-8 md:pb-10 border-b border-brand-primary/10"
                        style={{
                            background: `linear-gradient(135deg, ${recipe.accent}22, ${recipe.accent}08)`,
                        }}
                    >
                        <div className="flex items-start justify-between gap-5 flex-wrap">
                            <div className="flex gap-5 items-center">
                                <div
                                    className="w-[88px] h-[88px] rounded-[22px] flex items-center justify-center text-5xl shrink-0"
                                    style={{
                                        background: recipe.accent + "33",
                                        color: recipe.accent,
                                    }}
                                >
                                    {recipe.emoji}
                                </div>
                                <div>
                                    <p
                                        className="text-[11px] font-bold uppercase tracking-widest mb-1.5"
                                        style={{ color: recipe.accent }}
                                    >
                                        {recipe.cuisine}
                                    </p>
                                    <h1 className="serif text-[clamp(28px,6vw,38px)] font-black text-brand-primary leading-[1.1]">
                                        {recipe.title}
                                    </h1>
                                    <div className="flex gap-4 mt-3 text-[13px] text-brand-primary/80 flex-wrap">
                                        <span className="flex items-center gap-1.5">
                                            <FiClock className="relative -top-[0.5px]" />{" "}
                                            {recipe.time}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <FaFire className="relative -top-[1px] text-brand-secondary" />{" "}
                                            {recipe.calories} kcal
                                        </span>
                                        <span
                                            className="font-bold"
                                            style={{ color: recipe.accent }}
                                        >
                                            {recipe.difficulty}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    className="flex items-center gap-2 border-2 rounded-xl px-4 py-2.5 cursor-pointer font-bold text-sm transition-all duration-200"
                                    style={{
                                        background: isSaved
                                            ? recipe.accent
                                            : "var(--color-brand-card)",
                                        color: isSaved
                                            ? "var(--color-brand-bg)"
                                            : recipe.accent,
                                        borderColor: recipe.accent,
                                    }}
                                    onClick={() => toggleSave(recipe)}
                                >
                                    {isSaved ? (
                                        <>
                                            <FaHeart className="text-white" />{" "}
                                            Saved
                                        </>
                                    ) : (
                                        <>
                                            <FiHeart /> Save
                                        </>
                                    )}
                                </button>

                                <button
                                    className="flex items-center gap-2 border-2 rounded-xl px-5 py-2.5 cursor-pointer font-bold text-sm transition-all duration-200 hover:scale-105 shadow-md"
                                    style={{
                                        background: recipe.accent,
                                        color: "var(--color-brand-bg)",
                                        borderColor: recipe.accent,
                                    }}
                                    onClick={handleCooked}
                                >
                                    <FaCheck /> I Made This!
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                        <div>
                            <h2 className="font-extrabold text-brand-primary mb-4.5 text-[17px] flex items-center gap-2">
                                <FiShoppingCart className="text-[20px] text-brand-secondary" />{" "}
                                Ingredients
                            </h2>
                            <ul className="list-none">
                                {recipe.ingredients.map((ing, i) => (
                                    <li
                                        key={i}
                                        className="flex items-start gap-2.5 py-2 border-b border-brand-primary/10 text-sm text-brand-primary/90"
                                    >
                                        <span
                                            className="w-2 h-2 rounded-full shrink-0 mt-1.5"
                                            style={{
                                                background: recipe.accent,
                                            }}
                                        />
                                        {ing}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h2 className="font-extrabold text-brand-primary mb-4.5 text-[17px] flex items-center gap-2">
                                <FaUtensils className="text-brand-secondary" />{" "}
                                Instructions
                            </h2>
                            <ol className="list-none">
                                {recipe.steps.map((step, i) => (
                                    <li key={i} className="flex gap-3.5 mb-5">
                                        <div
                                            className="w-7 h-7 rounded-full text-white flex items-center justify-center font-extrabold text-[13px] shrink-0"
                                            style={{
                                                background: recipe.accent,
                                            }}
                                        >
                                            {i + 1}
                                        </div>
                                        <p className="text-sm text-brand-primary/90 leading-relaxed pt-1">
                                            {step}
                                        </p>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </div>

                    <div className="px-6 md:px-10 pb-8 md:pb-10">
                        <div
                            className="rounded-2xl p-5"
                            style={{
                                background: recipe.accent + "11",
                                border: `1px solid ${recipe.accent}33`,
                            }}
                        >
                            <p className="text-[13px] text-brand-primary/80 leading-relaxed">
                                <strong className="text-brand-primary">
                                    Chef's note:{" "}
                                </strong>
                                {recipe.description}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* XP Toast Celebration */}
            {showXpToast && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 slide-up flex items-center gap-3 px-6 py-4 bg-brand-card/90 backdrop-blur-md border border-brand-accent/30 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.15)]">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-brand-accent text-white text-lg">
                        <FaStar className="animate-pulse" />
                    </div>
                    <div>
                        <p className="text-brand-primary font-black text-sm uppercase tracking-wider">
                            Recipe Completed!
                        </p>
                        <p className="text-brand-secondary font-bold text-lg leading-tight flex items-center gap-1.5">
                            +{earnedXp} XP Earned
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
