import React, { useEffect, useState, useContext } from 'react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

// ✅ CORRECT IMPORT PATHS (src/pages/Payment/CheckoutForm.jsx -> src/hooks/...)
import useAxiosPublic from '../../hooks/useAxiosPublic'; 
import { AuthContext } from '../../providers/AuthProvider';

const CheckoutForm = ({ order }) => {
    const [clientSecret, setClientSecret] = useState('');
    const [error, setError] = useState('');
    const [transactionId, setTransactionId] = useState('');
    
    const stripe = useStripe();
    const elements = useElements();
    const axiosPublic = useAxiosPublic();
    const { user } = useContext(AuthContext); // This requires the import above
    const navigate = useNavigate();
    
    const price = order.totalPrice; 

    useEffect(() => {
        if (price > 0) {
            axiosPublic.post('/create-payment-intent', { price })
                .then(res => {
                    console.log("Client Secret:", res.data.clientSecret);
                    setClientSecret(res.data.clientSecret);
                })
                .catch(err => console.error("Error creating intent:", err));
        }
    }, [axiosPublic, price]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) return;

        const card = elements.getElement(CardElement);
        if (card === null) return;

        // 1. Create Payment Method
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card
        });

        if (error) {
            console.log('Payment Error:', error);
            setError(error.message);
        } else {
            console.log('Payment Method:', paymentMethod);
            setError('');
        }

        // 2. Confirm Payment
        const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: card,
                billing_details: {
                    email: user?.email || 'anonymous',
                    name: user?.displayName || 'anonymous'
                }
            }
        });

        if (confirmError) {
            console.log('Confirm Error:', confirmError);
            setError(confirmError.message);
        } else {
            console.log('Payment Intent:', paymentIntent);
            if (paymentIntent.status === 'succeeded') {
                setTransactionId(paymentIntent.id);

                // 3. Save info to Database
                const payment = {
                    email: user.email,
                    price: price,
                    transactionId: paymentIntent.id,
                    date: new Date(), 
                    orderId: order._id, 
                    status: 'paid'
                };

                const res = await axiosPublic.post('/payments', payment);
                
                if (res.data?.paymentResult?.insertedId) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Payment Successful!',
                        text: `Transaction ID: ${paymentIntent.id}`,
                        showConfirmButton: true
                    });
                    navigate('/dashboard/my-orders');
                }
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full md:w-2/3 mx-auto bg-base-200 p-8 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold mb-6 text-center">Enter Card Details</h3>
            <div className="border p-4 rounded bg-white">
                <CardElement
                    options={{
                        style: {
                            base: {
                                fontSize: '16px',
                                color: '#424770',
                                '::placeholder': { color: '#aab7c4' },
                            },
                            invalid: { color: '#9e2146' },
                        },
                    }}
                />
            </div>
            <p className="text-red-500 mt-4 text-sm font-bold">{error}</p>
            {transactionId && <p className="text-green-600 font-bold">Transaction ID: {transactionId}</p>}
            
            <button 
                className="btn btn-primary mt-6 w-full bg-chef-primary border-none text-white" 
                type="submit" 
                disabled={!stripe || !clientSecret}
            >
                Pay ${price}
            </button>
        </form>
    );
};

export default CheckoutForm;