import { Package, CheckCircle, Wallet, Star, TrendingUp, Loader2, BookOpen } from "lucide-react";
import { StatCard } from "./StatCard";
import Badge from "../common/Badge";
import Button from "../common/Button";

const UserOverviewTab = ({ bookings, completedBookings, wallet, reviews, totalSpent, bookingsLoading, navigate }) => {
  return (
    <div className="flex flex-col gap-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          icon={<Package size={22} className="text-indigo-600" />}
          label="Total Bookings"
          value={(bookings || []).length}
          bgClass="bg-indigo-50"
        />
        <StatCard
          icon={<CheckCircle size={22} className="text-emerald-600" />}
          label="Completed"
          value={completedBookings}
          bgClass="bg-emerald-50"
        />
        <StatCard
          icon={<Wallet size={22} className="text-amber-600" />}
          label="Wallet Balance"
          value={`₹${wallet?.balance || 0}`}
          bgClass="bg-amber-50"
        />
        <StatCard
          icon={<Star size={22} className="text-violet-600" />}
          label="Reviews Given"
          value={(reviews || []).length || 0}
          bgClass="bg-violet-50"
        />
        <StatCard
          icon={<TrendingUp size={22} className="text-rose-600" />}
          label="Total Spent"
          value={`₹${totalSpent}`}
          bgClass="bg-rose-50"
        />
      </div>

      {/* Recent Bookings */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-300">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            Recent Bookings
          </h3>
          {(bookings || []).length > 3 && (
            <Button variant="outline" size="sm" className="text-xs font-bold" onClick={() => navigate("/dashboard?tab=bookings")}>
              View All
            </Button>
          )}
        </div>

        {bookingsLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          </div>
        ) : (bookings || []).length === 0 ? (
          <div className="text-center py-16 px-6">
            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <BookOpen className="text-slate-300" size={32} />
            </div>
            <p className="text-slate-500 font-medium mb-6">
              No bookings yet. Find a service to get started!
            </p>
            <Button onClick={() => navigate("/services")}>
              Browse Services
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {(bookings || []).slice(0, 3).map((b) => (
              <div
                key={b._id}
                className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800 hover:shadow-lg dark:hover:shadow-none transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-xl shadow-sm transition-colors">
                    🏠
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white transition-colors">
                      {b.service?.title || "Service"}
                    </div>
                    <div className="text-xs text-slate-400 dark:text-slate-500 font-bold mt-1 transition-colors">
                      {b.bookingDate
                        ? new Date(b.bookingDate).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "Date TBD"}{" "}
                      • {b.timeSlot || ""}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-lg font-black text-slate-900 dark:text-white transition-colors">
                    ₹{b.totalAmount}
                  </div>
                  <Badge variant={b.status}>
                    {b.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserOverviewTab;
