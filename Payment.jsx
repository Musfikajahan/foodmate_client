import { useParams } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

// 🔴 TODO: PASTE YOUR PUBLISHABLE KEY HERE (It starts with pk_test_)
// Do NOT use the sk_test_ key here!
const stripePromise = loadStripe("pk_test_51SmMkNEOduL5skydPUBSvXMhzB3ZdYaaDG10OzN0YkBiGFMmUfEIdlZCsaDaKvpEDX7vA39uCNx6gpK5QBLRpC9B00xMq75UOF"); 

const Payment = () => {
    const { id } = useParams();
    const axiosSecure = useAxiosSecure();

    // Fetch the order using the ID
    const { data: order, isLoading } = useQuery({
        queryKey: ['order-payment', id],
        queryFn: async () => {
            const res = await axiosSecure.get(`/orders/${id}`);
            return res.data;
        }
    });

    if (isLoading) {
        return (
            <div className="text-center mt-20">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    // Safety check if order is invalid
    if (!order || !order.price) {
        return (
            <div className="text-center mt-20 text-red-500 font-bold">
                Error: Order not found or Access Denied.<br/>
                Please Logout and Login again.
            </div>
        );
    }

    return (
        <div className="w-full p-10">
            <h2 className="text-3xl font-bold text-center mb-10 text-purple-600">Payment</h2>
            <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-2xl border border-gray-100">
                <div className="mb-6">
                    <h3 className="font-bold text-lg">Order Summary</h3>
                    <p className="text-gray-600">Item: <span className="font-semibold">{order.mealName}</span></p>
                    <p className="text-gray-600">Quantity: {order.quantity}</p>
                    <div className="divider my-2"></div>
                    <p className="text-xl font-bold text-orange-500">Total to Pay: ${order.price}</p>
                </div>
                
                {/* Options ensure text contrast is high */}
                <Elements stripe={stripePromise} options={{ appearance: { theme: 'stripe' } }}>
                    <CheckoutForm order={order} />
                </Elements>
            </div>
        </div>
    );
};

export default Payment;