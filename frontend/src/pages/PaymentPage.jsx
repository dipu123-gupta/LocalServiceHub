import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { 
  Loader2, 
  ChevronLeft, 
  CreditCard, 
  ShieldCheck, 
  Lock, 
  CheckCircle2,
  AlertCircle,
  Calendar,
  Clock as ClockIcon,
  Store,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const PaymentPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        // Fixed string interpolation bug
        const { data } = await api.get(`/bookings/${bookingId}`);
        setBooking(data);
      } catch (err) {
        setError(err.response?.data?.message || err.extractedMessage || "Failed to fetch booking details");
      } finally {
        setIsLoading(false);
      }
    };

    if (bookingId) fetchBookingDetails();
  }, [bookingId]);

  const handlePayment = async () => {
    setPaymentLoading(true);
    try {
      const isLoaded = await loadRazorpay();
      if (!isLoaded)
        throw new Error(
          "Razorpay SDK failed to load. Please check your connection.",
        );

      const { data: order } = await api.post("/payments/create-order", {
        bookingId,
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_placeholder",
        amount: order.amount,
        currency: order.currency,
        name: "HomeServiceHub",
        description: `Payment for ${booking.service.title}`,
        order_id: order.id,
        handler: async (response) => {
          try {
            const verifyData = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId: bookingId,
              type: "booking",
            };
            await api.post("/payments/verify", verifyData);
            navigate("/bookings?payment_success=true");
          } catch (err) {
            setError(err.response?.data?.message || err.extractedMessage || "Payment verification failed");
          }
        },
        prefill: {
          name: booking.user.name,
          email: booking.user.email,
        },
        theme: {
          color: "#4f46e5",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError(err.response?.data?.message || err.extractedMessage || "Failed to initialize payment");
    } finally {
      setPaymentLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <Loader2 size={48} className="text-indigo-600 animate-spin" />
        <p className="text-slate-400 font-bold animate-pulse text-sm">Validating booking details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center p-12 bg-white rounded-[3rem] shadow-2xl shadow-red-100 border border-red-50"
        >
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8 text-red-500">
            <AlertCircle size={40} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-4">Payment Redirect Failed</h2>
          <p className="text-slate-500 font-bold mb-10 leading-relaxed text-sm">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-slate-800 transition-all active:scale-95 shadow-lg"
          >
            Go Back
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-24 px-4 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] -mr-64 -mt-64" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px] -ml-64 -mb-64" />

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors font-black text-xs uppercase tracking-widest mb-10"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
          Back to Details
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: Payment Action */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-7 bg-white rounded-[3.5rem] p-10 md:p-14 border border-slate-100 shadow-2xl shadow-slate-200/50"
          >
            <div className="flex items-center gap-4 mb-12">
              <div className="w-16 h-16 bg-indigo-600 text-white rounded-[1.5rem] flex items-center justify-center shadow-xl shadow-indigo-100">
                <ShieldCheck size={32} />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">Secure Payment</h1>
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">PCI-DSS Compliant Gateway</p>
              </div>
            </div>

            <div className="space-y-10">
              <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100/50">
                <div className="flex items-center gap-3 text-indigo-600 font-black text-sm mb-4">
                  <Lock size={16} /> Trusted Encryption
                </div>
                <p className="text-slate-600 font-bold leading-relaxed">
                  You are completing payment for <span className="text-slate-900">{booking?.service?.title}</span>. 
                  All transaction details are encrypted and securely processed via Razorpay.
                </p>
              </div>

              <button
                onClick={handlePayment}
                disabled={paymentLoading}
                className={`w-full py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-4 transition-all active:scale-95 shadow-2xl overflow-hidden group/btn ${
                  paymentLoading 
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
                    : "bg-indigo-600 text-white hover:bg-slate-900 hover:shadow-indigo-200"
                }`}
              >
                {paymentLoading ? (
                  <Loader2 size={24} className="animate-spin" />
                ) : (
                  <>
                    Pay ₹{booking?.totalAmount} <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-slate-400 pt-4">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                  <CreditCard size={14} /> All Cards Supported
                </div>
                <div className="w-1 h-1 bg-slate-200 rounded-full hidden sm:block" />
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                  <CheckCircle2 size={14} /> Instant Confirmation
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Booking Summary */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-5 flex flex-col gap-6"
          >
            <div className="bg-slate-900 text-white rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 opacity-10 rounded-full -mr-16 -mt-16 blur-2xl" />
              
              <h3 className="text-lg font-black mb-8 uppercase tracking-widest text-indigo-400 flex items-center gap-2">
                Order Summary
              </h3>

              <div className="space-y-8">
                <div className="flex gap-5">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-xl ring-2 ring-white/10 shrink-0">
                    <img
                      src={
                        typeof booking?.service?.images?.[0] === "string"
                          ? booking.service.images[0]
                          : booking?.service?.images?.[0]?.url ||
                            "https://via.placeholder.com/100"
                      }
                      className="w-full h-full object-cover"
                      alt="Service"
                    />
                  </div>
                  <div>
                    <h4 className="text-xl font-black leading-tight mb-2">{booking?.service?.title}</h4>
                    <div className="flex items-center gap-2 text-slate-400 text-sm font-bold">
                      <Store size={14} /> {booking?.provider?.businessName}
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-8 border-t border-white/5">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-bold text-sm">Service Fee</span>
                    <span className="font-black">₹{booking?.totalAmount}</span>
                  </div>
                  <div className="flex justify-between items-center text-2xl font-black pt-4">
                    <span className="text-indigo-400">Total</span>
                    <span>₹{booking?.totalAmount}</span>
                  </div>
                </div>

                <div className="bg-white/5 rounded-[2rem] p-6 space-y-4 ring-1 ring-white/10">
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Booking Schedule</div>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3 text-sm font-bold">
                      <Calendar size={16} className="text-indigo-400" /> 
                      {new Date(booking?.bookingDate).toLocaleDateString(undefined, { dateStyle: 'long' })}
                    </div>
                    <div className="flex items-center gap-3 text-sm font-bold">
                      <ClockIcon size={16} className="text-indigo-400" /> 
                      {booking?.timeSlot}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-emerald-50 rounded-[2rem] border border-emerald-100 flex items-start gap-4">
              <div className="p-2 bg-emerald-500 text-white rounded-xl">
                <ShieldCheck size={20} />
              </div>
              <p className="text-emerald-700 font-bold text-xs leading-relaxed">
                Your payment is protected by our HomeServiceHub Guarantee. If the professional doesn't show up, we refund 100% of your amount.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
