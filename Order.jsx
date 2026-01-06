import { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import useAxiosSecure from "../hooks/useAxiosSecure"; // Use Secure for posting
import { AuthContext } from "../providers/AuthProvider";
import Swal from "sweetalert2";

const Order = () => {
    const { user } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();
    const { register, handleSubmit } = useForm();
    const axiosSecure = useAxiosSecure();
    
    const { meal } = location.state || {};

    const onSubmit = (data) => {
        if (!meal) return;

        const orderInfo = {
            mealId: meal._id,
            mealName: meal.title,
            image: meal.image,
            price: parseFloat(meal.price) * parseInt(data.quantity),
            quantity: parseInt(data.quantity),
            userEmail: user.email,
            userName: user.displayName,
            userAddress: data.address,
            userPhone: data.phone,
            chefId: meal.chefEmail, 
            orderStatus: 'pending',
            paymentStatus: 'unpaid',
            orderDate: new Date()
        };

        axiosSecure.post('/orders', orderInfo)
            .then(res => {
                if (res.data.insertedId) {
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: 'Order Placed!',
                        text: 'Wait for the chef to confirm.',
                        showConfirmButton: false,
                        timer: 2000
                    });
                    // ✅ FIX: Go to "My Orders" instead of Payment
                    navigate('/dashboard/my-orders');
                }
            });
    };

    if (!meal) return <div className="text-center mt-20">No meal selected. Please go back.</div>;

    return (
        <div className="hero min-h-screen bg-base-200 py-10">
            <div className="hero-content flex-col lg:flex-row-reverse w-full max-w-4xl">
                <div className="text-center lg:text-left lg:w-1/2">
                    <img src={meal.image} alt="Meal" className="rounded-xl shadow-2xl w-full h-64 object-cover mb-4" />
                    <h1 className="text-4xl font-bold">{meal.title}</h1>
                    <p className="py-6 text-2xl font-bold text-orange-500">${meal.price}</p>
                </div>
                
                <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100 lg:w-1/2">
                    <form onSubmit={handleSubmit(onSubmit)} className="card-body">
                        <h2 className="text-2xl font-bold text-center mb-4">Confirm Order</h2>
                        <div className="form-control">
                            <label className="label"><span className="label-text">Quantity</span></label>
                            <input type="number" defaultValue={1} min="1" {...register("quantity", {required: true})} className="input input-bordered" />
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text">Delivery Address</span></label>
                            <textarea {...register("address", {required: true})} className="textarea textarea-bordered" placeholder="Your full address"></textarea>
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text">Phone Number</span></label>
                            <input type="tel" {...register("phone", {required: true})} className="input input-bordered" placeholder="+1234..." />
                        </div>
                        <div className="form-control mt-6">
                            <button className="btn btn-primary bg-orange-500 border-none">Place Order</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Order;