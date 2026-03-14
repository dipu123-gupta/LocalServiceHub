import { Users, Briefcase, LayoutGrid, BarChart3, MapPin, Zap, TrendingUp, ArrowUpRight, IndianRupee } from "lucide-react";
import { motion } from "framer-motion";

export const StatCard = ({ icon, label, value, description, variant = "indigo", onClick }) => {
  const variants = {
    indigo: "bg-indigo-500/10 text-indigo-600 border-indigo-50",
    emerald: "bg-emerald-500/10 text-emerald-600 border-emerald-50",
    amber: "bg-amber-500/10 text-amber-600 border-amber-50",
    violet: "bg-violet-500/10 text-violet-600 border-violet-50",
    rose: "bg-rose-500/10 text-rose-600 border-rose-50",
    cyan: "bg-cyan-500/10 text-cyan-600 border-cyan-50",
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      className={`bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-100/40 transition-all group relative overflow-hidden ${onClick ? 'cursor-pointer active:scale-95' : ''}`}
    >
      <div className="flex items-center gap-5 relative z-10">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300 border ${variants[variant]}`}>
          {icon}
        </div>
        <div>
          <div className="text-2xl font-black text-slate-900 leading-none mb-1 tracking-tighter">
            {value}
          </div>
          <div className="text-[0.65rem] font-black text-slate-400 uppercase tracking-widest">
            {label}
          </div>
        </div>
      </div>
      {description && (
        <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between relative z-10">
          <span className="text-[0.7rem] font-bold text-slate-500 uppercase tracking-wider italic opacity-60">
            {description}
          </span>
          <ArrowUpRight size={14} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      )}
      <div className={`absolute -right-6 -bottom-6 w-24 h-24 rounded-full opacity-0 group-hover:opacity-10 transition-opacity blur-2xl ${variants[variant].split(' ')[0]}`} />
    </motion.div>
  );
};

const AdminOverviewTab = ({
  users = [],
  services = [],
  categories = [],
  stats = { financials: { totalCommission: 0 }, dailyBookings: [], topServices: [] },
  cities = [],
  setActiveTab,
  setShowCatForm,
}) => {
  return (
    <div className="space-y-10">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <StatCard
          icon={<IndianRupee size={28} className="stroke-[1.5]" />}
          label="Gross Revenue"
          value={`₹${stats.financials?.totalRevenue?.toLocaleString() || 0}`}
          variant="emerald"
          description="Total platform volume"
        />
        <StatCard
          icon={<ArrowUpRight size={28} className="stroke-[1.5]" />}
          label="Platform Commission"
          value={`₹${stats.financials?.totalCommission?.toLocaleString() || 0}`}
          variant="indigo"
          description="Total earnings"
        />
        <StatCard
          icon={<Users size={28} className="stroke-[1.5]" />}
          label="Total Users"
          value={users.length}
          variant="violet"
          description="Active community"
        />
        <StatCard
          icon={<LayoutGrid size={28} className="stroke-[1.5]" />}
          label="Categories"
          value={categories.length}
          variant="amber"
          description="Market segments"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Recent Users List */}
        <div className="lg:col-span-7 bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/40">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-2xl font-black text-slate-900 tracking-tighter italic">
              Recent Onboarding
            </h3>
            <button 
              onClick={() => setActiveTab("users")}
              className="text-[10px] font-black text-indigo-600 hover:text-indigo-700 uppercase tracking-[0.2em] px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-xl transition-all active:scale-95"
            >
              System View All
            </button>
          </div>
          
          <div className="space-y-4">
            {users
              .slice(-5)
              .reverse()
              .map((u) => (
                <div
                  key={u._id}
                  className="flex items-center justify-between p-5 rounded-3xl bg-slate-50/50 border border-slate-100 group hover:bg-white hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500"
                >
                  <div className="flex items-center gap-5">
                    <div className="relative">
                       <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-500">
                         {u.name[0].toUpperCase()}
                       </div>
                       <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-lg bg-white border border-slate-100 flex items-center justify-center shadow-lg">
                          <div className={`w-2 h-2 rounded-full ${u.role === 'admin' ? 'bg-rose-500' : u.role === 'provider' ? 'bg-violet-500' : 'bg-emerald-500'}`} />
                       </div>
                    </div>
                    <div>
                      <div className="text-lg font-black text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">
                        {u.name}
                      </div>
                      <div className="text-xs font-bold text-slate-400">
                        {u.email}
                      </div>
                    </div>
                  </div>
                  <div className={`text-[9px] font-black uppercase tracking-[0.2em] px-3.5 py-1.5 rounded-xl border-2 ${
                    u.role === "admin" 
                      ? "bg-rose-50 text-rose-600 border-rose-100/50" 
                      : u.role === "provider" 
                        ? "bg-violet-50 text-violet-600 border-violet-100/50" 
                        : "bg-emerald-50 text-emerald-600 border-emerald-100/50"
                  }`}>
                    {u.role}
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Global Performance Insights */}
        <div className="lg:col-span-5 bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.4)]">
          <div className="relative z-10 h-full flex flex-col">
            <div className="flex items-center gap-2 mb-2">
               <TrendingUp size={16} className="text-indigo-400" />
               <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">Performance Metrics</span>
            </div>
            <h3 className="text-4xl font-black mb-6 tracking-tighter italic">Global Velocity</h3>
            <p className="text-slate-400 font-medium mb-12 max-w-xs leading-relaxed">
              Propelling the marketplace flywheel through data-driven operational excellence.
            </p>
            
            <div className="grid grid-cols-1 gap-6 mt-auto">
              <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-xl group hover:bg-white/10 transition-all">
                <div className="text-5xl font-black mb-2 tracking-tighter text-indigo-400 group-hover:scale-105 transition-transform inline-block">
                  {stats.dailyBookings?.reduce((acc, curr) => acc + curr.count, 0) || 0}
                </div>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Bookings (Last 7 Days)</div>
              </div>
              <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-xl group hover:bg-white/10 transition-all">
                <div className="text-xl font-black mb-1 text-emerald-400">Top Service:</div>
                <div className="text-2xl font-black tracking-tight text-white mb-2">
                  {stats.topServices?.[0]?.title || "N/A"}
                </div>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Highest Velocity Asset</div>
              </div>
            </div>
          </div>
          
          {/* Animated Accents */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/30 blur-[80px] rounded-full -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-600/20 blur-[60px] rounded-full -ml-24 -mb-24" />
          
          <BarChart3 className="absolute right-12 top-12 w-32 h-32 text-white/5 rotate-12 stroke-[1]" />
        </div>
      </div>
    </div>
  );
};

export default AdminOverviewTab;
