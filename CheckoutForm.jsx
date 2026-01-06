import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState, useContext } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { AuthContext } from "../../providers/AuthProvider";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const CheckoutForm = ({ order }) => {
    const [error, setError] = useState('');
    const [clientSecret, setClientSecret] = useState('');
    const [transactionId, setTransactionId] = useState('');
    const stripe = useStripe();
    const elements = useElements();
    const axiosSecure = useAxiosSecure();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const totalPrice = order.price;

    useEffect(() => {
        if (totalPrice > 0) {
            axiosSecure.post('/create-payment-intent', { price: totalPrice })
                .then(res => {
                    setClientSecret(res.data.clientSecret);
                })
        }
    }, [axiosSecure, totalPrice])

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        const card = elements.getElement(CardElement);
        if (card === null) return;

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card
        });

        if (error) {
            console.log('payment error', error);
            setError(error.message);
        } else {
            setError('');
        }

        const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: card,
                billing_details: {
                    email: user?.email || 'anonymous',
                    name: user?.displayName || 'anonymous'
                }
            }
        })

        if (confirmError) {
            console.log('confirm error', confirmError);
            setError(confirmError.message);
        } else {
            if (paymentIntent.status === 'succeeded') {
                setTransactionId(paymentIntent.id);
                const payment = {
                    email: user.email,
                    price: totalPrice,
                    transactionId: paymentIntent.id,
                    date: new Date(),
                    orderId: order._id,
                    menuItemIds: [order.mealId], 
                    status: 'service pending'
                }
                const res = await axiosSecure.post('/payments', payment);
                if (res.data?.paymentResult?.insertedId) {
                    Swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: "Payment Successful!",
                        showConfirmButton: false,
                        timer: 1500
                    });
                    navigate('/dashboard/payment-history')
                }
            }
        }
    }

    return (
        <form onSubmit={handleSubmit} className="w-full">
            <div className="mb-6">
                <label className="block font-bold text-gray-700 mb-2">Card Details</label>
                
                {/* Simplified Container */}
                <div className="border border-gray-300 rounded-lg p-4 bg-white">
                    <CardElement
                        options={{
                            style: {
                                base: {
                                    fontSize: '16px',
                                    color: '#000000', // Black Text
                                    '::placeholder': {
                                        color: '#777777', // Grey Placeholder
                                    },
                                },
                                invalid: {
                                    color: '#9e2146',
                                },
                            },
                        }}
                    />
                </div>
            </div>
            
            {error && <p className="text-red-600 mb-4 text-sm font-bold">{error}</p>}
            {transactionId && <p className="text-green-600 mb-4 text-sm font-bold"> Transaction ID: {transactionId}</p>}

            <button 
                className="btn btn-primary w-full bg-orange-500 border-none text-white font-bold text-lg mt-4" 
                type="submit" 
                // Button is disabled if Stripe hasn't loaded (Key issue) or ClientSecret is missing
                disabled={!stripe || !clientSecret}
            >
                {stripe ? `Pay $${totalPrice}` : "Loading Stripe..."}
            </button>
        </form>
    );
};

export default CheckoutForm;