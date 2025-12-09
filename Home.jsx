import { useEffect, useState } from "react";
import Banner from "../components/Banner";
import MealCard from "../components/MealCard";
import axios from "axios";

const Home = () => {
    const [meals, setMeals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch data from your backend
        axios.get('http://localhost:5000/meals')
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
        <div>
            <Banner />

            <div className="my-20 px-4 max-w-screen-xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-800 mb-2">Top Meals Today</h2>
                    <p className="text-gray-500">Check out the most popular dishes from our local chefs</p>
                    <div className="w-24 h-1 bg-chef-primary mx-auto mt-4 rounded-full"></div>
                </div>

                {loading ? (
                    <div className="text-center">
                        <span className="loading loading-spinner loading-lg text-chef-primary"></span>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
                        {/* Show only the first 6 meals on home page */}
                        {meals.slice(0, 6).map(meal => (
                            <MealCard key={meal._id} meal={meal} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;