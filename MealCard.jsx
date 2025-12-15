import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { motion } from "framer-motion";

const MealCard = ({ meal }) => {
    // ✅ FIXED: Destructure both 'title' AND 'name' so we can check both
    const { _id, title, name, image, price, rating, category, chefName } = meal;

    // ✅ FIXED: Use 'title' if it exists; otherwise use 'name'. Fallback to "Unnamed Meal".
    const displayTitle = title || name || "Unnamed Meal";

    // Generate random rating if missing
    const displayRating = rating !== undefined && rating !== null 
        ? rating.toFixed(1) 
        : (Math.random() * (5 - 3) + 3).toFixed(1); // random 3.0 to 5.0

    return (
        <motion.div 
            className="card w-96 bg-white shadow-lg hover:shadow-2xl transition-shadow duration-500 rounded-3xl overflow-hidden group border border-gray-100"
            whileHover={{ scale: 1.03 }}
        >
            <div className="relative h-60 overflow-hidden rounded-t-3xl">
                <motion.img
                    src={image}
                    // ✅ FIXED: Use the correct display title for alt text
                    alt={displayTitle} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 group-hover:rotate-1"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-3xl"></div>
            </div>

            <div className="card-body">
                <div className="flex justify-between items-center mb-2">
                    <motion.div className="badge badge-gradient badge-lg text-white" whileHover={{ scale: 1.1 }}>
                        {category}
                    </motion.div>
                    <motion.div className="flex items-center text-yellow-600 font-bold gap-1 text-lg" whileHover={{ scale: 1.1 }}>
                        <FaStar /> 
                        <span className="ml-1">{displayRating} Rating</span>
                    </motion.div>
                </div>

                {/* ✅ FIXED: Render 'displayTitle' here */}
                <motion.h2 
                    className="card-title text-2xl font-extrabold text-gray-900 mb-1"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    {displayTitle}
                </motion.h2>

                <motion.p className="text-gray-700 text-sm mb-4"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                >
                    Chef: {chefName}
                </motion.p>

                <div className="card-actions justify-between items-center mt-4">
                    <motion.p className="text-xl font-bold text-chef-primary text-amber-500" whileHover={{ scale: 1.05 }}>
                        ${price}
                    </motion.p>

                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        {/* Note: Ensure your route handles _id correctly (we fixed this in the backend already) */}
                        <Link
                            to={`/meals/${_id}`}
                            className="btn bg-gradient-to-r from-chef-dark to-chef-primary text-yellow-400 hover:from-chef-primary hover:to-chef-dark border-none"
                        >
                            View Details
                        </Link>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default MealCard;