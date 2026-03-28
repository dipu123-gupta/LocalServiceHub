import api from "@/utils/api";
import Button from "../common/Button";
import Badge from "../common/Badge";
import { useState } from "react";
import { 
  X, 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Clock, 
  CreditCard, 
  Landmark, 
  CircleDollarSign 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const AdminWithdrawalsTab = ({ withdrawals = [], setWithdrawals }) => {
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectionNote, setRejectionNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpdateWithdrawal = async (id, status, adminNote = "") => {
    try {
      if (status === "approved" && !window.confirm("Are you sure you want to approve and release this payment?")) return;
      
      const { data } = await api.put(`/withdrawals/${id}`, { 
        status, 
        adminNote 
      });
      setWithdrawals(withdrawals.map((w) => (w._id === id ? data : w)));
      setRejectingId(null);
      setRejectionNote("");
    } catch (err) {
      alert(err.extractedMessage || "Failed to update withdrawal status");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openRejectModal = (id) => {
    setRejectingId(id);
    setRejectionNote("");
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 transition-colors">
      <div className="p-8 border-b border-slate-100 dark:border-slate-800 transition-colors">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Payout Requests
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">
          Review and process provider earnings withdrawals.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 dark:bg-slate-800/50 transition-colors">
              {["Submission Date", "Provider Info", "Payment Amount", "Transfer Method", "Current Status", "Actions"].map(
                (h) => (
                  <th
                    key={h}
                    className="px-8 py-5 text-[0.65rem] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]"
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800 transition-colors">
            {withdrawals.map((w) => (
              <tr key={w._id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100/50 dark:bg-slate-800/50 w-fit px-2.5 py-1 rounded-lg transition-colors">
                    <Clock size={12} className="text-slate-400 dark:text-slate-600" />
                    {new Date(w.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric"
                    })}
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="font-black text-slate-900 dark:text-white leading-tight">
                    {w.provider?.businessName}
                  </div>
                  <div className="text-xs font-bold text-slate-400 dark:text-slate-500 mt-0.5 uppercase tracking-wider">
                    {w.provider?.user?.email}
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-1.5 transition-colors">
                    <span className="text-indigo-600 dark:text-indigo-400 text-sm">₹</span>
                    {w.amount.toLocaleString()}
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2 text-[0.65rem] font-black text-slate-700 dark:text-slate-200 bg-indigo-50 dark:bg-indigo-900/20 w-fit px-2 py-0.5 rounded border border-indigo-100 dark:border-indigo-900/50 uppercase tracking-widest transition-colors">
                      {w.paymentMethod === "bank_transfer" ? <Landmark size={12} /> : <CreditCard size={12} />}
                      {w.paymentMethod.replace("_", " ")}
                    </div>
                    {w.paymentMethod === "bank_transfer" && (
                      <div className="text-[0.7rem] font-bold text-slate-400 dark:text-slate-500 leading-tight">
                        A/C: ••••{w.bankDetails?.accountNumber?.slice(-4)}
                        <br />
                        IFSC: {w.bankDetails?.ifscCode}
                      </div>
                    )}
                    {w.paymentMethod === "upi" && (
                      <div className="text-[0.7rem] font-bold text-slate-400 dark:text-slate-500">
                        {w.upiId}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-8 py-6">
                  <Badge 
                    variant={w.status === "pending" ? "pending" : w.status === "completed" ? "success" : "danger"}
                    className="px-3 py-1 uppercase tracking-widest text-[0.6rem] dark:bg-slate-800 dark:text-slate-400"
                  >
                    {w.status}
                  </Badge>
                </td>
                <td className="px-8 py-6">
                  {w.status === "pending" && (
                    <div className="flex items-center gap-3">
                      <Button
                        onClick={() => handleUpdateWithdrawal(w._id, "approved")}
                        size="sm"
                        variant="success"
                        icon={CheckCircle}
                        className="rounded-xl px-4 font-black text-[0.65rem]"
                      >
                        Release
                      </Button>
                      <Button
                        onClick={() => openRejectModal(w._id)}
                        size="sm"
                        variant="danger"
                        icon={XCircle}
                        className="rounded-xl px-4 font-black text-[0.65rem]"
                      >
                        Decline
                      </Button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {withdrawals.length === 0 && (
          <div className="py-20 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CircleDollarSign size={24} className="text-slate-300" />
            </div>
            <p className="text-slate-400 font-bold text-sm">No payout requests found.</p>
          </div>
        )}
      </div>

      {/* Rejection Modal */}
      <AnimatePresence>
        {rejectingId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setRejectingId(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-lg p-10 shadow-2xl border border-slate-100 dark:border-slate-800 transition-colors"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-rose-50 dark:bg-rose-900/20 text-rose-500 dark:text-rose-400 rounded-2xl flex items-center justify-center transition-colors">
                    <XCircle size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Reject Payout</h3>
                    <p className="text-slate-400 dark:text-slate-500 font-bold text-[10px] uppercase tracking-widest mt-0.5">Please provide a reason</p>
                  </div>
                </div>
                <button 
                  onClick={() => setRejectingId(null)}
                  className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors text-slate-400 dark:text-slate-500"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Rejection Reason</label>
                  <textarea
                    value={rejectionNote}
                    onChange={(e) => setRejectionNote(e.target.value)}
                    placeholder="e.g., Bank details incorrect, Insufficient verification..."
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-50 dark:border-slate-700 rounded-2xl p-5 text-sm font-bold text-slate-900 dark:text-white min-h-[120px] outline-none focus:border-rose-100 dark:focus:border-rose-900 focus:bg-white dark:focus:bg-slate-950 transition-all ring-0 shadow-inner"
                  />
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={() => setRejectingId(null)}
                    variant="secondary"
                    className="flex-1 rounded-2xl font-black text-xs uppercase tracking-widest h-14"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      setIsSubmitting(true);
                      handleUpdateWithdrawal(rejectingId, "rejected", rejectionNote);
                    }}
                    isLoading={isSubmitting}
                    disabled={!rejectionNote.trim()}
                    variant="danger"
                    className="flex-1 rounded-2xl font-black text-xs uppercase tracking-widest h-14"
                  >
                    Reject Payout
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminWithdrawalsTab;
