import React from 'react';
import { motion } from 'framer-motion';
import { FaLeaf, FaTruck, FaAward } from 'react-icons/fa';

const WhyChooseUs = () => {
    const features = [
        { icon: <FaLeaf />, title: "Fresh Ingredients", desc: "We source directly from local farmers to ensure freshness." },
        { icon: <FaTruck />, title: "Fast Delivery", desc: "Hot and ready food delivered to your door in under 30 mins." },
        { icon: <FaAward />, title: "Top Chefs", desc: "Meals prepared by certified and top-rated local chefs." },
    ];

    return (
        <div className="bg-orange-50 py-20">
            <div className="max-w-screen-xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-extrabold text-gray-800">Why Choose FoodMate?</h2>
                    <p className="text-gray-600 mt-2">Experience the difference in every bite</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    {features.map((feature, index) => (
                        <motion.div 
                            key={index}
                            className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
                            whileHover={{ y: -10 }}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.2 }}
                        >
                            <div className="text-6xl text-orange-500 mb-4 mx-auto w-fit bg-orange-100 p-4 rounded-full">
                                {feature.icon}
                            </div>
                            <h3 className="text-2xl font-bold mb-3 text-gray-800">{feature.title}</h3>
                            <p className="text-gray-500">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WhyChooseUs;