import { useContext, useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { AuthContext } from "../providers/AuthProvider";
import Swal from "sweetalert2";
import { FaShoppingCart, FaStar } from "react-icons/fa";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../hooks/useAxiosSecure"; // ✅ Import Secure Hook

const MealDetails = () => {
    const meal = useLoaderData();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure(); // ✅ Initialize
    
    const { _id, title, image, price, rating, description, chefName, chefEmail } = meal || {};
    const [reviewText, setReviewText] = useState("");

    const { data: reviews = [], refetch } = useQuery({
        queryKey: ['reviews', _id],
        queryFn: async () => {
            const res = await axios.get(`https://foodmate-server-v2.vercel.app/reviews`);
            return res.data.filter(r => r.mealId === _id);
        }
    });

    const handleAddToOrder = () => {
        if (user && user.email) {
            navigate('/order', { state: { meal: meal } });
        } else {
            Swal.fire({
                title: 'Please Login',
                text: "You need to login to order food",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Login now!'
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/login');
                }
            })
        }
    }

    const handlePostReview = (e) => {
        e.preventDefault();
        if(!user) return Swal.fire('Error', 'Please login to review', 'error');

        const reviewData = {
            mealId: _id,
            mealTitle: title,
            user: user.displayName,
            email: user.email,
            image: user.photoURL,
            rating: 5, 
            review: reviewText,
            date: new Date()
        };

        // ✅ FIX: Use axiosSecure.post (Sends token) instead of axios.post
        axiosSecure.post('/reviews', reviewData)
            .then(res => {
                if(res.data.insertedId){
                    Swal.fire('Success', 'Review added!', 'success');
                    setReviewText("");
                    refetch();
                }
            })
            .catch(error => {
                console.error(error);
                Swal.fire('Error', 'Failed to post review. Try logging in again.', 'error');
            });
    }

    return (
        <div className="pt-6 px-4 max-w-screen-xl mx-auto mb-20">
            <div className="card lg:card-side bg-base-100 shadow-2xl overflow-hidden">
                <figure className="lg:w-1/2">
                    <img src={image} alt={title} className="w-full h-full object-cover" />
                </figure>
                <div className="card-body lg:w-1/2">
                    <h2 className="card-title text-4xl font-bold mb-2">{title}</h2>
                    <p className="text-gray-500 font-semibold mb-4">Chef: {chefName}</p>
                    <div className="flex items-center gap-2 mb-6">
                        <FaStar className="text-yellow-400 text-xl" />
                        <span className="text-xl font-bold">{rating ? rating.toFixed(1) : "New"}</span>
                        <span className="text-gray-400">({reviews.length} reviews)</span>
                    </div>
                    <p className="text-gray-700 mb-6">{description}</p>
                    
                    <div className="flex items-center justify-between mt-auto">
                        <span className="text-4xl font-bold text-orange-500">${price}</span>
                        <button onClick={handleAddToOrder} className="btn btn-primary bg-orange-500 border-none text-white px-8">
                            <FaShoppingCart className="mr-2"/> Order Now
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-16">
                <h3 className="text-3xl font-bold mb-8">Customer Reviews</h3>
                {user && (
                    <form onSubmit={handlePostReview} className="mb-10 bg-gray-50 p-6 rounded-xl border">
                        <textarea 
                            className="textarea textarea-bordered w-full" 
                            placeholder="Write a review..."
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            required
                        ></textarea>
                        <button className="btn btn-sm btn-accent mt-2">Post Review</button>
                    </form>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {reviews.map((rev) => (
                        <div key={rev._id} className="chat chat-start">
                            <div className="chat-image avatar">
                                <div className="w-10 rounded-full">
                                    <img src={rev.image} alt="User" />
                                </div>
                            </div>
                            <div className="chat-header">
                                {rev.user}
                                <time className="text-xs opacity-50 ml-2">{new Date(rev.date).toLocaleDateString()}</time>
                            </div>
                            <div className="chat-bubble bg-orange-100 text-gray-800">{rev.review}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MealDetails;