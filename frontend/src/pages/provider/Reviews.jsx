import React, { useState, useEffect } from "react";
import { 
  Star, 
  MessageSquare, 
  Filter, 
  Search, 
  Loader2, 
  User, 
  Calendar,
  ThumbsUp,
  AlertCircle,
  MoreHorizontal,
  Quote
} from "lucide-react";
import { motion } from "framer-motion";
import api from "../../services/api";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    average: 0,
    total: 0,
    breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/reviews/provider");
      setReviews(data);
      
      // Calculate stats
      const total = data.length;
      if (total > 0) {
        const sum = data.reduce((acc, r) => acc + r.rating, 0);
        const breakdown = data.reduce((acc, r) => {
          acc[Math.floor(r.rating)] = (acc[Math.floor(r.rating)] || 0) + 1;
          return acc;
        }, { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });
        
        setStats({
          average: sum / total,
          total,
          breakdown
        });
      }
    } catch (err) {
      console.error("Failed to load reviews", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 size={40} className="text-indigo-600 animate-spin" />
        <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Analyzing your reputation...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Customer <span className="text-indigo-600">Reviews</span>
          </h1>
          <p className="text-slate-500 font-bold mt-2">
            Your reputation is your best marketing tool. Track and analyze feedback.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-5 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm flex items-center gap-3">
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
            <span className="text-sm font-black text-slate-700 uppercase tracking-wider">Top 1% Professional</span>
          </div>
        </div>
      </div>

      {/* Summary Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-slate-900 rounded-[3.5rem] p-12 text-white relative overflow-hidden group shadow-2xl shadow-slate-200">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/10 blur-[100px] -mr-40 -mt-40" />
          <div className="relative z-10">
            <h3 className="text-xl font-black tracking-tight mb-8">Performance Rating</h3>
            <div className="flex items-end gap-6 mb-10">
              <h2 className="text-8xl font-black tracking-tighter leading-none">{stats.average.toFixed(1)}</h2>
              <div className="pb-2">
                <div className="flex gap-1 text-amber-500 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={20} fill={i < Math.floor(stats.average) ? "currentColor" : "none"} />
                  ))}
                </div>
                <p className="text-slate-400 font-bold text-sm tracking-tight capitalize">Based on {stats.total} genuine reviews</p>
              </div>
            </div>
            <div className="p-6 bg-white/5 backdrop-blur-md rounded-[2rem] border border-white/10">
              <p className="text-xs font-bold leading-relaxed text-slate-300 italic">"Consistently high ratings increase your chances of being featured in our 'Best of City' sections."</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-[3.5rem] border border-slate-100 shadow-xl p-10 flex flex-col justify-center">
          <h3 className="text-xl font-black text-slate-900 tracking-tight mb-8">Rating Breakdown</h3>
          <div className="space-y-6">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = stats.breakdown[rating] || 0;
              const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
              return (
                <div key={rating} className="flex items-center gap-6 group">
                  <div className="flex items-center gap-2 w-12 shrink-0">
                    <span className="text-sm font-black text-slate-900">{rating}</span>
                    <Star size={14} className="text-amber-500" fill="currentColor" />
                  </div>
                  <div className="flex-1 h-3 bg-slate-50 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={`h-full ${rating >= 4 ? 'bg-emerald-500' : rating >= 3 ? 'bg-amber-500' : 'bg-rose-500'} rounded-full`}
                    />
                  </div>
                  <span className="text-xs font-black text-slate-400 w-10 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Review List */}
      <div className="space-y-8">
        <div className="flex items-center justify-between px-4">
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Recent Feedback</h3>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 text-sm font-black text-slate-400 hover:text-indigo-600 transition-all uppercase tracking-widest">
              <Filter size={16} />
              Filter
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {reviews.length === 0 ? (
            <div className="md:col-span-2 bg-white rounded-[3rem] border border-slate-100 p-20 text-center">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Quote size={40} className="text-slate-200" />
              </div>
              <p className="text-slate-500 font-bold">No reviews received yet. Complete jobs to see feedback here!</p>
            </div>
          ) : (
            reviews.map((review, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                key={idx}
                className="bg-white rounded-[3rem] border border-slate-100 shadow-xl p-10 flex flex-col hover:shadow-2xl hover:shadow-indigo-100/50 transition-all duration-500 group"
              >
                <div className="flex items-start justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 font-black text-xl border border-indigo-100 shadow-sm group-hover:rotate-6 transition-transform">
                      {review.user?.name?.[0].toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900">{review.user?.name}</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Verified Client</p>
                    </div>
                  </div>
                  <div className="flex gap-1 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} />
                    ))}
                  </div>
                </div>

                <div className="p-8 bg-slate-50/50 rounded-[2.5rem] border border-slate-50 relative flex-1 mb-6">
                  <Quote className="absolute top-6 left-6 text-slate-100" size={40} />
                  <p className="relative z-10 text-sm font-bold text-slate-600 leading-relaxed italic">
                    "{review.comment}"
                  </p>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white border border-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                      <Calendar size={14} />
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {new Date(review.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-100 opacity-0 group-hover:opacity-100 transition-all cursor-pointer hover:bg-slate-900">
                    Respond
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Reviews;
