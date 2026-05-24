import { useState } from "react";
import { FiSend, FiCheckCircle } from "react-icons/fi";
import { feedbackAPI } from "../lib/api";

const CATEGORIES = [
    "Recipe Quality",
    "AI Accuracy",
    "UI/UX",
    "Performance",
    "Missing Feature",
    "Other",
];

const StarRating = ({ value, onChange }) => (
    <div className="flex gap-2" role="group" aria-label="Star rating">
        {[1, 2, 3, 4, 5].map((star) => (
            <button
                key={star}
                type="button"
                onClick={() => onChange(star)}
                className={`text-3xl transition-all duration-150 hover:scale-110 focus:outline-none cursor-pointer leading-none ${
                    star <= value
                        ? "text-brand-secondary"
                        : "text-brand-primary/20 hover:text-brand-secondary/40"
                }`}
                aria-label={`${star} star${star !== 1 ? "s" : ""}`}
            >
                &#9733;
            </button>
        ))}
    </div>
);

const RATING_LABELS = ["", "Poor", "Fair", "Good", "Great", "Excellent"];

export default function FeedbackModal({ onClose }) {
    const [rating, setRating] = useState(0);
    const [categories, setCategories] = useState([]);
    const [message, setMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [done, setDone] = useState(false);
    const [error, setError] = useState("");

    const toggleCategory = (cat) => {
        setCategories((prev) =>
            prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!rating) return setError("Please choose a star rating.");
        setError("");
        setSubmitting(true);
        try {
            await feedbackAPI.submit({ rating, categories, message });
            setDone(true);
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="bg-brand-bg rounded-card max-w-md w-full shadow-2xl border border-brand-primary/10 overflow-hidden scale-up">
                {/* Header */}
                <div
                    className="relative px-6 py-5 border-b border-brand-primary/10"
                    style={{
                        background:
                            "var(--brand-primary)",
                    }}
                >
                    <h2 className="serif text-xl font-black text-brand-bg">
                        Share Your Feedback
                    </h2>
                    <p className="text-brand-bg/70 text-sm mt-0.5">
                        Help us make Appitat better for you
                    </p>
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-brand-bg/60 hover:text-brand-bg transition-colors cursor-pointer p-1 rounded-lg hover:bg-brand-bg/10 text-xl leading-none"
                        aria-label="Close feedback modal"
                    >
                        &times;
                    </button>
                </div>

                {/* Content */}
                <div className="px-6 py-6">
                    {done ? (
                        <div className="flex flex-col items-center py-6 text-center gap-4 slide-up">
                            <div className="w-14 h-14 rounded-full bg-brand-primary/10 flex items-center justify-center">
                                <FiCheckCircle className="text-brand-primary" size={28} />
                            </div>
                            <div>
                                <h3 className="serif text-xl font-black text-brand-primary mb-1">
                                    Thank you
                                </h3>
                                <p className="text-brand-primary/60 text-sm leading-relaxed">
                                    Your feedback means a lot. We will use it to keep improving Appitat.
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="mt-2 btn-primary px-8 py-3 rounded-xl text-sm font-bold cursor-pointer"
                            >
                                Close
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                            {/* Star Rating */}
                            <div>
                                <label className="block text-sm font-bold text-brand-primary/80 mb-2">
                                    Overall Rating *
                                </label>
                                <StarRating value={rating} onChange={setRating} />
                                {rating > 0 && (
                                    <p className="text-xs text-brand-secondary font-bold mt-1.5 uppercase tracking-wider slide-up">
                                        {RATING_LABELS[rating]}
                                    </p>
                                )}
                            </div>

                            {/* Category Tags */}
                            <div>
                                <label className="block text-sm font-bold text-brand-primary/80 mb-2">
                                    What is this about?{" "}
                                    <span className="font-normal text-brand-primary/40">(optional)</span>
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {CATEGORIES.map((cat) => (
                                        <button
                                            key={cat}
                                            type="button"
                                            onClick={() => toggleCategory(cat)}
                                            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-150 cursor-pointer ${
                                                categories.includes(cat)
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
                                    htmlFor="feedback-message"
                                    className="block text-sm font-bold text-brand-primary/80 mb-2"
                                >
                                    Tell us more{" "}
                                    <span className="font-normal text-brand-primary/40">(optional)</span>
                                </label>
                                <textarea
                                    id="feedback-message"
                                    rows={4}
                                    maxLength={1000}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="What could we do better? Any features you would love to see?"
                                    className="w-full bg-brand-bg border border-brand-primary/20 text-brand-primary text-sm font-medium rounded-xl px-4 py-3 focus:outline-none focus:border-brand-secondary transition-colors resize-none placeholder:text-brand-primary/30"
                                />
                                <p className="text-right text-[11px] text-brand-primary/30 mt-1">
                                    {message.length}/1000
                                </p>
                            </div>

                            {error && (
                                <p className="text-brand-accent text-sm font-semibold -mt-2">
                                    {error}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={submitting}
                                className="btn-primary w-full py-3.5 rounded-xl text-[15px] font-bold flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                            >
                                {submitting ? (
                                    "Sending..."
                                ) : (
                                    <>
                                        <FiSend size={14} />
                                        Submit Feedback
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
