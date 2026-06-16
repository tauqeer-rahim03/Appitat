import { useState, useCallback } from "react";
import { useApp } from "../context/AppContext";
import { FaUtensils } from "react-icons/fa6";
import { FiAlertCircle, FiEye, FiEyeOff, FiArrowLeft, FiCheckCircle } from "react-icons/fi";
import { authAPI } from "../lib/api";
import { GoogleLogin } from '@react-oauth/google';

export default function AuthPage({ mode }) {
    const { user, navigate, login } = useApp();
    const [isLogin, setIsLogin] = useState(mode === "login");
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [successAnim, setSuccessAnim] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [greetName, setGreetName] = useState("");

    // Verification step state
    const [verifyStep, setVerifyStep] = useState(false);
    const [verifyCode, setVerifyCode] = useState("");

    // Forgot password state: null | 'email' | 'code' | 'done'
    const [forgotStep, setForgotStep] = useState(null);
    const [resetEmail, setResetEmail] = useState("");
    const [resetCode, setResetCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");

    const handle = useCallback(
        async (e) => {
            e.preventDefault();
            setError("");
            if (!form.email || !form.password)
                return setError("Please fill in all fields.");
            if (!isLogin && !form.name) return setError("Name is required.");

            setLoading(true);
            try {
                let response;
                if (isLogin) {
                    response = await authAPI.login({
                        email: form.email,
                        password: form.password,
                    });
                    if (response.data.unverified) {
                        setVerifyStep(true);
                        setLoading(false);
                        return;
                    }
                    const { token, user: userData } = response.data;
                    const resolvedName = userData?.name || form.email.split("@")[0];
                    setGreetName(resolvedName);
                    localStorage.setItem("appitat_token", token);
                    login(
                        userData || {
                            name: resolvedName,
                            email: form.email,
                        },
                        token,
                    );
                } else {
                    response = await authAPI.signup({
                        username: form.name,
                        email: form.email,
                        password: form.password,
                    });
                    if (response.data.unverified) {
                        setVerifyStep(true);
                        setLoading(false);
                        return;
                    }
                    setIsLogin(true);
                    setLoading(false);
                    return;
                }

                setSuccessAnim(true);
                setLoading(false);

                setTimeout(() => {
                    navigate("dashboard");
                }, 3000);
            } catch (err) {
                setLoading(false);
                if (err.response?.data?.unverified) {
                    setVerifyStep(true);
                    setError("Please verify your email address. A new code has been sent.");
                    return;
                }
                setError(
                    err.response?.data?.message ||
                        "An error occurred during authentication.",
                );
            }
        },
        [form, isLogin, login, navigate],
    );

    const handleGoogleSuccess = async (credentialResponse) => {
        setLoading(true);
        setError("");
        try {
            const response = await authAPI.googleLogin({
                token: credentialResponse.credential,
            });
            const { token, user: userData } = response.data;
            const resolvedName = userData?.name || "Chef";
            setGreetName(resolvedName);
            localStorage.setItem("appitat_token", token);
            login(userData, token);
            setSuccessAnim(true);
            setLoading(false);
            setTimeout(() => {
                navigate("dashboard");
            }, 3000);
        } catch (err) {
            setLoading(false);
            setError(
                err.response?.data?.message ||
                    "An error occurred during Google authentication.",
            );
        }
    };

    const handleForgotSubmitEmail = async (e) => {
        e.preventDefault();
        setError("");
        if (!resetEmail) return setError("Please enter your email.");
        setLoading(true);
        try {
            await authAPI.forgotPassword({ email: resetEmail });
            setForgotStep("code");
            setLoading(false);
        } catch (err) {
            setLoading(false);
            setError(err.response?.data?.message || "Something went wrong.");
        }
    };

    const handleResetSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (!resetCode || !newPassword)
            return setError("Please fill in all fields.");
        if (newPassword.length < 6)
            return setError("Password must be at least 6 characters.");
        setLoading(true);
        try {
            const response = await authAPI.resetPassword({
                email: resetEmail,
                code: resetCode,
                newPassword,
            });
            setSuccessMsg(response.data.message);
            setForgotStep("done");
            setLoading(false);
        } catch (err) {
            setLoading(false);
            setError(err.response?.data?.message || "Something went wrong.");
        }
    };

    const handleVerifySubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (!verifyCode) return setError("Please enter the verification code.");
        setLoading(true);
        try {
            const response = await authAPI.verifyEmail({
                email: form.email,
                code: verifyCode,
            });
            const { token, user: userData } = response.data;
            const resolvedName = userData?.name || form.email.split("@")[0];
            setGreetName(resolvedName);
            localStorage.setItem("appitat_token", token);
            login(
                userData || {
                    name: resolvedName,
                    email: form.email,
                },
                token,
            );
            setSuccessAnim(true);
            setLoading(false);
            setTimeout(() => {
                navigate("dashboard");
            }, 3000);
        } catch (err) {
            setLoading(false);
            setError(err.response?.data?.message || "Invalid or expired code.");
        }
    };

    const exitForgotFlow = () => {
        setForgotStep(null);
        setResetEmail("");
        setResetCode("");
        setNewPassword("");
        setError("");
        setSuccessMsg("");
    };

    const getHeading = () => {
        if (verifyStep) return "Verify your email";
        if (forgotStep === "email") return "Forgot password?";
        if (forgotStep === "code") return "Enter reset code";
        if (forgotStep === "done") return "Password updated!";
        return isLogin ? "Welcome back" : "Join the kitchen";
    };
    const getSubheading = () => {
        if (verifyStep) return `We sent a 6-digit code to ${form.email}. Check your inbox (and spam folder).`;
        if (forgotStep === "email") return "Enter the email address associated with your account.";
        if (forgotStep === "code") return `We sent a 6-digit code to ${resetEmail}. Check your inbox (and spam folder).`;
        if (forgotStep === "done") return "";
        return isLogin ? "Log in to access your recipes." : "Create your free account — no credit card needed.";
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-brand-bg to-brand-bg/80 flex items-center justify-center p-6 relative overflow-hidden">
            {/* Success Overlay Animation */}
            {successAnim && (
                <div
                    className="absolute inset-0 z-50 bg-brand-primary flex flex-col items-center justify-center text-brand-bg p-6 animate-out fade-out duration-500 fill-mode-forwards"
                    style={{ animationDelay: "2500ms" }}
                >
                    <div className="flex flex-col items-center justify-center w-full max-w-[1400px] px-8">
                        <h1
                            className="serif leading-[1.05] font-black text-center mb-6 py-4 tracking-tight flex flex-wrap justify-center w-full"
                            style={{
                                fontSize: `${Math.min(12, 85 / `Hello, ${greetName || form.name || "Chef"}`.length)}vw`,
                                whiteSpace: "nowrap",
                            }}
                        >
                            {`Hello, ${greetName || form.name || "Chef"}`
                                .split("")
                                .map((char, i) => (
                                    <span
                                        key={i}
                                        className="opacity-0 animate-in fade-in slide-in-from-bottom-[60px] duration-700 fill-mode-forwards"
                                        style={{
                                            animationDelay: `${i * 60}ms`,
                                        }}
                                    >
                                        {char === " " ? "\u00A0" : char}
                                    </span>
                                ))}
                        </h1>
                        <p
                            className="text-[3vw] text-brand-bg/80 text-center font-medium opacity-0 animate-in fade-in slide-in-from-bottom-4 duration-1000 fill-mode-forwards"
                            style={{ animationDelay: "1500ms" }}
                        >
                            Let's get cooking.
                        </p>
                    </div>
                </div>
            )}

            <div className="absolute top-0 right-0 bottom-0 left-[55%] bg-brand-primary pointer-events-none [clip-path:polygon(10%_0,100%_0,100%_100%,0%_100%)]">
                <div className="hidden md:flex flex-col items-center justify-center h-full p-10">
                    <span className="text-[60px] text-brand-bg mb-6 drop-shadow-sm opacity-80">
                        <FaUtensils />
                    </span>
                    <p className="serif text-brand-bg text-[28px] font-black text-center leading-tight">
                        Your perfect recipe
                        <br />
                        <em className="text-brand-accent not-italic">
                            awaits you.
                        </em>
                    </p>
                    <p className="text-brand-bg/80 text-sm mt-4 text-center max-w-[260px]">
                        Thousands of curated recipes powered by Gemini AI.
                    </p>
                </div>
            </div>

            <div className="slide-up bg-brand-card rounded-2xl md:rounded-3xl p-7 md:p-12 w-full max-w-[420px] shadow-2xl relative z-10">
                <div
                    className="mb-7 inline-flex items-center gap-1.5 group cursor-default"
                    onClick={() => navigate("hero")}
                >
                    <span className="text-[19px] text-brand-secondary group-hover:scale-110 transition-transform">
                        <FaUtensils />
                    </span>
                    <span className="serif text-lg font-black text-brand-primary relative top-[1px]">
                        Appitat
                    </span>
                </div>

                {/* Back button for forgot-password flow */}
                {forgotStep && forgotStep !== "done" && (
                    <button
                        className="flex items-center gap-1.5 text-sm text-brand-primary/60 hover:text-brand-primary transition-colors mb-4 cursor-pointer bg-transparent border-none p-0"
                        onClick={exitForgotFlow}
                    >
                        <FiArrowLeft size={14} /> Back to login
                    </button>
                )}

                {/* Back button for verify flow */}
                {verifyStep && (
                    <button
                        className="flex items-center gap-1.5 text-sm text-brand-primary/60 hover:text-brand-primary transition-colors mb-4 cursor-pointer bg-transparent border-none p-0"
                        onClick={() => {
                            setVerifyStep(false);
                            setVerifyCode("");
                            setError("");
                        }}
                    >
                        <FiArrowLeft size={14} /> Back
                    </button>
                )}

                <h2 className="serif text-[28px] font-black text-brand-primary mb-1.5">
                    {getHeading()}
                </h2>
                <p className="text-sm text-brand-primary/80 mb-8">
                    {getSubheading()}
                </p>

                {/* ===== SIGNUP VERIFICATION STEP ===== */}
                {verifyStep && (
                    <form onSubmit={handleVerifySubmit}>
                        <div className="mb-6">
                            <label className="text-xs font-semibold text-brand-primary/80 block mb-1.5">
                                6-Digit Code
                            </label>
                            <input
                                className="input-field px-3.5 py-3 md:py-2.5 rounded-[10px] text-sm tracking-[0.3em] text-center font-mono text-lg"
                                type="text"
                                placeholder="000000"
                                maxLength={6}
                                value={verifyCode}
                                onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, ""))}
                                autoFocus
                            />
                        </div>
                        {error && (
                            <p className="text-brand-accent text-[13px] mb-4 flex items-center gap-1.5 font-semibold">
                                <FiAlertCircle className="text-sm stroke-[2.5]" />{" "}
                                {error}
                            </p>
                        )}
                        <button
                            className="btn-primary w-full py-4 md:py-3.5 rounded-[11px] text-[15px]"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? "Verifying…" : "Verify Email"}
                        </button>
                    </form>
                )}

                {/* ===== FORGOT PASSWORD: Step 1 - Enter Email ===== */}
                {forgotStep === "email" && (
                    <form onSubmit={handleForgotSubmitEmail}>
                        <div className="mb-6">
                            <label className="text-xs font-semibold text-brand-primary/80 block mb-1.5">
                                Email
                            </label>
                            <input
                                className="input-field px-3.5 py-3 md:py-2.5 rounded-[10px] text-sm"
                                type="email"
                                placeholder="you@example.com"
                                value={resetEmail}
                                onChange={(e) => setResetEmail(e.target.value)}
                                autoFocus
                            />
                        </div>
                        {error && (
                            <p className="text-brand-accent text-[13px] mb-4 flex items-center gap-1.5 font-semibold">
                                <FiAlertCircle className="text-sm stroke-[2.5]" />{" "}
                                {error}
                            </p>
                        )}
                        <button
                            className="btn-primary w-full py-4 md:py-3.5 rounded-[11px] text-[15px]"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? "Sending…" : "Send Reset Code"}
                        </button>
                    </form>
                )}

                {/* ===== FORGOT PASSWORD: Step 2 - Enter Code + New Password ===== */}
                {forgotStep === "code" && (
                    <form onSubmit={handleResetSubmit}>
                        <div className="mb-4.5">
                            <label className="text-xs font-semibold text-brand-primary/80 block mb-1.5">
                                6-Digit Code
                            </label>
                            <input
                                className="input-field px-3.5 py-3 md:py-2.5 rounded-[10px] text-sm tracking-[0.3em] text-center font-mono text-lg"
                                type="text"
                                placeholder="000000"
                                maxLength={6}
                                value={resetCode}
                                onChange={(e) => setResetCode(e.target.value.replace(/\D/g, ""))}
                                autoFocus
                            />
                        </div>
                        <div className="mb-6">
                            <label className="text-xs font-semibold text-brand-primary/80 block mb-1.5">
                                New Password
                            </label>
                            <div className="relative">
                                <input
                                    className="input-field px-3.5 py-3 md:py-2.5 rounded-[10px] text-sm w-full pr-10"
                                    type={showNewPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-primary/50 hover:text-brand-primary transition-colors focus:outline-none"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    tabIndex="-1"
                                >
                                    {showNewPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                                </button>
                            </div>
                        </div>
                        {error && (
                            <p className="text-brand-accent text-[13px] mb-4 flex items-center gap-1.5 font-semibold">
                                <FiAlertCircle className="text-sm stroke-[2.5]" />{" "}
                                {error}
                            </p>
                        )}
                        <button
                            className="btn-primary w-full py-4 md:py-3.5 rounded-[11px] text-[15px]"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? "Resetting…" : "Reset Password"}
                        </button>
                    </form>
                )}

                {/* ===== FORGOT PASSWORD: Done ===== */}
                {forgotStep === "done" && (
                    <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                            <FiCheckCircle className="text-green-600" size={32} />
                        </div>
                        <p className="text-sm text-brand-primary/80 mb-6">{successMsg}</p>
                        <button
                            className="btn-primary w-full py-4 md:py-3.5 rounded-[11px] text-[15px]"
                            onClick={exitForgotFlow}
                        >
                            Back to Login
                        </button>
                    </div>
                )}

                {/* ===== NORMAL LOGIN / SIGNUP FORM ===== */}
                {!forgotStep && !verifyStep && (
                    <>
                        <form onSubmit={handle}>
                            {!isLogin && (
                                <div className="mb-4.5">
                                    <label className="text-xs font-semibold text-brand-primary/80 block mb-1.5">
                                        Full Name
                                    </label>
                                    <input
                                        className="input-field px-3.5 py-3 md:py-2.5 rounded-[10px] text-sm"
                                        placeholder="Your name"
                                        value={form.name}
                                        onChange={(e) =>
                                            setForm({ ...form, name: e.target.value })
                                        }
                                    />
                                </div>
                            )}

                            <div className="mb-4.5">
                                <label className="text-xs font-semibold text-brand-primary/80 block mb-1.5">
                                    Email
                                </label>
                                <input
                                    className="input-field px-3.5 py-3 md:py-2.5 rounded-[10px] text-sm"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={form.email}
                                    onChange={(e) =>
                                        setForm({ ...form, email: e.target.value })
                                    }
                                />
                            </div>
                            <div className="mb-2">
                                <label className="text-xs font-semibold text-brand-primary/80 block mb-1.5">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        className="input-field px-3.5 py-3 md:py-2.5 rounded-[10px] text-sm w-full pr-10"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={form.password}
                                        onChange={(e) =>
                                            setForm({ ...form, password: e.target.value })
                                        }
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-primary/50 hover:text-brand-primary transition-colors focus:outline-none"
                                        onClick={() => setShowPassword(!showPassword)}
                                        tabIndex="-1"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                                    </button>
                                </div>
                            </div>
                            {isLogin && (
                                <div className="text-right mb-5">
                                    <button
                                        type="button"
                                        className="text-[12px] text-brand-secondary font-semibold hover:underline cursor-pointer bg-transparent border-none p-0 outline-none"
                                        onClick={() => {
                                            setForgotStep("email");
                                            setError("");
                                            setResetEmail(form.email);
                                        }}
                                    >
                                        Forgot password?
                                    </button>
                                </div>
                            )}
                            {!isLogin && <div className="mb-4" />}
                            {error && (
                                <p className="text-brand-accent text-[13px] mb-4 flex items-center gap-1.5 font-semibold">
                                    <FiAlertCircle className="text-sm stroke-[2.5]" />{" "}
                                    {error}
                                </p>
                            )}
                            <button
                                className="btn-primary w-full py-4 md:py-3.5 rounded-[11px] text-[15px]"
                                type="submit"
                                disabled={loading}
                            >
                                {loading
                                    ? "Please wait…"
                                    : isLogin
                                      ? "Log In"
                                      : "Create Account"}
                            </button>
                        </form>

                        <div className="flex items-center my-6">
                            <div className="flex-1 border-t border-brand-primary/10"></div>
                            <span className="px-3 text-xs text-brand-primary/50 font-medium">OR</span>
                            <div className="flex-1 border-t border-brand-primary/10"></div>
                        </div>

                        <div className="flex justify-center mb-6 w-full overflow-hidden">
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={() => {
                                    setError('Google Login Failed');
                                }}
                                theme="outline"
                                size="large"
                                shape="rectangular"
                            />
                        </div>

                        <div className="my-6 border-t border-brand-primary/10 pt-5 text-center">
                            <p className="text-[13px] text-brand-primary/80">
                                {isLogin ? "New here? " : "Already have an account? "}
                                <button
                                    className="text-brand-secondary font-bold cursor-pointer hover:underline hover:scale-105 hover:shadow-[0_0_14px_3px_rgba(245,130,74,0.35)] transition-all bg-transparent border-none p-0 outline-none inline italic px-2 rounded-md"
                                    onClick={() => setIsLogin(!isLogin)}
                                >
                                    {isLogin ? "Create an account" : "Log in"}
                                </button>
                            </p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
