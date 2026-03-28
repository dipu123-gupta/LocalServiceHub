import React, { useState, useEffect } from "react";
import PageHeader from "../components/PageHeader";
import {
  CreditCard,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  DollarSign,
  Plus,
  Loader2,
  Gift,
  AlertCircle,
  TrendingUp,
  History,
  Coins,
  ShieldCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/utils/api";
import { useSelector } from "react-redux";

const Wallet = () => {
  const { userInfo } = useSelector((s) => s.auth);
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingFunds, setAddingFunds] = useState(false);
  const [redeeming, setRedeeming] = useState(false);

  const fetchData = async () => {
    try {
      const [walletRes, transRes] = await Promise.all([
        api.get("/wallet"),
        api.get("/wallet/transactions"),
      ]);
      setWallet(walletRes.data);
      setTransactions(transRes.data);
    } catch (err) {
      console.error("Wallet load failure", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo) fetchData();
  }, [userInfo]);

  const handleAddFunds = async () => {
    const amount = prompt("Enter amount to add (Mock Payment):", "500");
    if (!amount || isNaN(amount)) return;
    
    setAddingFunds(true);
    try {
      await api.post("/wallet/add", { amount: Number(amount) });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add funds");
    } finally {
      setAddingFunds(false);
    }
  };

  const handleRedeemPoints = async () => {
    if (wallet.loyaltyPoints < 100) {
      alert("Minimum 100 points required to redeem.");
      return;
    }
    
    if (!window.confirm(`Redeem ${wallet.loyaltyPoints} points for ₹${Math.floor(wallet.loyaltyPoints / 10)}?`)) return;

    setRedeeming(true);
    try {
      await api.post("/wallet/redeem", { points: wallet.loyaltyPoints });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Redemption failed");
    } finally {
      setRedeeming(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 pb-24 transition-colors duration-300">
      <PageHeader
        title="Digital Wallet"
        description="Securely manage your balance, track service payments, and redeem earned loyalty rewards."
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        {loading ? (
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl p-20 flex flex-col items-center justify-center gap-4 text-center border border-slate-100 dark:border-slate-800 transition-colors">
             <Loader2 size={48} className="text-indigo-600 animate-spin" />
             <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em]">Encrypted Session Sync...</p>
          </div>
        ) : (
          <>
            {/* Main Wallet Card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
              <div className="lg:col-span-2 bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-slate-900/30">
                <div className="absolute top-0 right-0 p-12 opacity-10">
                   <TrendingUp size={160} />
                </div>
                
                <div className="relative z-10">
                  <p className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px] mb-2">Available Credits</p>
                  <h2 className="text-6xl font-black tracking-tighter mb-10 flex items-center gap-2">
                    <span className="text-3xl text-slate-500 dark:text-slate-600">₹</span>
                    {wallet?.balance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </h2>
                  
                  <div className="flex flex-wrap gap-4">
                    <button 
                      onClick={handleAddFunds}
                      disabled={addingFunds}
                      className="group px-8 py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-2xl flex items-center gap-3 transition-all active:scale-95 shadow-xl shadow-indigo-900/40"
                    >
                      {addingFunds ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                      <span className="text-xs font-black uppercase tracking-widest">Top Up Balance</span>
                    </button>
                    <button className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl flex items-center gap-3 transition-all active:scale-95 border border-slate-700">
                      <CreditCard size={18} />
                      <span className="text-xs font-black uppercase tracking-widest">Saved Methods</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Rewards Card */}
              <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none transition-colors duration-300 flex flex-col justify-between">
                 <div>
                    <div className="flex items-center gap-3 mb-6">
                       <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/40 flex items-center justify-center text-amber-600 dark:text-amber-400 transition-colors">
                          <Coins size={20} />
                       </div>
                       <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-[10px] transition-colors">Loyalty Points</h3>
                    </div>
                    <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter mb-2 transition-colors">{wallet?.loyaltyPoints || 0}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-bold leading-relaxed mb-6 transition-colors">
                       Earn points for every service you complete. 10 points = ₹1.
                    </p>
                 </div>
                 
                 <button 
                   onClick={handleRedeemPoints}
                   disabled={redeeming || (wallet?.loyaltyPoints || 0) < 100}
                   className="w-full py-4 bg-amber-50 dark:bg-amber-900/30 hover:bg-amber-100 dark:hover:bg-amber-900/50 disabled:opacity-30 text-amber-600 dark:text-amber-400 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2"
                 >
                   {redeeming ? <Loader2 size={14} className="animate-spin" /> : <Gift size={14} />}
                   Redeem for Cash
                 </button>
              </div>
            </div>

            {/* Transactions Section */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 transition-colors duration-300 overflow-hidden">
              <div className="p-10 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900 sticky top-0 z-10 transition-colors">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                      <History size={20} />
                   </div>
                   <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Ledger History</h3>
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/20" />
                   <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Verified Transactions Only</p>
                </div>
              </div>

              <div className="divide-y divide-slate-50 dark:divide-slate-800">
                {transactions.length === 0 ? (
                  <div className="p-20 text-center flex flex-col items-center gap-4 opacity-30">
                    <Clock size={48} className="text-slate-300 dark:text-slate-700" />
                    <p className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-600">No history found</p>
                  </div>
                ) : (
                  transactions.map((tx, index) => (
                    <motion.div
                      key={tx._id}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                      className="p-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-all border-l-4 border-transparent hover:border-indigo-600"
                    >
                      <div className="flex items-center gap-6">
                        <div
                          className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border-2 ${
                            tx.type === "credit"
                              ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-900/50 text-emerald-600 dark:text-emerald-400 shadow-lg shadow-emerald-600/5 dark:shadow-none"
                              : "bg-rose-50 dark:bg-rose-900/20 border-rose-100 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 shadow-lg shadow-rose-600/5 dark:shadow-none"
                          }`}
                        >
                          {tx.type === "credit" ? (
                            <ArrowDownLeft size={24} />
                          ) : (
                            <ArrowUpRight size={24} />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                             <span className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest">
                                {new Date(tx.createdAt).toLocaleDateString("en-IN", {
                                  day: "numeric", month: "short", year: "numeric"
                                })}
                             </span>
                             <div className="w-1 h-1 rounded-full bg-slate-200 dark:bg-slate-700" />
                             <span className={`text-[10px] font-black uppercase tracking-widest ${tx.status === "completed" ? "text-emerald-500" : "text-amber-500"}`}>
                                {tx.status}
                             </span>
                          </div>
                          <h4 className="text-lg font-black text-slate-900 dark:text-white tracking-tight truncate max-w-xs sm:max-w-md">
                            {tx.description}
                          </h4>
                        </div>
                      </div>
                      <div
                        className={`text-2xl font-black tracking-tighter sm:text-right ${tx.type === "credit" ? "text-emerald-600 dark:text-emerald-400" : "text-slate-900 dark:text-white"}`}
                      >
                        {tx.type === "credit" ? "+" : "-"}<span className="text-sm font-bold mr-1">₹</span>{tx.amount.toLocaleString("en-IN")}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
            
            <div className="mt-12 flex items-center justify-center gap-2 opacity-30">
               <ShieldCheck size={16} className="text-emerald-600" />
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Transaction processing secured by HomeServiceHub Ledger System</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Wallet;
