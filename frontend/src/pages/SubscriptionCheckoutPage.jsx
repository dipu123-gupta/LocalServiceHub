import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import api from "@/utils/api";
import { Loader2, ChevronLeft, CreditCard, ShieldCheck, Zap, Sparkles, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CheckoutForm from "../components/CheckoutForm";

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "pk_test_placeholder",
);

const SubscriptionCheckoutPage = () => {
  const { planId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const [clientSecret, setClientSecret] = useState(state?.clientSecret || "");
  const [plan, setPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(!state?.clientSecret);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPlanDetails = async () => {
      try {
        const { data: allPlans } = await api.get("/subscriptions/plans/all");
        const foundPlan = allPlans.find((p) => p._id === planId);
        setPlan(foundPlan);

        if (!clientSecret) {
          const { data } = await api.post("/subscriptions/subscribe", {
            planId,
          });
          setClientSecret(data.clientSecret);
        }
      } catch (err) {
        setError("Failed to initialize payment");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlanDetails();
  }, [planId, clientSecret]);

  const handleSuccess = () => {
    navigate("/dashboard?subscription_success=true");
  };

  const appearance = {
    theme: "stripe",
    variables: { 
      colorPrimary: "#4f46e5", 
      borderRadius: "16px",
      colorBackground: "#ffffff",
      colorText: "#1e293b",
      colorDanger: "#ef4444",
      fontFamily: 'Inter, system-ui, sans-serif',
      spacingUnit: '4px',
    },
  };

  if (isLoading)
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-6">
        <div className="relative">
          <Loader2 className="w-16 h-16 text-indigo-500 animate-spin" />
          <div className="absolute inset-0 blur-2xl bg-indigo-500/20 animate-pulse rounded-full" />
        </div>
        <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px]">Initializing Secure Checkout</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#fafbfc] selection:bg-indigo-500/30 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="group flex items-center gap-3 text-slate-400 hover:text-slate-900 font-bold text-sm transition-all mb-12"
        >
          <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-slate-900 group-hover:border-slate-900 group-hover:text-white transition-all">
            <ChevronLeft size={16} />
          </div>
          Back to Plans
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Payment Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-7 bg-white rounded-[3rem] p-10 md:p-14 border border-slate-100 shadow-2xl shadow-indigo-900/5 relative overflow-hidden"
          >
             {/* Gradient Accent */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none opacity-50" />

             <div className="relative">
                <div className="flex items-center gap-4 mb-10">
                   <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
                      <CreditCard size={24} />
                   </div>
                   <div>
                      <h2 className="text-3xl font-black text-slate-900 tracking-tight">Checkout</h2>
                      <p className="text-sm font-medium text-slate-400">Complete your subscription setup</p>
                   </div>
                </div>

                {error && (
                  <div className="bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-2xl mb-10 text-sm font-black animate-shake">
                    {error}
                  </div>
                )}

                {clientSecret && (
                  <Elements
                    options={{ clientSecret, appearance }}
                    stripe={stripePromise}
                  >
                    <CheckoutForm planId={planId} onSuccess={handleSuccess} />
                  </Elements>
                )}

                <div className="mt-12 pt-10 border-t border-slate-50 flex flex-wrap items-center justify-center gap-8 text-slate-400 grayscale opacity-40">
                   <div className="flex items-center gap-2">
                      <ShieldCheck size={18} />
                      <span className="text-[10px] font-black uppercase tracking-widest leading-none">AES-256 SSL</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <CreditCard size={18} />
                      <span className="text-[10px] font-black uppercase tracking-widest leading-none">PCI Compliant</span>
                   </div>
                </div>
             </div>
          </motion.div>

          {/* Summary Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-5 space-y-8"
          >
            <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden group">
               {/* Decorative Element */}
               <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                  <Zap size={120} />
               </div>

               <div className="relative">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full mb-6">
                     <Sparkles size={12} className="text-indigo-400" />
                     <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300">Selected Plan</span>
                  </div>
                  <h3 className="text-3xl font-black mb-1 leading-tight tracking-tight">
                    {plan?.name}
                  </h3>
                  <p className="text-slate-400 font-medium text-sm mb-10">Premium House Cleaning Services</p>
                  
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-5xl font-black">₹{plan?.price}</span>
                    <span className="text-slate-500 font-bold uppercase tracking-widest text-xs">/ month</span>
                  </div>
                  <p className="text-indigo-300/60 text-xs font-black uppercase tracking-widest mb-10">Billed every 30 days</p>

                  <div className="space-y-4 pt-10 border-t border-white/5">
                    {plan?.features.map((f, i) => (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                        key={i} 
                        className="flex items-start gap-3"
                      >
                        <div className="mt-1 w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                           <CheckCircle size={12} className="text-emerald-500" />
                        </div>
                        <span className="text-sm font-medium text-slate-300 leading-tight">{f}</span>
                      </motion.div>
                    ))}
                  </div>
               </div>
            </div>

            {/* Testimonials or Trust Badges */}
            <div className="bg-indigo-50 border border-indigo-100 rounded-[2.5rem] p-8">
               <div className="flex items-center gap-4 mb-4">
                  <div className="flex -space-x-2">
                     {[1,2,3].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-indigo-50 bg-slate-200 overflow-hidden">
                           <img src={`https://i.pravatar.cc/100?u=${i}`} alt="" />
                        </div>
                     ))}
                  </div>
                  <span className="text-xs font-black text-indigo-600 uppercase tracking-widest whitespace-nowrap">Join 5,000+ members</span>
               </div>
               <p className="text-slate-600 text-sm italic font-medium">"Saving ₹2,400 monthly on cleaning plus VIP priority booking. Best choice I've made!"</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionCheckoutPage;
