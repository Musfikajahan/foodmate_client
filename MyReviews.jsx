import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";
import axios from "axios";
import { FaQuoteRight, FaStar, FaUtensils } from "react-icons/fa";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const MyReviews = () => {
    const { user } = useContext(AuthContext);

    const { data: reviews = [] } = useQuery({
        queryKey: ['my-reviews', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axios.get(`http://localhost:5000/reviews?email=${user.email}`);
            return res.data;
        }
    });

    // Animation Variants
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 }
    };

    return (
        <div className="min-h-screen bg-gray-50 w-full p-10 pt-24">
            
            {/* Header Section */}
            <div className="text-center mb-12">
                <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600 mb-2">
                    My Culinary Critique
                </h2>
                <p className="text-gray-500">Your journey through flavors and tastes.</p>
            </div>

            {/* Grid Container */}
            <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 max-w-7xl mx-auto"
                variants={container}
                initial="hidden"
                animate="show"
            >
                {reviews.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-20 opacity-50">
                        <FaUtensils className="text-6xl text-gray-300 mb-4" />
                        <p className="text-xl text-gray-500">You haven't written any reviews yet.</p>
                        <Link to="/meals" className="btn btn-link text-orange-500 mt-2">Go taste something!</Link>
                    </div>
                ) : (
                    reviews.map(review => (
                        <motion.div 
                            key={review._id} 
                            variants={item}
                            whileHover={{ y: -10 }}
                            className="card bg-white shadow-xl hover:shadow-2xl transition-all duration-300 border-b-4 border-orange-500 overflow-hidden group"
                        >
                            <div className="card-body relative p-8">
                                
                                {/* Decorative Big Quote Icon */}
                                <FaQuoteRight className="absolute top-6 right-6 text-6xl text-orange-100 group-hover:text-orange-200 transition-colors" />

                                {/* Reviewer Info (Sexy Header) */}
                                <div className="flex items-center gap-4 mb-4 relative z-10">
                                    <div className="avatar">
                                        <div className="w-12 h-12 rounded-full ring ring-orange-400 ring-offset-2">
                                            <img src={user?.photoURL} alt="Reviewer" />
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-800">{user?.displayName}</h4>
                                        <p className="text-xs text-gray-400">Verified Taster</p>
                                    </div>
                                </div>

                                {/* Meal Title */}
                                <h3 className="text-xl font-bold text-orange-600 mb-1 z-10 relative">
                                    {review.mealTitle}
                                </h3>

                                {/* Star Rating */}
                                <div className="flex text-yellow-400 mb-4 z-10 relative">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar 
                                            key={i} 
                                            className={`text-lg drop-shadow-sm ${i < review.rating ? "text-yellow-400" : "text-gray-200"}`} 
                                        />
                                    ))}
                                </div>

                                {/* Review Text */}
                                <p className="text-gray-600 italic leading-relaxed z-10 relative bg-orange-50/50 p-4 rounded-xl border border-orange-100">
                                    "{review.review}"
                                </p>

                                {/* Action Buttons (Optional) */}
                                <div className="card-actions justify-end mt-6">
                                    <Link to={`/meals/${review.mealId}`}>
                                        <button className="btn btn-sm btn-outline border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white">
                                            View Meal
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </motion.div>
        </div>
    );
};

export default MyReviews;