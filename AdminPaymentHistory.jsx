import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const AdminPaymentHistory = () => {
    const { data: payments = [], isLoading } = useQuery({
        queryKey: ['allPayments'],
        queryFn: async () => {
            const token = localStorage.getItem('access-token'); // Get Token
            // Fixed URL and added headers
            const res = await axios.get('http://localhost:5000/payments', {
                headers: { authorization: `Bearer ${token}` }
            });
            return res.data;
        }
    });

    if (isLoading) {
        return <div className="text-center mt-20"><span className="loading loading-spinner loading-lg"></span></div>;
    }

    return (
        <div className="w-full p-10">
            <h2 className="text-3xl font-bold mb-5 text-center">All Payment History</h2>
            <div className="overflow-x-auto bg-base-200 rounded-xl p-4 shadow-lg">
                <table className="table">
                    <thead className="bg-chef-primary text-white">
                        <tr>
                            <th>#</th>
                            <th>User Email</th> 
                            <th>Transaction ID</th>
                            <th>Amount</th>
                            <th>Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.map((payment, index) => (
                            <tr key={payment._id}>
                                <th>{index + 1}</th>
                                <td className="font-bold">{payment.email}</td>
                                <td className="font-mono text-xs">{payment.transactionId}</td>
                                <td className="text-green-600 font-bold">${payment.price}</td>
                                <td>{new Date(payment.date).toLocaleDateString()}</td>
                                <td>
                                    <span className="badge badge-success text-white">
                                        {payment.status || 'paid'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminPaymentHistory;