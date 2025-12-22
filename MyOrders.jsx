import React, { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AuthContext } from '../providers/AuthProvider';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';

const MyOrders = () => {
    const { user } = useContext(AuthContext);

    const { data: orders = [], refetch } = useQuery({
        queryKey: ['myOrders', user?.email],
        enabled: !!user?.email, // Only run query if user email exists
        queryFn: async () => {
            const res = await axios.get(`https://foodmate-server-v2.vercel.app/orders?email=${user.email}`);
            return res.data;
        }
    });

    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "Cancel this order?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "Yes, cancel it!"
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`https://foodmate-server-v2.vercel.app/orders/${id}`)
                    .then(res => {
                        if (res.data.deletedCount > 0) {
                            refetch();
                            Swal.fire("Cancelled!", "Order has been cancelled.", "success");
                        }
                    })
            }
        });
    }

    return (
        <div className="w-full p-10">
            <h2 className="text-3xl font-bold mb-5">My Orders: {orders.length}</h2>
            <div className="overflow-x-auto bg-base-200 rounded-xl p-4">
                <table className="table">
                    <thead className="bg-black text-white rounded-lg">
                        <tr>
                            <th>#</th>
                            <th>Item Name</th>
                            <th>Quantity</th>
                            <th>Total Price</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Pay</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((item, index) => (
                            <tr key={item._id}>
                                <th>{index + 1}</th>
                                {/* Added fallback: if mealName is missing, try name */}
                                <td className="font-bold">
                                    {item.mealName || item.name || "Unknown Item"}
                                </td>
                                <td>{item.quantity || 1}</td>
                                {/* Added fallback: if totalPrice is missing, try price */}
                                <td>${item.totalPrice || item.price || 0}</td>
                                <td>{item.orderTime ? new Date(item.orderTime).toLocaleDateString() : 'N/A'}</td>
                                
                                {/* Order Status Badge */}
                                <td>
                                    <span className={`badge ${
                                        item.orderStatus === 'pending' ? 'badge-warning' : 
                                        item.orderStatus === 'accepted' ? 'badge-info' :
                                        item.orderStatus === 'delivered' ? 'badge-success' :
                                        item.orderStatus === 'paid' ? 'badge-success' :
                                        'badge-ghost'
                                    } text-white capitalize`}>
                                        {item.orderStatus || 'pending'}
                                    </span>
                                </td>

                                {/* Payment Button */}
                                <td>
                                    {item.orderStatus === 'paid' || item.paymentStatus === 'paid' ? (
                                        <span className="text-green-500 font-bold">Paid</span>
                                    ) : (
                                        <Link to={`/dashboard/payment/${item._id}`}>
                                            <button 
                                                className="btn btn-sm btn-primary"
                                                disabled={item.orderStatus !== 'accepted'}
                                                title={item.orderStatus !== 'accepted' ? "Wait for Chef to accept" : "Pay Now"}
                                            >
                                                Pay
                                            </button>
                                        </Link>
                                    )}
                                </td>

                                {/* Cancel Button */}
                                <td>
                                    <button 
                                        onClick={() => handleDelete(item._id)} 
                                        className="btn btn-sm btn-error text-white"
                                        disabled={item.orderStatus !== 'pending'}
                                    >
                                        Cancel
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

export default MyOrders;