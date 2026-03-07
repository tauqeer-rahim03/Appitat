import { memo } from "react";
import { FiClock } from "react-icons/fi";
import { FaFire, FaHeart, FaRegHeart } from "react-icons/fa6";

const RecipeCardOuter = ({ r, index, isSaved, toggleSave, navigate }) => {
    return (
        <div
            className="slide-up rounded-card overflow-hidden cursor-default flex flex-col bg-brand-card border border-brand-primary/10 transition-all duration-300 hover:-translate-y-[4px] hover:shadow-[0_14px_48px_rgba(37,79,34,0.18)]"
            style={{ animationDelay: `${index * 0.07}s` }}
        >
            {/* Accent bar + shimmer on hover */}
            <div
                className="h-1.5 relative overflow-hidden"
                style={{ background: r.accent }}
            >
                <div className="absolute inset-0 ai-shimmer" />
            </div>
            <div
                className="p-5 flex-1 flex flex-col"
                onClick={() => navigate("recipe", r)}
            >
                <div className="flex items-start justify-between mb-3.5">
                    <div className="flex gap-3 items-center">
                        <div
                            className="w-[52px] h-[52px] rounded-button flex items-center justify-center text-[26px]"
                            style={{
                                background: r.accent + "22",
                                color: r.accent,
                            }}
                        >
                            {r.emoji}
                        </div>
                        <div>
                            <p className="font-bold text-brand-primary text-[15px] leading-tight">
                                {r.title}
                            </p>
                            <p className="text-[13px] text-brand-primary/80 mt-1 uppercase tracking-wider">
                                {r.cuisine}
                            </p>
                        </div>
                    </div>
                </div>
                <p className="text-[14px] text-brand-primary/80 leading-relaxed mb-4 flex-1">
                    {r.description.slice(0, 100)}…
                </p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                    {r.tags.map((t) => (
                        <span key={t} className="tag pointer-events-none">
                            {t}
                        </span>
                    ))}
                </div>
                <div className="flex items-center justify-between border-t border-brand-primary/10 pt-3.5 mt-auto">
                    <div className="flex gap-3.5 text-sm font-medium text-brand-primary/80">
                        <span className="flex items-center gap-1.5">
                            <FiClock className="relative -top-[1px]" /> {r.time}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <FaFire className="relative -top-[1px] text-brand-secondary" />{" "}
                            {r.calories} kcal
                        </span>
                    </div>
                    <button
                        className="flex items-center gap-1.5 text-sm font-bold cursor-pointer transition-all duration-200 group"
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleSave(r);
                        }}
                    >
                        {isSaved ? (
                            <>
                                <FaHeart className="text-brand-secondary text-lg" />
                                <span className="text-brand-secondary">
                                    Saved
                                </span>
                            </>
                        ) : (
                            <>
                                <FaRegHeart className="text-brand-primary/40 group-hover:text-brand-secondary text-lg transition-colors" />
                                <span className="text-brand-primary/40 group-hover:text-brand-secondary transition-colors">
                                    Save
                                </span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export const RecipeCard = memo(RecipeCardOuter);

export const RecipeCardSkeleton = () => {
    return (
        <div className="rounded-card overflow-hidden flex flex-col bg-brand-card border border-brand-primary/10 shadow-sm">
            <div className="h-1.5 relative overflow-hidden">
                <div
                    className="absolute inset-0 ai-shimmer"
                    style={{
                        background:
                            "linear-gradient(90deg, transparent, rgba(37,79,34,0.1), transparent)",
                    }}
                />
                <div className="w-full h-full bg-brand-primary/10 animate-pulse" />
            </div>
            <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex gap-3 items-center w-full">
                        <div className="w-[52px] h-[52px] rounded-button bg-brand-primary/10 animate-pulse shrink-0" />
                        <div className="flex-1">
                            <div className="h-4 bg-brand-primary/10 rounded-full w-3/4 mb-2 animate-pulse" />
                            <div className="h-2.5 bg-brand-primary/10 rounded-full w-1/3 animate-pulse" />
                        </div>
                    </div>
                </div>
                <div className="flex-1 mb-4">
                    <div className="h-2.5 bg-brand-primary/10 rounded-full w-full mb-2.5 animate-pulse" />
                    <div className="h-2.5 bg-brand-primary/10 rounded-full w-5/6 mb-2.5 animate-pulse" />
                    <div className="h-2.5 bg-brand-primary/10 rounded-full w-4/6 animate-pulse" />
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                    <div className="h-5 bg-brand-primary/10 rounded-lg w-16 animate-pulse" />
                    <div className="h-5 bg-brand-primary/10 rounded-lg w-20 animate-pulse" />
                </div>
                <div className="flex items-center justify-between border-t border-brand-primary/10 pt-4 mt-auto">
                    <div className="flex gap-4">
                        <div className="h-3 bg-brand-primary/10 rounded-full w-16 animate-pulse" />
                        <div className="h-3 bg-brand-primary/10 rounded-full w-16 animate-pulse" />
                    </div>
                    <div className="w-5 h-5 bg-brand-primary/10 rounded-full animate-pulse" />
                </div>
            </div>
        </div>
    );
};
