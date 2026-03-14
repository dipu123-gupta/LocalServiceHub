import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  DollarSign, 
  Star, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight,
  Loader2,
  ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";
import api from "@/utils/api";

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await api.get("/service-providers/stats");
      console.log("Dashboard Stats Received:", data);
      setStats(data);
    } catch (err) {
      console.error("Failed to fetch dashboard stats", err);
      setError("Could not load dashboard data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 size={40} className="text-indigo-600 animate-spin" />
        <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Syncing your business data...</p>
      </div>
    );
  }

  const kpis = [
    {
      name: "Withdrawable",
      value: `₹${(stats?.withdrawableBalance || 0).toLocaleString()}`,
      change: "Available now",
      isPositive: true,
      icon: DollarSign,
      color: "bg-emerald-500",
    },
    {
      name: "Pending balance",
      value: `₹${(stats?.pendingBalance || 0).toLocaleString()}`,
      change: "Locked",
      isPositive: false,
      icon: Clock,
      color: "bg-amber-500",
    },
    {
      name: "Total Earnings",
      value: `₹${(stats?.totalEarnings || 0).toLocaleString()}`,
      change: "Lifetime",
      isPositive: true,
      icon: TrendingUp,
      color: "bg-indigo-600",
    },
    {
      name: "Average Rating",
      value: stats?.rating?.toFixed(1) || "5.0",
      change: "Stable",
      isPositive: true,
      icon: Star,
      color: "bg-rose-500",
    },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Dashboard <span className="text-indigo-600">Overview</span>
          </h1>
          <p className="text-slate-500 font-bold mt-2">
            Track your performance, manage bookings, and grow your business.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-5 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm flex items-center gap-3">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-sm font-black text-slate-700 uppercase tracking-wider">Live System Status</span>
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, idx) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={kpi.name}
            className="group bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-indigo-100 hover:-translate-y-1 transition-all duration-500 relative overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 ${kpi.color} opacity-[0.03] rounded-bl-[5rem] -mr-8 -mt-8 group-hover:scale-110 transition-transform duration-700`} />
            
            <div className="flex items-start justify-between mb-8">
              <div className={`${kpi.color} p-4 rounded-2xl text-white shadow-lg shadow-current/20`}>
                <kpi.icon size={24} />
              </div>
              <div className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest ${kpi.isPositive ? "text-emerald-500" : "text-rose-500"}`}>
                {kpi.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {kpi.change}
              </div>
            </div>

            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{kpi.name}</p>
              <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{kpi.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/10 blur-[100px] -mr-40 -mt-40" />
            <div className="relative z-10">
              <h3 className="text-2xl font-black tracking-tight mb-2">Grow your Business</h3>
              <p className="text-slate-400 font-bold mb-8 max-w-md">Increase your visibility and get more bookings by keeping your services updated and profile professional.</p>
              <div className="flex flex-wrap gap-4">
                <Link to="/provider/services" className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-black text-sm shadow-xl hover:bg-indigo-50 transition-all active:scale-95">
                  Update Services
                </Link>
                <Link to="/provider/profile" className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-indigo-500/20 hover:bg-indigo-500 transition-all active:scale-95">
                  View Profile
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl p-10">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Recent Activity</h3>
              <Link to="/provider/bookings" className="text-xs font-black text-indigo-600 uppercase tracking-widest hover:underline">View All</Link>
            </div>
            
            <div className="space-y-6">
              {stats?.recentActivities?.length > 0 ? (
                stats.recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-all border border-transparent hover:border-slate-100 group">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black ${
                        activity.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 
                        activity.status === 'pending' ? 'bg-amber-50 text-amber-600' : 'bg-slate-50 text-slate-600'
                      }`}>
                        {activity.title[0]}
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-800">{activity.title}</p>
                        <p className="text-xs font-bold text-slate-400">{activity.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                        {new Date(activity.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </p>
                      <ChevronRight size={16} className="text-slate-300 group-hover:translate-x-1 transition-transform ml-auto" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-10 text-center text-slate-400 font-bold">No recent activity found.</div>
              )}
            </div>
          </div>
        </div>

        {/* Status Breakdown & Notifications */}
        <div className="space-y-8">
          <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl p-8">
            <h3 className="text-lg font-black text-slate-900 tracking-tight mb-8">Service Status</h3>
            <div className="space-y-6">
              <Link to="/provider/bookings?filter=pending" className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-black shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    {stats?.pendingBookings}
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-800 leading-tight">Pending Approval</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Ready to review</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
              </Link>
              <div className="h-[1px] bg-slate-50" />
              <Link to="/provider/bookings?filter=completed" className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center font-black shadow-sm group-hover:bg-emerald-600 group-hover:text-white transition-all">
                    {stats?.completedBookings}
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-800 leading-tight">Successful Jobs</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Growth engine active</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          <div className="bg-indigo-600 rounded-[3rem] p-8 text-white shadow-2xl shadow-indigo-200 relative overflow-hidden group">
            <div className="absolute inset-0 bg-slate-900 opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
            <Clock className="text-indigo-400/50 absolute top-4 right-4" size={60} strokeWidth={1} />
            <h4 className="text-base font-black tracking-tight mb-4 relative z-10">System Alerts</h4>
            <div className="space-y-4 relative z-10">
              <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10">
                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200 mb-1">Live Updates</p>
                <p className="text-xs font-bold leading-relaxed">Your dashboard is synchronized with real-time job requests and revenue tracking.</p>
              </div>
              <Link to="/provider/earnings" className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-xl shadow-indigo-900/20 block text-center">
                View Wallet & Logs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Internal Helper for Icon Consistency
const BadgeCheck = ({ size, className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

export default Dashboard;
