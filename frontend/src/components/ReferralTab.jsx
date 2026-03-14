import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Gift, Copy, Share2, CheckCircle, Users, Sparkles, ArrowRight, Wallet, BadgeCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "./common/Button";
import api from "@/utils/api";

const ReferralTab = () => {
  const { userInfo } = useSelector((s) => s.auth);
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState({ referredCount: 0, totalRewards: 0 });
  const [loading, setLoading] = useState(true);

  const referralLink = `${window.location.origin}/register?ref=${userInfo?.referralCode}`;

  useEffect(() => {
    fetchReferralStats();
  }, []);

  const fetchReferralStats = async () => {
    try {
      const { data } = await api.get("/users/referral-stats");
      setStats(data);
    } catch (err) {
      console.error("Failed to fetch referral stats", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(userInfo?.referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-10"
    >
      {/* Hero Banner */}
      <motion.div 
        variants={itemVariants}
        className="relative rounded-[3rem] p-12 md:p-16 overflow-hidden bg-slate-900 group"
      >
        {/* Animated Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/30 rounded-full blur-[100px] -mr-32 -mt-32 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-600/20 rounded-full blur-[80px] -ml-20 -mb-20" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-xl text-center md:text-left">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/20 backdrop-blur-md rounded-full mb-8 border border-white/10"
            >
              <Sparkles size={14} className="text-indigo-400" />
              <span className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em]">Community Rewards</span>
            </motion.div>
            <h2 className="text-5xl font-black text-white mb-6 tracking-tighter leading-[1.1]">
              Refer friends.<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">Earn ₹100.</span>
            </h2>
            <p className="text-lg font-medium text-slate-400 leading-relaxed mb-10">
              Invite your inner circle to HomeServiceHub. They get ₹50, you get ₹100. Everyone wins.
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 opacity-60">
               <div className="flex items-center gap-2">
                  <BadgeCheck size={18} className="text-white" />
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">Instant Credits</span>
               </div>
               <div className="w-1 h-1 rounded-full bg-white/20" />
               <div className="flex items-center gap-2">
                  <Wallet size={18} className="text-white" />
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">Direct to Wallet</span>
               </div>
            </div>
          </div>
          
          <motion.div
            initial={{ rotate: -15, scale: 0.8, opacity: 0 }}
            animate={{ rotate: -5, scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-64 h-64 md:w-80 md:h-80 relative flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-white/5 rounded-[4rem] rotate-12 blur-sm" />
            <Gift size={240} className="text-white opacity-20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-700" />
            <div className="absolute inset-0 flex items-center justify-center">
               <div className="w-20 h-20 bg-indigo-500 rounded-3xl shadow-xl shadow-indigo-500/40 flex items-center justify-center text-white text-4xl font-black">₹</div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Sharing Controls */}
        <motion.div 
          variants={itemVariants}
          className="lg:col-span-8 bg-white rounded-[3rem] p-10 md:p-14 border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden"
        >
          <div className="flex items-center gap-3 mb-10">
             <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white">
                <Share2 size={24} />
             </div>
             <h3 className="text-2xl font-black text-slate-900 tracking-tight">Your Referral Hub</h3>
          </div>

          <div className="grid gap-10">
            {/* Referral Code */}
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Universal Referral Code</label>
              <div className="relative group">
                <div className="absolute inset-0 bg-indigo-600/5 rounded-3xl border-2 border-dashed border-indigo-200 group-hover:border-indigo-400 transition-colors" />
                <div className="relative px-8 py-10 flex flex-col items-center gap-6">
                  <span className="text-5xl font-black text-indigo-600 tracking-[0.2em]">
                    {userInfo?.referralCode || "GENERATING..."}
                  </span>
                  <Button
                    onClick={handleCopy}
                    className="h-14 px-10 rounded-2xl bg-indigo-600 text-white font-black uppercase tracking-widest text-[11px] shadow-lg shadow-indigo-600/20 active:scale-[0.98]"
                  >
                    {copied ? <CheckCircle size={18} className="mr-2" /> : <Copy size={18} className="mr-2" />}
                    {copied ? "Copied" : "Copy Code"}
                  </Button>
                </div>
              </div>
            </div>

            {/* Direct Link */}
            <div className="space-y-4 pt-6 border-t border-slate-50">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Direct Invitation Link</label>
              <div className="flex gap-4">
                <div className="flex-1 h-14 bg-slate-50 border border-slate-200 rounded-2xl px-6 flex items-center overflow-hidden">
                  <span className="text-sm font-medium text-slate-500 truncate">{referralLink}</span>
                </div>
                <button
                  onClick={handleCopyLink}
                  className="w-14 h-14 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-900 hover:border-indigo-200 hover:bg-indigo-50 transition-all active:scale-95"
                >
                  <Share2 size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* How it works */}
          <div className="mt-14 p-8 bg-slate-900 rounded-[2.5rem] text-white">
             <h4 className="flex items-center gap-3 text-lg font-black mb-6">
                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
                   <CheckCircle size={16} className="text-indigo-400" />
                </div>
                Simplification Flow
             </h4>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { step: "01", text: "Invite friends via link or code." },
                  { step: "02", text: "They join and book a service." },
                  { step: "03", text: "Rewards deposit in your wallet." }
                ].map((item, i) => (
                  <div key={i} className="space-y-2">
                     <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{item.step}</span>
                     <p className="text-sm font-medium text-slate-400 leading-tight">{item.text}</p>
                  </div>
                ))}
             </div>
          </div>
        </motion.div>

        {/* Stats Sidebar */}
        <motion.div 
          variants={itemVariants}
          className="lg:col-span-4 space-y-6"
        >
          <div className="bg-emerald-50 border border-emerald-100 rounded-[2.5rem] p-10 text-center relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-6 text-emerald-100 group-hover:rotate-12 transition-transform duration-700">
                <Users size={80} />
             </div>
             <div className="relative">
                <div className="text-6xl font-black text-emerald-600 mb-2 leading-none tracking-tight">
                  {loading ? "..." : stats.referredCount}
                </div>
                <h4 className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Friends Onboarded</h4>
                <p className="text-xs font-medium text-emerald-800/40 mt-4 italic">Bring your crew, earn more.</p>
             </div>
          </div>

          <div className="bg-indigo-50 border border-indigo-100 rounded-[2.5rem] p-10 text-center relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-6 text-indigo-100 group-hover:rotate-12 transition-transform duration-700">
                <Gift size={80} />
             </div>
             <div className="relative">
                <div className="text-6xl font-black text-indigo-600 mb-2 leading-none tracking-tight">
                  {loading ? "..." : `₹${stats.totalRewards}`}
                </div>
                <h4 className="text-[10px] font-black text-indigo-700 uppercase tracking-widest">Rewards Realized</h4>
                <p className="text-xs font-medium text-indigo-800/40 mt-4 italic">Passive earnings incoming.</p>
             </div>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-[2.5rem] p-8">
             <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Pro Referral Tip</h5>
             <p className="text-sm font-medium text-slate-600 leading-relaxed italic">
               "Share your link in neighborhood groups or on social to reach more friends faster!"
             </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ReferralTab;
