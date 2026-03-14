import { Star, Clock, CheckCircle, Zap } from "lucide-react";
import Button from "../common/Button";
import Badge from "../common/Badge";

const UserMembershipTab = ({ userInfo, navigate }) => {
  return (
    <div className="max-w-2xl">
      <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl shadow-indigo-100/20">
        <div className="flex items-center gap-6 mb-10">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center shadow-inner">
            <Star size={32} className="text-indigo-600 fill-indigo-600" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              My Membership
            </h2>
            <p className="text-slate-500 font-medium">
              Manage your subscription and exclusive perks
            </p>
          </div>
        </div>

        <div className="bg-slate-50/80 rounded-3xl p-8 border border-white shadow-inner mb-10">
          <div className="flex justify-between items-center mb-6">
            <div>
              <div className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">
                Current Plan
              </div>
              <div className="text-2xl font-black text-slate-900 leading-tight">
                {userInfo.activeSubscription?.name || "Basic Free"}
              </div>
            </div>
            <Badge variant={userInfo.activeSubscription ? "success" : " gray"} className="px-4 py-1.5 uppercase tracking-widest text-[0.65rem]">
              {userInfo.activeSubscription ? "ACTIVATE" : "FREE"}
            </Badge>
          </div>

          {userInfo.subscriptionExpiresAt && (
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-500 bg-white/50 w-fit px-3 py-1.5 rounded-lg border border-white">
              <Clock size={14} className="text-slate-400" />
              Renews on {new Date(userInfo.subscriptionExpiresAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric"
              })}
            </div>
          )}
        </div>

        <div className="mb-10">
          <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
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
                className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-50 shadow-sm group hover:border-emerald-100 hover:bg-emerald-50/30 transition-all"
              >
                <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0 group-hover:bg-emerald-100 transition-colors">
                  <CheckCircle size={14} className="text-emerald-500" />
                </div>
                <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors">
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
            className="w-full h-16 rounded-2xl shadow-xl shadow-indigo-200/50 text-base"
          >
            Upgrade to Plus Pro
          </Button>
        )}
      </div>
    </div>
  );
};

export default UserMembershipTab;
