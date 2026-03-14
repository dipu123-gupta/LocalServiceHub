import React, { useState, useEffect } from "react";
import { 
  BadgeCheck, 
  Crown, 
  Zap, 
  Target, 
  ShieldCheck, 
  ChevronRight, 
  CheckCircle2, 
  Star, 
  TrendingUp, 
  Gift,
  Loader2,
  Lock,
  ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";
import api from "../../services/api";

const Membership = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get("/service-providers/profile");
      setProfile(data);
    } catch (err) {
      console.error("Failed to load profile", err);
    } finally {
      setLoading(false);
    }
  };

  const tiers = [
    {
      name: "Standard Partner",
      price: "Free",
      id: "free",
      description: "Essential tools to start your service business.",
      features: [
        "Up to 5 Service Listings",
        "Standard Job Lead Alerts",
        "Community Support",
        "Basic Analytics Dashboard"
      ],
      color: "bg-slate-100",
      textColor: "text-slate-600",
      btnColor: "bg-slate-900 text-white",
      highlight: false
    },
    {
      name: "HubPro Plus",
      price: "₹999/mo",
      id: "plus",
      description: "Advanced growth tools for serious professionals.",
      features: [
        "Unlimited Service Listings",
        "Priority Job Lead Matching",
        "Verified Partner Badge",
        "Advanced Revenue Analytics",
        "Premium Profile Placement",
        "Dedicated Account Manager"
      ],
      color: "bg-indigo-600",
      textColor: "text-white",
      btnColor: "bg-white text-indigo-600",
      highlight: true
    },
    {
      name: "Elite Enterprise",
      price: "₹2,499/mo",
      id: "elite",
      description: "Scale your agency with enterprise-grade features.",
      features: [
        "Everything in Plus",
        "Multi-city Expansion Tools",
        "Bulk Service Management",
        "API Integration Access",
        "Exclusive Networking Events",
        "Custom Branding Options"
      ],
      color: "bg-slate-900",
      textColor: "text-white",
      btnColor: "bg-indigo-600 text-white",
      highlight: false
    }
  ];

  if (loading) {
     return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 size={40} className="text-indigo-600 animate-spin" />
        <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Configuring your benefits...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            HubPro <span className="text-indigo-600">Membership</span>
          </h1>
          <p className="text-slate-500 font-bold mt-2">
            Unlock premium features and scale your business to the next level.
          </p>
        </div>
        <div className="flex items-center gap-4 bg-indigo-50 px-6 py-3 rounded-2xl border border-indigo-100">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
            <Crown size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest leading-none mb-1">Current Plan</p>
            <p className="text-sm font-black text-indigo-900">Standard Partner</p>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {tiers.map((tier, idx) => (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            key={tier.id}
            className={`${tier.color} rounded-[3.5rem] p-10 flex flex-col h-full shadow-2xl ${
              tier.highlight ? "shadow-indigo-200 lg:scale-105" : "shadow-slate-100 border border-slate-50"
            } relative overflow-hidden group`}
          >
            {tier.highlight && (
              <div className="absolute top-8 right-8 px-4 py-2 bg-white/20 backdrop-blur-md rounded-xl text-white text-[10px] font-black uppercase tracking-widest border border-white/30">
                Most Popular
              </div>
            )}
            
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 bg-white/10 text-white`}>
              {tier.id === 'plus' ? <Crown size={32} /> : tier.id === 'elite' ? <Zap size={32} /> : <Star size={32} className="text-slate-400" />}
            </div>

            <div className="mb-10">
              <h3 className={`text-2xl font-black mb-2 ${tier.textColor}`}>{tier.name}</h3>
              <p className={`text-sm font-bold opacity-70 mb-6 ${tier.textColor}`}>{tier.description}</p>
              <div className={`text-4xl font-black tracking-tighter ${tier.textColor}`}>
                {tier.price}
                {tier.price !== "Free" && <span className="text-sm opacity-50 font-bold ml-1">/ month</span>}
              </div>
            </div>

            <div className="space-y-4 mb-10 flex-1">
              {tier.features.map(feature => (
                <div key={feature} className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 ${tier.highlight ? "bg-white/20 text-white" : "bg-indigo-50 text-indigo-600"}`}>
                    <CheckCircle2 size={12} strokeWidth={3} />
                  </div>
                  <span className={`text-xs font-bold ${tier.textColor} opacity-90`}>{feature}</span>
                </div>
              ))}
            </div>

            <button className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 ${tier.btnColor} ${tier.id === 'free' ? 'opacity-50 cursor-default shadow-none' : 'hover:scale-105'}`}>
              {tier.id === 'free' ? "Default Plan" : "Upgrade Now"}
              {tier.id !== 'free' && <ArrowRight size={18} />}
            </button>
          </motion.div>
        ))}
      </div>

      {/* Comparison Grid */}
      <section className="bg-white rounded-[4rem] border border-slate-100 shadow-2xl p-12 overflow-hidden relative group">
        <div className="absolute inset-0 bg-slate-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-center md:text-left">
          <div className="space-y-4">
             <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-[1.5rem] flex items-center justify-center mx-auto md:mx-0 shadow-sm">
              <TrendingUp size={24} />
             </div>
             <h4 className="text-lg font-black text-slate-900 tracking-tight leading-tight">Increased Revenue</h4>
             <p className="text-xs font-bold text-slate-500 leading-relaxed">Plus members see up to <span className="text-indigo-600 font-black">40% more</span> job completions due to priority matching.</p>
          </div>
          <div className="space-y-4">
             <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-[1.5rem] flex items-center justify-center mx-auto md:mx-0 shadow-sm">
              <BadgeCheck size={24} />
             </div>
             <h4 className="text-lg font-black text-slate-900 tracking-tight leading-tight">Verified Credibility</h4>
             <p className="text-xs font-bold text-slate-500 leading-relaxed">The Verified Partner badge builds instant trust with high-value residential clients.</p>
          </div>
          <div className="space-y-4">
             <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-[1.5rem] flex items-center justify-center mx-auto md:mx-0 shadow-sm">
              <Target size={24} />
             </div>
             <h4 className="text-lg font-black text-slate-900 tracking-tight leading-tight">Priority Leads</h4>
             <p className="text-xs font-bold text-slate-500 leading-relaxed">Get instantly notified of high-demand tasks in your area before other providers.</p>
          </div>
          <div className="space-y-4">
             <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-[1.5rem] flex items-center justify-center mx-auto md:mx-0 shadow-sm">
              <Gift size={24} />
             </div>
             <h4 className="text-lg font-black text-slate-900 tracking-tight leading-tight">Elite Events</h4>
             <p className="text-xs font-bold text-slate-500 leading-relaxed">Exclusive access to industry meetups and partnership opportunities.</p>
          </div>
        </div>
      </section>

      {/* FAQ Link */}
      <div className="p-8 bg-slate-900 rounded-[3rem] text-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-indigo-500/5 blur-[50px]" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-6">
          <p className="text-slate-400 font-bold">Have questions about our membership tiers?</p>
          <button className="px-8 py-3 bg-white text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-50 transition-all flex items-center gap-2">
            Visit Partner Help Center <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Membership;
