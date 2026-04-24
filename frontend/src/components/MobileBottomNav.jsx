import { useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { FiSearch, FiHeart, FiUser } from "react-icons/fi";
import { FiBook, FiBookOpen } from "react-icons/fi";

export default function MobileBottomNav() {
    const { user, navigate, theme, toggleTheme } = useApp();
    const location = useLocation();

    if (!user) return null;

    const tabs = [
        {
            id: "dashboard",
            icon: FiSearch,
            label: "Discover",
            path: "/dashboard",
        },
        { id: "saved", icon: FiHeart, label: "Saved", path: "/saved" },
        { id: "account", icon: FiUser, label: "Account", path: "/account" },
    ];

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-brand-card/95 backdrop-blur-xl border-t border-brand-primary/10 pb-safe">
            <div className="flex items-center justify-around h-[64px] px-2">
                {tabs.map((tab) => {
                    const isActive = location.pathname === tab.path;
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => navigate(tab.id)}
                            className={`flex flex-col items-center justify-center gap-0.5 w-[72px] h-[52px] rounded-2xl transition-all duration-200 active:scale-90 cursor-pointer ${
                                isActive
                                    ? "text-brand-secondary bg-brand-secondary/10"
                                    : "text-brand-primary/50 hover:text-brand-primary/80"
                            }`}
                        >
                            <Icon
                                className={`text-[22px] stroke-[2.5] transition-transform duration-200 ${isActive ? "scale-110" : ""}`}
                            />
                            <span
                                className={`text-[10px] font-bold tracking-wide transition-colors ${isActive ? "text-brand-secondary" : ""}`}
                            >
                                {tab.label}
                            </span>
                            {isActive && (
                                <div className="absolute bottom-1.5 w-1 h-1 rounded-full bg-brand-secondary" />
                            )}
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}
