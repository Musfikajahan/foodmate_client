import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../hooks/useAxiosSecure'; // Your axios hook
import useAuth from '../../hooks/useAuth'; // Your auth hook

const ManageOrders = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    // Fetch orders specific to this chef
    const { data: orders = [], refetch } = useQuery({
        queryKey: ['chef-orders', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/chef-orders/${user.email}`);
            return res.data;
        }
    });

    // Handle Status Updates
    const handleStatusUpdate = async (orderId, newStatus) => {
        const res = await axiosSecure.patch(`/update-order-status/${orderId}`, { status: newStatus });
        if (res.data.modifiedCount > 0) {
            refetch(); // Refresh the table
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: `Order marked as ${newStatus}`,
                showConfirmButton: false,
                timer: 1500
            });
        }
    };

    return (
        <div className="p-8 bg-gray-900 min-h-screen text-white">
            <h2 className="text-3xl font-bold mb-8">Manage Orders ({orders.length})</h2>
            
            <div className="overflow-x-auto">
                <table className="table w-full text-gray-300">
                    {/* Head */}
                    <thead>
                        <tr className="text-gray-400 border-b border-gray-700">
                            <th>Meal Info</th>
                            <th>Customer</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order._id} className="border-b border-gray-800 hover:bg-gray-800">
                                {/* Meal Info */}
                                <td>
                                    <div className="font-bold text-lg">{order.mealName}</div>
                                    <div className="text-sm opacity-70">Qty: {order.quantity} | Price: ${order.price}</div>
                                </td>

                                {/* Customer Info */}
                                <td>
                                    <div>{order.userEmail}</div>
                                    <div className="text-xs opacity-60">{order.userAddress}</div>
                                </td>

                                {/* Status Badge */}
                                <td>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                        order.orderStatus === 'pending' ? 'bg-yellow-500 text-black' :
                                        order.orderStatus === 'accepted' ? 'bg-blue-500 text-white' :
                                        order.orderStatus === 'delivered' ? 'bg-green-500 text-white' :
                                        'bg-red-500 text-white'
                                    }`}>
                                        {order.orderStatus.toUpperCase()}
                                    </span>
                                </td>

                                {/* Action Buttons [cite: 353-368] */}
                                <td className="flex gap-2">
                                    {/* CANCEL Button */}
                                    <button
                                        onClick={() => handleStatusUpdate(order._id, 'cancelled')}
                                        disabled={order.orderStatus !== 'pending'}
                                        className="btn btn-xs btn-error"
                                    >
                                        Cancel
                                    </button>

                                    {/* ACCEPT Button */}
                                    <button
                                        onClick={() => handleStatusUpdate(order._id, 'accepted')}
                                        disabled={order.orderStatus !== 'pending'}
                                        className="btn btn-xs btn-info"
                                    >
                                        Accept
                                    </button>

                                    {/* DELIVER Button (Only enabled if accepted) */}
                                    <button
                                        onClick={() => handleStatusUpdate(order._id, 'delivered')}
                                        disabled={order.orderStatus !== 'accepted'}
                                        className="btn btn-xs btn-success"
                                    >
                                        Deliver
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageOrders;