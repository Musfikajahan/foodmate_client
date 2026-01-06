import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaQuoteLeft, FaStar } from 'react-icons/fa';
import axios from 'axios';

const CustomerReviews = () => {
    const [reviews, setReviews] = useState([]);
    
    useEffect(() => {
        // 1. Try to fetch Real Reviews from your Backend
        axios.get('http://localhost:5000/reviews')
            .then(res => {
                if (res.data.length > 0) {
                    setReviews(res.data);
                } else {
                    // 2. If DB is empty, load Dummy Data so section isn't blank
                    loadDummyData();
                }
            })
            .catch(err => {
                console.log("Could not fetch reviews, loading dummy data.");
                loadDummyData();
            });
    }, []);

    const loadDummyData = () => {
        setReviews([
            { _id: 1, name: "John Doe", review: "The best homemade food I've ever tasted!", rating: 5, image: "https://i.pravatar.cc/150?img=1" },
            { _id: 2, name: "Jane Smith", review: "Delivery was super fast and food was hot.", rating: 4.5, image: "https://i.pravatar.cc/150?img=5" },
            { _id: 3, name: "Mike Ross", review: "Authentic flavors, reminds me of home.", rating: 5, image: "https://i.pravatar.cc/150?img=11" }
        ]);
    }

    return (
        <div className="my-20 px-4 max-w-screen-xl mx-auto">
            {/* Header Section */}
            <div className="text-center mb-12">
                <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500 mb-2">
                    What Our Customers Say
                </h2>
                <p className="text-gray-500 font-medium">Real feedback from our beloved foodies</p>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {reviews.slice(0, 3).map((review, index) => (
                    <motion.div
                        key={review._id}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.2, duration: 0.5 }}
                        viewport={{ once: true }} // Animates only once
                        className="card bg-base-100 shadow-xl border border-gray-100 p-8 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 rounded-3xl"
                    >
                        {/* Quote Icon */}
                        <div className="mb-4">
                            <FaQuoteLeft className="text-5xl text-orange-200" />
                        </div>

                        {/* Review Text */}
                        <p className="text-white-600 mb-6 italic leading-relaxed min-h-[80px]">
                            "{review.review}"
                        </p>

                        {/* Reviewer Info */}
                        <div className="flex items-center gap-4 mt-auto">
                            <div className="avatar">
                                <div className="w-14 h-14 rounded-full ring ring-orange-400 ring-offset-base-100 ring-offset-2">
                                    {/* Handle missing images gracefully */}
                                    <img 
                                        src={review.image || "https://i.ibb.co/T0h0cbf/user-placeholder.png"} 
                                        alt={review.name} 
                                        onError={(e) => {
                                            e.target.onerror = null; 
                                            e.target.src="https://i.ibb.co/T0h0cbf/user-placeholder.png"
                                        }}
                                    />
                                </div>
                            </div>
                            <div>
                                <h4 className="font-bold text-lg text-white-800">
                                    {review.name || "Happy Customer"}
                                </h4>
                                <div className="flex text-yellow-400 text-sm mt-1">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar 
                                            key={i} 
                                            className={i < Math.round(review.rating) ? "text-yellow-400" : "text-gray-300"} 
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default CustomerReviews;