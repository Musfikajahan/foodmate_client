import React, { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import axios from 'axios';
import { AuthContext } from '../providers/AuthProvider';
import { motion, AnimatePresence } from 'framer-motion';

const OrderRequests = () => {
    const { user } = useContext(AuthContext);

    const { data: orders = [], refetch } = useQuery({
        queryKey: ['order-requests', user?.email],
        queryFn: async () => {
            const res = await axios.get(`http://localhost:5000/orders/chef/${user?.email}`);
            return res.data;
        },
        enabled: !!user?.email
    });

    const handleStatusChange = (orderId, newStatus) => {
        axios.patch(`http://localhost:5000/orders/status/${orderId}`, { status: newStatus })
            .then(res => {
                if (res.data.modifiedCount > 0) {
                    refetch();
                    Swal.fire({
                        icon: 'success',
                        title: `Order ${newStatus}`,
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            })
            .catch(error => {
                console.error("Error updating status:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                });
            });
    };

    return (
        <div className="p-8 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 min-h-screen">
            <h2 className="text-3xl font-extrabold mb-6 text-chef-primary">Manage Order Requests</h2>

            <div className="overflow-x-auto shadow-lg rounded-xl">
                <table className="table w-full border-separate border-spacing-y-2">
                    <thead>
                        <tr className="bg-gradient-to-r from-chef-primary to-orange-400 text-white uppercase text-sm">
                            <th>Meal Name</th>
                            <th>Qty</th>
                            <th>Price</th>
                            <th>Status</th>
                            <th>User Email</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence>
                        {orders.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center py-4 text-gray-500">No orders found.</td>
                            </tr>
                        ) : (
                            orders.map(order => (
                                <motion.tr
                                    key={order._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                    className="bg-white shadow-md rounded-xl hover:scale-[1.02] hover:shadow-xl transition-all duration-300"
                                >
                                    <td className="font-semibold text-gray-800">{order.mealName}</td>
                                    <td>{order.quantity}</td>
                                    <td className="text-chef-primary font-bold">${order.totalPrice}</td>
                                    <td>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                                            order.orderStatus === 'pending' ? 'bg-yellow-400 text-black' :
                                            order.orderStatus === 'accepted' ? 'bg-blue-400 text-white' :
                                            order.orderStatus === 'delivered' ? 'bg-green-500 text-white' :
                                            'bg-red-500 text-white'
                                        }`}>
                                            {order.orderStatus}
                                        </span>
                                    </td>
                                    <td className="text-gray-600 text-sm">
                                        {order.userEmail}<br/>
                                        <span className="opacity-50">{order.userAddress}</span>
                                    </td>
                                    <td className="flex gap-2">
                                        <button 
                                            onClick={() => handleStatusChange(order._id, 'cancelled')}
                                            disabled={order.orderStatus !== 'pending'} 
                                            className="btn btn-xs rounded-full bg-red-500 hover:bg-red-600 text-white transition-all duration-300"
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            onClick={() => handleStatusChange(order._id, 'accepted')}
                                            disabled={order.orderStatus !== 'pending'} 
                                            className="btn btn-xs rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-all duration-300"
                                        >
                                            Accept
                                        </button>
                                        <button 
                                            onClick={() => handleStatusChange(order._id, 'delivered')}
                                            disabled={order.orderStatus !== 'accepted'} 
                                            className="btn btn-xs rounded-full bg-green-500 hover:bg-green-600 text-white transition-all duration-300"
                                        >
                                            Deliver
                                        </button>
                                    </td>
                                </motion.tr>
                            ))
                        )}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrderRequests;
