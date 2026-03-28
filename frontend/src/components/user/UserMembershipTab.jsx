import { Star, Clock, CheckCircle, Zap } from "lucide-react";
import Button from "../common/Button";
import Badge from "../common/Badge";

const UserMembershipTab = ({ userInfo, navigate }) => {
  return (
    <div className="max-w-2xl">
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-800 shadow-xl shadow-indigo-100/20 dark:shadow-none transition-colors duration-300">
        <div className="flex items-center gap-6 mb-10">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center shadow-inner transition-colors">
            <Star size={32} className="text-indigo-600 dark:text-indigo-400 fill-indigo-600 dark:fill-indigo-400 transition-colors" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight transition-colors">
              My Membership
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium transition-colors">
              Manage your subscription and exclusive perks
            </p>
          </div>
        </div>

        <div className="bg-slate-50/80 dark:bg-slate-800/50 rounded-3xl p-8 border border-white dark:border-slate-700 shadow-inner mb-10 transition-colors">
          <div className="flex justify-between items-center mb-6">
            <div>
              <div className="text-[0.65rem] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-1 transition-colors">
                Current Plan
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white leading-tight transition-colors">
                {userInfo.activeSubscription?.name || "Basic Free"}
              </div>
            </div>
            <Badge variant={userInfo.activeSubscription ? "success" : " gray"} className="px-4 py-1.5 uppercase tracking-widest text-[0.65rem]">
              {userInfo.activeSubscription ? "ACTIVATE" : "FREE"}
            </Badge>
          </div>

          {userInfo.subscriptionExpiresAt && (
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400 bg-white/50 dark:bg-slate-900/50 w-fit px-3 py-1.5 rounded-lg border border-white dark:border-slate-700 transition-colors">
              <Clock size={14} className="text-slate-400 dark:text-slate-500 transition-colors" />
              Renews on {new Date(userInfo.subscriptionExpiresAt).toLocaleDateString("en-IN", {
                day: "numeric", month: "short", year: "numeric"
              })}
            </div>
          )}
        </div>

        <div className="mb-10">
          <h3 className="text-lg font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2 transition-colors">
            Included Benefits
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(
              userInfo.activeSubscription?.features || [
                "Standard Booking Fees",
                "24/7 Customer Support",
                "Basic Maintenance Guide",
                "Standard Service Warranty"
              ]
            ).map((f, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-50 dark:border-slate-800 shadow-sm group hover:border-emerald-100 dark:hover:border-emerald-900 hover:bg-emerald-50/30 dark:hover:bg-emerald-900/20 transition-all duration-300"
              >
                <div className="w-6 h-6 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center shrink-0 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-500 transition-colors">
                  <CheckCircle size={14} className="text-emerald-500 dark:text-emerald-400 transition-colors" />
                </div>
                <span className="text-sm font-bold text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                  {f}
                </span>
              </div>
            ))}
          </div>
        </div>

        {!userInfo.activeSubscription?.name?.includes("Pro") && (
          <Button
            onClick={() => navigate("/subscriptions")}
            icon={Zap}
            size="lg"
            className="w-full h-16 rounded-2xl shadow-xl shadow-indigo-200/50 dark:shadow-none text-base"
          >
            Upgrade to Plus Pro
          </Button>
        )}
      </div>
    </div>
  );
};

export default UserMembershipTab;
