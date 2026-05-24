import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { FiClock, FiHeart, FiUser, FiEdit2, FiAward, FiLogOut, FiSend, FiCheckCircle, FiMessageSquare } from "react-icons/fi";
import { FaFire } from "react-icons/fa";
import { RECIPES } from "../data/constants";
import { AccountPersonalizationCard } from "../components/AccountPersonalizationCard";
import { AccountPantryCard } from "../components/AccountPantryCard";
import { AccountBadgesCard } from "../components/AccountBadgesCard";
import { resolvePic } from "../lib/utils";
import { feedbackAPI } from "../lib/api";

const FEEDBACK_CATEGORIES = [
    "Recipe Quality",
    "AI Accuracy",
    "UI/UX",
    "Performance",
    "Missing Feature",
    "Other",
];

const RATING_LABELS = ["", "Poor", "Fair", "Good", "Great", "Excellent"];

export default function AccountPage() {
    const { user, saved, toggleSave, navigate, logout } = useApp();
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    // Feedback tab state
    const [fbRating, setFbRating] = useState(0);
    const [fbCategories, setFbCategories] = useState([]);
    const [fbMessage, setFbMessage] = useState("");
    const [fbSubmitting, setFbSubmitting] = useState(false);
    const [fbDone, setFbDone] = useState(false);
    const [fbError, setFbError] = useState("");

    const toggleFbCategory = (cat) =>
        setFbCategories((prev) =>
            prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
        );

    const handleFbSubmit = async (e) => {
        e.preventDefault();
        if (!fbRating) return setFbError("Please choose a star rating.");
        setFbError("");
        setFbSubmitting(true);
        try {
            await feedbackAPI.submit({ rating: fbRating, categories: fbCategories, message: fbMessage });
            setFbDone(true);
        } catch {
            setFbError("Something went wrong. Please try again.");
        } finally {
            setFbSubmitting(false);
        }
    };

    const resetFeedback = () => {
        setFbRating(0);
        setFbCategories([]);
        setFbMessage("");
        setFbDone(false);
        setFbError("");
    };

    const [activeTab, setActiveTab] = useState("cookbook");

    const readOnlyMode = {
        age: false,
        experience: false,
        allergies: false,
        neverShowMe: false,
        pantry: false,
    };

    useEffect(() => {
        if (!user) {
            navigate("login");
        }
    }, [user, navigate]);

    if (!user) return null;

    const mockHistory = RECIPES.slice(1, 4);

    const xp = user?.xp || 0;
    const currentLevel = Math.floor(xp / 500) + 1;
    const xpInLevel = xp % 500;
    const xpProgress = (xpInLevel / 500) * 100;

    let badgeTitle = "Novice Cook";
    let badgeColor = "#cd7f32"; // Bronze
    if (currentLevel >= 6 && currentLevel < 10) {
        badgeTitle = "Sous Chef";
        badgeColor = "#C0C0C0"; // Silver
    } else if (currentLevel >= 10) {
        badgeTitle = "Master Chef";
        badgeColor = "#FFD700"; // Gold
    }

    return (
        <div className="min-h-screen bg-brand-bg has-bottom-nav">
            {/* Header Section */}
            <div
                className="relative px-4 md:px-6 py-8 md:py-16 text-center border-b-[4px] border-brand-secondary"
                style={{
                    backgroundColor: user.coverPic
                        ? "transparent"
                        : "var(--brand-primary)",
                    backgroundImage: user.coverPic
                        ? `linear-gradient(rgba(30, 15, 0, 0.4), rgba(61, 32, 16, 0.8)), url(${resolvePic(user.coverPic)})`
                        : "linear-gradient(to bottom right, var(--brand-primary), var(--brand-primary))",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <div className="max-w-[1000px] mx-auto flex flex-col items-center relative z-10 w-full">
                    <button
                        className="absolute top-0 right-0 text-white/90 hover:text-white bg-black/20 hover:bg-black/40 backdrop-blur-sm px-4 py-2.5 rounded-full transition-all cursor-pointer flex items-center gap-2 border border-white/10 shadow-lg"
                        onClick={() => navigate("settings")}
                        title="Edit Profile"
                    >
                        <FiEdit2 size={16} />
                        <span className="hidden md:block text-sm font-bold tracking-wide">
                            Edit Profile
                        </span>
                    </button>

                    <div className="w-[72px] h-[72px] md:w-[100px] md:h-[100px] rounded-full bg-brand-secondary text-white flex items-center justify-center font-black text-[28px] md:text-[40px] shadow-xl mb-3 md:mb-4 border-4 border-brand-bg/20 overflow-hidden relative mt-6 md:mt-2">
                        {user.profilePic ? (
                            <img
                                src={resolvePic(user.profilePic)}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <FiUser className="w-1/2 h-1/2 opacity-80" />
                        )}
                    </div>

                    <div className="slide-up">
                        <h1 className="serif text-[26px] md:text-[44px] font-black text-brand-bg mb-1 flex items-center justify-center gap-3">
                            {(typeof user?.name === 'string' ? user.name : '') || 
                             (typeof user?.email === 'string' ? user.email.split("@")[0] : '') || 
                             "User"}
                        </h1>
                        <p className="text-brand-bg/70 text-[14px] md:text-[15px] flex items-center justify-center gap-2">
                            {typeof user?.email === 'string' ? user.email : ""}
                        </p>
                        {user?.experience && typeof user.experience === 'string' && (
                            <p className="text-white/70 text-[13px] uppercase tracking-wider font-bold mt-3 bg-black/20 inline-block px-3 py-1 rounded-full border border-white/10">
                                {user.experience} Cook
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="max-w-[1400px] mx-auto px-6 mt-6 md:mt-8">
                <div className="flex gap-2 md:gap-4 border-b border-brand-primary/10 pb-4 overflow-x-auto slide-up hide-scrollbar -mx-2 px-2">
                    <button
                        className={`text-[12px] md:text-sm font-bold uppercase tracking-wider px-4 md:px-5 py-2.5 rounded-xl whitespace-nowrap transition-all shrink-0 min-h-[40px] active:scale-95 ${activeTab === "cookbook" ? "bg-brand-primary text-brand-bg shadow-md" : "text-brand-primary/60 hover:bg-brand-primary/5 hover:text-brand-primary"}`}
                        onClick={() => setActiveTab("cookbook")}
                    >
                        My Cookbook
                    </button>
                    <button
                        className={`text-[12px] md:text-sm font-bold uppercase tracking-wider px-4 md:px-5 py-2.5 rounded-xl whitespace-nowrap transition-all shrink-0 min-h-[40px] active:scale-95 ${activeTab === "preferences" ? "bg-brand-primary text-brand-bg shadow-md" : "text-brand-primary/60 hover:bg-brand-primary/5 hover:text-brand-primary"}`}
                        onClick={() => setActiveTab("preferences")}
                    >
                        Preferences & AI
                    </button>
                    <button
                        className={`text-[12px] md:text-sm font-bold uppercase tracking-wider px-4 md:px-5 py-2.5 rounded-xl whitespace-nowrap transition-all shrink-0 min-h-[40px] active:scale-95 ${activeTab === "badges" ? "bg-brand-primary text-brand-bg shadow-md" : "text-brand-primary/60 hover:bg-brand-primary/5 hover:text-brand-primary"}`}
                        onClick={() => setActiveTab("badges")}
                    >
                        Badges
                    </button>
                    <button
                        className={`text-[12px] md:text-sm font-bold uppercase tracking-wider px-4 md:px-5 py-2.5 rounded-xl whitespace-nowrap transition-all shrink-0 min-h-[40px] active:scale-95 ${activeTab === "history" ? "bg-brand-primary text-brand-bg shadow-md" : "text-brand-primary/60 hover:bg-brand-primary/5 hover:text-brand-primary"}`}
                        onClick={() => setActiveTab("history")}
                    >
                        History
                    </button>
                    <button
                        className={`text-[12px] md:text-sm font-bold uppercase tracking-wider px-4 md:px-5 py-2.5 rounded-xl whitespace-nowrap transition-all shrink-0 min-h-[40px] active:scale-95 ${activeTab === "feedback" ? "bg-brand-primary text-brand-bg shadow-md" : "text-brand-primary/60 hover:bg-brand-primary/5 hover:text-brand-primary"}`}
                        onClick={() => setActiveTab("feedback")}
                    >
                        Feedback
                    </button>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-6 md:py-12 min-h-[50vh]">
                {activeTab === "preferences" && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {/* Summary Card */}
                        <div className="card slide-up stagger-2 rounded-[20px] p-6">
                            <h2 className="serif text-[22px] font-black text-brand-primary mb-5">
                                Your Profile
                            </h2>
                            <div className="flex flex-col gap-4">
                                <div className="flex justify-between items-center border-b border-brand-primary/10 pb-3">
                                    <span className="text-brand-primary/80 text-sm font-semibold flex items-center gap-2">
                                        <FiHeart className="text-brand-secondary" />{" "}
                                        Saved Recipes
                                    </span>
                                    <span className="text-brand-primary font-bold">
                                        {saved?.length || 0}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center border-b border-brand-primary/10 pb-3">
                                    <span className="text-brand-primary/80 text-sm font-semibold flex items-center gap-2">
                                        <FiUser className="text-brand-secondary" />{" "}
                                        Account Type
                                    </span>
                                    <span className="text-white text-[12px] font-bold px-2.5 py-1 bg-brand-secondary rounded-lg tracking-wide uppercase">
                                        Member
                                    </span>
                                </div>
                                <div className="pt-2">
                                    <div className="flex justify-between items-end mb-2">
                                        <div className="flex flex-col">
                                            <span className="text-brand-primary/80 text-sm font-semibold flex items-center gap-2">
                                                <FiAward
                                                    style={{
                                                        color: badgeColor,
                                                    }}
                                                    className="text-lg"
                                                />{" "}
                                                Level {currentLevel} Chef
                                            </span>
                                            <span
                                                className="text-[11px] font-black uppercase tracking-widest mt-0.5 ml-6"
                                                style={{ color: badgeColor }}
                                            >
                                                {badgeTitle}
                                            </span>
                                        </div>
                                        <span className="text-brand-primary font-black text-sm">
                                            {xp} XP
                                        </span>
                                    </div>
                                    <div className="w-full bg-brand-primary/5 rounded-full h-2.5 overflow-hidden">
                                        <div
                                            className="h-2.5 rounded-full transition-all duration-1000 ease-out"
                                            style={{
                                                width: `${xpProgress}%`,
                                                backgroundColor: badgeColor,
                                            }}
                                        ></div>
                                    </div>
                                    <p className="text-right text-[10px] text-brand-primary/50 font-bold mt-1 uppercase tracking-wider">
                                        {500 - xpInLevel} XP to Level{" "}
                                        {currentLevel + 1}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <AccountPersonalizationCard
                            user={user}
                            editMode={readOnlyMode}
                            toggleEdit={() => {}}
                            newAllergy={""}
                            setNewAllergy={() => {}}
                            newDislike={""}
                            setNewDislike={() => {}}
                            handleAddTag={() => {}}
                            handleRemoveTag={() => {}}
                            hideEditToggle={true}
                        />

                        <div className="lg:col-span-2 max-w-2xl mx-auto w-full">
                            <AccountPantryCard
                                user={user}
                                editMode={readOnlyMode}
                                toggleEdit={() => {}}
                                newPantryItem={""}
                                setNewPantryItem={() => {}}
                                handleAddTag={() => {}}
                                handleRemoveTag={() => {}}
                                hideEditToggle={true}
                            />
                        </div>
                    </div>
                )}

                {activeTab === "badges" && <AccountBadgesCard user={user} />}

                {activeTab === "history" && (
                    <div className="max-w-2xl mx-auto">
                        {/* Recent History Card */}
                        <div className="card slide-up rounded-card p-6">
                            <h2 className="serif text-[22px] font-black text-brand-primary mb-5">
                                Cooking History
                            </h2>
                            <div className="flex flex-col gap-4">
                                {(user.history && Array.isArray(user.history) && user.history.length > 0) ? (
                                    user.history.map((h, idx) => {
                                        const recipeKey = String(h?.recipeId ?? h?._id ?? idx);
                                        const emoji = typeof h?.emoji === 'string' ? h.emoji : '🍳';
                                        const title = typeof h?.title === 'string' ? h.title : String(h?.title ?? '');
                                        const xpAwarded = Number(h?.xpAwarded) || 0;
                                        const cuisine = typeof h?.cuisine === 'string' ? h.cuisine : '';
                                        const cookedAt = h?.cookedAt ? (() => { try { return new Date(h.cookedAt).toLocaleDateString(); } catch { return 'Recently'; } })() : 'Recently';

                                        return (
                                            <div
                                                key={recipeKey}
                                                className="flex gap-3 items-center"
                                            >
                                                <div
                                                    className="w-[50px] h-[50px] rounded-xl flex items-center justify-center text-[22px] bg-brand-primary/5 text-brand-secondary"
                                                >
                                                    {emoji}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-center">
                                                        <p className="font-bold text-brand-primary text-[14px] leading-tight">
                                                            {title}
                                                        </p>
                                                        {xpAwarded > 0 && (
                                                            <span className="text-[10px] font-black bg-brand-secondary/10 text-brand-secondary px-2 py-0.5 rounded-lg">
                                                                +{xpAwarded} XP
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-[11px] text-brand-primary/80 mt-0.5 uppercase tracking-wider">
                                                        {cuisine}{cuisine ? ' • ' : ''}{cookedAt}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <p className="text-sm text-brand-primary/50 text-center py-4">
                                        No cooking history yet. Time to get cooking!
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "cookbook" && (
                    <div className="w-full">
                        <div className="flex items-center justify-between mb-8 pb-4 border-b border-brand-primary/20">
                            <h2 className="serif text-[28px] font-black text-brand-primary tracking-tight">
                                Your Cookbook
                            </h2>
                            <button
                                className="btn-ghost flex items-center gap-2 text-sm px-4 py-2 !rounded-xl"
                                onClick={() => navigate("saved")}
                            >
                                View all <FiHeart />
                            </button>
                        </div>

                        {!saved || saved.length === 0 ? (
                            <div className="slide-up text-center py-16 bg-brand-card rounded-card border border-brand-primary/20 border-dashed">
                                <div className="w-16 h-16 bg-brand-bg rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <FiHeart className="text-[28px] text-brand-secondary/80" />
                                </div>
                                <h3 className="serif text-[22px] font-black text-brand-primary mb-2">
                                    No recipes saved yet
                                </h3>
                                <p className="text-brand-primary/80 text-sm mb-6 max-w-[280px] mx-auto">
                                    Recipes you save using the heart icon will
                                    appear here in your cookbook.
                                </p>
                                <button
                                    className="btn-primary px-6 py-2.5 rounded-xl text-sm"
                                    onClick={() => navigate("dashboard")}
                                >
                                    Discover Recipes
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
                                {(saved || []).slice(0, 4).map((r, i) => (
                                    <div
                                        key={String(r.id ?? i)}
                                        className="card slide-up rounded-card overflow-hidden cursor-default"
                                        style={{
                                            animationDelay: `${i * 0.07}s`,
                                        }}
                                    >
                                        <div
                                            className="h-1.5"
                                            style={{ background: typeof r.accent === 'string' ? r.accent : undefined }}
                                        />
                                        <div
                                            className="p-5"
                                            onClick={() =>
                                                navigate("recipe", r)
                                            }
                                        >
                                            <div className="flex items-start justify-between mb-3.5">
                                                <div className="flex gap-3 items-center">
                                                    <div
                                                        className="w-[46px] h-[46px] rounded-xl flex items-center justify-center text-[22px]"
                                                        style={{
                                                            background: typeof r.accent === 'string' ? r.accent + "33" : undefined,
                                                            color: typeof r.accent === 'string' ? r.accent : undefined,
                                                        }}
                                                    >
                                                        {typeof r.emoji === 'string' ? r.emoji : "🍽️"}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-brand-primary text-[15px] leading-tight">
                                                            {typeof r.title === 'string' ? r.title : String(r.title ?? '')}
                                                        </p>
                                                        <p className="text-[11px] text-brand-primary/80 mt-1 uppercase tracking-wider">
                                                            {typeof r.cuisine === 'string' ? r.cuisine : ''}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-[13px] text-brand-primary/80 leading-relaxed mb-4">
                                                {typeof r.description === 'string' && r.description ? `${r.description.slice(0, 80)}…` : ""}
                                            </p>
                                            <div className="flex flex-wrap gap-1.5 mb-4">
                                                {Array.isArray(r.tags) && r.tags.map((t, ti) => (
                                                    <span
                                                        key={typeof t === 'string' ? t : ti}
                                                        className="tag !text-[10px] pointer-events-none"
                                                    >
                                                        {typeof t === 'string' ? t : String(t ?? '')}
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="flex items-center justify-between border-t border-brand-primary/10 pt-3.5">
                                                <div className="flex gap-3 text-xs text-brand-primary/80">
                                                    <span className="flex items-center gap-1">
                                                        <FiClock className="relative -top-[1px]" />{" "}
                                                        {typeof r.time === 'string' ? r.time : String(r.time ?? '')}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <FaFire className="relative -top-[1px] text-brand-secondary" />{" "}
                                                        {typeof r.calories === 'string' ? r.calories : String(r.calories ?? '')}
                                                    </span>
                                                </div>
                                                <button
                                                    className="text-lg text-brand-secondary hover:scale-125 transition-transform"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleSave(r);
                                                    }}
                                                >
                                                    <FiHeart className="fill-current" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === "feedback" && (
                    <div className="max-w-2xl mx-auto w-full slide-up">
                        {fbDone ? (
                            <div className="card rounded-card p-10 flex flex-col items-center text-center gap-5">
                                <div className="w-14 h-14 rounded-full bg-brand-primary/10 flex items-center justify-center">
                                    <FiCheckCircle className="text-brand-primary" size={28} />
                                </div>
                                <div>
                                    <h2 className="serif text-2xl font-black text-brand-primary mb-2">Thank you</h2>
                                    <p className="text-brand-primary/60 text-sm leading-relaxed max-w-xs mx-auto">
                                        Your feedback has been sent. We will use it to keep improving Appitat.
                                    </p>
                                </div>
                                <button
                                    onClick={resetFeedback}
                                    className="btn-primary px-8 py-3 rounded-xl text-sm font-bold cursor-pointer mt-2"
                                >
                                    Submit Another
                                </button>
                            </div>
                        ) : (
                            <div className="card rounded-card overflow-hidden">
                                {/* Card Header */}
                                <div
                                    className="px-6 py-5 border-b border-brand-primary/10"
                                    style={{
                                        background: "var(--brand-primary)",
                                    }}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                                            <FiMessageSquare className="text-brand-bg" size={17} />
                                        </div>
                                        <div>
                                            <h2 className="serif text-xl font-black text-brand-bg leading-tight">Share Your Feedback</h2>
                                            <p className="text-brand-bg/60 text-xs mt-0.5">Your suggestions directly shape Appitat</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Form */}
                                <form onSubmit={handleFbSubmit} className="px-6 py-6 flex flex-col gap-6">
                                    {/* Star Rating */}
                                    <div>
                                        <label className="block text-sm font-bold text-brand-primary/80 mb-3">Overall Rating *</label>
                                        <div className="flex gap-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setFbRating(star)}
                                                    className={`text-4xl transition-all duration-150 hover:scale-110 focus:outline-none cursor-pointer leading-none ${
                                                        star <= fbRating
                                                            ? "text-brand-secondary"
                                                            : "text-brand-primary/20 hover:text-brand-secondary/40"
                                                    }`}
                                                    aria-label={`${star} star${star !== 1 ? "s" : ""}`}
                                                >
                                                    &#9733;
                                                </button>
                                            ))}
                                        </div>
                                        {fbRating > 0 && (
                                            <p className="text-xs text-brand-secondary font-bold mt-2 uppercase tracking-wider">
                                                {RATING_LABELS[fbRating]}
                                            </p>
                                        )}
                                    </div>

                                    {/* Category Tags */}
                                    <div>
                                        <label className="block text-sm font-bold text-brand-primary/80 mb-3">
                                            What is this about?{" "}
                                            <span className="font-normal text-brand-primary/40">(optional)</span>
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {FEEDBACK_CATEGORIES.map((cat) => (
                                                <button
                                                    key={cat}
                                                    type="button"
                                                    onClick={() => toggleFbCategory(cat)}
                                                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-150 cursor-pointer ${
                                                        fbCategories.includes(cat)
                                                            ? "bg-brand-primary text-brand-bg shadow-sm"
                                                            : "bg-brand-primary/8 text-brand-primary/70 hover:bg-brand-primary/15 border border-brand-primary/15"
                                                    }`}
                                                >
                                                    {cat}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Message */}
                                    <div>
                                        <label
                                            htmlFor="account-feedback-message"
                                            className="block text-sm font-bold text-brand-primary/80 mb-3"
                                        >
                                            Tell us more{" "}
                                            <span className="font-normal text-brand-primary/40">(optional)</span>
                                        </label>
                                        <textarea
                                            id="account-feedback-message"
                                            rows={5}
                                            maxLength={1000}
                                            value={fbMessage}
                                            onChange={(e) => setFbMessage(e.target.value)}
                                            placeholder="What could we do better? Any features you would love to see?"
                                            className="w-full bg-brand-bg border border-brand-primary/20 text-brand-primary text-sm font-medium rounded-xl px-4 py-3 focus:outline-none focus:border-brand-secondary transition-colors resize-none placeholder:text-brand-primary/30"
                                        />
                                        <p className="text-right text-[11px] text-brand-primary/30 mt-1">
                                            {fbMessage.length}/1000
                                        </p>
                                    </div>

                                    {fbError && (
                                        <p className="text-brand-accent text-sm font-semibold -mt-2">
                                            {fbError}
                                        </p>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={fbSubmitting}
                                        className="btn-primary w-full py-4 rounded-xl text-[15px] font-bold flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                                    >
                                        {fbSubmitting ? "Sending..." : (<><FiSend size={15} /> Submit Feedback</>)}
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                )}

                {/* Sign Out Section (mobile-friendly) */}
                <div className="mt-12 mb-4 flex justify-center">
                    <button
                        className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-[14px] font-bold text-brand-accent/80 bg-brand-accent/5 border border-brand-accent/15 hover:bg-brand-accent hover:text-white transition-all active:scale-[0.97] cursor-pointer"
                        onClick={() => setShowLogoutConfirm(true)}
                    >
                        <FiLogOut className="text-lg stroke-[2.5]" />
                        Sign Out
                    </button>
                </div>
            </div>

            {/* Logout Confirmation Modal */}
            {showLogoutConfirm && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm p-6">
                    <div className="bg-brand-bg rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-brand-primary/10 sheet-enter">
                        <h3 className="serif text-xl font-black text-brand-primary mb-2">
                            Sign Out?
                        </h3>
                        <p className="text-brand-primary/70 text-sm leading-relaxed mb-6">
                            Are you sure you want to sign out of your account?
                        </p>
                        <div className="flex gap-3">
                            <button
                                className="flex-1 py-3 rounded-xl text-sm font-bold text-brand-primary/60 bg-brand-primary/5 hover:bg-brand-primary/10 transition-colors active:scale-[0.97] cursor-pointer"
                                onClick={() => setShowLogoutConfirm(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="flex-1 py-3 rounded-xl text-sm font-bold bg-brand-accent text-white hover:bg-brand-accent/90 shadow-md transition-all active:scale-[0.97] cursor-pointer"
                                onClick={() => {
                                    setShowLogoutConfirm(false);
                                    logout();
                                }}
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
