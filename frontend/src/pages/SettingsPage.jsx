import { useState, useRef, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { FiCamera, FiCheck, FiArrowLeft, FiAlertCircle, FiEye, FiEyeOff, FiUser } from "react-icons/fi";
import { AccountPersonalizationCard } from "../components/AccountPersonalizationCard";
import { AccountPantryCard } from "../components/AccountPantryCard";
import { userAPI, authAPI } from "../lib/api";
import { resolvePic } from "../lib/utils";

export default function SettingsPage() {
    const { user, updateUser, navigate } = useApp();

    const [localUser, setLocalUser] = useState(user ? { ...user } : null);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [showDiscardModal, setShowDiscardModal] = useState(false);

    const [newAllergy, setNewAllergy] = useState("");
    const [newDislike, setNewDislike] = useState("");
    const [newPantryItem, setNewPantryItem] = useState("");
    const [profileFile, setProfileFile] = useState(null);
    const [coverFile, setCoverFile] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    const [editMode, setEditMode] = useState({
        age: true,
        experience: true,
        allergies: true,
        neverShowMe: true,
        pantry: true,
    });

    const profilePicRef = useRef(null);
    const coverPicRef = useRef(null);

    // Password Reset States
    const [pwdModalStep, setPwdModalStep] = useState(null); // 'request', 'code', 'done'
    const [pwdCode, setPwdCode] = useState("");
    const [pwdNewPassword, setPwdNewPassword] = useState("");
    const [pwdShowNewPassword, setPwdShowNewPassword] = useState(false);
    const [pwdError, setPwdError] = useState("");
    const [pwdLoading, setPwdLoading] = useState(false);

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
        setIsSaving(true);
        try {
            if (profileFile || coverFile) {
                const formData = new FormData();
                if (profileFile) formData.append("profilePic", profileFile);
                if (coverFile) formData.append("coverPic", coverFile);
                
                const imgRes = await userAPI.updateImages(formData);
                if (imgRes.data) {
                    localUser.profilePic = imgRes.data.profilePic || localUser.profilePic;
                    localUser.coverPic = imgRes.data.coverPic || localUser.coverPic;
                }
            }

            await userAPI.updateProfile({
                name: localUser.name,
                email: localUser.email,
                age: localUser.age,
                experience: localUser.experience,
                allergies: localUser.allergies,
                pantry: localUser.pantry,
                neverShowMe: localUser.neverShowMe,
                cookDays: localUser.cookDays, // Sync cookDays
                xp: localUser.xp,
                level: localUser.level,
                profilePic: localUser.profilePic,
                coverPic: localUser.coverPic,
            });

            updateUser(localUser);
            setHasUnsavedChanges(false);
            navigate("account");
        } catch (err) {
            console.error("Failed to save profile:", err);
            alert("Error saving profile changes. Please try again.");
        } finally {
            setIsSaving(false);
        }
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

        if (type === "profile") setProfileFile(file);
        if (type === "cover") setCoverFile(file);

        const reader = new FileReader();
        reader.onloadend = () => {
            handleLocalUpdate({ 
                [type === "profile" ? "profilePic" : "coverPic"]: reader.result 
            });
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

    // ====== PASSWORD RESET HANDLERS ======
    const requestPasswordReset = async () => {
        setPwdError("");
        setPwdLoading(true);
        try {
            await authAPI.forgotPassword({ email: user.email });
            setPwdModalStep("code");
            setPwdLoading(false);
        } catch (err) {
            setPwdLoading(false);
            if (err.response?.status === 400 && err.response?.data?.message?.includes("Google Sign-In")) {
                setPwdError("This account is linked to Google. Password change is not applicable.");
                setPwdModalStep("error");
            } else {
                setPwdError(err.response?.data?.message || "Failed to request password reset.");
                setPwdModalStep("error");
            }
        }
    };

    const submitPasswordReset = async (e) => {
        e.preventDefault();
        setPwdError("");
        if (!pwdCode || !pwdNewPassword) {
            return setPwdError("Please fill in all fields.");
        }
        if (pwdNewPassword.length < 6) {
            return setPwdError("Password must be at least 6 characters.");
        }
        setPwdLoading(true);
        try {
            await authAPI.resetPassword({
                email: user.email,
                code: pwdCode,
                newPassword: pwdNewPassword,
            });
            setPwdModalStep("done");
            setPwdLoading(false);
        } catch (err) {
            setPwdLoading(false);
            setPwdError(err.response?.data?.message || "Something went wrong.");
        }
    };

    const closePwdModal = () => {
        setPwdModalStep(null);
        setPwdCode("");
        setPwdNewPassword("");
        setPwdError("");
    };

    return (
        <div className="min-h-screen bg-brand-bg pb-4 md:pb-20 has-bottom-nav">
            {/* Header / Cover Area */}
            <div
                className="relative px-6 py-10 md:py-16 border-b-[4px] border-brand-secondary group transition-colors"
                style={{
                    backgroundColor: user.coverPic
                        ? "transparent"
                        : "var(--brand-primary)",
                    backgroundImage: localUser.coverPic
                        ? `linear-gradient(rgba(30, 15, 0, 0.4), rgba(61, 32, 16, 0.8)), url(${resolvePic(localUser.coverPic)})`
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
                <div className="absolute top-4 right-4 flex flex-col items-end gap-2 z-20">
                    <button
                        className="bg-black/40 hover:bg-black/60 text-white backdrop-blur-md px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer"
                        onClick={() => coverPicRef.current?.click()}
                    >
                        <FiCamera /> Edit Cover
                    </button>
                    {localUser.coverPic && (
                        <button
                            className="bg-black/40 hover:bg-red-500/80 text-white backdrop-blur-md px-3 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
                            onClick={() => {
                                setCoverFile(null);
                                handleLocalUpdate({ coverPic: "" });
                            }}
                        >
                            Remove Cover
                        </button>
                    )}
                </div>
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
                                    src={resolvePic(localUser.profilePic)}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <FiUser className="w-1/2 h-1/2 opacity-80" />
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

                    {localUser.profilePic && (
                        <button
                            className="text-white bg-black/40 hover:bg-black/60 px-3 py-1 rounded-lg text-xs font-bold transition-colors mb-4 backdrop-blur-sm flex items-center gap-1.5 cursor-pointer"
                            onClick={() => {
                                setProfileFile(null);
                                handleLocalUpdate({ profilePic: "" });
                            }}
                        >
                            Remove Picture
                        </button>
                    )}

                    <h1 className="serif text-[32px] font-black text-brand-bg mb-2">
                        Settings
                    </h1>
                </div>
            </div>

            {/* Editing Forms */}
            <div className="max-w-[1000px] mx-auto px-4 md:px-6 mt-6 md:mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Basic Info Card */}
                    <div className="card rounded-card p-6 slide-up flex flex-col justify-between">
                        <div>
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
                                        disabled // Don't allow changing email as it's the primary key for auth
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Security Section embedded inside Basic Info */}
                        <div className="mt-8 pt-6 border-t border-brand-primary/10">
                            <h3 className="text-sm font-black text-brand-primary mb-2">Security</h3>
                            <p className="text-xs text-brand-primary/60 mb-4 leading-relaxed">
                                Need to change your password? We will send a verification code to <strong>{user.email}</strong>.
                            </p>
                            <button
                                className="px-5 py-2.5 text-sm font-bold text-brand-primary bg-brand-primary/5 hover:bg-brand-primary/10 transition-colors active:scale-[0.98] rounded-xl cursor-pointer disabled:opacity-50"
                                onClick={() => {
                                    setPwdModalStep("request");
                                    requestPasswordReset();
                                }}
                                disabled={pwdLoading || pwdModalStep === "request"}
                            >
                                {pwdModalStep === "request" && pwdLoading ? "Sending Code..." : "Change Password"}
                            </button>
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

                {/* Desktop Save Button */}
                <div className="mt-12 hidden md:flex justify-center slide-up">
                    <button
                        className="btn-primary px-12 py-4 rounded-xl text-[16px] shadow-xl hover:scale-105 transition-transform disabled:opacity-50 disabled:scale-100"
                        onClick={handleSave}
                        disabled={isSaving}
                    >
                        {isSaving ? "Saving..." : "Save Profile Changes"}
                    </button>
                </div>

                {/* Mobile Sticky Save Bar */}
                <div className="md:hidden fixed bottom-[72px] left-0 right-0 bg-brand-card/95 backdrop-blur-xl border-t border-brand-primary/10 p-3 z-40 pb-safe">
                    <button
                        className="w-full h-[50px] bg-brand-secondary text-white rounded-xl font-bold text-[15px] shadow-md disabled:opacity-50 active:scale-[0.98] transition-all cursor-pointer"
                        onClick={handleSave}
                        disabled={isSaving}
                    >
                        {isSaving ? "Saving..." : "Save Profile Changes"}
                    </button>
                </div>
            </div>

            {/* Unsaved Changes Modal */}
            {showDiscardModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-6 slide-up">
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
                                className="px-5 py-2.5 text-sm font-bold text-brand-primary/50 hover:text-brand-primary transition-colors hover:bg-black/5 rounded-xl cursor-pointer"
                                onClick={() => setShowDiscardModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-5 py-2.5 text-sm font-bold bg-red-100 text-red-600 hover:bg-red-200 rounded-xl transition-colors cursor-pointer"
                                onClick={() => {
                                    setHasUnsavedChanges(false);
                                    navigate("account");
                                }}
                            >
                                Discard
                            </button>
                            <button
                                className="px-5 py-2.5 text-sm font-bold bg-brand-secondary text-white hover:bg-brand-secondary/90 rounded-xl shadow-md transition-colors cursor-pointer"
                                onClick={handleSave}
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Password Reset Modal */}
            {(pwdModalStep === "code" || pwdModalStep === "error" || pwdModalStep === "done") && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm p-6">
                    <div className="bg-brand-bg rounded-2xl max-w-[400px] w-full p-7 md:p-8 shadow-2xl border border-brand-primary/10 scale-up">
                        {pwdModalStep === "error" && (
                            <div className="text-center">
                                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-5">
                                    <FiAlertCircle className="text-red-500" size={32} />
                                </div>
                                <h3 className="serif text-xl font-black text-brand-primary mb-2">Oops!</h3>
                                <p className="text-sm text-brand-primary/80 mb-6">{pwdError}</p>
                                <button
                                    className="btn-primary w-full py-3.5 rounded-[11px] text-[15px]"
                                    onClick={closePwdModal}
                                >
                                    Close
                                </button>
                            </div>
                        )}

                        {pwdModalStep === "code" && (
                            <>
                                <h3 className="serif text-2xl font-black text-brand-primary mb-2">Enter reset code</h3>
                                <p className="text-sm text-brand-primary/80 mb-6">
                                    We sent a 6-digit code to <strong>{user.email}</strong>. Check your inbox and spam folder.
                                </p>
                                <form onSubmit={submitPasswordReset}>
                                    <div className="mb-4">
                                        <label className="text-xs font-semibold text-brand-primary/80 block mb-1.5">
                                            6-Digit Code
                                        </label>
                                        <input
                                            className="w-full bg-brand-bg border border-brand-primary/20 text-brand-primary font-mono text-center tracking-[0.3em] text-lg rounded-xl px-4 py-3 focus:outline-none focus:border-brand-secondary transition-colors"
                                            type="text"
                                            placeholder="000000"
                                            maxLength={6}
                                            value={pwdCode}
                                            onChange={(e) => setPwdCode(e.target.value.replace(/\D/g, ""))}
                                            autoFocus
                                        />
                                    </div>
                                    <div className="mb-6">
                                        <label className="text-xs font-semibold text-brand-primary/80 block mb-1.5">
                                            New Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                className="w-full bg-brand-bg border border-brand-primary/20 text-brand-primary font-medium rounded-xl px-4 py-3 pr-10 focus:outline-none focus:border-brand-secondary transition-colors text-sm"
                                                type={pwdShowNewPassword ? "text" : "password"}
                                                placeholder="••••••••"
                                                value={pwdNewPassword}
                                                onChange={(e) => setPwdNewPassword(e.target.value)}
                                            />
                                            <button
                                                type="button"
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-primary/50 hover:text-brand-primary transition-colors focus:outline-none cursor-pointer"
                                                onClick={() => setPwdShowNewPassword(!pwdShowNewPassword)}
                                            >
                                                {pwdShowNewPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                                            </button>
                                        </div>
                                    </div>
                                    {pwdError && (
                                        <p className="text-brand-accent text-[13px] mb-4 flex items-center gap-1.5 font-semibold">
                                            <FiAlertCircle className="text-sm stroke-[2.5]" /> {pwdError}
                                        </p>
                                    )}
                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            className="flex-1 py-3.5 rounded-xl text-sm font-bold text-brand-primary/60 bg-brand-primary/5 hover:bg-brand-primary/10 transition-colors cursor-pointer"
                                            onClick={closePwdModal}
                                            disabled={pwdLoading}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 btn-primary py-3.5 rounded-xl text-[15px]"
                                            disabled={pwdLoading}
                                        >
                                            {pwdLoading ? "Saving..." : "Update"}
                                        </button>
                                    </div>
                                </form>
                            </>
                        )}

                        {pwdModalStep === "done" && (
                            <div className="text-center">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                                    <span className="text-green-600 text-3xl">✓</span>
                                </div>
                                <h3 className="serif text-xl font-black text-brand-primary mb-2">Password Updated!</h3>
                                <p className="text-sm text-brand-primary/80 mb-6">Your password has been changed successfully.</p>
                                <button
                                    className="btn-primary w-full py-3.5 rounded-[11px] text-[15px]"
                                    onClick={closePwdModal}
                                >
                                    Done
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
