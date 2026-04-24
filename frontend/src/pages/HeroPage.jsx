import { useMemo } from "react";
import { RECIPES } from "../data/constants";
import { useApp } from "../context/AppContext";
import Footer from "../components/Footer";
import { FaUtensils } from "react-icons/fa6";
import { motion } from "framer-motion"; // eslint-disable-line no-unused-vars
import {
    RefreshCcw,
    UserCheck,
    Award,
    BookHeart,
    Sparkles,
    Clock,
} from "lucide-react";

export default function HeroPage() {
    const { navigate, user } = useApp();

    const features = useMemo(
        () => [
            {
                icon: <RefreshCcw size={40} />,
                title: "Smart Pantry Tracking",
                desc: "Keep an ongoing inventory. We'll only suggest recipes you can actually make.",
            },
            {
                icon: <UserCheck size={40} />,
                title: "Deep Personalization",
                desc: "Set strict allergy filters or log ingredients you dislike for tailored menus.",
            },
            {
                icon: <Award size={40} />,
                title: "Gamified Cooking",
                desc: "Earn XP and level up from Novice to Master Chef as you cook and explore.",
            },
            {
                icon: <BookHeart size={40} />,
                title: "Your Digital Cookbook",
                desc: "Save your favorite discoveries and plan your entire week's meals effortlessly.",
            },
            {
                icon: <Sparkles size={40} />,
                title: "AI Recipe Generation",
                desc: "Our AI models create thousands of unique, delicious recipes on demand.",
            },
            {
                icon: <Clock size={40} />,
                title: "Instant Inspiration",
                desc: "Short on time? Get a personalized dinner plan mapped out in seconds.",
            },
        ],
        [],
    );

    return (
        <div>
            {/* HERO */}
            <section className="relative min-h-[80vh] flex items-center overflow-hidden bg-gradient-to-br from-brand-bg to-brand-bg/80">
                {/* AI Aura Glows — ambient background light */}
                <div
                    className="ai-aura w-[600px] h-[600px] -top-[150px] -left-[150px]"
                    style={{
                        background:
                            "radial-gradient(circle, rgba(160,58,19,0.22), transparent 70%)",
                    }}
                />
                <div
                    className="ai-aura w-[400px] h-[400px] bottom-[-80px] left-[5%]"
                    style={{
                        background:
                            "radial-gradient(circle, rgba(245,130,74,0.18), transparent 70%)",
                        animationDelay: "4s",
                    }}
                />
                <div
                    className="ai-aura w-[300px] h-[300px] top-[10%] left-[35%] hidden md:block"
                    style={{
                        background:
                            "radial-gradient(circle, rgba(37,79,34,0.12), transparent 70%)",
                        animationDelay: "8s",
                    }}
                />

                {/* Right Side: High Visibility Image Background (50% Split) */}
                <div
                    className="absolute top-0 right-0 bottom-0 left-[50%] bg-cover bg-center pointer-events-none [clip-path:polygon(10%_0,100%_0,100%_100%,0%_100%)] hidden md:block"
                    style={{
                        backgroundImage: `url('https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=2653&q=80')`,
                    }}
                >
                    {/* Overlay to blur image and unconditionally remain dark for contrast */}
                    <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-black/60 backdrop-blur-[2px] [clip-path:polygon(10%_0,100%_0,100%_100%,0%_100%)]"></div>
                </div>

                <div className="max-w-[1400px] w-full mx-auto px-6 py-12 md:py-20 flex flex-col md:flex-row items-center relative z-10">
                    {/* Left Side: Hero Text content */}
                    <div className="w-full md:w-[50%] md:pr-10 lg:pr-20">
                        <div className="slide-up inline-flex items-center gap-1.5 glass-card px-3.5 py-1.5 text-brand-secondary text-[13px] font-bold rounded-full tracking-widest uppercase mb-6 pulse-glow">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-accent inline-block animate-pulse" />
                            AI-Powered Recipe Discovery
                        </div>
                        <h1 className="serif slide-up stagger-1 text-[clamp(40px,8vw,72px)] font-black text-brand-primary leading-[1.05] mb-6">
                            Cook with{" "}
                            <em className="text-gradient not-italic">
                                confidence.
                            </em>
                            <br />
                            Eat with <em className="italic">joy.</em>
                        </h1>
                        <p className="slide-up stagger-2 text-base md:text-lg text-brand-primary/80 leading-relaxed mb-8 md:mb-10 max-w-[460px]">
                            Tell us what's in your fridge or pantry — our AI
                            finds the perfect recipe from your ingredients every
                            single time.
                        </p>
                        <div className="slide-up stagger-3 flex flex-col sm:flex-row gap-4 flex-wrap">
                            <button
                                className="btn-primary w-full sm:w-auto px-8 md:px-10 py-4 rounded-button text-[15px] md:text-[16px] font-bold shadow-lg hover:shadow-xl transition-shadow pulse-glow active:scale-[0.97]"
                                onClick={() =>
                                    navigate(user ? "dashboard" : "signup")
                                }
                            >
                                Start Cooking Free →
                            </button>
                            <button
                                className="btn-ghost w-full sm:w-auto px-8 md:px-10 py-4 rounded-button text-[15px] md:text-[16px] font-bold bg-brand-card/50 backdrop-blur-sm shadow-sm active:scale-[0.97]"
                                onClick={() => navigate("dashboard")}
                            >
                                Browse Recipes
                            </button>
                        </div>
                    </div>

                    {/* Right Side: Interactive Elements hovering over the split image */}
                    <div className="w-full md:w-[50%] slide-up stagger-2 relative flex flex-col gap-4 mt-16 md:mt-0 items-center md:items-end px-4 md:px-0">
                        {RECIPES.slice(0, 3).map((r, i) => (
                            <div
                                key={r.id}
                                className="glass-card p-3 md:p-4 flex items-center gap-3 md:gap-4 w-full max-w-[420px] hover:-translate-y-1 transition-transform active:scale-[0.98]"
                                style={{
                                    opacity: 0,
                                    animation: `slideUp 0.6s ease-out ${0.4 + i * 0.15}s forwards`,
                                    transform: `translateX(${i * -15}px)`, // Staggering them visually to the left slightly
                                }}
                                onClick={() => navigate("dashboard")}
                            >
                                <div
                                    className="w-[56px] h-[56px] rounded-xl flex items-center justify-center text-[28px] shrink-0"
                                    style={{
                                        background: r.accent + "22",
                                        color: r.accent,
                                    }}
                                >
                                    {r.emoji}
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-brand-primary text-[16px]">
                                        {r.title}
                                    </p>
                                    <p className="text-[14px] text-brand-primary/70 mt-0.5 font-medium">
                                        {r.cuisine} · {r.time} · {r.calories}{" "}
                                        kcal
                                    </p>
                                </div>
                                <div
                                    className="text-[13px] font-bold px-3 py-1.5 rounded-lg ml-2"
                                    style={{
                                        background: r.accent + "22",
                                        color: r.accent,
                                    }}
                                >
                                    {r.difficulty}
                                </div>
                            </div>
                        ))}
                        <div
                            className="text-right text-brand-bg md:text-white/90 font-bold w-full max-w-[420px] md:pr-4 text-[15px] mt-2 drop-shadow-md bg-brand-primary md:bg-transparent backdrop-blur-sm md:backdrop-blur-none p-2 rounded-lg slide-up"
                            style={{
                                opacity: 0,
                                animation: `slideUp 0.6s ease-out 0.85s forwards`,
                            }}
                        >
                            + hundreds more recipes waiting →
                        </div>
                    </div>
                </div>
            </section>

            {/* FEATURES MARQUEE */}
            <section className="bg-brand-card py-20 overflow-hidden border-y border-brand-primary/5">
                <div className="max-w-[1400px] mx-auto mb-14 px-6 relative z-20">
                    <h2 className="serif text-[clamp(28px,4vw,44px)] font-black text-brand-primary text-center">
                        Why cooks love{" "}
                        <em className="text-brand-accent not-italic">
                            Appitat
                        </em>
                    </h2>
                </div>

                {/* Marquee Container */}
                <div className="relative w-full flex whitespace-nowrap overflow-hidden">
                    {/* Left & Right Fade Overlays for smooth entry/exit */}
                    <div className="absolute top-0 bottom-0 left-0 w-[100px] md:w-[200px] bg-gradient-to-r from-brand-card to-transparent z-10 pointer-events-none" />
                    <div className="absolute top-0 bottom-0 right-0 w-[100px] md:w-[200px] bg-gradient-to-l from-brand-card to-transparent z-10 pointer-events-none" />

                    {/* Scrolling Track (moving left-to-right) */}
                    <motion.div
                        className="flex gap-8 px-4 items-center w-max"
                        animate={{ x: ["0%", "-50%"] }}
                        transition={{
                            repeat: Infinity,
                            ease: "linear",
                            duration: 80, // Slower marquee length for easy reading
                        }}
                    >
                        {/* Duplicate the array 3 times for completely seamless infinite scrolling on all screen sizes */}
                        {[...features, ...features, ...features].map((f, i) => (
                            <div
                                key={i}
                                className="bg-brand-bg border border-brand-primary/5 shadow-sm rounded-card p-8 w-[350px] shrink-0 whitespace-normal text-center"
                            >
                                <div className="text-brand-secondary flex justify-center mb-6">
                                    <div className="bg-brand-secondary/10 p-4 rounded-full">
                                        {f.icon}
                                    </div>
                                </div>
                                <h3 className="font-bold text-brand-primary mb-3 text-[20px]">
                                    {f.title}
                                </h3>
                                <p className="text-[15px] text-brand-primary/70 leading-relaxed font-medium">
                                    {f.desc}
                                </p>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* CTA BANNER */}
            <section className="relative bg-brand-primary py-[72px] px-6 overflow-hidden flex items-center justify-center">
                <div className="max-w-[1000px] w-full mx-auto relative flex items-center justify-between">
                    {/* Left Icon: Flipped Logo (Knife on Left) */}
                    <div className="hidden md:flex text-brand-accent relative z-10 w-[20%] justify-center transform scale-x-[-1] -rotate-12 opacity-80">
                        <FaUtensils className="w-24 h-24 lg:w-32 lg:h-32 drop-shadow-lg" />
                    </div>

                    <div className="flex flex-col items-center text-center relative z-20 w-full md:w-[60%] shrink-0">
                        <h2 className="serif text-[clamp(28px,4vw,48px)] font-black text-brand-bg mb-4">
                            Ready to transform your kitchen?
                        </h2>
                        <p className="text-brand-bg/80 text-base mb-9 max-w-[460px] mx-auto">
                            Join thousands of home cooks who've made weeknight
                            dinners something to look forward to.
                        </p>
                        <button
                            className="btn-primary px-10 py-4 rounded-button text-base shadow-xl hover:scale-105 transition-transform"
                            onClick={() => navigate("signup")}
                        >
                            Create Free Account →
                        </button>
                    </div>

                    {/* Right Icon: Standard Logo (Fork on Left, Knife on Right) */}
                    <div className="hidden md:flex text-brand-accent relative z-10 w-[20%] justify-center transform rotate-12 opacity-80">
                        <FaUtensils className="w-24 h-24 lg:w-32 lg:h-32 drop-shadow-lg" />
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
