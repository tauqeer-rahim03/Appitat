import { useState, useCallback } from "react";
import { FiFilter, FiChevronUp, FiChevronDown, FiX } from "react-icons/fi";
import { createPortal } from "react-dom";
import {
    CUISINE_TAGS,
    DIET_TAGS,
    TIME_OPTIONS,
    SPICE_LEVELS,
    CALORIE_OPTIONS,
    SERVING_OPTIONS,
    MEAL_TYPES,
} from "../../data/constants";

function FilterContent({
    openCategories,
    toggleCategory,
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
    toggleTag,
    isMobile = false,
}) {
    const tagBtnClass = (isActive) =>
        `px-4 py-2.5 ${isMobile ? "min-h-[44px]" : "md:px-5 md:py-2.5"} rounded-button border text-[14px] md:text-[15px] font-semibold cursor-pointer transition-all active:scale-95 ${
            isActive
                ? "bg-brand-secondary text-white border-brand-secondary shadow-md shadow-brand-secondary/20"
                : "bg-brand-card text-brand-primary/80 border-brand-primary/20 hover:border-brand-secondary hover:text-brand-secondary"
        }`;

    const categories = [
        { key: "mealType", label: "MEAL TYPE", items: MEAL_TYPES, type: "single", value: selectedMealType, setter: setSelectedMealType },
        { key: "cuisine", label: "CUISINE", items: CUISINE_TAGS, type: "multi", value: selectedCuisines, setter: setSelectedCuisines },
        { key: "time", label: "TIME AVAILABLE", items: TIME_OPTIONS, type: "single", value: selectedTime, setter: setSelectedTime },
        { key: "diet", label: "DIET", items: DIET_TAGS, type: "multi", value: selectedDiets, setter: setSelectedDiets },
        { key: "spice", label: "SPICE LEVEL", items: SPICE_LEVELS, type: "single", value: selectedSpice, setter: setSelectedSpice },
        { key: "calories", label: "CALORIES", items: CALORIE_OPTIONS, type: "single", value: selectedCalories, setter: setSelectedCalories },
        { key: "servings", label: "SERVINGS", items: SERVING_OPTIONS, type: "single", value: selectedServings, setter: setSelectedServings },
    ];

    return (
        <div className="flex flex-col gap-5 md:gap-6">
            {categories.map(({ key, label, items, type, value, setter }) => (
                <div key={key}>
                    <button
                        className="w-full flex justify-between items-center cursor-pointer mb-3 md:mb-4 border-none bg-none p-0 outline-none"
                        onClick={() => toggleCategory(key)}
                    >
                        <p className="text-[13px] md:text-[14px] font-bold text-brand-primary/80 tracking-widest uppercase mb-0 flex items-center gap-2">
                            {label}
                        </p>
                        <div className="text-brand-primary/80">
                            {openCategories[key] ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
                        </div>
                    </button>
                    {openCategories[key] && (
                        <div className="flex flex-wrap gap-2.5 md:gap-3 slide-up">
                            {items.map((t) => {
                                const isActive = type === "multi"
                                    ? value.includes(t.label)
                                    : value === t.label;
                                return (
                                    <button
                                        key={t.label}
                                        className={tagBtnClass(isActive)}
                                        onClick={() =>
                                            type === "multi"
                                                ? toggleTag(value, setter, t.label)
                                                : setter(value === t.label ? "" : t.label)
                                        }
                                    >
                                        <span className="mr-1.5 opacity-90">{t.emoji}</span> {t.label}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

export function DashboardPreferencesSidebar({
    activeFiltersCount,
    showMobileFilters,
    setShowMobileFilters,
    openCategories,
    toggleCategory,
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
    toggleTag,
}) {
    const [isClosing, setIsClosing] = useState(false);

    const filterProps = {
        openCategories, toggleCategory,
        selectedCuisines, setSelectedCuisines,
        selectedDiets, setSelectedDiets,
        selectedTime, setSelectedTime,
        selectedSpice, setSelectedSpice,
        selectedCalories, setSelectedCalories,
        selectedServings, setSelectedServings,
        selectedMealType, setSelectedMealType,
        toggleTag,
    };

    const handleClose = useCallback(() => {
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
            setShowMobileFilters(false);
        }, 280);
    }, [setShowMobileFilters]);

    return (
        <div className="flex flex-col gap-0 lg:gap-6 w-full">
            {/* Mobile: Filter trigger button */}
            <button
                className="w-full flex items-center justify-between cursor-pointer lg:cursor-default border-none bg-none p-0 outline-none"
                onClick={() => {
                    if (window.innerWidth < 1024) setShowMobileFilters(!showMobileFilters);
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
                    {showMobileFilters ? <FiChevronUp size={24} /> : <FiChevronDown size={24} />}
                </div>
            </button>

            {/* Desktop: Inline filters (unchanged) */}
            <div className="hidden lg:flex flex-col gap-6 mt-0">
                <FilterContent {...filterProps} />
            </div>

            {/* Mobile: Bottom Sheet */}
            {showMobileFilters && createPortal(
                <div className="lg:hidden fixed inset-0 z-[60]">
                    {/* Backdrop */}
                    <div
                        className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${isClosing ? "opacity-0" : "opacity-100 backdrop-enter"}`}
                        onClick={handleClose}
                    />
                    {/* Sheet */}
                    <div className={`absolute bottom-0 left-0 right-0 bg-brand-bg rounded-t-[28px] max-h-[85vh] flex flex-col pb-safe shadow-2xl ${isClosing ? "sheet-exit" : "sheet-enter"}`}>
                        {/* Drag handle */}
                        <div className="flex justify-center pt-3 pb-1">
                            <div className="w-10 h-1 rounded-full bg-brand-primary/20" />
                        </div>
                        {/* Header */}
                        <div className="flex items-center justify-between px-5 py-3 border-b border-brand-primary/10">
                            <h3 className="serif text-[20px] font-black text-brand-primary flex items-center gap-2">
                                <FiFilter className="text-brand-secondary" />
                                Preferences
                                {activeFiltersCount > 0 && (
                                    <span className="bg-brand-secondary text-white text-[11px] w-5 h-5 flex items-center justify-center rounded-full">
                                        {activeFiltersCount}
                                    </span>
                                )}
                            </h3>
                            <button
                                onClick={handleClose}
                                className="w-9 h-9 rounded-full bg-brand-primary/5 flex items-center justify-center text-brand-primary hover:bg-brand-primary/10 transition-colors cursor-pointer"
                            >
                                <FiX size={20} />
                            </button>
                        </div>
                        {/* Scrollable content */}
                        <div className="flex-1 overflow-y-auto px-5 py-5 hide-scrollbar">
                            <FilterContent {...filterProps} isMobile={true} />
                        </div>
                        {/* Done button */}
                        <div className="px-5 py-4 border-t border-brand-primary/10">
                            <button
                                onClick={handleClose}
                                className="w-full h-[50px] bg-brand-primary text-brand-bg rounded-xl font-bold text-[15px] active:scale-[0.98] transition-transform cursor-pointer"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
