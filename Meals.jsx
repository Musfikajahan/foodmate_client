import { useEffect, useState } from "react";
import axios from "axios";
import MealCard from "../components/MealCard";

const Meals = () => {
    const [meals, setMeals] = useState([]);
    const [search, setSearch] = useState("");
    const [sortOrder, setSortOrder] = useState(""); // 'asc' or 'desc'
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        axios.get('http://localhost:5000/meals')
            .then(res => {
                setMeals(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    // Filter and Sort Logic (Client-side for simplicity)
    const filteredMeals = meals
        .filter(meal => meal.title.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => {
            if (sortOrder === 'asc') return a.price - b.price;
            if (sortOrder === 'desc') return b.price - a.price;
            return 0;
        });

    return (
        <div className="pt-2 px-4 max-w-screen-xl mx-auto min-h-screen">
            {/* --- Controls Section --- */}
            <div className="flex flex-col md:flex-row justify-between items-center my-8 gap-4 bg-base-200 p-4 rounded-xl">
                
                {/* Search Input */}
                <div className="form-control w-full md:w-1/2">
                    <div className="input-group">
                        <input 
                            type="text" 
                            placeholder="Search for food..." 
                            className="input input-bordered w-full"
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* Sort Dropdown */}
                <select 
                    className="select select-bordered w-full md:w-auto"
                    onChange={(e) => setSortOrder(e.target.value)}
                    value={sortOrder}
                >
                    <option value="">Sort by Price</option>
                    <option value="asc">Low to High</option>
                    <option value="desc">High to Low</option>
                </select>
            </div>

            {/* --- Meals Grid --- */}
            {loading ? (
                <div className="flex justify-center mt-20">
                    <span className="loading loading-bars loading-lg text-chef-primary"></span>
                </div>
            ) : (
                <>
                    {filteredMeals.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
                            {filteredMeals.map(meal => (
                                <MealCard key={meal._id} meal={meal} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center mt-20">
                            <h3 className="text-2xl font-bold text-gray-400">No meals found matching your search.</h3>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Meals;