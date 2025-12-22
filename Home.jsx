import { useEffect, useState } from "react";
import Banner from "../components/Banner";
import MealCard from "../components/MealCard";
import axios from "axios";
import { motion } from "framer-motion";

const Home = () => {
    const [meals, setMeals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('https://foodmate-server-v2.vercel.app/meals')
            .then(res => {
                setMeals(res.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching meals:", error);
                setLoading(false);
            });
    }, []);

    return (
        <div className="overflow-hidden">
            {/* Banner */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 1 }}
            >
                <Banner />
            </motion.div>

            {/* Section */}
            <div className="my-20 px-4 max-w-screen-xl mx-auto">
                <div className="text-center mb-12">
                    <motion.h2 
                        className="text-4xl font-extrabold text-amber-400 mb-2 relative inline-block"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        Top Meals Today
                        <motion.div 
                            className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 rounded-full"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 1, ease: "easeInOut" }}
                        />
                    </motion.h2>
                    <motion.p 
                        className="text-pink-400 mt-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                    >
                        Check out the most popular dishes from our talented chefs
                    </motion.p>
                </div>

                {loading ? (
                    <div className="text-center">
                        <span className="loading loading-spinner loading-lg text-chef-primary"></span>
                    </div>
                ) : (
                    <motion.div 
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                    >
                        {meals.slice(0, 6).map(meal => (
                            <motion.div 
                                key={meal._id}
                                whileHover={{ scale: 1.05, y: -5 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-full"
                            >
                                <MealCard meal={meal} />
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Home;
