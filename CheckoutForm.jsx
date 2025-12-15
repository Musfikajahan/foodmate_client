import React, { useEffect, useState, useContext } from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { AuthContext } from "../../providers/AuthProvider";

const CheckoutForm = ({ order }) => {
  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [message, setMessage] = useState("");

  const stripe = useStripe();
  const elements = useElements();
  const axiosPublic = useAxiosPublic();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const price = Number(order?.totalPrice || order?.price || 0);

  // Determine if payment is allowed
  const isPayable = order?.orderStatus === "delivered";

  // Set dynamic message for non-payable orders
  useEffect(() => {
    if (!isPayable) {
      switch (order?.orderStatus) {
        case "pending":
          setMessage("Order is not yet accepted by the chef.");
          break;
        case "accepted":
          setMessage("Order is accepted but not delivered yet.");
          break;
        case "cancelled":
          setMessage("Order is cancelled. Payment not allowed.");
          break;
        case "paid":
          setMessage("Order is already paid.");
          break;
        default:
          setMessage("Payment not allowed for this order.");
      }
    } else {
      setMessage("");
    }
  }, [order?.orderStatus, isPayable]);

  useEffect(() => {
    if (price > 0 && isPayable) {
      axiosPublic
        .post("/create-payment-intent", { price, orderId: order._id })
        .then((res) => setClientSecret(res.data.clientSecret))
        .catch((err) => console.error("❌ Payment intent error:", err));
    }
  }, [axiosPublic, price, order._id, isPayable]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!stripe || !elements || !isPayable) return;

    const card = elements.getElement(CardElement);
    if (!card) return;

    // Create Payment Method
    const { error: createError } = await stripe.createPaymentMethod({
      type: "card",
      card,
      billing_details: {
        email: user?.email || "anonymous",
        name: user?.displayName || "anonymous",
      },
    });

    if (createError) {
      setError(createError.message);
      return;
    }

    // Confirm Payment
    const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card },
    });

    if (confirmError) {
      setError(confirmError.message);
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      setTransactionId(paymentIntent.id);

      const payment = {
        email: user.email,
        price,
        transactionId: paymentIntent.id,
        date: new Date(),
        orderId: order._id,
        status: "paid",
      };

      try {
        const res = await axiosPublic.post("/payments", payment);
        if (res.data?.paymentResult?.insertedId) {
          Swal.fire({
            icon: "success",
            title: "Payment Successful!",
            text: `Transaction ID: ${paymentIntent.id}`,
          });
          navigate("/dashboard/my-orders");
        }
      } catch (err) {
        console.error("❌ Error saving payment:", err);
        setError("Payment succeeded but failed to update order. Contact support.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full md:w-2/3 mx-auto bg-base-200 p-8 rounded-xl shadow-lg">
      <h3 className="text-xl font-bold mb-6 text-center">Enter Card Details</h3>

      {!isPayable && (
        <p className="text-red-500 font-bold text-center mb-4">{message}</p>
      )}

      <div className="border p-4 rounded bg-white">
        <CardElement
          options={{
            style: {
              base: { fontSize: "16px", color: "#424770", "::placeholder": { color: "#aab7c4" } },
              invalid: { color: "#9e2146" },
            },
          }}
        />
      </div>

      {error && <p className="text-red-500 mt-4 text-sm font-bold">{error}</p>}
      {transactionId && <p className="text-green-600 font-bold mt-2">Transaction ID: {transactionId}</p>}

      <button
        type="submit"
        disabled={!stripe || !clientSecret || !isPayable}
        className="btn btn-primary mt-6 w-full bg-chef-primary border-none text-white"
      >
        Pay ${price}
      </button>
    </form>
  );
};

export default CheckoutForm;
