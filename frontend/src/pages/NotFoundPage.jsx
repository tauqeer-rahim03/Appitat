import { useApp } from "../context/AppContext";

export default function NotFoundPage({ 
    title = "Oops! The recipe burned.", 
    message = "We can't seem to find the page you're looking for. It might have been devoured, moved, or perhaps someone forgot to set the kitchen timer!",
    code = "404",
    subtext = "Error Code: 404 (Missing Ingredient)"
}) {
    const { navigate } = useApp();

    return (
        <div className="min-h-screen bg-[#fdf8f2] flex flex-col items-center justify-center p-6 text-center">
            <div className="absolute top-0 right-0 bottom-0 left-[55%] bg-gradient-to-br from-[#1e0f00] to-[#3d2010] pointer-events-none [clip-path:polygon(10%_0,100%_0,100%_100%,0%_100%)] hidden md:block opacity-30" />

            <div className="slide-up max-w-[500px] relative z-10 w-full mb-10">
                <div className="text-[120px] mb-2 drop-shadow-sm leading-none">
                    🍳
                </div>

                <h1 className="serif text-[clamp(60px,10vw,100px)] font-black text-[#1e0f00] leading-none mb-1 tracking-tight">
                    {code}
                </h1>

                <h2 className="serif text-[clamp(28px,4vw,36px)] font-bold text-[#C97D2E] mb-6">
                    {title}
                </h2>

                <p className="text-[#6b5240] text-lg leading-relaxed mb-10">
                    {message}
                </p>

                <button
                    className="btn-primary px-8 py-3.5 rounded-[12px] text-[15px] shadow-md shadow-[#C97D2E]/20"
                    onClick={() => {
                        if (code === "500") {
                            window.location.href = "/";
                        } else {
                            navigate("hero");
                        }
                    }}
                >
                    {code === "500" ? "Reset Kitchen →" : "Back to the Kitchen →"}
                </button>
            </div>

            <div className="absolute bottom-10 text-[13px] text-[#8a6642]">
                {subtext}
            </div>
        </div>
    );
}
