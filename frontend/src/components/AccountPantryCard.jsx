import { FiCheck, FiEdit2, FiX } from "react-icons/fi";
import { FaFire } from "react-icons/fa";

export function AccountPantryCard({
    user,
    editMode,
    toggleEdit,
    newPantryItem,
    setNewPantryItem,
    handleAddTag,
    handleRemoveTag,
    hideEditToggle,
}) {
    return (
        <div className="card slide-up stagger-2 rounded-card p-6">
            <h2 className="serif text-[22px] font-black text-brand-primary mb-5">
                My Pantry
            </h2>
            <div className="flex flex-col gap-5">
                {/* Pantry Row */}
                <div className="flex sm:items-center justify-between py-2 border-b border-brand-primary/10 last:border-0 flex-col sm:flex-row gap-2 sm:gap-0">
                    <div className="flex items-center justify-between sm:justify-start w-full sm:w-auto">
                        <div className="flex flex-col">
                            <label className="text-sm font-semibold text-brand-primary/80 mr-4">
                                Basics you always have
                            </label>
                        </div>
                        {!hideEditToggle && (
                            <button
                                className="text-brand-primary/50 hover:text-brand-secondary transition-colors ml-1 sm:hidden"
                                onClick={() => toggleEdit("pantry")}
                                title={editMode.pantry ? "Save" : "Edit"}
                            >
                                {editMode.pantry ? (
                                    <FiCheck size={18} />
                                ) : (
                                    <FiEdit2 size={16} />
                                )}
                            </button>
                        )}
                    </div>

                    <div className="flex flex-col sm:items-end gap-2 flex-1">
                        <div className="flex items-center gap-2 justify-start sm:justify-end w-full">
                            {editMode.pantry && (
                                <input
                                    className="input-field w-full sm:max-w-[180px] px-3 py-1.5 rounded-lg text-sm text-brand-primary bg-white border border-brand-accent outline-none"
                                    placeholder="Press Enter to add"
                                    value={newPantryItem}
                                    onChange={(e) =>
                                        setNewPantryItem(e.target.value)
                                    }
                                    onKeyDown={(e) =>
                                        handleAddTag(
                                            e,
                                            "pantry",
                                            newPantryItem,
                                            setNewPantryItem,
                                        )
                                    }
                                />
                            )}
                            {!hideEditToggle && (
                                <button
                                    className="text-brand-primary/50 hover:text-brand-secondary transition-colors ml-1 hidden sm:block"
                                    onClick={() => toggleEdit("pantry")}
                                    title={editMode.pantry ? "Save" : "Edit"}
                                >
                                    {editMode.pantry ? (
                                        <FiCheck size={18} />
                                    ) : (
                                        <FiEdit2 size={16} />
                                    )}
                                </button>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-1.5 justify-start sm:justify-end">
                            {!editMode.pantry &&
                                (!user.pantry || user.pantry.length === 0) && (
                                    <span className="text-sm font-bold text-brand-primary/50">
                                        None
                                    </span>
                                )}
                            {(user.pantry || []).map((t) => (
                                <span
                                    key={t}
                                    className="tag text-[14px]! flex items-center gap-1 bg-brand-primary/5 border-brand-primary/10"
                                >
                                    {t}
                                    {editMode.pantry && (
                                        <button
                                            className="bg-none border-none cursor-pointer p-0 flex items-center justify-center hover:text-brand-secondary transition-colors"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRemoveTag("pantry", t);
                                            }}
                                        >
                                            <FiX />
                                        </button>
                                    )}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
