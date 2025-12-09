import React from 'react';
import { Link } from 'react-router-dom';

const PaymentSuccess = () => {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center">
            <h2 className="text-4xl text-green-600 font-bold mb-4">Payment Successful!</h2>
            <p className="text-lg mb-8">Thank you for your order.</p>

            <Link to="/dashboard/payment-history">
                <button className="btn btn-primary">View Payment History</button>
            </Link>
        </div>
    );
};

export default PaymentSuccess;