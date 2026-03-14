import { Loader2, MessageSquare, Star } from "lucide-react";

const UserReviewsTab = ({ reviews, reviewsLoading }) => {
  return (
    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-black text-slate-900 tracking-tight">
          My Reviews ({reviews.length})
        </h2>
      </div>

      {reviewsLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-20 px-6">
          <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <MessageSquare className="text-slate-300" size={40} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No reviews yet</h3>
          <p className="text-slate-500 max-w-xs mx-auto">
            You haven't shared your feedback on any services yet. Your reviews help others!
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {reviews.map((r) => (
            <div
              key={r._id}
              className="group bg-slate-50/50 rounded-2xl p-6 border border-slate-100 transition-all hover:bg-white hover:shadow-xl hover:shadow-indigo-100/40"
            >
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-xl shadow-sm">
                    🏠
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {r.service?.title}
                    </h3>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                      Posted on {new Date(r.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                      })}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-lg border border-slate-100 shadow-sm">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={14}
                      className={r.rating >= s ? "fill-amber-400 text-amber-400" : "text-slate-200"}
                    />
                  ))}
                  <span className="ml-1.5 text-sm font-black text-slate-700">{r.rating}</span>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -left-2 top-0 text-4xl text-indigo-100 font-serif leading-none">"</div>
                <p className="pl-4 text-slate-600 font-medium leading-relaxed italic relative z-10">
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
