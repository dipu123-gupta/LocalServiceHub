import React, { useState, useEffect } from "react";
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock, 
  IndianRupee, 
  Loader2, 
  Filter, 
  Download,
  CheckCircle2,
  XCircle,
  AlertCircle,
  TrendingUp,
  CreditCard,
  History
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/utils/api";
import WithdrawalModal from "../../components/provider/WithdrawalModal";

const Earnings = () => {
  const [wallet, setWallet] = useState(null);
  const [withdrawals, setWithdrawals] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchFinancialData();
  }, []);

  const fetchFinancialData = async () => {
    setLoading(true);
    try {
      const [walletRes, withdrawalRes, transRes] = await Promise.all([
        api.get("/wallet"),
        api.get("/withdrawals/my"),
        api.get("/wallet/transactions")
      ]);
      setWallet(walletRes.data);
      setWithdrawals(withdrawalRes.data);
      setTransactions(transRes.data);
    } catch (err) {
      console.error("Failed to load financial data", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 size={40} className="text-indigo-600 animate-spin" />
        <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Reconciling your accounts...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 transition-colors">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight transition-colors">
            Earnings <span className="text-emerald-600 dark:text-emerald-400 font-black">& Payouts</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold mt-2 transition-colors">
            Manage your revenue, track transactions, and request secure withdrawals.
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-sm shadow-2xl dark:shadow-none hover:bg-indigo-600 dark:hover:bg-indigo-500 hover:text-white transition-all active:scale-95 flex items-center gap-3 group"
        >
          <CreditCard size={18} className="group-hover:-translate-y-1 transition-transform" />
          Request Withdrawal
        </button>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-900 rounded-[2.5rem] md:rounded-[3.5rem] p-6 md:p-12 text-white relative overflow-hidden group shadow-2xl shadow-slate-200">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 blur-[100px] -mr-40 -mt-40 group-hover:bg-emerald-500/20 transition-all duration-700" />
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                <Wallet size={24} />
              </div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-400">Available Balance</p>
            </div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mt-auto">
              <div>
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-2">₹{wallet?.withdrawableBalance?.toLocaleString()}</h2>
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm tracking-tight">
                  <TrendingUp size={16} />
                  +₹{wallet?.pendingBalance?.toLocaleString()} pending from active jobs
                </div>
              </div>
              <div className="p-6 bg-white/5 backdrop-blur-md rounded-[2rem] border border-white/10 flex items-center gap-6">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Total Earned</p>
                  <p className="text-xl font-black tracking-tight text-white">₹{wallet?.totalEarnings?.toLocaleString()}</p>
                </div>
                <div className="w-[1px] h-10 bg-white/10" />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Withdrawals</p>
                  <p className="text-xl font-black tracking-tight text-white">{withdrawals.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] md:rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-xl dark:shadow-none p-6 md:p-10 flex flex-col relative overflow-hidden group transition-colors">
          <div className="absolute inset-0 bg-emerald-50 dark:bg-emerald-900/10 opacity-0 group-hover:opacity-30 transition-opacity duration-700" />
          <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mb-8 relative z-10 transition-colors">Quick Summary</h3>
          <div className="space-y-8 relative z-10 flex-1">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none transition-colors">Monthly Volume</p>
              <div className="flex items-center gap-2 text-emerald-500 dark:text-emerald-400 font-black text-sm transition-colors">
                <ArrowUpRight size={14} />
                +14.2%
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm font-bold">
                <span className="text-slate-500 dark:text-slate-400">Platform Commission</span>
                <span className="text-slate-900 dark:text-slate-200">10%</span>
              </div>
              <div className="w-full h-2 bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden transition-colors">
                <div className="h-full bg-slate-900 dark:bg-white w-[10%]" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm font-bold">
                <span className="text-slate-500 dark:text-slate-400">Tax Deductions</span>
                <span className="text-slate-900 dark:text-slate-200">18% GST</span>
              </div>
              <div className="w-full h-2 bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden transition-colors">
                <div className="h-full bg-emerald-500 w-[18%]" />
              </div>
            </div>
          </div>
          <button className="w-full py-4 bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 dark:hover:bg-indigo-600 hover:text-white transition-all mt-8 relative z-10">
            Download Tax Reports
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
        {/* Transaction History */}
        <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] md:rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-xl dark:shadow-none overflow-hidden p-6 md:p-10 transition-colors">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center shadow-sm transition-colors">
                <History size={20} />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight transition-colors">Recent Activity</h3>
            </div>
            <button className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl transition-all border border-slate-100 dark:border-slate-700">
              <Download size={18} />
            </button>
          </div>

          <div className="space-y-6">
            {transactions.slice(0, 5).map((tx, idx) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={tx._id} 
                className="flex items-center justify-between p-6 rounded-3xl border border-transparent hover:border-slate-100 dark:hover:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all group"
              >
                <div className="flex items-center gap-5">
                  <div className={`w-12 h-12 ${tx.type === 'credit' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 dark:text-emerald-400' : 'bg-rose-50 dark:bg-rose-900/20 text-rose-500 dark:text-rose-400'} rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-12`}>
                    {tx.type === 'credit' ? <ArrowUpRight size={20} strokeWidth={3} /> : <ArrowDownRight size={20} strokeWidth={3} />}
                  </div>
                  <div>
                    <h5 className="text-sm font-black text-slate-900 dark:text-white leading-tight mb-1 transition-colors">{tx.description}</h5>
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2 transition-colors">
                      <Clock size={12} />
                      {new Date(tx.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                      <span className="w-1 h-1 bg-slate-200 dark:bg-slate-700 rounded-full" />
                      Ref: {tx._id.slice(-6).toUpperCase()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-black tracking-tight transition-colors ${tx.type === 'credit' ? 'text-emerald-500' : 'text-slate-900 dark:text-slate-200'}`}>
                    {tx.type === 'credit' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                  </p>
                </div>
              </motion.div>
            ))}
            {transactions.length === 0 && (
              <div className="py-10 text-center text-slate-400 dark:text-slate-500 font-bold transition-colors">No recent transactions recorded.</div>
            )}
          </div>
        </section>

        {/* Payout Requests */}
        <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] md:rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-xl dark:shadow-none overflow-hidden p-6 md:p-10 transition-colors">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center shadow-sm transition-colors">
                <CheckCircle2 size={20} />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight transition-colors">Payout Status</h3>
            </div>
            <button className="px-5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest hover:bg-white dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-200 transition-all shadow-sm">
              View All
            </button>
          </div>

          <div className="space-y-8">
            {withdrawals.slice(0, 4).map((w, idx) => (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={w._id} 
                className="relative pl-8 border-l-2 border-slate-100 dark:border-slate-800 last:border-0 pb-8 last:pb-0"
              >
                <div className={`absolute left-[-9px] top-0 w-4 h-4 rounded-full border-4 border-white dark:border-slate-900 shadow-sm ${
                  w.status === 'approved' ? 'bg-emerald-500' : w.status === 'pending' ? 'bg-amber-500' : 'bg-rose-500'
                }`} />
                <div className="flex items-center justify-between p-6 bg-slate-50/50 dark:bg-slate-800/20 rounded-3xl border border-slate-100 dark:border-slate-800 group hover:bg-white dark:hover:bg-slate-800/50 transition-all shadow-sm">
                  <div>
                    <h5 className="text-sm font-black text-slate-900 dark:text-white mb-1 transition-colors">₹{w.amount.toLocaleString()} Withdrawal</h5>
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2 transition-colors">
                      Requested {new Date(w.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm ${
                    w.status === 'approved' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 
                    w.status === 'pending' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' : 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400'
                  }`}>
                    {w.status}
                  </div>
                </div>
              </motion.div>
            ))}
            {withdrawals.length === 0 && (
              <div className="py-10 text-center text-slate-400 dark:text-slate-500 font-bold transition-colors">No payout history found.</div>
            )}
          </div>
        </section>
      </div>

      {isModalOpen && (
        <WithdrawalModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          balance={wallet?.withdrawableBalance || 0}
          onSuccess={fetchFinancialData}
        />
      )}
    </div>
  );
};

export default Earnings;
