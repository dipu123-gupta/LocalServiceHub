import React, { useState, useEffect } from "react";
import api from "@/utils/api";
import { 
  ShieldCheck, 
  Clock, 
  User, 
  Activity,
  Loader2,
  Calendar,
  AlertTriangle,
  Info
} from "lucide-react";
import toast from "react-hot-toast";
import Pagination from "../common/Pagination";

const AdminAuditLogsTab = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/users/audit-logs?page=${page}&limit=20`);
      setLogs(data.logs || []);
      setTotalPages(data.pages || 1);
    } catch (err) {
      toast.error("Failed to load audit logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page]);

  const getActionColor = (action) => {
    if (action.includes("BLOCK")) return "text-rose-500 bg-rose-50 dark:bg-rose-900/20";
    if (action.includes("UNBLOCK")) return "text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20";
    if (action.includes("RESOLVE")) return "text-blue-500 bg-blue-50 dark:bg-blue-900/20";
    return "text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20";
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-950 flex items-center justify-center text-indigo-400">
             <ShieldCheck size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-1">Audit Trail</h2>
            <p className="text-sm font-medium text-slate-400">System-wide log of all sensitive administrative actions.</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 transition-colors">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Timestamp</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Admin User</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Action</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Target Type</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Target ID</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800 transition-colors">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-20 text-center">
                    <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mx-auto mb-4" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Compiling logs...</p>
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-20 text-center">
                    <Activity className="w-10 h-10 text-slate-200 mx-auto mb-4" />
                    <p className="text-sm font-bold text-slate-400">No logs recorded yet.</p>
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-2 text-xs font-black text-slate-700 dark:text-slate-300">
                         <div className="p-1 bg-white dark:bg-slate-800 rounded shadow-sm">
                           <Clock size={12} className="text-indigo-400" />
                         </div>
                         {new Date(log.createdAt).toLocaleString()}
                       </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white text-[10px] font-black">
                          {log.admin?.name?.[0]?.toUpperCase() || "A"}
                        </div>
                        <div className="text-xs font-bold text-slate-700 dark:text-slate-300">{log.admin?.name || "System"}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${getActionColor(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{log.targetType}</span>
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-slate-500 font-mono">#{log.targetId?.toString().slice(-8)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-2 text-[10px] font-bold text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                        <Info size={10} />
                        {log.ipAddress || "::1"}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {!loading && totalPages > 1 && (
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      )}
    </div>
  );
};

export default AdminAuditLogsTab;
