import { useContext } from "react";
import { useLocation, useNavigate, useLoaderData } from "react-router-dom";
import { useForm } from "react-hook-form";
import { AuthContext } from "../providers/AuthProvider";
import Swal from "sweetalert2";
import axios from "axios";

const Order = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const loaderMeal = useLoaderData(); 
    const location = useLocation();
    const meal = loaderMeal || location.state?.meal; 
    
    if (!meal) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] animate-fadeIn">
                <h2 className="text-3xl font-bold mb-4 text-red-500">No meal selected!</h2>
                <button 
                    onClick={() => navigate('/meals')} 
                    className="btn btn-gradient animate-pulse hover:scale-105 transition-transform duration-300"
                >
                    Go to Meals
                </button>
            </div>
        );
    }

    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const quantity = watch("quantity", 1); 
    const totalPrice = (meal.price * quantity).toFixed(2);

    const onSubmit = data => {
        const orderData = {
            mealId: meal._id, 
            mealName: meal.title,
            mealImage: meal.image, 
            price: parseFloat(meal.price),
            quantity: parseInt(data.quantity),
            totalPrice: parseFloat(totalPrice),
            chefId: meal.chefEmail, 
            userEmail: user.email,
            userName: user.displayName,
            userAddress: data.address,
            paymentStatus: "Pending",
            orderStatus: "pending"
        };

        Swal.fire({
            title: 'Confirm Order?',
            html: `<b>Total Price:</b> $${totalPrice}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#FF6B00',
            cancelButtonColor: '#6B7280',
            confirmButtonText: 'Yes, Order!'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.post('https://foodmate-server-v2.vercel.app/orders', orderData)
                    .then(res => {
                        if (res.data.insertedId || res.data.modifiedCount > 0) {
                            Swal.fire(
                                'Success!',
                                'Your order has been placed.',
                                'success'
                            );
                            navigate('/dashboard/my-orders');
                        }
                    })
                    .catch(error => {
                        console.error(error);
                        Swal.fire('Error', 'Something went wrong.', 'error');
                    });
            }
        });
    };

    return (
        <div className="max-w-4xl mx-auto my-14 p-8 bg-gradient-to-r from-orange-100 via-white to-pink-100 rounded-3xl shadow-2xl animate-fadeIn transition-all duration-500">
            <h2 className="text-4xl font-extrabold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500 animate-gradient-x">
                Confirm Your Order
            </h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                
                {/* Meal Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold text-lg">Meal Name</span>
                        </label>
                        <input type="text" value={meal.title} readOnly className="input input-bordered bg-gray-100 focus:ring-2 focus:ring-orange-400 transition duration-300" />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold text-lg">Price (Per Unit)</span>
                        </label>
                        <input type="text" value={`$${meal.price}`} readOnly className="input input-bordered bg-gray-100 focus:ring-2 focus:ring-pink-400 transition duration-300" />
                    </div>
                </div>

                {/* Quantity */}
                <div className="form-control">
                    <label className="label">
                        <span className="label-text font-semibold text-lg">Quantity</span>
                    </label>
                    <input 
                        type="number" 
                        defaultValue={1} 
                        min="1" 
                        {...register("quantity", { required: true, min: 1 })} 
                        className="input input-bordered border-orange-400 focus:ring-2 focus:ring-orange-300 transition duration-300 hover:scale-105"
                    />
                </div>

                {/* Delivery Address */}
                <div className="form-control">
                    <label className="label">
                        <span className="label-text font-semibold text-lg">Delivery Address</span>
                    </label>
                    <textarea 
                        {...register("address", { required: true })} 
                        placeholder="Your address..." 
                        className="textarea textarea-bordered h-28 focus:ring-2 focus:ring-pink-300 transition duration-300 hover:scale-105"
                    ></textarea>
                    {errors.address && <span className="text-red-500 text-sm mt-1">Address is required</span>}
                </div>

                <div className="divider before:bg-orange-300 after:bg-pink-300"></div>
                
                {/* Total Price */}
                <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-lg mb-6 hover:shadow-2xl transition-shadow duration-300">
                    <span className="text-2xl font-bold text-gray-700">Total:</span>
                    <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500">${totalPrice}</span>
                </div>

                {/* Buttons */}
                <div className="flex gap-6">
                    <button 
                        type="button" 
                        onClick={() => navigate(-1)} 
                        className="btn btn-outline border-red-500 text-red-500 flex-1 hover:bg-red-100 hover:scale-105 transition-all duration-300"
                    >
                        Cancel
                    </button>
                    <input 
                        type="submit" 
                        value="Confirm Order" 
                        className="btn btn-gradient flex-1 text-white font-bold hover:scale-105 transition-transform duration-300"
                    />
                </div>
            </form>
        </div>
    );
};

export default Order;
