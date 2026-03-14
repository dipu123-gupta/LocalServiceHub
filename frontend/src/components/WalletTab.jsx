import { useState, useEffect } from "react";
import api from "@/utils/api";
import {
  Wallet,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  Loader2,
  Send,
  Landmark,
  X,
  CreditCard,
  TrendingUp,
  ShieldCheck,
  History
} from "lucide-react";
import Button from "./common/Button";
import Badge from "./common/Badge";
import InputField from "./common/InputField";
import { motion, AnimatePresence } from "framer-motion";

const WalletTab = ({ userInfo }) => {
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addAmount, setAddAmount] = useState("");
  const [addLoading, setAddLoading] = useState(false);

  // Withdrawal states
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [bankDetails, setBankDetails] = useState({
    accountNumber: "",
    bankName: "",
    ifscCode: "",
    accountHolderName: "",
  });
  const [withdrawLoading, setWithdrawLoading] = useState(false);

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      const [wRes, tRes] = await Promise.all([
        api.get("/wallet"),
        api.get("/wallet/transactions"),
      ]);
      setWallet(wRes.data);
      setTransactions(tRes.data);
    } catch (err) {
      console.error("Failed to fetch wallet data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFunds = async (e) => {
    e.preventDefault();
    if (!addAmount || addAmount <= 0) return;
    setAddLoading(true);
    try {
      const { data } = await api.post("/wallet/add", { amount: addAmount });
      setWallet(data);
      setAddAmount("");
      // Refresh transactions
      const { data: transactions } = await api.get("/wallet/transactions");
      setTransactions(transactions);
      alert(`Success! ₹${addAmount} added to your wallet.`);
    } catch (err) {
      alert("Failed to add funds");
    } finally {
      setAddLoading(false);
    }
  };

  const handleWithdrawRequest = async (e) => {
    e.preventDefault();
    if (!withdrawAmount || withdrawAmount < 100) {
      alert("Minimum withdrawal is ₹100");
      return;
    }
    if (withdrawAmount > wallet.balance) {
      alert("Insufficient balance");
      return;
    }

    setWithdrawLoading(true);
    try {
      await api.post("/withdrawals", {
        amount: withdrawAmount,
        bankDetails,
      });
      alert("Withdrawal request submitted!");
      setShowWithdrawModal(false);
      setWithdrawAmount("");
      fetchWalletData(); // Refresh balance and transactions
    } catch (err) {
      alert(err.extractedMessage || "Withdrawal failed");
    } finally {
      setWithdrawLoading(false);
    }
  };

  const handleRedeemPoints = async () => {
    if (!wallet || wallet.loyaltyPoints < 100) return;
    setAddLoading(true);
    try {
      const { data } = await api.post("/wallet/redeem", { points: 100 });
      setWallet(data);
      // Refresh transactions
      const tRes = await api.get("/wallet/transactions");
      setTransactions(tRes.data);
      alert(`Success! ₹10 has been added to your wallet.`);
    } catch (err) {
      alert(err.extractedMessage || "Redemption failed");
    } finally {
      setAddLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex flex-col justify-center items-center h-96 gap-4">
        <Loader2 className="animate-spin text-indigo-600 h-12 w-12" />
        <p className="text-slate-400 font-bold animate-pulse text-xs uppercase tracking-widest">Securing Connection...</p>
      </div>
    );

  const isProvider = userInfo?.role === "provider";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      <div className="lg:col-span-8 space-y-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="group relative overflow-hidden bg-slate-900 rounded-[3rem] p-12 text-white shadow-2xl shadow-indigo-100 ring-1 ring-white/10"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] -mr-32 -mt-32 group-hover:bg-indigo-600/30 transition-colors duration-700" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/10 rounded-full blur-[80px] -ml-32 -mb-32" />
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
            <div className="flex-1">
              <div className="flex items-center gap-3 text-indigo-400 font-black text-[10px] uppercase tracking-[0.2em] mb-4">
                <ShieldCheck size={16} /> Secure Assets
              </div>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-2xl font-black text-slate-500 mr-2">₹</span>
                <div className="text-6xl font-black tracking-tighter leading-none">
                  {wallet?.balance?.toLocaleString() || "0"}
                </div>
              </div>
              <p className="text-slate-400 font-bold text-sm">Available balance for services & withdrawals</p>
              
              <div className="mt-10 flex items-center gap-8">
                <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 ring-1 ring-white/5">
                  <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1.5 flex items-center gap-2">
                     <Plus size={10} /> Rewards
                  </div>
                  <div className="text-2xl font-black flex items-center gap-2">
                    {wallet?.loyaltyPoints || 0}
                    <span className="text-[10px] text-indigo-400 font-black uppercase tracking-widest">Pts</span>
                  </div>
                </div>
                
                {wallet?.loyaltyPoints >= 100 && (
                  <button
                    onClick={handleRedeemPoints}
                    className="h-14 px-6 bg-indigo-600 hover:bg-white hover:text-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95"
                  >
                    Redeem ₹10
                  </button>
                )}
              </div>
            </div>

            {isProvider && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileActive={{ scale: 0.98 }}
                onClick={() => setShowWithdrawModal(true)}
                className="bg-white text-slate-900 hover:bg-indigo-50 shadow-2xl shadow-indigo-500/20 px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-3 transition-colors shrink-0"
              >
                Withdraw <ArrowUpRight size={18} />
              </motion.button>
            )}
          </div>
          <Wallet className="absolute -right-8 -bottom-8 w-48 h-48 text-white/5 -rotate-12 pointer-events-none group-hover:scale-110 transition-transform duration-1000" />
        </motion.div>

        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Financial Diary</h3>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Movement of funds</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl text-slate-400">
              <History size={20} />
            </div>
          </div>

          <div className="space-y-4">
            {transactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-40">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center">
                  <Clock size={32} className="text-slate-300" />
                </div>
                <p className="text-slate-400 font-black text-xs uppercase tracking-widest italic">History is clear</p>
              </div>
            ) : (
              transactions.map((t, idx) => (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  key={t._id}
                  className="flex items-center justify-between p-6 rounded-3xl bg-slate-50/50 border border-slate-50 group hover:bg-white hover:shadow-2xl hover:shadow-indigo-50 hover:border-indigo-100 transition-all cursor-default"
                >
                  <div className="flex items-center gap-5">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner transition-colors ${
                      t.type === "credit" ? "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white" : "bg-rose-50 text-rose-600 group-hover:bg-rose-500 group-hover:text-white"
                    }`}>
                      {t.type === "credit" ? <ArrowDownLeft size={24} /> : <ArrowUpRight size={24} />}
                    </div>
                    <div>
                      <div className="font-black text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight mb-1">
                        {t.description}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          {new Date(t.createdAt).toLocaleDateString(undefined, {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </span>
                        {t.status === "pending" && (
                          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-amber-50 text-amber-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-amber-100">
                            <Clock size={10} className="animate-spin" /> Pending
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className={`text-xl font-black ${
                    t.type === "credit" ? "text-emerald-600" : "text-rose-600"
                  }`}>
                    {t.type === "credit" ? "+" : "-"}₹{t.amount.toLocaleString()}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="lg:col-span-4 space-y-10">
        <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm sticky top-32">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl shadow-inner shadow-indigo-100/50">
              <Plus size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none">Top Up</h3>
              <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-1.5">Add wallet credits</p>
            </div>
          </div>
          
          <form onSubmit={handleAddFunds} className="space-y-6">
            <div className="relative group">
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-slate-300 group-focus-within:text-indigo-600 transition-all">₹</span>
              <input
                type="number"
                value={addAmount}
                onChange={(e) => setAddAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-slate-50 border-2 border-slate-50 rounded-[2rem] py-5 pl-12 pr-6 text-2xl font-black text-slate-900 outline-none focus:border-indigo-600 focus:bg-white transition-all ring-0 shadow-inner placeholder:text-slate-200"
              />
            </div>
            
            <button
              type="submit"
              disabled={addLoading || !addAmount}
              className={`w-full py-5 rounded-[1.8rem] font-black text-sm uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-3 overflow-hidden group/btn ${
                addLoading || !addAmount 
                  ? "bg-slate-100 text-slate-300 cursor-not-allowed" 
                  : "bg-indigo-600 text-white shadow-2xl shadow-indigo-200 hover:bg-slate-900"
              }`}
            >
              {addLoading ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                <>
                  Top Up Wallet <TrendingUp size={16} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                </>
              )}
            </button>
          </form>
          
          <div className="mt-10 space-y-5">
            {[
              { label: "Instant top-ups", icon: "⚡" },
              { label: "Zero fee deposits", icon: "🛡️" },
              { label: "Earn loyalty points", icon: "🎁" }
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-slate-50/50 rounded-2xl border border-slate-50 group hover:border-indigo-100 transition-all">
                <span className="text-xl shrink-0 group-hover:scale-125 transition-transform">{feature.icon}</span>
                <span className="text-xs font-black text-slate-600 uppercase tracking-widest">{feature.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showWithdrawModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowWithdrawModal(false)}
              className="absolute inset-0 bg-slate-900/80 backdrop-blur-xl"
            />
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white rounded-[3.5rem] w-full max-w-xl p-10 md:p-14 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 animate-gradient-x" />
              
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="absolute top-8 right-8 p-3 rounded-2xl bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all active:scale-90"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-6 mb-12">
                <div className="w-20 h-20 rounded-[2rem] bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-inner shadow-indigo-100 border border-indigo-100/50 relative">
                  <Landmark size={40} />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-indigo-600 text-white rounded-lg flex items-center justify-center">
                    <Send size={12} />
                  </div>
                </div>
                <div>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight">Withdrawal</h3>
                  <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">Direct Transfer to Bank</p>
                </div>
              </div>

              <form onSubmit={handleWithdrawRequest} className="space-y-8">
                <div className="bg-slate-900 rounded-[2rem] p-8 border border-white/10 ring-1 ring-white/5 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-indigo-600/30 transition-colors" />
                  <div className="relative z-10">
                    <div className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                       <ShieldCheck size={12} /> Liquid Balance
                    </div>
                    <div className="text-4xl font-black text-white leading-none tracking-tighter">₹{wallet.balance.toLocaleString()}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="Withdraw Amount"
                    type="number"
                    required
                    min="100"
                    max={wallet.balance}
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="Min. ₹100"
                    className="h-16 rounded-[1.5rem] bg-slate-50 border-transparent focus:bg-white text-lg font-black"
                  />
                  <InputField
                    label="Bank Name"
                    required
                    value={bankDetails.bankName}
                    onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                    className="h-16 rounded-[1.5rem] bg-slate-50 border-transparent focus:bg-white"
                  />
                </div>

                <div className="space-y-6">
                  <InputField
                    label="Account Holder's Full Name"
                    required
                    value={bankDetails.accountHolderName}
                    onChange={(e) => setBankDetails({ ...bankDetails, accountHolderName: e.target.value })}
                    className="h-16 rounded-[1.5rem] bg-slate-50 border-transparent focus:bg-white"
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                      label="Account Number"
                      required
                      value={bankDetails.accountNumber}
                      onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                      className="h-16 rounded-[1.5rem] bg-slate-50 border-transparent focus:bg-white"
                    />
                    <InputField
                      label="IFSC Code"
                      required
                      value={bankDetails.ifscCode}
                      onChange={(e) => setBankDetails({ ...bankDetails, ifscCode: e.target.value.toUpperCase() })}
                      className="h-16 rounded-[1.5rem] bg-slate-50 border-transparent focus:bg-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={withdrawLoading}
                  className={`w-full h-18 py-5 rounded-[1.8rem] font-black text-sm uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-3 overflow-hidden mt-6 ${
                    withdrawLoading 
                      ? "bg-slate-100 text-slate-300 cursor-not-allowed" 
                      : "bg-indigo-600 text-white shadow-2xl shadow-indigo-200 hover:bg-slate-900"
                  }`}
                >
                  {withdrawLoading ? (
                    <Loader2 className="animate-spin h-5 w-5" />
                  ) : (
                    <>
                      Confirm Withdrawal <ArrowUpRight size={18} />
                    </>
                  )}
                </button>
                <p className="text-center text-slate-400 font-bold text-[9px] uppercase tracking-widest px-10">
                  Transactions are subject to verification. Usually credited within 24-48 business hours.
                </p>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WalletTab;
