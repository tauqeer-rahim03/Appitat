import { useState } from "react";
import { Link } from "react-router-dom";
import { FaUtensils } from "react-icons/fa6";
import { FiMessageSquare } from "react-icons/fi";
import FeedbackModal from "./FeedbackModal";

export default function Footer() {
    const [showFeedback, setShowFeedback] = useState(false);

    return (
        <>
            <footer className="bg-brand-card text-brand-primary/80 px-6 pt-12 pb-8 border-t border-brand-primary/10">
                <div className="max-w-[1400px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-[20px] text-brand-secondary">
                                <FaUtensils />
                            </span>
                            <span className="serif text-xl font-black text-brand-primary relative top-[1px]">
                                Appitat
                            </span>
                        </div>
                        <p className="text-[13px] leading-relaxed">
                            AI-powered recipe discovery tailored to your tastes,
                            pantry, and lifestyle.
                        </p>
                    </div>

                    {[
                        [
                            "Discover",
                            [
                                { label: "Browse Recipes", path: "/dashboard" }
                            ],
                        ],
                        [
                            "Account",
                            [
                                { label: "Sign Up Free", path: "/signup" },
                                { label: "Log In", path: "/login" },
                                { label: "Saved Recipes", path: "/saved" },
                                { label: "My Profile", path: "/account" },
                                { label: "Settings", path: "/settings" }
                            ],
                        ],
                    ].map(([title, links]) => (
                        <div key={title}>
                            <p className="text-brand-primary font-bold text-xs tracking-widest uppercase mb-3.5">
                                {title}
                            </p>
                            {links.map((l) => (
                                <Link
                                    key={l.label}
                                    to={l.path}
                                    className="block text-[13px] mb-2 transition-colors duration-200 hover:text-brand-accent hover:underline"
                                >
                                    {l.label}
                                </Link>
                            ))}
                        </div>
                    ))}

                    {/* Feedback CTA column */}
                    <div>
                        <p className="text-brand-primary font-bold text-xs tracking-widest uppercase mb-3.5">
                            Feedback
                        </p>
                        <p className="text-[13px] leading-relaxed mb-3 text-brand-primary/60">
                            Help us improve Appitat with your ideas and suggestions.
                        </p>
                        <button
                            id="footer-feedback-btn"
                            onClick={() => setShowFeedback(true)}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-secondary/10 hover:bg-brand-secondary/20 text-brand-secondary text-[13px] font-bold transition-all duration-200 cursor-pointer border border-brand-secondary/20 hover:scale-[1.02]"
                        >
                            <FiMessageSquare size={13} />
                            Share Feedback
                        </button>
                    </div>
                </div>
                <div className="max-w-[1400px] mx-auto mt-8 border-t border-brand-primary/10 pt-6 text-center text-xs opacity-70">
                    © {new Date().getFullYear()} Appitat · AI-Powered Culinary Intelligence.
                </div>
            </footer>

            {showFeedback && (
                <FeedbackModal onClose={() => setShowFeedback(false)} />
            )}
        </>
    );
}
