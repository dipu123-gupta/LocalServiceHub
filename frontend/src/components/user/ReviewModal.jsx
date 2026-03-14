import React, { useState } from "react";
import { X, Star, Send, Loader2, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/utils/api";
import Button from "../common/Button";

const ReviewModal = ({ isOpen, onClose, booking, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return alert("Please select a rating");
    if (!comment.trim()) return alert("Please share some feedback");

    setSubmitting(true);
    try {
      await api.post("/reviews", {
        serviceId: booking.service?._id,
        rating,
        comment,
      });
      onSuccess();
      onClose();
    } catch (err) {
      alert(err.extractedMessage || "Failed to post review");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
      />
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative bg-white rounded-[3rem] w-full max-w-lg p-10 shadow-2xl border border-slate-100 overflow-hidden"
      >
        {/* Dynamic Background Element */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-50 rounded-full blur-3xl opacity-50" />
        
        <div className="flex items-center justify-between mb-8 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
              <MessageSquare size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Share Experience</h3>
              <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-0.5 italic">Review your service</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-3 bg-white text-slate-400 hover:text-rose-500 rounded-2xl shadow-sm transition-all border border-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
          <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 text-center space-y-4 shadow-inner">
            <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">How was the {booking.service?.title}?</h4>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  className="transition-all transform hover:scale-125"
                >
                  <Star
                    size={36}
                    className={`transition-all ${
                      (hover || rating) >= star
                        ? "fill-amber-400 text-amber-400 scale-110 drop-shadow-md"
                        : "text-slate-300 fill-transparent"
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic pt-2">
              {rating === 5 ? "Amazing experience!" : rating === 4 ? "Very good service" : rating === 3 ? "It was okay" : rating === 2 ? "Could be better" : rating === 1 ? "Not satisfied" : "Rate the service"}
            </p>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Write your feedback</label>
            <textarea
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What did you like? What could be improved? Tell us about the professional..."
              className="w-full bg-white border-2 border-slate-100 focus:border-indigo-100 rounded-3xl p-6 text-sm font-bold min-h-[150px] outline-none transition-all shadow-sm resize-none"
            />
          </div>

          <Button
            type="submit"
            isLoading={submitting}
            disabled={submitting || rating === 0 || !comment.trim()}
            className="w-full py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-indigo-100"
          >
            Post Review
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default ReviewModal;
