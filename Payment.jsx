import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useLoaderData } from "react-router-dom";
import CheckoutForm from "./CheckoutForm";

const stripePromise = loadStripe(import.meta.env.VITE_PAYMENT_GATEWAY_PK);

const Payment = () => {
  const order = useLoaderData();

  if (!order) return <p>Loading...</p>;

  let message = "";
  const isPayable = order.orderStatus === "delivered";

  if (order.orderStatus === "pending") {
    message = "Your order is not accepted by the chef yet.";
  } else if (order.orderStatus === "accepted") {
    message = "Your order is accepted but not delivered yet.";
  } else if (order.orderStatus === "cancelled") {
    message = "This order was cancelled by the chef. Payment is not allowed.";
  } else if (order.orderStatus === "paid") {
    message = "This order is already paid.";
  }

  return (
    <div className="p-10 w-full">
      <h2 className="text-3xl text-center mb-10 font-bold text-chef-primary">
        Payment for <span className="text-black">{order.mealName}</span>
      </h2>

      {!isPayable ? (
        <p className="text-red-500 font-bold text-center text-lg">{message}</p>
      ) : (
        <Elements stripe={stripePromise}>
          <CheckoutForm order={order} />
        </Elements>
      )}
    </div>
  );
};

export default Payment;
