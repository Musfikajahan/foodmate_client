import React, { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AuthContext } from '../providers/AuthProvider';
import { Link } from 'react-router-dom'; // Import Link for navigation
import Swal from 'sweetalert2';
import axios from 'axios';

const MyOrders = () => {
    const { user } = useContext(AuthContext);

    const { data: orders = [], refetch } = useQuery({
        queryKey: ['myOrders', user?.email],
        queryFn: async () => {
            const res = await axios.get(`http://localhost:5000/orders?email=${user.email}`);
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
                axios.delete(`http://localhost:5000/orders/${id}`)
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
                            <th>Pay</th> {/* New Payment Column */}
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((item, index) => (
                            <tr key={item._id}>
                                <th>{index + 1}</th>
                                <td className="font-bold">{item.mealName}</td>
                                <td>{item.quantity}</td>
                                <td>${item.totalPrice}</td>
                                <td>{new Date(item.orderTime).toLocaleDateString()}</td>
                                
                                {/* Order Status Badge */}
                                <td>
                                    <span className={`badge ${
                                        item.orderStatus === 'pending' ? 'badge-warning' : 
                                        item.orderStatus === 'accepted' ? 'badge-info' :
                                        item.orderStatus === 'delivered' ? 'badge-success' :
                                        'badge-ghost'
                                    } text-white capitalize`}>
                                        {item.orderStatus || 'pending'}
                                    </span>
                                </td>

                                {/* --- PAYMENT COLUMN --- */}
                                <td>
                                    {item.paymentStatus === 'paid' ? (
                                        <span className="text-green-500 font-bold">Paid</span>
                                    ) : (
                                        <Link to={`/dashboard/payment/${item._id}`}>
                                            <button 
                                                className="btn btn-sm btn-primary"
                                                // Disable button unless Chef has accepted the order
                                                disabled={item.orderStatus !== 'accepted'}
                                                title={item.orderStatus !== 'accepted' ? "Wait for Chef to accept" : "Pay Now"}
                                            >
                                                Pay
                                            </button>
                                        </Link>
                                    )}
                                </td>

                                {/* Cancel Action */}
                                <td>
                                    <button 
                                        onClick={() => handleDelete(item._id)} 
                                        className="btn btn-sm btn-error text-white"
                                        // Disable cancel if chef has already started cooking (accepted)
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