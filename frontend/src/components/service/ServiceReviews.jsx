import { Star, MessageSquare, ThumbsUp, Send, User, ChevronDown, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const ServiceReviews = ({
  reviews,
  service,
  userInfo,
  reviewSuccess,
  reviewError,
  reviewRating,
  setReviewRating,
  reviewComment,
  setReviewComment,
  handleReviewSubmit,
  isReviewLoading,
}) => {
  return (
    <div className="space-y-12">
      {/* Review Submission Section */}
      <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-full blur-3xl -mr-16 -mt-16" />
        
        <div className="flex items-center gap-4 mb-8 relative z-10">
          <div className="p-3 bg-indigo-50 rounded-2xl">
            <MessageSquare size={20} className="text-indigo-600" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900">Community Feedback</h3>
            <p className="text-slate-500 text-sm font-medium">Verified experiences from service users</p>
          </div>
          <div className="ml-auto flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-2xl border border-amber-100">
            <Star size={18} className="fill-amber-400 stroke-amber-400" />
            <span className="text-lg font-black text-amber-700">
              {service.rating?.toFixed(1) || "5.0"}
            </span>
          </div>
        </div>

        {userInfo ? (
          <AnimatePresence mode="wait">
            {reviewSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-10 text-center bg-emerald-50/50 rounded-[2rem] border border-emerald-100/50"
              >
                <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-200">
                  <CheckCircle size={32} className="text-white" />
                </div>
                <h4 className="text-xl font-black text-slate-900 mb-1">Feedback Received!</h4>
                <p className="text-emerald-700 font-semibold text-sm">Thank you for helping our community grow.</p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6 relative z-10"
              >
                {reviewError && (
                  <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-bold flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />
                    {reviewError}
                  </div>
                )}

                <div className="flex flex-col gap-3">
                  <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest ml-1">
                    Rate Your Experience
                  </label>
                  <div className="flex items-center gap-2 bg-slate-50 w-fit p-2 rounded-2xl border border-slate-100">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className="p-1.5 transition-all duration-200 hover:scale-125 focus:outline-none"
                      >
                        <Star
                          size={28}
                          className={`transition-all duration-300 ${
                            reviewRating >= star
                              ? "fill-amber-400 stroke-amber-400 drop-shadow-sm"
                              : "fill-white stroke-slate-200"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest ml-1">
                    Your Review
                  </label>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Describe the professional's behavior, work quality, and if they met expectations..."
                    required
                    rows={3}
                    className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-[2rem] text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-200 transition-all resize-none placeholder:text-slate-400"
                  />
                </div>

                <button
                  onClick={handleReviewSubmit}
                  disabled={isReviewLoading || !reviewRating || !reviewComment}
                  className={`flex items-center justify-center gap-3 px-10 py-4 rounded-2xl font-black text-white transition-all duration-300 shadow-xl ${
                    isReviewLoading || !reviewRating || !reviewComment
                      ? "bg-slate-200 cursor-not-allowed shadow-none"
                      : "bg-slate-900 hover:bg-indigo-600 hover:shadow-indigo-100 active:scale-95"
                  }`}
                >
                  {isReviewLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      Posting...
                    </>
                  ) : (
                    <>
                      Post Review <Send size={18} />
                    </>
                  )}
                </button>
                <p className="text-[10px] text-slate-400 font-bold ml-1">
                  * Reviews are only verified if you have a completed booking.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        ) : (
          <div className="p-8 bg-slate-50 rounded-[2rem] text-center border-2 border-dashed border-slate-200">
            <p className="text-slate-500 font-bold mb-4">You must be logged in to leave a review</p>
            <button
              onClick={() => (window.location.href = "/login")}
              className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-slate-900 transition-all active:scale-95"
            >
              Login to Post Review
            </button>
          </div>
        )}
      </div>

      {/* Reviews List Section */}
      <div className="space-y-8">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-4">
            <h3 className="text-2xl font-black text-slate-900">Member Reviews</h3>
            <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-black rounded-lg">
              {reviews.length} total
            </span>
          </div>
          {reviews.length > 0 && (
            <button className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors">
              Sort by: Newest <ChevronDown size={14} />
            </button>
          )}
        </div>

        {reviews.length === 0 ? (
          <div className="p-16 text-center bg-white rounded-3xl border border-slate-100 border-dashed">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star size={24} className="text-slate-200" />
            </div>
            <p className="text-slate-400 font-bold">No verified reviews found for this service yet.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            <AnimatePresence>
              {reviews.map((rev, idx) => (
                <motion.div
                  key={rev._id || idx}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-50/50 transition-all duration-500 group"
                >
                  <div className="flex items-start justify-between gap-6 mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-indigo-50 border-2 border-indigo-100 overflow-hidden flex items-center justify-center group-hover:bg-indigo-600 transition-colors duration-500">
                        {rev.user?.avatar ? (
                          <img
                            src={rev.user.avatar}
                            alt={rev.user.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-lg font-black text-indigo-400 group-hover:text-white transition-colors">
                            {rev.user?.name?.[0]?.toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div>
                        <h4 className="font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {rev.user?.name || "Verified Client"}
                        </h4>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-tight">
                          {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : "Recently"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-100">
                      <Star size={14} className="fill-amber-400 stroke-amber-400" />
                      <span className="text-sm font-black text-amber-700">{rev.rating?.toFixed(1)}</span>
                    </div>
                  </div>

                  <p className="text-slate-600 leading-relaxed text-sm font-medium pl-4 border-l-4 border-slate-50 group-hover:border-indigo-100 transition-colors">
                    "{rev.comment}"
                  </p>

                  <div className="mt-8 flex items-center gap-6 text-[10px] font-black uppercase tracking-wider text-slate-400">
                    <button className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors">
                      <ThumbsUp size={14} /> Helpful
                    </button>
                    <span className="w-1 h-1 bg-slate-200 rounded-full" />
                    <button className="hover:text-red-400 transition-colors">Report</button>
                    <div className="ml-auto w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-200" title="Verified Professional Service" />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};
