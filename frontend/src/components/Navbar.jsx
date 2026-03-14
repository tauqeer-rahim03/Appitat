import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";
import {
    FiSearch,
    FiHeart,
    FiUser,
    FiLogOut,
    FiMenu,
    FiX,
    FiBook,
    FiBookOpen,
} from "react-icons/fi";
import { FaUtensils } from "react-icons/fa6";

export default function Navbar() {
    const { user, navigate, logout, theme, toggleTheme } = useApp();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);
    const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const dropdownRef = useRef(null);

    // Close desktop profile dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setAccountDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <>
            <nav className="bg-brand-bg/95 backdrop-blur-md border-b border-brand-primary/10 sticky top-0 z-50 px-6 transition-colors duration-300 shadow-sm">
                <div className="max-w-[1400px] mx-auto flex items-center justify-between h-[60px]">
                    <button
                        className="flex items-center gap-2 cursor-pointer group border-none bg-none p-0 outline-none"
                        onClick={() => navigate("hero")}
                    >
                        <span className="text-[22px] text-brand-secondary group-hover:scale-110 transition-transform">
                            <FaUtensils />
                        </span>
                        <span className="serif text-xl font-black text-brand-primary relative top-[1px]">
                            Appitat
                        </span>
                    </button>

                    <div className="hidden md:flex items-center gap-7">
                        {user && (
                            <button
                                className={`flex items-center cursor-pointer gap-1.5 transition-all duration-200 font-semibold text-sm py-1 border-b-2 ${
                                    location.pathname === "/dashboard"
                                        ? "text-brand-secondary border-brand-secondary"
                                        : "text-brand-primary/80 border-transparent hover:text-brand-secondary hover:border-brand-secondary"
                                }`}
                                onClick={() => navigate("dashboard")}
                            >
                                <FiSearch className="text-sm stroke-[2.5]" />{" "}
                                Discover
                            </button>
                        )}
                        {user && (
                            <button
                                className={`flex items-center cursor-pointer gap-1.5 transition-all duration-200 font-semibold text-sm py-1 border-b-2 ${
                                    location.pathname === "/saved"
                                        ? "text-brand-secondary border-brand-secondary"
                                        : "text-brand-primary/80 border-transparent hover:text-brand-secondary hover:border-brand-secondary"
                                }`}
                                onClick={() => navigate("saved")}
                            >
                                <FiHeart className="text-sm stroke-[2.5]" />{" "}
                                Saved
                            </button>
                        )}

                        <button
                            onClick={toggleTheme}
                            className="flex items-center gap-2 p-1.5 px-3 rounded-[20px] bg-brand-primary/5 hover:bg-brand-primary/10 border border-brand-primary/10 transition-colors ml-2 cursor-pointer select-none text-brand-primary"
                            aria-label="Toggle theme"
                        >
                            <div
                                key={theme}
                                className="book-animate flex items-center justify-center"
                            >
                                {theme === "dark" ? (
                                    <FiBook className="text-lg stroke-[2.5]" />
                                ) : (
                                    <FiBookOpen className="text-lg stroke-[2.5]" />
                                )}
                            </div>
                            <span className="text-sm font-bold hidden lg:inline-block">
                                Theme
                            </span>
                        </button>

                        {!user ? (
                            <div className="flex gap-2.5">
                                <button
                                    className="btn-ghost px-[18px] py-[7px] rounded-lg text-[13px] cursor-pointer"
                                    onClick={() => navigate("login")}
                                >
                                    Log In
                                </button>
                                <button
                                    className="btn-primary px-[18px] py-[7px] rounded-lg text-[13px] cursor-pointer"
                                    onClick={() => navigate("signup")}
                                >
                                    Sign Up
                                </button>
                            </div>
                        ) : (
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    className="flex items-center gap-2.5 p-1 pr-4 bg-brand-primary/5 hover:bg-brand-primary/10 border border-brand-primary/10 rounded-[20px] transition-colors cursor-pointer select-none outline-none"
                                    onClick={() =>
                                        setAccountDropdownOpen(
                                            !accountDropdownOpen,
                                        )
                                    }
                                >
                                    <div className="w-[32px] h-[32px] rounded-full bg-brand-primary text-brand-bg flex items-center justify-center font-bold text-xs shadow-sm overflow-hidden shrink-0">
                                        {user.profilePic ? (
                                            <img
                                                src={user.profilePic}
                                                alt="Profile"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            (user.name && user.name[0]) ? user.name[0].toUpperCase() : "U"
                                        )}
                                    </div>
                                    <span className="text-sm font-bold text-brand-primary hidden lg:inline-block">
                                        {user.name || (user.email ? user.email.split("@")[0] : "User")}
                                    </span>
                                </button>

                                {accountDropdownOpen && (
                                    <div className="absolute right-0 mt-3 w-[160px] bg-brand-bg rounded-xl shadow-lg border border-brand-primary/10 py-2 flex flex-col z-50 slide-up overflow-hidden">
                                        <button
                                            className="w-full text-left px-4 py-2.5 text-[14px] text-brand-primary hover:bg-brand-primary/5 transition-colors flex items-center gap-2.5 font-medium cursor-pointer"
                                            onClick={() => {
                                                setAccountDropdownOpen(false);
                                                navigate("account");
                                            }}
                                        >
                                            <FiUser className="text-[15px] stroke-[2.5] text-brand-primary" />{" "}
                                            Profile
                                        </button>
                                        <button
                                            className="w-full text-left px-4 py-2.5 text-[14px] text-brand-accent hover:bg-brand-accent/10 transition-colors flex items-center gap-2.5 font-medium border-t border-brand-primary/10 cursor-pointer"
                                            onClick={() => {
                                                setAccountDropdownOpen(false);
                                                setShowLogoutConfirm(true);
                                            }}
                                        >
                                            <FiLogOut className="text-[15px] stroke-[2.5]" />{" "}
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* --- MOBILE HAMBURGER BUTTON --- */}
                    <button
                        className="md:hidden text-2xl text-brand-primary p-2 -mr-2 cursor-pointer transition-transform duration-200"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        {menuOpen ? <FiX /> : <FiMenu />}
                    </button>
                </div>

                {/* --- MOBILE DROPDOWN MENU --- */}
                <div
                    className={`md:hidden absolute top-[60px] left-0 right-0 bg-brand-bg/95 backdrop-blur-xl border-b border-brand-primary/10 p-6 flex flex-col gap-5 shadow-xl max-h-[calc(100vh-60px)] overflow-y-auto z-40 transition-all duration-300 origin-top
                ${menuOpen ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0 pointer-events-none"}`}
                >
                    <div className="flex flex-col gap-4 mb-2">
                        {user && (
                            <button
                                className={`flex items-center gap-3 text-base font-medium py-3 px-2 border-b border-brand-primary/10 rounded-lg transition-colors text-left ${
                                    location.pathname === "/dashboard"
                                        ? "text-brand-secondary bg-brand-primary/5 border-transparent"
                                        : "text-brand-primary hover:bg-brand-primary/5"
                                }`}
                                onClick={() => {
                                    setMenuOpen(false);
                                    navigate("dashboard");
                                }}
                            >
                                <FiSearch
                                    className={`text-xl stroke-[2.5] ${location.pathname === "/dashboard" ? "text-brand-secondary" : "text-brand-secondary/80"}`}
                                />{" "}
                                Discover
                            </button>
                        )}
                        {user && (
                            <button
                                className={`flex items-center gap-3 text-base font-medium py-3 px-2 border-b border-brand-primary/10 rounded-lg transition-colors text-left ${
                                    location.pathname === "/saved"
                                        ? "text-brand-secondary bg-brand-primary/5 border-transparent"
                                        : "text-brand-primary hover:bg-brand-primary/5"
                                }`}
                                onClick={() => {
                                    setMenuOpen(false);
                                    navigate("saved");
                                }}
                            >
                                <FiHeart
                                    className={`text-xl stroke-[2.5] ${location.pathname === "/saved" ? "text-brand-secondary" : "text-brand-secondary/80"}`}
                                />{" "}
                                Saved
                            </button>
                        )}
                        {user && (
                            <button
                                className={`flex items-center gap-3 text-base font-medium py-3 px-2 rounded-lg transition-colors text-left ${
                                    location.pathname === "/account"
                                        ? "text-brand-secondary bg-brand-primary/5"
                                        : "text-brand-primary hover:bg-brand-primary/5"
                                }`}
                                onClick={() => {
                                    setMenuOpen(false);
                                    navigate("account");
                                }}
                            >
                                <FiUser
                                    className={`text-xl stroke-[2.5] ${location.pathname === "/account" ? "text-brand-secondary" : "text-brand-secondary/80"}`}
                                />{" "}
                                Account
                            </button>
                        )}
                    </div>

                    {!user ? (
                        <div className="flex flex-col gap-3">
                            <button
                                className="bg-brand-secondary text-white w-full py-4 rounded-xl text-[15px] font-bold shadow-md active:scale-[0.98] transition-all"
                                onClick={() => {
                                    setMenuOpen(false);
                                    navigate("signup");
                                }}
                            >
                                Sign Up
                            </button>
                            <button
                                className="bg-transparent text-brand-primary w-full py-4 rounded-xl text-[15px] font-bold border-2 border-brand-primary/20 active:scale-[0.98] transition-all"
                                onClick={() => {
                                    setMenuOpen(false);
                                    navigate("login");
                                }}
                            >
                                Log In
                            </button>
                        </div>
                    ) : (
                        <div className="pt-2">
                            <button
                                className="w-full bg-brand-accent/10 py-4 rounded-xl text-[15px] font-bold flex items-center justify-center gap-2.5 text-brand-accent border border-brand-accent/20 hover:bg-brand-accent hover:text-white transition-colors active:scale-[0.98]"
                                onClick={() => {
                                    setMenuOpen(false);
                                    setShowLogoutConfirm(true);
                                }}
                            >
                                <FiLogOut className="text-xl stroke-[2.5]" />
                                Sign Out
                            </button>
                        </div>
                    )}

                    <div className="pt-2 border-t border-brand-primary/10 mt-2 flex justify-center">
                        <button
                            onClick={toggleTheme}
                            className="flex items-center gap-2 p-3 rounded-xl text-brand-primary hover:bg-brand-primary/10 transition-colors w-full justify-center font-medium group"
                        >
                            <div
                                key={theme}
                                className="book-animate flex items-center justify-center"
                            >
                                {theme === "dark" ? (
                                    <>
                                        <FiBook className="text-xl stroke-[2.5] mr-2" />
                                        Dark Mode
                                    </>
                                ) : (
                                    <>
                                        <FiBookOpen className="text-xl stroke-[2.5] mr-2" />
                                        Light Mode
                                    </>
                                )}
                            </div>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Logout Confirmation Modal Overlay */}
            {showLogoutConfirm &&
                createPortal(
                    <div
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-primary/40 backdrop-blur-sm slide-up"
                        onClick={() => setShowLogoutConfirm(false)}
                    >
                        <div
                            className="bg-brand-card rounded-[24px] shadow-2xl w-full max-w-sm overflow-hidden flex flex-col items-center relative p-8 animate-in zoom-in-95 duration-200"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="w-16 h-16 bg-brand-accent/10 text-brand-accent rounded-full flex items-center justify-center text-[28px] mb-4">
                                <FiLogOut />
                            </div>
                            <h3 className="serif text-[24px] font-black text-brand-primary mb-2 text-center">
                                Log Out?
                            </h3>
                            <p className="text-[14px] text-brand-primary/70 text-center mb-8">
                                Are you sure you want to log out of your Appitat
                                account?
                            </p>
                            <div className="w-full flex flex-col gap-3">
                                <button
                                    className="w-full bg-brand-accent hover:bg-brand-accent/90 text-brand-bg py-3.5 rounded-xl text-[15px] font-bold transition-colors active:scale-[0.98]"
                                    onClick={() => {
                                        setShowLogoutConfirm(false);
                                        logout();
                                    }}
                                >
                                    Yes, log me out
                                </button>
                                <button
                                    className="w-full bg-brand-primary/5 hover:bg-brand-primary/10 text-brand-primary py-3.5 rounded-xl text-[15px] font-bold transition-colors active:scale-[0.98]"
                                    onClick={() => setShowLogoutConfirm(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>,
                    document.body,
                )}
        </>
    );
}
