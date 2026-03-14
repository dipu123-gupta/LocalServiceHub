import React, { useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { Loader2, ShieldCheck, AlertCircle } from "lucide-react";

const CheckoutForm = ({ bookingId, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/bookings?payment_success=true&booking_id=${bookingId}`,
      },
      redirect: "if_required", // Handle success in-place if possible
    });

    if (error) {
      if (error.type === "card_error" || error.type === "validation_error") {
        setMessage(error.message);
      } else {
        setMessage("An unexpected error occurred.");
      }
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      onSuccess(paymentIntent);
    }

    setIsLoading(false);
  };

  return (
    <form
      id="payment-form"
      onSubmit={handleSubmit}
      className="flex flex-col gap-8"
    >
      <div className="bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100 shadow-inner">
         <PaymentElement id="payment-element" options={{ layout: "tabs" }} />
      </div>

      {message && (
        <motion.div
           initial={{ opacity: 0, height: 0 }}
           animate={{ opacity: 1, height: "auto" }}
           className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-xs font-bold"
        >
          <AlertCircle size={14} /> {message}
        </motion.div>
      )}

      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        disabled={isLoading || !stripe || !elements}
        id="submit"
        className={`w-full h-16 rounded-[1.5rem] bg-slate-900 border border-slate-800 text-white font-black uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-4 shadow-2xl shadow-slate-900/20 transition-all hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isLoading ? (
          <Loader2 size={18} className="animate-spin text-indigo-400" />
        ) : (
          <ShieldCheck size={18} className="text-emerald-400" />
        )}
        {isLoading ? "Validating Session..." : "Authorize Payment"}
      </motion.button>

      <div className="flex flex-col items-center gap-2">
         <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-full border border-emerald-100/50">
            <div className="w-1 h-1 rounded-full bg-emerald-500" />
            <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest leading-none">AES-256 Encrypted</span>
         </div>
         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center max-w-[200px] leading-tight opacity-40">
           Secured by Stripe Infrastructure
         </p>
      </div>
    </form>
  );
};

export default CheckoutForm;
