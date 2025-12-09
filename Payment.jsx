import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useLoaderData } from 'react-router-dom';
import CheckoutForm from './CheckoutForm';

// Make sure VITE_PAYMENT_GATEWAY_PK matches your .env.local file key
const stripePromise = loadStripe(import.meta.env.VITE_PAYMENT_GATEWAY_PK);

const Payment = () => {
    const order = useLoaderData(); 

    return (
        <div className="p-10 w-full">
            <h2 className="text-3xl text-center mb-10 font-bold text-chef-primary">
                Payment for <span className="text-black">{order.mealName}</span>
            </h2>
            <div>
                <Elements stripe={stripePromise}>
                    <CheckoutForm order={order} />
                </Elements>
            </div>
        </div>
    );
};

export default Payment;