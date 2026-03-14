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
import api from "../../services/api";
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Earnings <span className="text-emerald-600">& Payouts</span>
          </h1>
          <p className="text-slate-500 font-bold mt-2">
            Manage your revenue, track transactions, and request secure withdrawals.
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm shadow-2xl hover:bg-indigo-600 transition-all active:scale-95 flex items-center gap-3 group"
        >
          <CreditCard size={18} className="group-hover:-translate-y-1 transition-transform" />
          Request Withdrawal
        </button>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-900 rounded-[3.5rem] p-12 text-white relative overflow-hidden group shadow-2xl shadow-slate-200">
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
                <h2 className="text-6xl font-black tracking-tighter mb-2">₹{wallet?.withdrawableBalance?.toLocaleString()}</h2>
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

        <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-xl p-10 flex flex-col relative overflow-hidden group">
          <div className="absolute inset-0 bg-emerald-50 opacity-0 group-hover:opacity-30 transition-opacity duration-700" />
          <h3 className="text-xl font-black text-slate-900 tracking-tight mb-8 relative z-10">Quick Summary</h3>
          <div className="space-y-8 relative z-10 flex-1">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Monthly Volume</p>
              <div className="flex items-center gap-2 text-emerald-500 font-black text-sm">
                <ArrowUpRight size={14} />
                +14.2%
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm font-bold">
                <span className="text-slate-500">Platform Commission</span>
                <span className="text-slate-900">10%</span>
              </div>
              <div className="w-full h-2 bg-slate-50 rounded-full overflow-hidden">
                <div className="h-full bg-slate-900 w-[10%]" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm font-bold">
                <span className="text-slate-500">Tax Deductions</span>
                <span className="text-slate-900">18% GST</span>
              </div>
              <div className="w-full h-2 bg-slate-50 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-[18%]" />
              </div>
            </div>
          </div>
          <button className="w-full py-4 bg-slate-50 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all mt-8 relative z-10">
            Download Tax Reports
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
        {/* Transaction History */}
        <section className="bg-white rounded-[3.5rem] border border-slate-100 shadow-xl overflow-hidden p-10">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-sm">
                <History size={20} />
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Recent Activity</h3>
            </div>
            <button className="p-3 bg-slate-50 text-slate-400 hover:text-indigo-600 rounded-xl transition-all border border-slate-100">
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
                className="flex items-center justify-between p-6 rounded-3xl border border-transparent hover:border-slate-100 hover:bg-slate-50/50 transition-all group"
              >
                <div className="flex items-center gap-5">
                  <div className={`w-12 h-12 ${tx.type === 'credit' ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'} rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-12`}>
                    {tx.type === 'credit' ? <ArrowUpRight size={20} strokeWidth={3} /> : <ArrowDownRight size={20} strokeWidth={3} />}
                  </div>
                  <div>
                    <h5 className="text-sm font-black text-slate-900 leading-tight mb-1">{tx.description}</h5>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Clock size={12} />
                      {new Date(tx.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                      <span className="w-1 h-1 bg-slate-200 rounded-full" />
                      Ref: {tx._id.slice(-6).toUpperCase()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-black tracking-tight ${tx.type === 'credit' ? 'text-emerald-500' : 'text-slate-900'}`}>
                    {tx.type === 'credit' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                  </p>
                </div>
              </motion.div>
            ))}
            {transactions.length === 0 && (
              <div className="py-10 text-center text-slate-400 font-bold">No recent transactions recorded.</div>
            )}
          </div>
        </section>

        {/* Payout Requests */}
        <section className="bg-white rounded-[3.5rem] border border-slate-100 shadow-xl overflow-hidden p-10">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center shadow-sm">
                <CheckCircle2 size={20} />
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Payout Status</h3>
            </div>
            <button className="px-5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all shadow-sm">
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
                className="relative pl-8 border-l-2 border-slate-100 last:border-0 pb-8 last:pb-0"
              >
                <div className={`absolute left-[-9px] top-0 w-4 h-4 rounded-full border-4 border-white shadow-sm ${
                  w.status === 'approved' ? 'bg-emerald-500' : w.status === 'pending' ? 'bg-amber-500' : 'bg-rose-500'
                }`} />
                <div className="flex items-center justify-between p-6 bg-slate-50/50 rounded-3xl border border-slate-100 group hover:bg-white transition-all shadow-sm">
                  <div>
                    <h5 className="text-sm font-black text-slate-900 mb-1">₹{w.amount.toLocaleString()} Withdrawal</h5>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      Requested {new Date(w.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                    w.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 
                    w.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                  }`}>
                    {w.status}
                  </div>
                </div>
              </motion.div>
            ))}
            {withdrawals.length === 0 && (
              <div className="py-10 text-center text-slate-400 font-bold">No payout history found.</div>
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
