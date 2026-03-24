import { useState, useEffect } from "react";

/**
 * Custom hook for managing App theme (light/dark)
 */
export default function useTheme() {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem("appitat_theme") || "light";
    });

    useEffect(() => {
        localStorage.setItem("appitat_theme", theme);
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    };

    return { theme, toggleTheme };
}
