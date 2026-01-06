import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { FaUtensils, FaCreditCard, FaClock, FaCheckCircle, FaTruck } from "react-icons/fa";

const MyOrders = () => {
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    const { data: orders = [], isLoading } = useQuery({
        queryKey: ['my-orders', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/orders?email=${user.email}`);
            return res.data;
        }
    });

    const handlePayClick = (order) => {
        if (order.orderStatus !== 'delivered') {
            Swal.fire({
                icon: 'info',
                title: 'Preparing your meal...',
                text: 'Please wait for the chef to deliver the order before paying.',
                confirmButtonColor: '#f97316'
            });
        } else {
            navigate(`/dashboard/payment/${order._id}`);
        }
    };

    if (isLoading) return (
        <div className="flex justify-center items-center h-screen">
            <span className="loading loading-spinner loading-lg text-orange-500"></span>
        </div>
    );

    return (
        <div className="w-full min-h-screen bg-gray-50 p-6 md:p-12 font-sans">
            
            {/* Header Section */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="flex flex-col md:flex-row justify-between items-center mb-10"
            >
                <div>
                    <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500">
                        My Orders
                    </h2>
                    <p className="text-gray-500 mt-2">Track your delicious meals and payments.</p>
                </div>
                <div className="bg-white px-6 py-3 rounded-full shadow-sm border border-gray-100 mt-4 md:mt-0">
                    <span className="text-gray-600 font-bold">Total Orders: </span>
                    <span className="text-orange-500 font-bold text-xl ml-2">{orders.length}</span>
                </div>
            </motion.div>

            {orders.length === 0 ? (
                <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center bg-white rounded-3xl shadow-xl p-20 text-center border border-dashed border-gray-300"
                >
                    <div className="bg-orange-50 p-6 rounded-full mb-6">
                        <FaUtensils className="text-6xl text-orange-300" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-700">No orders yet</h3>
                    <p className="text-gray-500 mt-2 mb-8">Go ahead and explore our delicious menu!</p>
                    <button onClick={() => navigate('/meals')} className="btn btn-primary bg-gradient-to-r from-orange-500 to-pink-500 border-none text-white px-8 rounded-full hover:shadow-lg transform hover:scale-105 transition-all">
                        Browse Menu
                    </button>
                </motion.div>
            ) : (
                <div className="overflow-hidden rounded-2xl shadow-2xl bg-white border border-gray-100">
                    <table className="table w-full">
                        {/* Table Head */}
                        <thead>
                            <tr className="bg-gradient-to-r from-orange-50 to-pink-50 text-gray-700 text-sm uppercase tracking-wider">
                                <th className="py-5 pl-8">Meal Details</th>
                                <th className="text-center">Qty</th>
                                <th className="text-center">Price</th>
                                <th className="text-center">Status</th>
                                <th className="text-center pr-8">Action</th>
                            </tr>
                        </thead>
                        
                        {/* Table Body */}
                        <tbody className="divide-y divide-gray-100">
                            {orders.map((order, index) => (
                                <motion.tr 
                                    key={order._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="hover:bg-orange-50/30 transition-colors duration-300 group"
                                >
                                    <td className="pl-8 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="avatar">
                                                <div className="mask mask-squircle w-16 h-16 shadow-md group-hover:scale-105 transition-transform duration-300">
                                                    <img src={order.image} alt="Meal" className="object-cover" />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-bold text-lg text-gray-800">{order.mealName}</div>
                                                <div className="text-xs text-gray-400 mt-1">Order #{order._id.slice(-6)}</div>
                                            </div>
                                        </div>
                                    </td>
                                    
                                    <td className="text-center font-medium text-gray-600">
                                        x{order.quantity}
                                    </td>
                                    
                                    <td className="text-center">
                                        <span className="font-bold text-orange-600 text-lg">${order.price}</span>
                                    </td>
                                    
                                    <td className="text-center">
                                        <div className="flex justify-center">
                                            {order.orderStatus === 'pending' && (
                                                <span className="badge bg-yellow-100 text-yellow-700 border-none p-3 gap-2 font-bold shadow-sm">
                                                    <FaClock /> Pending
                                                </span>
                                            )}
                                            {order.orderStatus === 'cooking' && (
                                                <span className="badge bg-blue-100 text-blue-700 border-none p-3 gap-2 font-bold shadow-sm">
                                                    <FaUtensils /> Cooking
                                                </span>
                                            )}
                                            {order.orderStatus === 'ready' && (
                                                <span className="badge bg-purple-100 text-purple-700 border-none p-3 gap-2 font-bold shadow-sm">
                                                    <FaCheckCircle /> Ready
                                                </span>
                                            )}
                                            {order.orderStatus === 'delivered' && (
                                                <span className="badge bg-green-100 text-green-700 border-none p-3 gap-2 font-bold shadow-sm">
                                                    <FaTruck /> Delivered
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    
                                    <td className="text-center pr-8">
                                        {order.paymentStatus === 'paid' ? (
                                            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-green-50 text-green-600 border border-green-200 shadow-sm">
                                                <FaCheckCircle className="mr-2" /> Paid
                                            </span>
                                        ) : (
                                            <button 
                                                onClick={() => handlePayClick(order)}
                                                className={`btn btn-sm px-6 rounded-full border-none shadow-md transition-all duration-300 ${
                                                    order.orderStatus === 'delivered' 
                                                    ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:shadow-lg hover:scale-105' 
                                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                }`}
                                            >
                                                <FaCreditCard className="mr-2" /> Pay Bill
                                            </button>
                                        )}
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default MyOrders;