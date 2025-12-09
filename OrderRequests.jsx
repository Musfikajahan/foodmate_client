import React, { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import axios from 'axios';
import { AuthContext } from '../providers/AuthProvider';

const OrderRequests = () => {
    const { user } = useContext(AuthContext);

    // 1. Fetch orders specific to this chef
    const { data: orders = [], refetch } = useQuery({
        queryKey: ['order-requests', user?.email],
        queryFn: async () => {
            // Since we are using standard axios for now, we use the full URL
            const res = await axios.get(`http://localhost:5000/orders/chef/${user?.email}`);
            return res.data;
        },
        enabled: !!user?.email // Only run query if user email is available
    });

    // 2. Handle Status Updates
    const handleStatusChange = (orderId, newStatus) => {
        axios.patch(`http://localhost:5000/orders/status/${orderId}`, { status: newStatus })
            .then(res => {
                if (res.data.modifiedCount > 0) {
                    refetch(); // Live update the list
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
        <div className="p-8">
            <h2 className="text-3xl font-bold mb-6 text-chef-primary">Manage Order Requests</h2>
            <div className="overflow-x-auto shadow-md sm:rounded-lg">
                <table className="table w-full">
                    {/* head */}
                    <thead className="bg-gray-200 text-gray-700 uppercase text-sm">
                        <tr>
                            <th>Meal Name</th>
                            <th>Qty</th>
                            <th>Price</th>
                            <th>Status</th>
                            <th>User Email</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length === 0 ? (
                             <tr>
                                <td colSpan="6" className="text-center py-4 text-gray-500">No orders found.</td>
                            </tr>
                        ) : (
                            orders.map(order => (
                                <tr key={order._id} className="hover:bg-gray-50">
                                    <td>
                                        <div className="font-bold">{order.mealName}</div>
                                    </td>
                                    <td>{order.quantity}</td>
                                    <td>${order.totalPrice}</td>
                                    <td>
                                        <span className={`badge ${
                                            order.orderStatus === 'pending' ? 'badge-warning' :
                                            order.orderStatus === 'accepted' ? 'badge-info' : // Changed 'cooking' to 'accepted' to match your button logic
                                            order.orderStatus === 'delivered' ? 'badge-success' :
                                            'badge-error'
                                        } text-white p-3 capitalize`}>
                                            {order.orderStatus}
                                        </span>
                                    </td>
                                    <td>
                                        {order.userEmail}
                                        <br/>
                                        <span className="text-xs opacity-50">{order.userAddress}</span>
                                    </td>
                                    <td className="flex gap-2">
                                        {/* CANCEL BUTTON */}
                                        <button 
                                            onClick={() => handleStatusChange(order._id, 'cancelled')}
                                            disabled={order.orderStatus !== 'pending'} 
                                            className="btn btn-xs btn-error text-white"
                                        >
                                            Cancel
                                        </button>

                                        {/* ACCEPT BUTTON (Starts Cooking) */}
                                        <button 
                                            onClick={() => handleStatusChange(order._id, 'accepted')}
                                            disabled={order.orderStatus !== 'pending'} 
                                            className="btn btn-xs btn-success text-white"
                                        >
                                            Accept
                                        </button>

                                        {/* DELIVER BUTTON */}
                                        <button 
                                            onClick={() => handleStatusChange(order._id, 'delivered')}
                                            // Only enabled if accepted (cooking)
                                            disabled={order.orderStatus !== 'accepted'} 
                                            className="btn btn-xs btn-primary"
                                        >
                                            Deliver
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrderRequests;