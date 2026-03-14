import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { 
  Check, 
  Loader2, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Star, 
  Crown,
  CheckCircle2,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SubscriptionPage = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubscribing, setIsSubscribing] = useState(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const role = userInfo?.role === "provider" ? "provider" : "user";
        // Fixed string interpolation bug
        const { data } = await api.get(`/subscriptions/plans/${role}`);
        setPlans(data);
      } catch (err) {
        console.error("Failed to fetch plans", err);
      } finally {
        setIsLoading(false);
      }
    };
    if (userInfo) fetchPlans();
    else navigate("/login");
  }, [userInfo, navigate]);

  const handleSubscribe = async (planId) => {
    setIsSubscribing(planId);
    try {
      const { data } = await api.post("/subscriptions/subscribe", { planId });
      navigate(`/subscribe/checkout/${planId}`, {
        state: { clientSecret: data.clientSecret },
      });
    } catch (err) {
      alert(err.response?.data?.message || "Subscription failed");
    } finally {
      setIsSubscribing(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <Loader2 size={48} className="text-indigo-600 animate-spin" />
        <p className="text-slate-400 font-bold animate-pulse text-sm">Curating your options...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-24 px-4 overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[120px] -mr-64 -mt-64" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[120px] -ml-64 -mb-64" />

      <div className="max-w-7xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-6 py-2 bg-indigo-600/10 border border-indigo-600/20 text-indigo-600 rounded-full text-xs font-black uppercase tracking-widest mb-8 shadow-sm"
        >
          <Sparkles size={14} /> Elevate Your Experience
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight"
        >
          Choose the <span className="text-indigo-600">Perfect Plan</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-slate-500 max-w-2xl mx-auto mb-20 font-semibold leading-relaxed"
        >
          Unlock exclusive benefits, lower commission rates, and premium support
          to grow your business or save more on every booking.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, idx) => {
            const isFeatured = plan.name.toLowerCase().includes("pro") || plan.name.toLowerCase().includes("gold");
            return (
              <motion.div
                key={plan._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + idx * 0.1 }}
                className={`flex flex-col relative bg-white rounded-[3rem] p-10 border transition-all duration-500 group ${
                  isFeatured 
                    ? "border-indigo-600 shadow-2xl shadow-indigo-100 ring-4 ring-indigo-50 lg:-mt-4 lg:mb-4" 
                    : "border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl"
                }`}
              >
                {isFeatured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-6 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase flex items-center gap-2 shadow-lg ring-4 ring-white">
                    <Crown size={12} /> Recommended
                  </div>
                )}

                <div className="mb-10 text-left">
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`p-3 rounded-2xl ${isFeatured ? "bg-indigo-600 text-white" : "bg-slate-50 text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-colors"}`}>
                      {isFeatured ? <Zap size={24} /> : <Star size={24} />}
                    </div>
                    <h3 className="text-2xl font-black text-slate-900">{plan.name}</h3>
                  </div>

                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-5xl font-black text-slate-900">₹{plan.price}</span>
                    <span className="text-slate-400 font-bold text-lg">/mo</span>
                  </div>
                  <p className="text-slate-500 font-bold text-sm leading-relaxed min-h-[48px]">
                    {plan.description}
                  </p>
                </div>

                <div className="flex-1 space-y-5 mb-12">
                  <div className="h-[1px] w-full bg-slate-50 group-hover:bg-indigo-50 transition-colors" />
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-4 text-left">
                      <div className={`mt-1 p-0.5 rounded-full ${isFeatured ? "bg-indigo-100 text-indigo-600" : "bg-emerald-50 text-emerald-500"}`}>
                        <CheckCircle2 size={16} />
                      </div>
                      <span className="text-slate-600 font-bold text-sm leading-tight">{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleSubscribe(plan._id)}
                  disabled={plan.price === 0 || isSubscribing}
                  className={`w-full py-4 rounded-2xl font-black text-base flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg group/btn ${
                    plan.price === 0 
                      ? "bg-slate-100 text-slate-400 cursor-default" 
                      : isFeatured
                        ? "bg-indigo-600 text-white hover:bg-slate-900 hover:shadow-indigo-200"
                        : "bg-slate-900 text-white hover:bg-indigo-600 hover:shadow-slate-200"
                  }`}
                >
                  {isSubscribing === plan._id ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : plan.price === 0 ? (
                    "Active Lifetime"
                  ) : (
                    <>
                      Upgrade Now <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Value Propositions */}
        <div className="mt-32 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: <ShieldCheck size={28} />,
              title: "Money Back Guarantee",
              desc: "7-day satisfaction guarantee, no questions asked policy.",
              color: "indigo"
            },
            {
              icon: <Zap size={28} />,
              title: "Instant Activation",
              desc: "All benefits are applied to your account immediately after payment.",
              color: "purple"
            },
            {
              icon: <Star size={28} />,
              title: "Exclusive Ecosystem",
              desc: "Access member-only deals, priority support, and elite badges.",
              color: "emerald"
            },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 + i * 0.1 }}
              className="p-10 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all group flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 bg-slate-50 group-hover:bg-indigo-600 group-hover:text-white rounded-2xl flex items-center justify-center text-indigo-600 transition-all duration-500 mb-6 drop-shadow-sm">
                {stat.icon}
              </div>
              <h4 className="text-xl font-black text-slate-900 mb-4">{stat.title}</h4>
              <p className="text-slate-500 font-bold text-sm leading-relaxed">
                {stat.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
