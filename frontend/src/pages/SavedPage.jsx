import { useApp } from "../context/AppContext";
import { FiLock } from "react-icons/fi";
import { FaUtensils, FaHeart } from "react-icons/fa6";
import { RecipeCard } from "../components/RecipeCard";

export default function SavedPage() {
    const { navigate, saved, toggleSave, user } = useApp();

    if (!user) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
                <FiLock className="text-[64px] text-[#C97D2E] mb-5" />
                <h2 className="serif text-[28px] font-black text-brand-primary mb-3">
                    Log in to save recipes
                </h2>
                <p className="text-brand-primary/70 mb-7">
                    Create a free account to build your personal cookbook.
                </p>
                <button
                    className="btn-primary px-8 py-3.5 rounded-xl text-[15px]"
                    onClick={() => navigate("signup")}
                >
                    Sign Up Free
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-bg px-6 py-8 md:py-12">
            <div className="max-w-[1200px] mx-auto">
                <h1 className="serif slide-up text-[clamp(26px,4vw,42px)] font-black text-brand-primary mb-2 flex items-center gap-2">
                    Your Cookbook{" "}
                    <FaHeart className="text-brand-secondary text-3xl" />
                </h1>
                <p className="slide-up stagger-1 text-brand-primary/70 mb-9">
                    {saved.length} saved recipe{saved.length !== 1 ? "s" : ""}
                </p>

                {saved.length === 0 ? (
                    <div className="text-center py-20 px-6 bg-brand-card rounded-[20px] border border-brand-primary/10">
                        <FaUtensils className="text-[60px] text-brand-secondary mx-auto block mb-6 opacity-60" />
                        <p className="text-brand-primary mb-6">
                            You haven't saved any recipes yet.
                        </p>
                        <button
                            className="btn-primary px-7 py-3 rounded-[11px] text-sm"
                            onClick={() => navigate("dashboard")}
                        >
                            Browse Recipes
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6">
                        {saved.map((r, i) => (
                            <RecipeCard
                                key={r.id}
                                r={r}
                                index={i}
                                isSaved={true}
                                toggleSave={toggleSave}
                                navigate={navigate}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
