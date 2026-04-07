import React, { useState } from "react";
import { X, CreditCard, Loader2, IndianRupee, AlertCircle, CheckCircle2, Building, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/utils/api";

const WithdrawalModal = ({ isOpen, onClose, balance, onSuccess }) => {
  const [amount, setAmount] = useState("");
  const [bankDetails, setBankDetails] = useState({
    accountHolderName: "",
    accountNumber: "",
    ifscCode: "",
    bankName: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(1); // 1: Amount/Details, 2: Success

  const handleBankChange = (e) => {
    setBankDetails({ ...bankDetails, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (amount < 100) return alert("Minimum withdrawal amount is ₹100");
    if (amount > balance) return alert("Insufficient balance");

    setSubmitting(true);
    try {
      await api.post("/withdrawals", { amount, bankDetails });
      setStep(2);
      onSuccess();
    } catch (err) {
      console.error("Withdrawal failed", err);
      alert(err.response?.data?.message || "Failed to process withdrawal. Check your bank details.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl relative z-10 overflow-hidden"
      >
        {step === 1 ? (
          <>
            {/* Header */}
            <div className="px-10 py-8 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Request Payout</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 italic">Secure Bank Transfer</p>
              </div>
              <button onClick={onClose} className="p-3 bg-white text-slate-400 hover:text-rose-500 rounded-2xl shadow-sm transition-all border border-slate-100">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-10 space-y-8">
              {/* Balance Summary */}
              <div className="p-6 bg-slate-900 rounded-[2rem] text-white flex items-center justify-between relative overflow-hidden group">
                <div className="absolute inset-0 bg-indigo-500/10 blur-[30px]" />
                <div className="relative z-10">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Withdrawable Balance</p>
                  <p className="text-2xl font-black tracking-tight">₹{balance.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center relative z-10">
                  <CreditCard size={24} className="text-white" />
                </div>
              </div>

              {/* Amount Input */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Withdrawal Amount</label>
                <div className="relative">
                  <IndianRupee size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    required
                    type="number"
                    min="100"
                    max={balance}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Min. ₹100"
                    className="w-full bg-slate-50 border-2 border-slate-50 focus:border-indigo-100 focus:bg-white rounded-2xl py-5 pl-14 pr-6 text-lg font-black text-slate-900 outline-none transition-all shadow-inner"
                  />
                  <button 
                    type="button"
                    onClick={() => setAmount(balance)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 px-3 py-1 bg-white text-[10px] font-black text-indigo-600 uppercase tracking-widest rounded-lg border border-slate-100 shadow-sm"
                  >
                    Max
                  </button>
                </div>
              </div>

              {/* Bank Details */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-slate-400 mb-2">
                  <Building size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Bank Beneficiary Information</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input 
                    required
                    name="accountHolderName"
                    placeholder="Acc. Holder Name"
                    value={bankDetails.accountHolderName}
                    onChange={handleBankChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-5 text-xs font-bold text-slate-900 outline-none transition-all"
                  />
                  <input 
                    required
                    name="bankName"
                    placeholder="Bank Name"
                    value={bankDetails.bankName}
                    onChange={handleBankChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-5 text-xs font-bold text-slate-900 outline-none transition-all"
                  />
                  <input 
                    required
                    name="accountNumber"
                    placeholder="Account Number"
                    value={bankDetails.accountNumber}
                    onChange={handleBankChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-5 text-xs font-bold text-slate-900 outline-none transition-all"
                  />
                  <input 
                    required
                    name="ifscCode"
                    placeholder="IFSC Code"
                    value={bankDetails.ifscCode}
                    onChange={handleBankChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-5 text-xs font-bold text-slate-900 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Safety Warning */}
              <div className="flex items-start gap-4 p-5 bg-amber-50 rounded-3xl border border-amber-100">
                <ShieldCheck className="text-amber-500 shrink-0 mt-0.5" size={18} />
                <p className="text-[10px] font-bold text-amber-700 leading-relaxed">
                  Funds will be transferred within <span className="font-black">2-3 business days</span> after approval. Please ensure bank details are accurate as once initiated, it cannot be reversed.
                </p>
              </div>

              <button 
                type="submit"
                disabled={submitting || !amount || amount < 100}
                className="w-full py-5 bg-indigo-600 text-white rounded-3xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-indigo-100 hover:bg-slate-900 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {submitting ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Processing Securely...
                  </>
                ) : (
                  "Initiate Payout"
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="p-16 text-center space-y-8 animate-in zoom-in-95 duration-500">
            <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-xl shadow-emerald-50">
              <CheckCircle2 size={48} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Request Received!</h3>
              <p className="text-slate-500 font-bold max-w-xs mx-auto text-sm leading-relaxed">
                Your payout request for <span className="text-slate-900 font-black">₹{amount}</span> has been successfully queued for processing.
              </p>
            </div>
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">
                <span>Ref ID</span>
                <span className="text-slate-900">WD-{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
              </div>
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                <span>Expected by</span>
                <span className="text-slate-900">Within 3 Working Days</span>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="w-full py-5 bg-slate-900 text-white rounded-3xl font-black text-sm uppercase tracking-[0.2em] shadow-xl hover:bg-indigo-600 transition-all active:scale-95"
            >
              Back to Earnings
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default WithdrawalModal;
