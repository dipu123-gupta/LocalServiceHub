import React, { useState, useEffect } from "react";
import api from "@/utils/api";
import { 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  ChevronRight,
  Send,
  User,
  Filter
} from "lucide-react";
import toast from "react-hot-toast";
import Pagination from "../common/Pagination";
import Badge from "../common/Badge";

const AdminSupportTab = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [resolution, setResolution] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const qs = statusFilter !== "all" ? `?status=${statusFilter}&page=${page}` : `?page=${page}`;
      const { data } = await api.get(`/support/admin${qs}`);
      setTickets(data.tickets);
      setTotalPages(data.pages);
    } catch (err) {
      toast.error("Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [page, statusFilter]);

  const handleResolve = async (e) => {
    e.preventDefault();
    if (!resolution) return toast.error("Please provide a resolution message");
    
    setSubmitting(true);
    try {
      await api.put(`/support/${selectedTicket._id}`, { status: "resolved", resolution });
      toast.success("Ticket resolved successfully!");
      setSelectedTicket(null);
      setResolution("");
      fetchTickets();
    } catch (err) {
      toast.error("Failed to resolve ticket");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "open": return "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400";
      case "in-progress": return "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400";
      case "resolved": return "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400";
      default: return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400";
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-1">Ticket Management</h2>
          <p className="text-sm font-medium text-slate-400">Resolve user disputes and platform queries.</p>
        </div>
        <div className="flex items-center gap-3">
          <Filter size={16} className="text-slate-400" />
          <select 
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-2 text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="all">All statuses</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Ticket List */}
        <div className="lg:col-span-2 space-y-6">
          {loading ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-20 flex flex-col items-center justify-center border border-slate-100 dark:border-slate-800">
               <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Fetching tickets...</p>
            </div>
          ) : tickets.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-20 text-center border border-slate-100 dark:border-slate-800 transition-colors">
               <MessageSquare className="w-12 h-12 text-slate-200 mx-auto mb-4" />
               <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">Clean Slates!</h3>
               <p className="text-sm text-slate-400">No tickets found for the selected filter.</p>
            </div>
          ) : (
            <>
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
                <div className="divide-y divide-slate-50 dark:divide-slate-800">
                  {tickets.map((ticket) => (
                    <div 
                      key={ticket._id} 
                      onClick={() => setSelectedTicket(ticket)}
                      className={`p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-all border-l-4 ${selectedTicket?._id === ticket._id ? "border-indigo-600 bg-indigo-50/20" : "border-transparent"}`}
                    >
                      <div className="flex items-start justify-between gap-4 mb-3">
                         <div className="flex items-center gap-3">
                            <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider ${getStatusColor(ticket.status)}`}>
                              {ticket.status}
                            </span>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">#{ticket._id.slice(-6).toUpperCase()}</span>
                         </div>
                         <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                           <Clock size={10} />
                           {new Date(ticket.createdAt).toLocaleDateString()}
                         </div>
                      </div>
                      <h4 className="text-base font-black text-slate-900 dark:text-white mb-2">{ticket.subject}</h4>
                      <div className="flex items-center gap-4">
                         <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
                           <User size={12} className="text-indigo-400" />
                           {ticket.user?.name || "Unknown User"}
                         </div>
                         <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
                           <Badge variant="ghost" className="text-[8px]">{ticket.category}</Badge>
                         </div>
                         <div className={`ml-auto text-[9px] font-black uppercase tracking-widest ${ticket.priority === 'urgent' ? 'text-rose-500' : 'text-slate-400'}`}>
                           {ticket.priority} PR
                         </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
            </>
          )}
        </div>

        {/* Selected Ticket Detail */}
        <div className="space-y-6">
          {selectedTicket ? (
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl p-8 sticky top-8 transition-colors">
               <div className="flex items-center justify-between mb-8">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">Ticket Details</h3>
                  <button onClick={() => setSelectedTicket(null)} className="text-slate-400 hover:text-slate-900 transition-colors"><X size={20} /></button>
               </div>

               <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">User Message</label>
                    <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                      {selectedTicket.message}
                    </div>
                  </div>

                  {selectedTicket.status === 'resolved' ? (
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-2 block">Resolution Message</label>
                      <div className="p-4 bg-emerald-50/50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/30 rounded-2xl text-sm font-bold text-emerald-800 dark:text-emerald-300">
                        {selectedTicket.resolution}
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleResolve} className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-2 block">Reply & Resolve</label>
                      <textarea
                        required
                        rows={4}
                        value={resolution}
                        onChange={(e) => setResolution(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-indigo-500 transition-all"
                        placeholder="Type resolution message here..."
                      />
                      <button 
                        disabled={submitting}
                        className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 rounded-2xl transition-all shadow-lg shadow-indigo-100 dark:shadow-none"
                      >
                        {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><CheckCircle2 className="w-4 h-4" /> Finalize Ticket</>}
                      </button>
                    </form>
                  )}
               </div>
            </div>
          ) : (
            <div className="h-full bg-slate-50/50 dark:bg-slate-900/50 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2.5rem] flex flex-col items-center justify-center p-12 text-center transition-colors">
               <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-sm mb-6">
                 <ChevronRight className="text-slate-300 rotate-90" />
               </div>
               <h4 className="text-base font-black text-slate-900 dark:text-white mb-2">Action Required</h4>
               <p className="text-xs font-bold text-slate-400">Select a ticket from the list to view details and provide resolution.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const X = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

export default AdminSupportTab;
