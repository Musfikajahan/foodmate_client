import { useContext } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { AuthContext } from "../providers/AuthProvider";
import Swal from "sweetalert2";
import { FaShoppingCart, FaStar, FaTimes } from "react-icons/fa"; 

const MealDetails = () => {
    const meal = useLoaderData();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const { _id, title, image, price, rating, description, ingredients, chefName, reviews_count } = meal;

    const handleAddToOrder = () => {
         Swal.fire({
            title: 'Ready to Order?',
            text: `You are ordering ${title} for $${price}`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#FF6B00',
            confirmButtonText: 'Yes, go to checkout!'
         }).then((result) => {
            if (result.isConfirmed) {
                // ---------------------------------------------------------
                // 🔴 FIX: Changed '/order/confirm' to `/order/${_id}`
                // This matches your Router path: path: "order/:id"
                // ---------------------------------------------------------
                navigate(`/order/${_id}`, { state: { meal } });
            }
         })
    }

    // Function to go back
    const handleClose = () => {
        navigate(-1); // This goes back to the previous page (Meals or Home)
    }

    return (
        <div className="hero min-h-screen bg-base-100 px-4 py-10 relative">
            {/* --- CLOSE BUTTON --- */}
            <button 
                onClick={handleClose} 
                className="btn btn-circle btn-sm btn-ghost absolute top-2 right-2 md:top-5 md:right-10 z-20 text-2xl hover:bg-gray-200"
            >
                <FaTimes />
            </button>

            <div className="hero-content flex-col lg:flex-row gap-10 border p-8 rounded-2xl shadow-lg relative bg-white">
                 {/* Alternate close button inside the card for better visibility on mobile */}
                <button 
                    onClick={handleClose} 
                    className="btn btn-circle btn-sm btn-ghost absolute top-2 right-2 lg:hidden"
                >
                    <FaTimes />
                </button>

                <img src={image} className="max-w-sm md:max-w-md rounded-lg shadow-2xl" alt={title} />
                <div>
                    <h1 className="text-5xl font-bold text-gray-800">{title}</h1>
                    <p className="py-4 text-gray-600">{description}</p>
                    
                    <div className="flex flex-wrap gap-2 my-4">
                        <div className="badge badge-lg badge-outline gap-2">
                            <FaStar className="text-yellow-500"/> {rating} ({reviews_count} reviews)
                        </div>
                        <div className="badge badge-lg badge-secondary">Chef: {chefName}</div>
                    </div>

                    <div className="my-6">
                        <h3 className="font-bold text-lg mb-2">Ingredients:</h3>
                        <ul className="list-disc list-inside text-gray-500">
                            {ingredients?.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex items-center gap-6 mt-8">
                        <span className="text-4xl font-bold text-chef-primary">${price}</span>
                        <button onClick={handleAddToOrder} className="btn btn-primary bg-chef-primary border-none text-white px-8 text-lg">
                            <FaShoppingCart className="mr-2"/> Order Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MealDetails;