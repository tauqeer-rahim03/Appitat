import { FiFilter, FiChevronUp, FiChevronDown } from "react-icons/fi";
import {
    CUISINE_TAGS,
    DIET_TAGS,
    TIME_OPTIONS,
    SPICE_LEVELS,
    CALORIE_OPTIONS,
    SERVING_OPTIONS,
} from "../data/constants";

export function DashboardPreferencesSidebar({
    activeFiltersCount,
    showMobileFilters,
    setShowMobileFilters,
    openCategories,
    toggleCategory,
    // Tag Selection
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
    toggleTag,
}) {
    return (
        <div className="flex flex-col gap-0 lg:gap-6 w-full">
            {/* Mobile Filter Toggle Header */}
            <button
                className="w-full flex items-center justify-between cursor-pointer lg:cursor-default border-none bg-none p-0 outline-none"
                onClick={() => {
                    if (window.innerWidth < 1024)
                        setShowMobileFilters(!showMobileFilters);
                }}
            >
                <h2 className="serif text-[20px] lg:text-[28px] font-black text-brand-primary tracking-tight lg:mb-2 flex items-center gap-2">
                    <FiFilter className="lg:hidden" />
                    Preferences
                    {activeFiltersCount > 0 && (
                        <span className="bg-brand-secondary text-white text-[12px] w-5 h-5 flex items-center justify-center rounded-full lg:hidden">
                            {activeFiltersCount}
                        </span>
                    )}
                </h2>
                <div className="text-brand-primary lg:hidden text-left">
                    {showMobileFilters ? (
                        <FiChevronUp size={24} />
                    ) : (
                        <FiChevronDown size={24} />
                    )}
                </div>
            </button>

            <div
                className={`flex-col gap-6 mt-6 lg:mt-0 ${
                    showMobileFilters ? "flex" : "hidden lg:flex"
                }`}
            >
                {/* Cuisine Accordion */}
                <div>
                    <button
                        className="w-full flex justify-between items-center cursor-pointer mb-4 border-none bg-none p-0 outline-none"
                        onClick={() => toggleCategory("cuisine")}
                    >
                        <p className="text-[14px] font-bold text-brand-primary/80 tracking-widest uppercase mb-0">
                            CUISINE
                        </p>
                        <div className="text-brand-primary/80">
                            {openCategories.cuisine ? (
                                <FiChevronUp size={20} />
                            ) : (
                                <FiChevronDown size={20} />
                            )}
                        </div>
                    </button>
                    {openCategories.cuisine && (
                        <div className="flex flex-wrap gap-3 slide-up">
                            {CUISINE_TAGS.map((t) => (
                                <button
                                    key={t.label}
                                    className={`px-4 py-2 md:px-5 md:py-2.5 rounded-button border text-[14px] md:text-[15px] font-semibold cursor-pointer transition-all ${
                                        selectedCuisines.includes(t.label)
                                            ? "bg-brand-secondary text-white border-brand-secondary shadow-md shadow-brand-secondary/20 hover:scale-105 hover:shadow-[0_0_18px_4px_rgba(160,58,19,0.45)]"
                                            : "bg-brand-card text-brand-primary/80 border-brand-primary/20 hover:border-brand-secondary hover:text-brand-secondary hover:scale-105 hover:shadow-[0_0_14px_3px_rgba(160,58,19,0.2)]"
                                    }`}
                                    onClick={() =>
                                        toggleTag(
                                            selectedCuisines,
                                            setSelectedCuisines,
                                            t.label,
                                        )
                                    }
                                >
                                    <span className="mr-2 opacity-90">
                                        {t.emoji}
                                    </span>{" "}
                                    {t.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Time Accordion */}
                <div>
                    <button
                        className="w-full flex justify-between items-center cursor-pointer mb-4 border-none bg-none p-0 outline-none"
                        onClick={() => toggleCategory("time")}
                    >
                        <p className="text-[14px] font-bold text-brand-primary/80 tracking-widest uppercase mb-0">
                            TIME AVAILABLE
                        </p>
                        <div className="text-brand-primary/80">
                            {openCategories.time ? (
                                <FiChevronUp size={20} />
                            ) : (
                                <FiChevronDown size={20} />
                            )}
                        </div>
                    </button>
                    {openCategories.time && (
                        <div className="flex flex-wrap gap-3 slide-up">
                            {TIME_OPTIONS.map((t) => (
                                <button
                                    key={t.label}
                                    className={`px-4 py-2 md:px-5 md:py-2.5 rounded-button border text-[14px] md:text-[15px] font-semibold cursor-pointer transition-all ${
                                        selectedTime === t.label
                                            ? "bg-brand-secondary text-white border-brand-secondary shadow-md shadow-brand-secondary/20 hover:scale-105 hover:shadow-[0_0_18px_4px_rgba(160,58,19,0.45)]"
                                            : "bg-brand-card text-brand-primary/80 border-brand-primary/20 hover:border-brand-secondary hover:text-brand-secondary hover:scale-105 hover:shadow-[0_0_14px_3px_rgba(160,58,19,0.2)]"
                                    }`}
                                    onClick={() =>
                                        setSelectedTime(
                                            selectedTime === t.label
                                                ? ""
                                                : t.label,
                                        )
                                    }
                                >
                                    <span className="mr-2 opacity-90">
                                        {t.emoji}
                                    </span>{" "}
                                    {t.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Diet Accordion */}
                <div>
                    <button
                        className="w-full flex justify-between items-center cursor-pointer mb-4 border-none bg-none p-0 outline-none"
                        onClick={() => toggleCategory("diet")}
                    >
                        <p className="text-[14px] font-bold text-brand-primary/80 tracking-widest uppercase mb-0">
                            DIET
                        </p>
                        <div className="text-brand-primary/80">
                            {openCategories.diet ? (
                                <FiChevronUp size={20} />
                            ) : (
                                <FiChevronDown size={20} />
                            )}
                        </div>
                    </button>
                    {openCategories.diet && (
                        <div className="flex flex-wrap gap-3 slide-up">
                            {DIET_TAGS.map((t) => (
                                <button
                                    key={t.label}
                                    className={`px-4 py-2 md:px-5 md:py-2.5 rounded-button border text-[14px] md:text-[15px] font-semibold cursor-pointer transition-all ${
                                        selectedDiets.includes(t.label)
                                            ? "bg-brand-secondary text-white border-brand-secondary shadow-md shadow-brand-secondary/20 hover:scale-105 hover:shadow-[0_0_18px_4px_rgba(160,58,19,0.45)]"
                                            : "bg-brand-card text-brand-primary/80 border-brand-primary/20 hover:border-brand-secondary hover:text-brand-secondary hover:scale-105 hover:shadow-[0_0_14px_3px_rgba(160,58,19,0.2)]"
                                    }`}
                                    onClick={() =>
                                        toggleTag(
                                            selectedDiets,
                                            setSelectedDiets,
                                            t.label,
                                        )
                                    }
                                >
                                    <span className="mr-2 opacity-90">
                                        {t.emoji}
                                    </span>{" "}
                                    {t.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Spice Level Accordion */}
                <div>
                    <button
                        className="w-full flex justify-between items-center cursor-pointer mb-4 border-none bg-none p-0 outline-none"
                        onClick={() => toggleCategory("spice")}
                    >
                        <p className="text-[14px] font-bold text-brand-primary/80 tracking-widest uppercase mb-0">
                            SPICE LEVEL
                        </p>
                        <div className="text-brand-primary/80">
                            {openCategories.spice ? (
                                <FiChevronUp size={20} />
                            ) : (
                                <FiChevronDown size={20} />
                            )}
                        </div>
                    </button>
                    {openCategories.spice && (
                        <div className="flex flex-wrap gap-3 slide-up">
                            {SPICE_LEVELS.map((t) => (
                                <button
                                    key={t.label}
                                    className={`px-4 py-2 md:px-5 md:py-2.5 rounded-button border text-[14px] md:text-[15px] font-semibold cursor-pointer transition-all ${
                                        selectedSpice === t.label
                                            ? "bg-brand-secondary text-white border-brand-secondary shadow-md shadow-brand-secondary/20 hover:scale-105 hover:shadow-[0_0_18px_4px_rgba(160,58,19,0.45)]"
                                            : "bg-brand-card text-brand-primary/80 border-brand-primary/20 hover:border-brand-secondary hover:text-brand-secondary hover:scale-105 hover:shadow-[0_0_14px_3px_rgba(160,58,19,0.2)]"
                                    }`}
                                    onClick={() =>
                                        setSelectedSpice(
                                            selectedSpice === t.label
                                                ? ""
                                                : t.label,
                                        )
                                    }
                                >
                                    <span className="mr-2 opacity-90">
                                        {t.emoji}
                                    </span>{" "}
                                    {t.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Calories Accordion */}
                <div>
                    <button
                        className="w-full flex justify-between items-center cursor-pointer mb-4 border-none bg-none p-0 outline-none"
                        onClick={() => toggleCategory("calories")}
                    >
                        <p className="text-[14px] font-bold text-brand-primary/80 tracking-widest uppercase mb-0">
                            CALORIES
                        </p>
                        <div className="text-brand-primary/80">
                            {openCategories.calories ? (
                                <FiChevronUp size={20} />
                            ) : (
                                <FiChevronDown size={20} />
                            )}
                        </div>
                    </button>
                    {openCategories.calories && (
                        <div className="flex flex-wrap gap-3 slide-up">
                            {CALORIE_OPTIONS.map((t) => (
                                <button
                                    key={t.label}
                                    className={`px-4 py-2 md:px-5 md:py-2.5 rounded-button border text-[14px] md:text-[15px] font-semibold cursor-pointer transition-all ${
                                        selectedCalories === t.label
                                            ? "bg-brand-secondary text-white border-brand-secondary shadow-md shadow-brand-secondary/20 hover:scale-105 hover:shadow-[0_0_18px_4px_rgba(160,58,19,0.45)]"
                                            : "bg-brand-card text-brand-primary/80 border-brand-primary/20 hover:border-brand-secondary hover:text-brand-secondary hover:scale-105 hover:shadow-[0_0_14px_3px_rgba(160,58,19,0.2)]"
                                    }`}
                                    onClick={() =>
                                        setSelectedCalories(
                                            selectedCalories === t.label
                                                ? ""
                                                : t.label,
                                        )
                                    }
                                >
                                    <span className="mr-2 opacity-90">
                                        {t.emoji}
                                    </span>{" "}
                                    {t.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Servings Accordion */}
                <div>
                    <button
                        className="w-full flex justify-between items-center cursor-pointer mb-4 border-none bg-none p-0 outline-none"
                        onClick={() => toggleCategory("servings")}
                    >
                        <p className="text-[14px] font-bold text-brand-primary/80 tracking-widest uppercase mb-0">
                            SERVINGS
                        </p>
                        <div className="text-brand-primary/80">
                            {openCategories.servings ? (
                                <FiChevronUp size={20} />
                            ) : (
                                <FiChevronDown size={20} />
                            )}
                        </div>
                    </button>
                    {openCategories.servings && (
                        <div className="flex flex-wrap gap-3 slide-up">
                            {SERVING_OPTIONS.map((t) => (
                                <button
                                    key={t.label}
                                    className={`px-4 py-2 md:px-5 md:py-2.5 rounded-button border text-[14px] md:text-[15px] font-semibold cursor-pointer transition-all ${
                                        selectedServings === t.label
                                            ? "bg-brand-secondary text-white border-brand-secondary shadow-md shadow-brand-secondary/20 hover:scale-105 hover:shadow-[0_0_18px_4px_rgba(160,58,19,0.45)]"
                                            : "bg-brand-card text-brand-primary/80 border-brand-primary/20 hover:border-brand-secondary hover:text-brand-secondary hover:scale-105 hover:shadow-[0_0_14px_3px_rgba(160,58,19,0.2)]"
                                    }`}
                                    onClick={() =>
                                        setSelectedServings(
                                            selectedServings === t.label
                                                ? ""
                                                : t.label,
                                        )
                                    }
                                >
                                    <span className="mr-2 opacity-90">
                                        {t.emoji}
                                    </span>{" "}
                                    {t.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
