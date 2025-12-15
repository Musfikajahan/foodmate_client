import { useContext } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { AuthContext } from "../providers/AuthProvider";
import Swal from "sweetalert2";
import { FaShoppingCart, FaStar, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";

const MealDetails = () => {
    const meal = useLoaderData();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    
    // Destructure properties safely
    const { _id, title, image, price, rating, description, ingredients, chefName, reviews_count } = meal || {};

    // Fallback rating
    const displayRating = rating !== undefined && rating !== null 
        ? rating.toFixed(1)
        : (Math.random() * (5 - 3) + 3).toFixed(1);

    // Fallback image
    const displayImage = image 
        ? image 
        : "https://via.placeholder.com/600x400?text=Meal+Image+Not+Available";

    const handleAddToOrder = () => {
        // ✅ [FIX ADDED HERE] Safety check for missing ID
        if (!_id) {
            Swal.fire({
                title: 'Error',
                text: 'Meal data is missing. Please reload the page.',
                icon: 'error',
                confirmButtonColor: '#d33'
            });
            return;
        }

        Swal.fire({
            title: 'Ready to Order?',
            text: `You are ordering ${title} for $${price}`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#FF6B00',
            confirmButtonText: 'Yes, go to checkout!'
        }).then((result) => {
            if (result.isConfirmed) {
                // Now safely navigates because we checked _id above
                navigate(`/order/${_id}`, { state: { meal } });
            }
        });
    };

    const handleClose = () => navigate(-1);

    // If meal data didn't load at all, show a loading state
    if (!meal) {
        return <div className="text-center py-20">Loading meal details...</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100 px-4 py-10 relative">
            
            {/* Close Button */}
            <button 
                onClick={handleClose} 
                className="btn btn-circle btn-sm btn-ghost absolute top-5 right-5 z-30 text-2xl text-gray-700 hover:bg-gray-300 transition-all"
            >
                <FaTimes />
            </button>

            <motion.div 
                className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 p-6 lg:p-10 rounded-3xl shadow-2xl bg-white relative"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                {/* Meal Image */}
                <motion.div className="flex-1 flex justify-center items-center max-h-[500px]">
                    <motion.img
                        src={displayImage} 
                        alt={title} 
                        className="w-full max-h-[500px] rounded-2xl shadow-2xl object-cover"
                        whileHover={{ scale: 1.05 }}
                    />
                </motion.div>

                {/* Meal Info */}
                <div className="flex-1 flex flex-col justify-between">
                    <div>
                        <motion.h1 
                            className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4"
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            {title}
                        </motion.h1>

                        <motion.p 
                            className="text-gray-800 mb-6 leading-relaxed"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                        >
                            {description}
                        </motion.p>

                        <div className="flex flex-wrap gap-3 mb-6">
                            <motion.div 
                                className="badge badge-lg badge-gradient gap-2 flex items-center text-gray-900"
                                whileHover={{ scale: 1.05 }}
                            >
                                <FaStar className="text-yellow-500"/> {displayRating} ({reviews_count || 0} reviews)
                            </motion.div>
                            <motion.div 
                                className="badge badge-lg badge-secondary text-gray-100"
                                whileHover={{ scale: 1.05 }}
                            >
                                Chef: {chefName}
                            </motion.div>
                        </div>

                        {ingredients && ingredients.length > 0 && (
                            <div className="mb-6">
                                <h3 className="font-bold text-lg mb-2 text-gray-900">Ingredients:</h3>
                                <ul className="list-disc list-inside text-yellow-700">
                                    {ingredients.map((item, index) => (
                                        <motion.li 
                                            key={index}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            {item}
                                        </motion.li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Price & Order Button */}
                    <motion.div 
                        className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-4 lg:mt-0"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <span className="text-4xl lg:text-5xl font-extrabold text-chef-primary drop-shadow-md text-amber-500">
                            ${price}
                        </span>
                        <motion.button 
                            onClick={handleAddToOrder} 
                            className="btn btn-primary bg-chef-primary border-none text-amber-500 px-8 py-4 text-xl shadow-xl hover:scale-105 transition-transform duration-300"
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <FaShoppingCart className="mr-2"/> Order Now
                        </motion.button>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default MealDetails;