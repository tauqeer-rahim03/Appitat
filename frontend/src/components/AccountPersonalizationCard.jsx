import { FiCheck, FiEdit2, FiX } from "react-icons/fi";

export function AccountPersonalizationCard({
    user,
    updateUser,
    editMode,
    toggleEdit,
    newAllergy,
    setNewAllergy,
    newDislike,
    setNewDislike,
    handleAddTag,
    handleRemoveTag,
    hideEditToggle,
}) {
    return (
        <div className="card slide-up stagger-2 rounded-card p-6">
            <h2 className="serif text-[22px] font-black text-brand-primary mb-5">
                Personalization
            </h2>
            <div className="flex flex-col gap-5">
                {/* Age Row */}
                <div className="flex items-center justify-between py-2 border-b border-brand-primary/10 last:border-0">
                    <label className="text-sm font-semibold text-brand-primary/80 mr-4">
                        Age
                    </label>
                    <div className="flex items-center gap-2">
                        {!editMode.age ? (
                            <span className="text-sm font-bold text-brand-primary">
                                {user.age || "Not set"}
                            </span>
                        ) : (
                            <input
                                type="number"
                                className="input-field w-24 px-3 py-1.5 rounded-lg text-sm text-brand-primary bg-brand-card border border-brand-accent outline-none text-right"
                                placeholder="Age"
                                value={user.age || ""}
                                onChange={(e) =>
                                    updateUser({ age: e.target.value })
                                }
                            />
                        )}
                        {!hideEditToggle && (
                            <button
                                className="text-brand-primary/50 hover:text-brand-secondary transition-colors ml-1"
                                onClick={() => toggleEdit("age")}
                                title={editMode.age ? "Save" : "Edit"}
                            >
                                {editMode.age ? (
                                    <FiCheck size={18} />
                                ) : (
                                    <FiEdit2 size={16} />
                                )}
                            </button>
                        )}
                    </div>
                </div>

                {/* Experience Row */}
                <div className="flex items-center justify-between py-2 border-b border-brand-primary/10 last:border-0">
                    <label className="text-sm font-semibold text-brand-primary/80 mr-4">
                        Cooking Experience
                    </label>
                    <div className="flex items-center gap-2">
                        {!editMode.experience ? (
                            <span className="text-sm font-bold text-brand-primary capitalize">
                                {user.experience || "Not set"}
                            </span>
                        ) : (
                            <select
                                className="input-field px-3 py-1.5 rounded-lg text-sm text-brand-primary bg-brand-card border border-brand-accent outline-none"
                                value={user.experience || ""}
                                onChange={(e) =>
                                    updateUser({ experience: e.target.value })
                                }
                            >
                                <option value="" disabled>
                                    Select level
                                </option>
                                <option value="beginner">Beginner</option>
                                <option value="intermediate">
                                    Intermediate
                                </option>
                                <option value="advanced">Advanced</option>
                                <option value="pro">Professional</option>
                            </select>
                        )}
                        {!hideEditToggle && (
                            <button
                                className="text-brand-primary/50 hover:text-brand-secondary transition-colors ml-1"
                                onClick={() => toggleEdit("experience")}
                                title={editMode.experience ? "Save" : "Edit"}
                            >
                                {editMode.experience ? (
                                    <FiCheck size={18} />
                                ) : (
                                    <FiEdit2 size={16} />
                                )}
                            </button>
                        )}
                    </div>
                </div>

                {/* Allergies Row */}
                <div className="flex sm:items-center justify-between py-2 border-b border-brand-primary/10 last:border-0 flex-col sm:flex-row gap-2 sm:gap-0">
                    <div className="flex items-center justify-between sm:justify-start w-full sm:w-auto">
                        <label className="text-sm font-semibold text-brand-primary/80 mr-4">
                            Allergies
                        </label>
                        {!hideEditToggle && (
                            <button
                                className="text-brand-primary/50 hover:text-brand-secondary transition-colors ml-1 sm:hidden"
                                onClick={() => toggleEdit("allergies")}
                                title={editMode.allergies ? "Save" : "Edit"}
                            >
                                {editMode.allergies ? (
                                    <FiCheck size={18} />
                                ) : (
                                    <FiEdit2 size={16} />
                                )}
                            </button>
                        )}
                    </div>

                    <div className="flex flex-col sm:items-end gap-2 flex-1">
                        <div className="flex items-center gap-2 justify-start sm:justify-end w-full">
                            {editMode.allergies && (
                                <input
                                    className="input-field w-full sm:max-w-[180px] px-3 py-1.5 rounded-lg text-sm text-brand-primary bg-brand-card border border-brand-accent outline-none"
                                    placeholder="Press Enter to add"
                                    value={newAllergy}
                                    onChange={(e) =>
                                        setNewAllergy(e.target.value)
                                    }
                                    onKeyDown={(e) =>
                                        handleAddTag(
                                            e,
                                            "allergies",
                                            newAllergy,
                                            setNewAllergy,
                                        )
                                    }
                                />
                            )}
                            {!hideEditToggle && (
                                <button
                                    className="text-brand-primary/50 hover:text-brand-secondary transition-colors ml-1 hidden sm:block"
                                    onClick={() => toggleEdit("allergies")}
                                    title={editMode.allergies ? "Save" : "Edit"}
                                >
                                    {editMode.allergies ? (
                                        <FiCheck size={18} />
                                    ) : (
                                        <FiEdit2 size={16} />
                                    )}
                                </button>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-1.5 justify-start sm:justify-end">
                            {!editMode.allergies &&
                                (!user.allergies ||
                                    user.allergies.length === 0) && (
                                    <span className="text-sm font-bold text-brand-primary/50">
                                        None
                                    </span>
                                )}
                            {(user.allergies || []).map((t) => (
                                <span
                                    key={t}
                                    className="tag text-[14px]! flex items-center gap-1 bg-red-100 text-red-800 border-red-200"
                                >
                                    {t}
                                    {editMode.allergies && (
                                        <button
                                            className="bg-none border-none cursor-pointer p-0 flex items-center justify-center hover:text-red-500 transition-colors"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRemoveTag("allergies", t);
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

                {/* Never Show Me Row */}
                <div className="flex sm:items-center justify-between py-2 border-b border-brand-primary/10 last:border-0 flex-col sm:flex-row gap-2 sm:gap-0">
                    <div className="flex items-center justify-between sm:justify-start w-full sm:w-auto">
                        <label className="text-sm font-semibold text-brand-primary/80 mr-4">
                            Never Show Me
                        </label>
                        {!hideEditToggle && (
                            <button
                                className="text-brand-primary/50 hover:text-brand-secondary transition-colors ml-1 sm:hidden"
                                onClick={() => toggleEdit("neverShowMe")}
                                title={editMode.neverShowMe ? "Save" : "Edit"}
                            >
                                {editMode.neverShowMe ? (
                                    <FiCheck size={18} />
                                ) : (
                                    <FiEdit2 size={16} />
                                )}
                            </button>
                        )}
                    </div>

                    <div className="flex flex-col sm:items-end gap-2 flex-1">
                        <div className="flex items-center gap-2 justify-start sm:justify-end w-full">
                            {editMode.neverShowMe && (
                                <input
                                    className="input-field w-full sm:max-w-[180px] px-3 py-1.5 rounded-lg text-sm text-brand-primary bg-brand-card border border-brand-accent outline-none"
                                    placeholder="Press Enter to add"
                                    value={newDislike}
                                    onChange={(e) =>
                                        setNewDislike(e.target.value)
                                    }
                                    onKeyDown={(e) =>
                                        handleAddTag(
                                            e,
                                            "neverShowMe",
                                            newDislike,
                                            setNewDislike,
                                        )
                                    }
                                />
                            )}
                            {!hideEditToggle && (
                                <button
                                    className="text-brand-primary/50 hover:text-brand-secondary transition-colors ml-1 hidden sm:block"
                                    onClick={() => toggleEdit("neverShowMe")}
                                    title={
                                        editMode.neverShowMe ? "Save" : "Edit"
                                    }
                                >
                                    {editMode.neverShowMe ? (
                                        <FiCheck size={18} />
                                    ) : (
                                        <FiEdit2 size={16} />
                                    )}
                                </button>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-1.5 justify-start sm:justify-end">
                            {!editMode.neverShowMe &&
                                (!user.neverShowMe ||
                                    user.neverShowMe.length === 0) && (
                                    <span className="text-sm font-bold text-brand-primary/50">
                                        None
                                    </span>
                                )}
                            {(user.neverShowMe || []).map((t) => (
                                <span
                                    key={t}
                                    className="tag !text-[14px] flex items-center gap-1 bg-red-100 text-red-800 border-red-200"
                                >
                                    {t}
                                    {editMode.neverShowMe && (
                                        <button
                                            className="bg-none border-none cursor-pointer p-0 flex items-center justify-center hover:text-red-500 transition-colors"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRemoveTag(
                                                    "neverShowMe",
                                                    t,
                                                );
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
