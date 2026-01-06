import React, { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AuthContext } from '../providers/AuthProvider';
import axios from 'axios';

const PaymentHistory = () => {
    const { user } = useContext(AuthContext);

    const { data: payments = [] } = useQuery({
        queryKey: ['payments', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const token = localStorage.getItem('access-token'); // Get Token
            // Fixed URL and added headers
            const res = await axios.get(`http://localhost:5000/payments/${user.email}`, {
                headers: { authorization: `Bearer ${token}` }
            });
            return res.data;
        }
    });

    return (
        <div className="w-full p-10">
            <h2 className="text-3xl font-bold mb-5">Payment History</h2>
            <p className="mb-5 text-gray-500">Total Payments: {payments.length}</p>

            <div className="overflow-x-auto bg-base-200 rounded-xl p-4">
                <table className="table">
                    {/* Head */}
                    <thead className="bg-chef-primary text-white rounded-lg">
                        <tr>
                            <th>#</th>
                            <th>Amount</th>
                            <th>Transaction ID</th>
                            <th>Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.map((payment, index) => (
                            <tr key={payment._id}>
                                <th>{index + 1}</th>
                                <td className="font-bold text-green-600">${payment.price}</td>
                                <td className="font-mono text-xs">{payment.transactionId}</td>
                                <td>{new Date(payment.date).toLocaleString()}</td>
                                <td>
                                    <span className="badge badge-success text-white">Paid</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PaymentHistory;