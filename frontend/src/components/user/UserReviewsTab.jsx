import { Loader2, MessageSquare, Star } from "lucide-react";

const UserReviewsTab = ({ reviews, reviewsLoading }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-300">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight transition-colors">
          My Reviews ({reviews.length})
        </h2>
      </div>

      {reviewsLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 text-indigo-600 dark:text-indigo-400 animate-spin transition-colors" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-20 px-6">
          <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-colors">
            <MessageSquare className="text-slate-300 dark:text-slate-600" size={40} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 transition-colors">No reviews yet</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto transition-colors">
            You haven't shared your feedback on any services yet. Your reviews help others!
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {reviews.map((r) => (
            <div
              key={r._id}
              className="group bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 transition-all hover:bg-white dark:hover:bg-slate-800 hover:shadow-xl dark:hover:shadow-none transition-colors duration-300"
            >
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-xl shadow-sm transition-colors">
                    🏠
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {r.service?.title}
                    </h3>
                    <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-0.5 transition-colors">
                      Posted on {new Date(r.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric", month: "short", year: "numeric"
                      })}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-700 shadow-sm transition-colors">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={14}
                      className={r.rating >= s ? "fill-amber-400 text-amber-400" : "text-slate-200 dark:text-slate-700"}
                    />
                  ))}
                  <span className="ml-1.5 text-sm font-black text-slate-700 dark:text-slate-300 transition-colors">{r.rating}</span>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -left-2 top-0 text-4xl text-indigo-100 dark:text-indigo-900/30 font-serif leading-none transition-colors">"</div>
                <p className="pl-4 text-slate-600 dark:text-slate-400 font-medium leading-relaxed italic relative z-10 transition-colors">
                  {r.comment}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserReviewsTab;
