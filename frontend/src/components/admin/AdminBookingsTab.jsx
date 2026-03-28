import { Calendar, Clock, User, Briefcase, MapPin, IndianRupee, Tag, Info, Trash2, CheckCircle, XCircle } from "lucide-react";
import Badge from "../common/Badge";
import Button from "../common/Button";
import api from "@/utils/api";

const AdminBookingsTab = ({ bookings = [], fetchAllData }) => {
  const handleDeleteBooking = async (id) => {
    if (!window.confirm("Are you sure you want to delete this booking record? This action is permanent.")) return;
    try {
      await api.delete(`/bookings/${id}`);
      fetchAllData();
    } catch (err) {
      alert(err.extractedMessage || "Delete failed");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "warning";
      case "confirmed": return "info";
      case "completed": return "success";
      case "cancelled": return "danger";
      default: return "gray";
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight transition-colors">System Bookings</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1 transition-colors">
            Global oversight of all platform transactions and service requests.
          </p>
        </div>
        <div className="flex items-center gap-3">
            <Badge variant="info" className="px-4 py-2 rounded-xl text-xs font-black uppercase dark:bg-indigo-900/30 dark:text-indigo-400">
                Total: {bookings.length}
            </Badge>
            <Badge variant="success" className="px-4 py-2 rounded-xl text-xs font-black uppercase dark:bg-emerald-900/30 dark:text-emerald-400">
                Active: {bookings.filter(b => b.status !== 'cancelled').length}
            </Badge>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/50 transition-colors">
                <th className="px-8 py-6 text-[0.65rem] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">Booking Info</th>
                <th className="px-8 py-6 text-[0.65rem] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">Customer</th>
                <th className="px-8 py-6 text-[0.65rem] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">Provider</th>
                <th className="px-8 py-6 text-[0.65rem] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">Amount</th>
                <th className="px-8 py-6 text-[0.65rem] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">Status</th>
                <th className="px-8 py-6 text-[0.65rem] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800 transition-colors">
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-8 py-20 text-center text-slate-400 dark:text-slate-500 font-medium transition-colors">
                    No bookings found in the system.
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                    <td className="px-4 md:px-8 py-4 md:py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50 shadow-sm transition-colors">
                          <Briefcase size={20} />
                        </div>
                        <div>
                          <p className="font-black text-slate-900 dark:text-white text-sm tracking-tight">{booking.service?.title || "Unknown Service"}</p>
                          <div className="flex items-center gap-3 mt-1 text-[0.65rem] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                            <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(booking.bookingDate).toLocaleDateString()}</span>
                            <span className="flex items-center gap-1"><Clock size={12} /> {booking.timeSlot}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 md:px-8 py-4 md:py-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{booking.user?.name || "Deleted User"}</span>
                        <span className="text-[0.65rem] font-medium text-slate-400 dark:text-slate-500">{booking.user?.email}</span>
                      </div>
                    </td>
                    <td className="px-4 md:px-8 py-4 md:py-6">
                        <div className="flex items-center gap-2">
                            <User size={14} className="text-slate-300 dark:text-slate-600" />
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{booking.provider?.businessName || "Unknown Provider"}</span>
                        </div>
                    </td>
                    <td className="px-4 md:px-8 py-4 md:py-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-900 dark:text-white transition-colors">₹{booking.totalAmount}</span>
                        <span className="text-[0.6rem] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">{booking.paymentMethod}</span>
                      </div>
                    </td>
                    <td className="px-4 md:px-8 py-4 md:py-6">
                      <Badge variant={getStatusColor(booking.status)} className="px-3 py-1 rounded-lg text-[0.6rem] font-black uppercase tracking-widest dark:bg-slate-800 dark:text-slate-400">
                        {booking.status}
                      </Badge>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleDeleteBooking(booking._id)}
                          className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                          title="Delete Record"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminBookingsTab;
