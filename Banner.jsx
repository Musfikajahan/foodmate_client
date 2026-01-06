import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Banner = () => {
    // --- 1. LIQUID BACKGROUND ---
    const liquidBackground = {
        background: "linear-gradient(-45deg, #FF6B6B, #FF8E53, #FFC107, #FF3D00)",
        backgroundSize: "400% 400%",
        animation: "liquid 10s ease infinite",
        position: "absolute",
        inset: 0,
        zIndex: -1, // ✅ FIX: Set to -1 to stay behind content
        opacity: 0.9 
    };

    const styleSheet = document.styleSheets[0];
    const keyframes = `
        @keyframes liquid {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
    `;
    try { if (styleSheet) styleSheet.insertRule(keyframes, styleSheet.cssRules.length); } catch (e) {}

    // --- 2. ANIMATION VARIANTS ---
    
    // Scene 1: Chef enters, grabs food, exits
    const chefVariant = {
        animate: {
            x: [-200, 100, 100, 400, 400], 
            opacity: [0, 1, 1, 0, 0], 
            transition: { duration: 12, repeat: Infinity, ease: "easeInOut", times: [0, 0.1, 0.3, 0.4, 1] }
        }
    };

    // Scene 2: Delivery Boy zooms across
    const bikeVariant = {
        animate: {
            x: [-200, "100vw"], 
            transition: { 
                duration: 6, 
                repeat: Infinity, 
                ease: "linear", 
                delay: 4, 
                repeatDelay: 6 
            }
        }
    };

    // Scene 3: Customer appears & gets happy
    const customerVariant = {
        animate: {
            opacity: [0, 0, 1, 1, 0], 
            scale: [1, 1, 1, 1.2, 1], 
            transition: { duration: 12, repeat: Infinity, times: [0, 0.6, 0.7, 0.9, 1] }
        }
    };

    // Floating Particles
    const particles = [...Array(15)].map((_, i) => ({
        id: i,
        size: Math.random() * 15 + 5,
        left: Math.random() * 100,
        duration: Math.random() * 3 + 2,
        delay: Math.random() * 2
    }));

    return (
        // ✅ FIX: Added 'z-0' to create a local stacking context
        <div className="relative z-0 min-h-[750px] overflow-hidden flex items-center justify-center bg-orange-600">
            
            {/* BACKGROUND LAYER */}
            <div style={liquidBackground}></div>
            
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/20 z-0"></div>

            {/* --- MOVIE ANIMATION LAYER --- */}
            
            {/* 1. CHEF */}
            <motion.div 
                className="absolute left-0 bottom-1/3 text-8xl z-10"
                variants={chefVariant}
                animate="animate"
            >
                👨‍🍳
                <motion.span 
                    className="absolute -right-12 top-4 text-6xl"
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 12, times: [0.1, 0.2, 0.4], repeat: Infinity }}
                >
                    🍔
                </motion.span>
            </motion.div>

            {/* 2. DELIVERY BOY */}
            <motion.div 
                className="absolute left-0 bottom-1/4 text-8xl z-10"
                variants={bikeVariant}
                animate="animate"
            >
                🚴
                <span className="text-4xl absolute -top-2 right-4">🎒</span>
            </motion.div>

            {/* 3. CUSTOMER */}
            <motion.div 
                className="absolute right-10 bottom-1/3 text-8xl z-10"
                variants={customerVariant}
                animate="animate"
            >
                🙋‍♂️
                <motion.span 
                    className="absolute -left-10 top-10 text-6xl"
                    animate={{ opacity: [0, 0, 1, 0], y: [0, 0, -20, 0] }}
                    transition={{ duration: 12, times: [0, 0.8, 0.85, 1], repeat: Infinity }}
                >
                    🍔
                </motion.span>
                <motion.span 
                    className="absolute top-0 right-0 text-5xl"
                    animate={{ opacity: [0, 0, 1, 0], scale: [0, 0, 1.5, 0] }}
                    transition={{ duration: 12, times: [0, 0.85, 0.9, 1], repeat: Infinity }}
                >
                    ❤️
                </motion.span>
            </motion.div>


            {/* --- FLOATING AMBIENCE --- */}
            {["🍕", "🍟", "🥗", "🍦", "🍩"].map((emoji, i) => (
                <motion.div
                    key={i}
                    className="absolute text-6xl opacity-60 z-0"
                    initial={{ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight }}
                    animate={{ y: [0, -50, 0], rotate: [0, 20, -20, 0] }}
                    transition={{ duration: Math.random() * 3 + 2, repeat: Infinity, ease: "easeInOut" }}
                    style={{ top: `${Math.random() * 80}%`, left: `${Math.random() * 90}%` }}
                >
                    {emoji}
                </motion.div>
            ))}

            {/* --- PARTICLES --- */}
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    className="absolute bg-white rounded-full opacity-30"
                    style={{ width: p.size, height: p.size, left: `${p.left}%`, bottom: -20 }}
                    animate={{ y: -800, opacity: [0, 0.5, 0] }}
                    transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "linear" }}
                />
            ))}


            {/* --- MAIN CONTENT --- */}
            <div className="hero-content relative text-center z-20 mt-10">
                <div className="max-w-4xl mx-auto px-4 bg-black/10 backdrop-blur-sm rounded-3xl p-8 border border-white/10 shadow-2xl">
                    <motion.h1 
                        className="mb-4 text-6xl sm:text-8xl font-black text-white"
                        style={{ textShadow: "4px 4px 0px #000, 0 0 30px rgba(255,165,0,0.8)" }}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", bounce: 0.5 }}
                    >
                        FAST & FRESH
                    </motion.h1>

                    <motion.h2
                        className="mb-8 text-3xl sm:text-5xl font-bold text-yellow-300"
                        style={{ textShadow: "2px 2px 0px #000" }}
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        From Kitchen to Doorstep!
                    </motion.h2>

                    <motion.p 
                        className="mb-8 text-xl text-white font-medium drop-shadow-md"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        Watch the magic happen. Order now and track your meal in real-time.
                    </motion.p>
                    
                    <Link to="/meals">
                        <motion.button
                            className="px-10 py-5 rounded-full bg-white text-orange-600 font-black text-2xl shadow-[0_6px_0_rgb(0,0,0,0.3)] border-b-4 border-gray-300 active:shadow-none active:translate-y-2 active:border-none transition-all"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            ORDER NOW 🚀
                        </motion.button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Banner;