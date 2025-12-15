import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAuth from '../../hooks/useAuth';
import { motion } from 'framer-motion';

const ManageOrders = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    // Fetch chef's orders
    const { data: orders = [], refetch } = useQuery({
        queryKey: ['chef-orders', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/orders/chef/${user.email}`);
            return res.data;
        }
    });

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            const res = await axiosSecure.patch(`/orders/status/${orderId}`, { status: newStatus });
            if (res.data.modifiedCount > 0) {
                refetch();
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: `Order marked as ${newStatus}`,
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        } catch (error) {
            console.error("Error updating status:", error);
            Swal.fire('Error', 'Failed to update order', 'error');
        }
    };

    const statusStyles = {
        pending: "bg-yellow-500 text-black",
        accepted: "bg-blue-500 text-white",
        delivered: "bg-green-500 text-white",
        cancelled: "bg-red-500 text-white"
    };

    return (
        <div className="p-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen text-white">
            <h2 className="text-4xl font-bold mb-10 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-orange-400">
                Manage Orders ({orders.length})
            </h2>

            <div className="overflow-x-auto rounded-xl shadow-lg">
                <table className="table w-full text-gray-200">
                    <thead className="bg-gradient-to-r from-pink-600 to-orange-600 text-white uppercase tracking-wider">
                        <tr>
                            <th>Meal Info</th>
                            <th>Customer</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <motion.tr 
                                key={order._id} 
                                className="border-b border-gray-700 hover:bg-gray-700 transition-all duration-300"
                                whileHover={{ scale: 1.01, backgroundColor: '#1f2937' }}
                            >
                                <td>
                                    <div className="font-semibold">{order.mealName}</div>
                                    <div className="text-sm opacity-70">Qty: {order.quantity} | ${order.price}</div>
                                </td>
                                <td>
                                    <div className="font-medium">{order.userEmail}</div>
                                    <div className="text-xs opacity-60">{order.userAddress}</div>
                                </td>
                                <td>
                                    <motion.span
                                        className={`px-4 py-1 rounded-full text-xs font-bold ${statusStyles[order.orderStatus]}`}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {order.orderStatus.toUpperCase()}
                                    </motion.span>
                                </td>
                                <td className="flex gap-2">
                                    <motion.button
                                        onClick={() => handleStatusUpdate(order._id, 'cancelled')}
                                        disabled={order.orderStatus !== 'pending'}
                                        className="btn btn-xs bg-red-500 hover:bg-red-600 text-white shadow-md"
                                        whileHover={{ scale: 1.1 }}
                                    >
                                        Cancel
                                    </motion.button>
                                    <motion.button
                                        onClick={() => handleStatusUpdate(order._id, 'accepted')}
                                        disabled={order.orderStatus !== 'pending'}
                                        className="btn btn-xs bg-blue-500 hover:bg-blue-600 text-white shadow-md"
                                        whileHover={{ scale: 1.1 }}
                                    >
                                        Accept
                                    </motion.button>
                                    <motion.button
                                        onClick={() => handleStatusUpdate(order._id, 'delivered')}
                                        disabled={order.orderStatus !== 'accepted'}
                                        className="btn btn-xs bg-green-500 hover:bg-green-600 text-white shadow-md"
                                        whileHover={{ scale: 1.1 }}
                                    >
                                        Deliver
                                    </motion.button>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageOrders;
