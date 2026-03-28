import { useState, useEffect } from "react";
import { 
  IndianRupee, 
  Settings, 
  RefreshCw, 
  ArrowUpRight, 
  CheckCircle, 
  Clock, 
  Filter,
  CreditCard,
  PieChart,
  TrendingUp,
  Wallet,
  Activity,
  ArrowDownRight
} from "lucide-react";
import { motion } from "framer-motion";
import api from "@/utils/api";
import Button from "../common/Button";

const AdminFinancialTab = ({ transactions = [], stats = {} }) => {
  const [commission, setCommission] = useState(15);
  const [isUpdating, setIsUpdating] = useState(false);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchCommission();
  }, []);

  const fetchCommission = async () => {
    try {
      const { data } = await api.get("/settings/platformCommissionPercentage");
      setCommission(data.value);
    } catch (err) {
      console.error("Failed to fetch commission setting", err);
    }
  };

  const handleUpdateCommission = async () => {
    setIsUpdating(true);
    try {
      await api.post("/settings", {
        key: "platformCommissionPercentage",
        value: Number(commission),
        description: "Global platform commission percentage"
      });
      alert("Commission settings updated successfully!");
    } catch (err) {
      alert("Failed to update commission settings");
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredTransactions = transactions.filter(t => 
    filter === "all" ? true : t.status === filter
  );

  const kpis = [
    {
      label: "Total Gross Volume",
      value: `₹${(stats.financials?.totalRevenue || 0).toLocaleString()}`,
      growth: stats.financials?.revenueGrowth || 0,
      icon: TrendingUp,
      color: "indigo"
    },
    {
      label: "Platform Revenue",
      value: `₹${(stats.financials?.totalCommission || 0).toLocaleString()}`,
      growth: stats.financials?.commissionGrowth || 0,
      icon: Activity,
      color: "emerald"
    },
    {
      label: "Provider Payouts",
      value: `₹${(stats.financials?.providerEarnings || 0).toLocaleString()}`,
      icon: Wallet,
      color: "blue"
    },
    {
      label: "Completion Rate",
      value: `${stats.financials?.totalBookings || 0} Jobs`,
      icon: CheckCircle,
      color: "amber"
    }
  ];

  return (
    <div className="space-y-12 pb-20">
      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {kpis.map((kpi, idx) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={idx}
            className="bg-white dark:bg-slate-900 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none relative overflow-hidden transition-colors"
          >
            <div className={`absolute top-0 right-0 w-24 h-24 bg-${kpi.color}-500/5 rounded-bl-full`} />
            <div className="relative z-10">
              <div className={`w-12 h-12 bg-${kpi.color}-50 dark:bg-${kpi.color}-900/20 text-${kpi.color}-600 dark:text-${kpi.color}-400 rounded-2xl flex items-center justify-center mb-6 transition-colors`}>
                <kpi.icon size={24} />
              </div>
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-1">{kpi.label}</p>
              <h4 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
                {kpi.value}
              </h4>
              {kpi.growth !== undefined && (
                <div className={`flex items-center gap-1 text-[10px] font-black tracking-widest ${kpi.growth >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {kpi.growth >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {Math.abs(kpi.growth)}% vs last month
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Commission Management */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none h-full relative overflow-hidden transition-colors">
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-indigo-500/5 rounded-tl-full -mr-10 -mb-10 blur-2xl" />
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl transition-colors">
                  <Settings size={20} />
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Fee Structure</h3>
              </div>

              <div className="flex-1 space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Platform Commission</label>
                  <div className="relative group">
                    <input 
                      type="number" 
                      value={commission}
                      onChange={(e) => setCommission(e.target.value)}
                      className="w-full h-16 md:h-20 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-700 rounded-2xl px-6 md:px-8 text-2xl md:text-3xl font-black text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-950 transition-all group-hover:bg-white dark:group-hover:bg-slate-900"
                    />
                    <div className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 font-black text-2xl">%</div>
                  </div>
                </div>

                <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800 transition-colors">
                   <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 leading-relaxed uppercase tracking-wider">
                     Adjusting this value will update the global default for all new service bookings on the platform.
                   </p>
                </div>
              </div>

              <Button 
                  onClick={handleUpdateCommission}
                  disabled={isUpdating}
                  className="w-full mt-10 h-16 rounded-2xl bg-slate-950 dark:bg-indigo-600 text-white font-black uppercase tracking-widest text-xs hover:bg-slate-900 dark:hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 shadow-xl dark:shadow-indigo-500/20"
              >
                {isUpdating ? <RefreshCw className="animate-spin" size={18} /> : <CheckCircle size={18} />}
                Apply Changes
              </Button>
            </div>
          </div>
        </div>

        {/* Financial Ledger */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none h-full transition-colors flex flex-col">
            <div className="p-6 md:p-10 border-b border-slate-50 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors">
              <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Settlement Report</h3>
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 mt-1 uppercase tracking-widest">Recent Financial Flows</p>
              </div>

              <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl transition-colors">
                {[
                  { id: "all", label: "All Hubs" },
                  { id: "completed", label: "Settled" },
                  { id: "pending", label: "In Transit" }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setFilter(tab.id)}
                    className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                        filter === tab.id 
                            ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm" 
                            : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-x-auto min-h-[400px]">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50/30 dark:bg-slate-800/20 transition-colors">
                    <th className="px-10 py-5 text-left text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">Professional</th>
                    <th className="px-10 py-5 text-left text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">Gross (₹)</th>
                    <th className="px-10 py-5 text-left text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">Revenue (₹)</th>
                    <th className="px-10 py-5 text-left text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800 transition-colors">
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((tx) => (
                      <tr key={tx._id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="px-10 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 font-black border border-slate-100 dark:border-slate-700 transition-colors">
                              {tx.provider?.name?.[0].toUpperCase()}
                            </div>
                            <div>
                              <div className="text-sm font-black text-slate-900 dark:text-white leading-tight">
                                {tx.provider?.name || "Verified Pro"}
                              </div>
                              <div className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">
                                {new Date(tx.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-10 py-6">
                          <div className="text-sm font-black text-slate-900 dark:text-white tracking-tight">
                            ₹{tx.totalAmount.toLocaleString()}
                          </div>
                        </td>
                        <td className="px-10 py-6">
                          <div className="text-sm font-black text-indigo-600 dark:text-indigo-400 tracking-tight">
                            ₹{tx.platformCommission.toLocaleString()}
                          </div>
                          <div className="text-[8px] font-black text-indigo-400/60 uppercase tracking-tighter">
                            {tx.commissionPercentage}% platform fee
                          </div>
                        </td>
                        <td className="px-10 py-6">
                          <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${
                            tx.status === "completed" 
                              ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400" 
                              : "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400" 
                          }`}>
                             {tx.status === "completed" ? <CheckCircle size={10} /> : <Clock size={10} />}
                             {tx.status}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-8 py-20 text-center">
                        <div className="flex flex-col items-center gap-4">
                           <Activity size={40} className="text-slate-200 dark:text-slate-800" />
                           <p className="text-[10px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-[0.3em]">No activity detected.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="p-6 bg-slate-50/50 dark:bg-slate-800/20 border-t border-slate-50 dark:border-slate-800 text-center rounded-b-[2.5rem] transition-colors">
               <button className="text-[10px] font-black text-slate-400 hover:text-indigo-600 uppercase tracking-[0.2em] transition-colors">Download Detailed Audit Log (CSV)</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminFinancialTab;
