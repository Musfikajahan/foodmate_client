import { useEffect, useState } from "react";
import axios from "axios";
import MealCard from "../components/MealCard";
import { motion, AnimatePresence } from "framer-motion";

const Meals = () => {
    const [meals, setMeals] = useState([]);
    const [search, setSearch] = useState("");
    const [sortOrder, setSortOrder] = useState(""); 
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        axios.get("https://server-vert-rho.vercel.app/meals")
            .then(res => {
                setMeals(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const filteredMeals = meals
        .filter(meal => {
            const text = (meal.title || meal.name || "").toLowerCase();
            return text.includes(search.toLowerCase());
        })
        .sort((a, b) => {
            if (sortOrder === "asc") return a.price - b.price;
            if (sortOrder === "desc") return b.price - a.price;
            return 0;
        });

    return (
        <div className="pt-6 px-4 max-w-screen-xl mx-auto min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            
            {/* Controls */}
            <div className="flex flex-col md:flex-row justify-between items-center my-8 gap-4 p-5 bg-white rounded-2xl shadow-lg border border-gray-200">
                
                {/* Search */}
                <div className="form-control w-full md:w-1/2">
                    <div className="input-group">
                        <input
                            type="text"
                            placeholder="Search for meals..."
                            className="input input-bordered w-full border-chef-primary focus:outline-none focus:ring-2 focus:ring-chef-primary transition-all duration-300 text-white-800"
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* Sort */}
                <select
                    className="select select-bordered w-full md:w-auto border-chef-primary focus:outline-none focus:ring-2 focus:ring-chef-primary transition-all duration-300 text-gray-800"
                    onChange={(e) => setSortOrder(e.target.value)}
                    value={sortOrder}
                >
                    <option value="">Sort by Price</option>
                    <option value="asc">Low to High</option>
                    <option value="desc">High to Low</option>
                </select>
            </div>

            {/* Meals Grid */}
            {loading ? (
                <div className="flex justify-center mt-20">
                    <span className="loading loading-spinner loading-lg text-chef-primary"></span>
                </div>
            ) : (
                <>
                    {filteredMeals.length > 0 ? (
                        <motion.div
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center"
                            layout
                        >
                            <AnimatePresence>
                                {filteredMeals.map(meal => (
                                    <motion.div
                                        key={meal._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.4 }}
                                        whileHover={{ scale: 1.03, boxShadow: "0px 10px 25px rgba(0,0,0,0.15)" }}
                                        className="w-full"
                                    >
                                        <MealCard meal={meal} textClass="text-gray-900" />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    ) : (
                        <div className="text-center mt-20">
                            <h3 className="text-2xl font-bold text-gray-800 animate-pulse">
                                No meals found matching your search.
                            </h3>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Meals;
