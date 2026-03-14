import { useState, useRef, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { FiCamera, FiCheck, FiArrowLeft } from "react-icons/fi";
import { AccountPersonalizationCard } from "../components/AccountPersonalizationCard";
import { AccountPantryCard } from "../components/AccountPantryCard";
import { userAPI } from "../lib/api";

export default function SettingsPage() {
    const { user, updateUser, navigate } = useApp();

    const [localUser, setLocalUser] = useState(user ? { ...user } : null);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [showDiscardModal, setShowDiscardModal] = useState(false);

    const [newAllergy, setNewAllergy] = useState("");
    const [newDislike, setNewDislike] = useState("");
    const [newPantryItem, setNewPantryItem] = useState("");

    const [editMode, setEditMode] = useState({
        age: true,
        experience: true,
        allergies: true,
        neverShowMe: true,
        pantry: true,
    });

    const profilePicRef = useRef(null);
    const coverPicRef = useRef(null);

    useEffect(() => {
        if (!user) {
            navigate("login");
        }
    }, [user, navigate]);

    if (!user || !localUser) return null;

    const handleLocalUpdate = (updates) => {
        setLocalUser((prev) => ({ ...prev, ...updates }));
        setHasUnsavedChanges(true);
    };

    const toggleEdit = (field) => {
        setEditMode((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    const handleSave = async () => {
        try {
            await userAPI.updateProfile({
                name: localUser.name,
                email: localUser.email,
                age: localUser.age,
                experience: localUser.experience,
                allergies: localUser.allergies,
                pantry: localUser.pantry,
                neverShowMe: localUser.neverShowMe,
                profilePic: localUser.profilePic,
                coverPic: localUser.coverPic,
            });
        } catch (err) {
            console.error("Failed to save profile:", err);
        }
        updateUser(localUser);
        setHasUnsavedChanges(false);
        navigate("account");
    };

    const handleCancel = () => {
        if (hasUnsavedChanges) {
            setShowDiscardModal(true);
        } else {
            navigate("account");
        }
    };

    const handleImageUpload = (e, type) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            if (type === "profile") {
                handleLocalUpdate({ profilePic: reader.result });
            } else if (type === "cover") {
                handleLocalUpdate({ coverPic: reader.result });
            }
        };
        reader.readAsDataURL(file);
    };

    const handleAddTag = (e, field, value, setter) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (!value.trim()) return;
            const currentList = localUser[field] || [];
            if (!currentList.includes(value.trim())) {
                handleLocalUpdate({ [field]: [...currentList, value.trim()] });
            }
            setter("");
        }
    };

    const handleRemoveTag = (field, value) => {
        const currentList = localUser[field] || [];
        handleLocalUpdate({ [field]: currentList.filter((t) => t !== value) });
    };

    return (
        <div className="min-h-screen bg-brand-bg pb-20">
            {/* Header / Cover Area */}
            <div
                className="relative px-6 py-10 md:py-16 border-b-[4px] border-brand-secondary group transition-colors"
                style={{
                    backgroundColor: user.coverPic
                        ? "transparent"
                        : "var(--brand-primary)",
                    backgroundImage: user.coverPic
                        ? `linear-gradient(rgba(30, 15, 0, 0.4), rgba(61, 32, 16, 0.8)), url(${user.coverPic})`
                        : "linear-gradient(to bottom right, var(--brand-primary), var(--brand-primary))",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                {/* Back Button */}
                <button
                    onClick={handleCancel}
                    className="absolute top-4 left-4 bg-black/40 hover:bg-black/60 text-white backdrop-blur-md px-3 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors z-20"
                >
                    <FiArrowLeft /> Back
                </button>

                {/* Cover Image Upload */}
                <button
                    className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 text-white backdrop-blur-md px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors z-20"
                    onClick={() => coverPicRef.current?.click()}
                >
                    <FiCamera /> Edit Cover
                </button>
                <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={coverPicRef}
                    onChange={(e) => handleImageUpload(e, "cover")}
                />

                <div className="max-w-[1000px] mx-auto flex flex-col items-center relative z-10 slide-up">
                    {/* Profile Avatar Upload */}
                    <button
                        className="relative group/avatar cursor-pointer border-none bg-none p-0 outline-none"
                        onClick={() => profilePicRef.current?.click()}
                    >
                        <div className="w-[80px] h-[80px] md:w-[100px] md:h-[100px] rounded-full bg-brand-secondary text-white flex items-center justify-center font-black text-[32px] md:text-[40px] shadow-xl mb-4 border-4 border-brand-bg/20 overflow-hidden relative">
                            {localUser.profilePic ? (
                                <img
                                    src={localUser.profilePic}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                (localUser.name && localUser.name[0]) ? (
                                    localUser.name[0].toUpperCase()
                                ) : (
                                    "U"
                                )
                            )}
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                                <FiCamera className="text-white text-2xl" />
                            </div>
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            ref={profilePicRef}
                            onChange={(e) => handleImageUpload(e, "profile")}
                        />
                    </button>

                    <h1 className="serif text-[32px] font-black text-brand-bg mb-2">
                        Settings
                    </h1>
                </div>
            </div>

            {/* Editing Forms */}
            <div className="max-w-[1000px] mx-auto px-6 mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Basic Info Card */}
                    <div className="card rounded-card p-6 slide-up">
                        <h2 className="serif text-[22px] font-black text-brand-primary mb-5">
                            Basic Information
                        </h2>
                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="block text-sm font-bold text-brand-primary/80 mb-2">
                                    Display Name
                                </label>
                                <input
                                    className="w-full bg-brand-bg border border-brand-primary/20 text-brand-primary font-medium rounded-xl px-4 py-3 focus:outline-none focus:border-brand-secondary transition-colors"
                                    value={localUser.name}
                                    onChange={(e) =>
                                        handleLocalUpdate({
                                            name: e.target.value,
                                        })
                                    }
                                    placeholder="Your Name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-brand-primary/80 mb-2">
                                    Email Address
                                </label>
                                <input
                                    className="w-full bg-brand-bg border border-brand-primary/20 text-brand-primary font-medium rounded-xl px-4 py-3 focus:outline-none focus:border-brand-secondary transition-colors"
                                    value={localUser.email}
                                    onChange={(e) =>
                                        handleLocalUpdate({
                                            email: e.target.value,
                                        })
                                    }
                                    placeholder="Email Address"
                                />
                            </div>
                        </div>
                    </div>

                    <AccountPersonalizationCard
                        user={localUser}
                        updateUser={handleLocalUpdate}
                        editMode={editMode}
                        toggleEdit={toggleEdit}
                        newAllergy={newAllergy}
                        setNewAllergy={setNewAllergy}
                        newDislike={newDislike}
                        setNewDislike={setNewDislike}
                        handleAddTag={handleAddTag}
                        handleRemoveTag={handleRemoveTag}
                        hideEditToggle={true}
                    />

                    <div className="lg:col-span-2 max-w-2xl mx-auto w-full">
                        <AccountPantryCard
                            user={localUser}
                            editMode={editMode}
                            toggleEdit={toggleEdit}
                            newPantryItem={newPantryItem}
                            setNewPantryItem={setNewPantryItem}
                            handleAddTag={handleAddTag}
                            handleRemoveTag={handleRemoveTag}
                            hideEditToggle={true}
                        />
                    </div>
                </div>

                {/* Global Save Button */}
                <div className="mt-12 flex justify-center slide-up">
                    <button
                        className="btn-primary px-12 py-4 rounded-xl text-[16px] shadow-xl hover:scale-105 transition-transform"
                        onClick={handleSave}
                    >
                        Save Profile Changes
                    </button>
                </div>
            </div>

            {/* Unsaved Changes Modal */}
            {showDiscardModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6 slide-up">
                    <div className="bg-brand-bg rounded-card max-w-sm w-full p-6 shadow-2xl scale-up border flex flex-col gap-4 border-brand-primary/10">
                        <h3 className="serif text-xl font-black text-brand-primary">
                            Unsaved Changes
                        </h3>
                        <p className="text-brand-primary/80 text-sm leading-relaxed">
                            You have unsaved changes to your profile. Do you
                            want to save them before leaving?
                        </p>
                        <div className="flex justify-end gap-3 mt-2">
                            <button
                                className="px-5 py-2.5 text-sm font-bold text-brand-primary/50 hover:text-brand-primary transition-colors hover:bg-black/5 rounded-xl"
                                onClick={() => setShowDiscardModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-5 py-2.5 text-sm font-bold bg-red-100 text-red-600 hover:bg-red-200 rounded-xl transition-colors"
                                onClick={() => {
                                    setHasUnsavedChanges(false);
                                    navigate("account");
                                }}
                            >
                                Discard
                            </button>
                            <button
                                className="px-5 py-2.5 text-sm font-bold bg-brand-secondary text-white hover:bg-brand-secondary/90 rounded-xl shadow-md transition-colors"
                                onClick={handleSave}
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
