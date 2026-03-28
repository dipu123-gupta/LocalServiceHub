import React, { useState } from "react";
import { X, AlertCircle, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { bookingService } from "../../services/bookingService";

const ApproveChargesModal = ({ isOpen, onClose, booking, onSuccess }) => {
  const [loading, setLoading] = useState(null); // stores the chargeId being processed

  if (!isOpen || !booking) return null;

  const pendingCharges = booking.additionalCharges?.filter(
    (c) => c.approvalStatus === "pending"
  ) || [];

  const handleAction = async (chargeId, status) => {
    setLoading(chargeId);
    try {
      await bookingService.approveAdditionalCharge(booking._id, chargeId, status);
      onSuccess?.(); // Refresh the parent data
      if (pendingCharges.length === 1) {
        onClose(); // Automatically close if it was the last one
      }
    } catch (err) {
      alert(err.extractedMessage || `Failed to ${status} charge`);
    } finally {
      setLoading(null);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 mb-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/40 backdrop-blur-md"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 transition-colors"
        >
          {/* Header */}
          <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-8 text-white relative">
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-white/20 rounded-2xl">
                <AlertCircle size={28} />
              </div>
              <h3 className="text-2xl font-black tracking-tight">Approve Extra Charges</h3>
            </div>
            <p className="text-amber-50/80 font-bold text-sm leading-relaxed">
              Your professional has requested additional charges for extra materials or services. Please review and approve to proceed.
            </p>
          </div>

          <div className="p-8">
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {pendingCharges.map((charge) => (
                <div 
                  key={charge._id}
                  className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-black text-slate-700 dark:text-slate-200">{charge.item}</span>
                    <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">₹{charge.price}</span>
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      disabled={loading === charge._id}
                      onClick={() => handleAction(charge._id, "approved")}
                      className="flex-1 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 dark:hover:bg-indigo-500 hover:text-white transition-all transform active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {loading === charge._id ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                      Approve
                    </button>
                    <button
                      disabled={loading === charge._id}
                      onClick={() => handleAction(charge._id, "rejected")}
                      className="px-6 py-3 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 text-slate-400 dark:text-slate-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:border-rose-500 hover:text-rose-500 transition-all transform active:scale-95 disabled:opacity-50"
                    >
                       <XCircle size={18} />
                    </button>
                  </div>
                </div>
              ))}
              
              {pendingCharges.length === 0 && (
                <div className="text-center py-10">
                   <CheckCircle size={40} className="mx-auto text-emerald-400 mb-4" />
                   <p className="text-slate-500 dark:text-slate-400 font-bold">All extra charges have been processed.</p>
                </div>
              )}
            </div>

            <div className="mt-8 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800 flex gap-3">
               <AlertCircle size={18} className="text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
               <p className="text-[10px] font-bold text-indigo-600/80 dark:text-indigo-400/80 leading-relaxed uppercase tracking-wider">
                 Approved charges will be added to your final bill. Rejected charges will notify the provider and will not be billed.
               </p>
            </div>

            <button
               onClick={onClose}
               className="w-full mt-8 py-4 text-slate-400 dark:text-slate-500 font-black text-[10px] uppercase tracking-widest border-t border-slate-50 dark:border-slate-800"
            >
              Close and Review Later
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ApproveChargesModal;
