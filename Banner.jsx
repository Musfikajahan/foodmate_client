import { Link } from "react-router-dom";

const Banner = () => {
    const confetti = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        color: ['red', 'yellow', 'green', 'blue', 'pink'][i % 5],
        left: Math.random() * 100,
        delay: Math.random() * 2
    }));

    return (
        <div className="relative min-h-[600px] overflow-hidden">
            {/* Background image */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80)' }}
            ></div>

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-200 via-orange-200 to-orange-300 opacity-60 animate-pulse-slow mix-blend-multiply"></div>

            {/* Confetti particles */}
            {confetti.map(c => (
                <span
                    key={c.id}
                    className={`absolute w-2 h-2 rounded-full bg-${c.color}-400 animate-fall`}
                    style={{
                        left: `${c.left}%`,
                        animationDelay: `${c.delay}s`
                    }}
                ></span>
            ))}

            {/* Floating circles */}
            <div className="absolute top-10 left-5 w-16 h-16 bg-yellow-300 rounded-full opacity-70 animate-bounce-slow"></div>
            <div className="absolute bottom-20 right-10 w-24 h-24 bg-orange-400 rounded-full opacity-60 animate-bounce-delay"></div>
            <div className="absolute top-1/2 left-1/3 w-20 h-20 bg-red-400 rounded-full opacity-50 animate-bounce-fast"></div>

            {/* Floating food emojis with steam */}
            <span className="absolute top-1/4 left-1 text-3xl animate-bounce-slow">🍕<span className="absolute -top-6 left-1 animate-steam">💨</span></span>
            <span className="absolute bottom-1/3 right-2 text-3xl animate-bounce-delay">🍔<span className="absolute -top-6 left-1 animate-steam">💨</span></span>
            <span className="absolute top-1/2 right-1/4 text-3xl animate-bounce-fast">🥗<span className="absolute -top-6 left-1 animate-steam">💨</span></span>

            {/* Bouncing utensils */}
            <span className="absolute top-1/3 left-2 text-2xl animate-bounce-slow">🍴</span>
            <span className="absolute bottom-1/4 right-3 text-2xl animate-bounce-delay">🥄</span>
            <span className="absolute top-2/3 right-1/3 text-2xl animate-bounce-fast">🔪</span>

            {/* Hero content */}
            <div className="hero-content relative text-center z-10">
                <div className="max-w-lg mx-auto px-4">
                    <h1 className="mt-35 mb-5 text-5xl sm:text-6xl font-extrabold text-purple-500 animate-bounce-slow">
                        Delicious Moments <span className="text-yellow-400 animate-pulse">Every Day!</span>
                    </h1>
                    <p className="mb-5 text-lg sm:text-xl text-yellow-200 font-medium animate-slideIn">
                        Discover delicious creations from the best local chefs fresh, fast, and ready to savor right at your doorstep.
                    </p>
                    <Link
                        to="/meals"
                        className="inline-block px-8 py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-500 animate-bounce-slow"
                    >
                        Order Now
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Banner;
