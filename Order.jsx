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
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <h2 className="text-2xl font-bold mb-4">Error: Meal Data Missing!</h2>
                <button onClick={() => navigate('/meals')} className="btn btn-primary">Go to Meals</button>
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

            // CUSTOMER INFO
            userEmail: user.email,
            userName: user.displayName,
            userAddress: data.address,

            // ✅ FIXED (this is required for Manage Orders)
            chefEmail: meal.chefEmail,
            chefName: meal.chefName,

            paymentStatus: "Pending",
            orderStatus: "pending",
            orderDate: new Date()
        };

        console.log("🚀 Sending Order:", orderData);

        Swal.fire({
            title: 'Confirm Order?',
            text: `Total Price: $${totalPrice}`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#FF6B00',
            confirmButtonText: 'Yes, Place Order!'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.post('https://foodmate-server-v2.vercel.app/orders', orderData)
                    .then(res => {
                        console.log("✅ Server Response:", res.data);

                        if (res.data.insertedId || res.data.modifiedCount > 0) {
                            Swal.fire('Success!', 'Your order has been placed.', 'success');
                            navigate('/dashboard/my-orders');
                        }
                    })
                    .catch(error => {
                        console.error("❌ Order Error:", error);
                        Swal.fire('Error', 'Could not place order.', 'error');
                    });
            }
        });
    };

    return (
        <div className="max-w-screen-md mx-auto my-10 p-6 bg-base-200 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold text-center mb-8 text-chef-primary">Confirm Your Order</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-control">
                        <label className="label"><span className="label-text">Meal Name</span></label>
                        <input type="text" value={meal.title} readOnly className="input input-bordered bg-gray-200 text-black" />
                    </div>
                    <div className="form-control">
                        <label className="label"><span className="label-text">Price (Per Unit)</span></label>
                        <input type="text" value={`$${meal.price}`} readOnly className="input input-bordered bg-gray-200 text-black" />
                    </div>
                    <div className="form-control">
                        <label className="label"><span className="label-text">Your Email</span></label>
                        <input type="text" value={user?.email} readOnly className="input input-bordered bg-gray-200 text-black" />
                    </div>
                    <div className="form-control">
                        <label className="label"><span className="label-text">Chef Name</span></label>
                        <input type="text" value={meal.chefName} readOnly className="input input-bordered bg-gray-200 text-black" />
                    </div>
                </div>

                <div className="form-control">
                    <label className="label"><span className="label-text font-bold">Quantity</span></label>
                    <input
                        type="number"
                        defaultValue={1}
                        min="1"
                        {...register("quantity", { required: true, min: 1 })}
                        className="input input-bordered border-chef-primary text-black bg-white"
                    />
                </div>

                <div className="form-control">
                    <label className="label"><span className="label-text font-bold">Delivery Address</span></label>
                    <textarea
                        {...register("address", { required: true })}
                        placeholder="Enter your full address..."
                        className="textarea textarea-bordered h-24 text-black bg-white"
                    ></textarea>
                    {errors.address && <span className="text-red-500 text-sm">Address is required</span>}
                </div>

                <div className="divider"></div>

                <div className="flex justify-between items-center bg-white p-4 rounded-lg mb-4">
                    <span className="text-xl font-bold text-black">Total:</span>
                    <span className="text-2xl font-bold text-chef-primary">${totalPrice}</span>
                </div>

                <div className="flex gap-4">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="btn btn-outline border-red-500 text-red-500 hover:bg-red-600 hover:text-white flex-1"
                    >
                        Quit / Cancel
                    </button>

                    <input
                        type="submit"
                        value="Confirm Order"
                        className="btn btn-primary bg-chef-primary border-none text-white flex-1"
                    />
                </div>
            </form>
        </div>
    );
};

export default Order;
