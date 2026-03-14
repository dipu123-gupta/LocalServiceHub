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
  PieChart
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

  return (
    <div className="space-y-10">
      {/* Commission Controls */}
      <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full -mr-32 -mt-32 blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <Settings size={20} />
            </div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Global Commission Settings</h3>
          </div>

          <div className="flex flex-col md:flex-row items-end gap-6 max-w-2xl">
            <div className="flex-1 space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Platform Commission (%)</label>
              <div className="relative group">
                <input 
                  type="number" 
                  value={commission}
                  onChange={(e) => setCommission(e.target.value)}
                  className="w-full h-16 bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 text-xl font-black text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all group-hover:bg-white"
                  placeholder="15"
                />
                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 font-black text-xl">%</div>
              </div>
            </div>
            <Button 
                onClick={handleUpdateCommission}
                disabled={isUpdating}
                className="h-16 px-10 rounded-2xl bg-slate-950 text-white font-black uppercase tracking-widest text-xs hover:bg-slate-900 transition-all flex items-center gap-3"
            >
              {isUpdating ? <RefreshCw className="animate-spin" size={18} /> : <CheckCircle size={18} />}
              Update Reality
            </Button>
          </div>
          <p className="text-[10px] font-bold text-slate-400 mt-4 max-w-md italic uppercase tracking-widest">
            * This setting will affect all new bookings. Individual provider subscription overrides will still take precedence.
          </p>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40">
        <div className="p-10 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Financial Transaction Log</h3>
            <p className="text-sm font-bold text-slate-400 mt-1">Real-time ledger of all platform volume and commissions.</p>
          </div>

          <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-2xl">
            {[
                { id: "all", label: "All" },
                { id: "completed", label: "Settled" },
                { id: "pending", label: "Pending" }
            ].map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setFilter(tab.id)}
                    className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        filter === tab.id 
                            ? "bg-white text-indigo-600 shadow-sm" 
                            : "text-slate-500 hover:text-slate-700"
                    }`}
                >
                    {tab.label}
                </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto overflow-hidden rounded-b-[2.5rem]">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Entity & Date</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Volume (₹)</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Comm. (₹)</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Payout (₹)</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Method</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((tx) => (
                  <tr key={tx._id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                          <CreditCard size={18} />
                        </div>
                        <div>
                          <div className="text-sm font-black text-slate-900 leading-tight">
                            {tx.provider?.name || "Professional"}
                          </div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                            {new Date(tx.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-sm font-black text-slate-900 tracking-tight">
                        ₹{tx.totalAmount.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-sm font-black text-indigo-600 tracking-tight">
                        ₹{tx.platformCommission.toLocaleString()}
                      </div>
                      <div className="text-[9px] font-black text-indigo-400 uppercase tracking-tighter">
                        {tx.commissionPercentage}% cut
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-sm font-black text-emerald-600 tracking-tight">
                        ₹{tx.providerEarning.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        tx.status === "completed" 
                          ? "bg-emerald-50 text-emerald-600" 
                          : tx.status === "pending" 
                            ? "bg-amber-50 text-amber-600" 
                            : "bg-rose-50 text-rose-600"
                      }`}>
                         {tx.status === "completed" ? <CheckCircle size={10} /> : <Clock size={10} />}
                         {tx.status}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest opacity-60">
                        {tx.paymentMethod}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-8 py-12 text-center text-slate-400 font-bold uppercase tracking-[0.2em]">No transactions recorded.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminFinancialTab;
