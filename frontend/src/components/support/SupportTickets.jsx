import React, { useState, useEffect } from "react";
import { supportService } from "../../services/supportService";
import { 
  Plus, 
  MessageSquare, 
  History, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  ChevronRight,
  Send
} from "lucide-react";
import toast from "react-hot-toast";
import Pagination from "../common/Pagination";

const SupportTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // New Ticket Form
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
    category: "other",
    priority: "low"
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const data = await supportService.getMyTickets({ page, limit: 5 });
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
  }, [page]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await supportService.createTicket(formData);
      toast.success("Ticket created successfully!");
      setShowCreate(false);
      setFormData({ subject: "", message: "", category: "other", priority: "low" });
      setPage(1);
      fetchTickets();
    } catch (err) {
      toast.error("Failed to create ticket");
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
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-1">Support Center</h2>
          <p className="text-sm font-medium text-slate-400">Need help? We're here for you 24/7.</p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-indigo-200 dark:shadow-none"
        >
          {showCreate ? "Close Form" : <><Plus className="w-4 h-4" /> New Ticket</>}
        </button>
      </div>

      {showCreate && (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 p-8 rounded-3xl border-2 border-indigo-500/20 shadow-2xl space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Subject</label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                className="w-full h-14 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl px-4 text-sm font-bold text-slate-900 dark:text-white"
                placeholder="Brief summary of the issue"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Category</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full h-14 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl px-4 text-sm font-bold text-slate-900 dark:text-white outline-none"
                >
                  <option value="billing">Billing</option>
                  <option value="service_quality">Service Quality</option>
                  <option value="technical">Technical</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Priority</label>
                <select 
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value})}
                  className="w-full h-14 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl px-4 text-sm font-bold text-slate-900 dark:text-white outline-none"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Message</label>
            <textarea
              required
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 text-sm font-bold text-slate-900 dark:text-white"
              placeholder="Describe your issue in detail..."
            />
          </div>
          <button 
            disabled={submitting}
            className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 rounded-2xl transition-all"
          >
            {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-4 h-4" /> Submit Ticket</>}
          </button>
        </form>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden">
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
          <History className="w-5 h-5 text-indigo-600" />
          <h3 className="font-black text-slate-900 dark:text-white">Ticket History</h3>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Loading your tickets...</p>
          </div>
        ) : tickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-950 rounded-full flex items-center justify-center mb-6">
              <MessageSquare className="w-10 h-10 text-slate-300" />
            </div>
            <h4 className="text-lg font-black text-slate-900 dark:text-white mb-2">No Tickets Found</h4>
            <p className="text-sm text-slate-500 max-w-xs">You haven't raised any support tickets yet. Click the button above to start.</p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-slate-50 dark:divide-slate-800">
              {tickets.map((ticket) => (
                <div key={ticket._id} className="p-8 hover:bg-slate-50 dark:hover:bg-slate-950/50 transition-colors group">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusColor(ticket.status)}`}>
                          {ticket.status}
                        </span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          #{ticket._id.toString().slice(-8).toUpperCase()}
                        </span>
                      </div>
                      <h4 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                        {ticket.subject}
                      </h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {ticket.message}
                      </p>
                      <div className="flex items-center gap-6 pt-2">
                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          <Clock className="w-3 h-3" />
                          {new Date(ticket.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          <AlertCircle className="w-3 h-3" />
                          {ticket.priority} Priority
                        </div>
                      </div>
                    </div>
                    <button className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl hover:bg-indigo-600 hover:text-white transition-all">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                  
                  {ticket.resolution && (
                    <div className="mt-6 p-6 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/30 rounded-2xl flex gap-4">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1">Resolution</p>
                        <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">{ticket.resolution}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <Pagination 
              currentPage={page} 
              totalPages={totalPages} 
              onPageChange={(p) => setPage(p)} 
            />
          </>
        )}
      </div>
    </div>
  );
};

export default SupportTickets;
