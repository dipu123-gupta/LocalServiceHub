import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  CheckCircle2,
  XCircle,
  PlayCircle,
  Loader2,
  Search,
  Filter,
  ChevronRight,
  IndianRupee,
  MessageCircle,
  AlertCircle,
  MoreHorizontal,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const Bookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/bookings/provider");
      setBookings(data);
    } catch (err) {
      console.error("Failed to load bookings", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      await api.put(`/bookings/${id}/status`, { status: newStatus });
      setBookings(
        bookings.map((b) => (b._id === id ? { ...b, status: newStatus } : b)),
      );
    } catch (err) {
      console.error("Status update failed", err);
      alert("Failed to update status. Please check your connection.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleChat = (userId) => {
    navigate("/provider/messages", { state: { recipientId: userId } });
  };

  const filteredBookings = bookings.filter((b) =>
    filterStatus === "all" ? true : b.status === filterStatus,
  );

  const statusConfig = {
    pending: {
      label: "Requested",
      bg: "bg-amber-100",
      text: "text-amber-700",
      icon: Clock,
    },
    accepted: {
      label: "Confirmed",
      bg: "bg-indigo-100",
      text: "text-indigo-700",
      icon: Calendar,
    },
    "on-the-way": {
      label: "On the Way",
      bg: "bg-indigo-100",
      text: "text-indigo-700",
      icon: MapPin,
    },
    started: {
      label: "Job Started",
      bg: "bg-blue-100",
      text: "text-blue-700",
      icon: PlayCircle,
    },
    completed: {
      label: "Completed",
      bg: "bg-emerald-100",
      text: "text-emerald-700",
      icon: CheckCircle2,
    },
    cancelled: {
      label: "Cancelled",
      bg: "bg-rose-100",
      text: "text-rose-700",
      icon: XCircle,
    },
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Job <span className="text-indigo-600">Bookings</span>
          </h1>
          <p className="text-slate-500 font-bold mt-2">
            You have {bookings.filter((b) => b.status === "pending").length} new
            requests waiting for your approval.
          </p>
        </div>
        <div className="flex bg-white p-1.5 rounded-[1.5rem] border border-slate-200 shadow-sm overflow-x-auto custom-scrollbar no-scrollbar">
          {[
            "all",
            "pending",
            "accepted",
            "on-the-way",
            "started",
            "completed",
            "cancelled",
          ].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                filterStatus === status
                  ? "bg-slate-900 text-white shadow-lg"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Booking List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
          <Loader2 size={40} className="text-indigo-600 animate-spin" />
          <p className="text-sm font-black text-slate-400 uppercase tracking-widest">
            Syncing your schedule...
          </p>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="bg-white rounded-[3rem] border border-slate-100 p-20 text-center shadow-sm">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Calendar size={40} className="text-slate-200" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
            No Bookings Found
          </h3>
          <p className="text-slate-500 font-bold max-w-sm mx-auto">
            Try adjusting your filters or check back later for new requests.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredBookings.map((booking, idx) => {
            const Config = statusConfig[booking.status] || statusConfig.pending;
            const StatusIcon = Config.icon;

            return (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={booking._id}
                className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 p-10 flex flex-col xl:flex-row gap-10 hover:shadow-2xl hover:shadow-indigo-100/50 transition-all duration-500 group relative overflow-hidden"
              >
                <div
                  className={`absolute left-0 top-0 bottom-0 w-2 ${Config.bg.replace("bg-", "bg-opacity-80 bg-")}`}
                />

                {/* Left Side: Service & Status */}
                <div className="xl:flex-[1.5] space-y-8">
                  <div className="flex items-start justify-between">
                    <div>
                      <div
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl ${Config.bg} ${Config.text} mb-4`}
                      >
                        <StatusIcon size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">
                          {Config.label}
                        </span>
                      </div>
                      <h4 className="text-2xl font-black text-slate-900 tracking-tight leading-tight group-hover:text-indigo-600 transition-colors">
                        {booking.service?.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-2 text-slate-400 font-bold text-xs uppercase tracking-widest">
                        <IndianRupee size={12} strokeWidth={3} />
                        Earnings:{" "}
                        <span className="text-slate-900">
                          ₹{booking.providerEarnings?.toFixed(0)}
                        </span>
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-200 mx-2" />
                        ID:{" "}
                        <span className="text-slate-900">
                          {booking._id.slice(-8).toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                          <Calendar size={18} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
                            Job Date
                          </p>
                          <p className="text-sm font-black text-slate-800">
                            {new Date(booking.bookingDate).toLocaleDateString(
                              [],
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                          <Clock size={18} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
                            Start Time
                          </p>
                          <p className="text-sm font-black text-slate-800">
                            {booking.timeSlot}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 mt-1 shrink-0 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                          <MapPin size={18} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
                            Location
                          </p>
                          <p className="text-sm font-black text-slate-800 leading-relaxed">
                            {booking.address.city}, {booking.address.state}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side: Customer & Actions */}
                <div className="xl:flex-1 flex flex-col gap-6 xl:border-l xl:border-slate-50 xl:pl-10">
                  <div className="p-6 bg-slate-50/50 rounded-3xl border border-slate-100 space-y-4 relative group/card">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 font-black border border-slate-100 shadow-sm text-lg">
                        {booking.user?.name?.[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                          Customer
                        </p>
                        <h5 className="font-black text-slate-900">
                          {booking.user?.name}
                        </h5>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                      <a
                        href={`tel:${booking.contactNumber}`}
                        className="flex-1 py-3 bg-white text-slate-600 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-900 hover:text-white transition-all shadow-sm group/btn"
                      >
                        <Phone
                          size={14}
                          className="group-hover/btn:rotate-12 transition-transform"
                        />
                        <span className="text-[10px] font-black uppercase tracking-widest">
                          Call
                        </span>
                      </a>
                      <button
                        onClick={() => handleChat(booking.user?._id)}
                        className="flex-1 py-3 bg-white text-indigo-600 rounded-xl flex items-center justify-center gap-2 hover:bg-indigo-600 hover:text-white transition-all shadow-sm group/btn"
                      >
                        <MessageCircle
                          size={14}
                          className="group-hover/btn:scale-110 transition-transform"
                        />
                        <span className="text-[10px] font-black uppercase tracking-widest">
                          Chat
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col justify-end gap-3">
                    {updatingId === booking._id ? (
                      <div className="flex items-center justify-center py-4 text-indigo-600 gap-3">
                        <Loader2 size={18} className="animate-spin" />
                        <span className="text-[10px] font-black uppercase tracking-widest">
                          Processing...
                        </span>
                      </div>
                    ) : (
                      <>
                        {booking.status === "pending" && (
                          <>
                            <button
                              onClick={() =>
                                handleStatusUpdate(booking._id, "accepted")
                              }
                              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-slate-900 transition-all active:scale-95"
                            >
                              Accept Request
                            </button>
                            <button
                              onClick={() =>
                                handleStatusUpdate(booking._id, "cancelled")
                              }
                              className="w-full py-4 bg-rose-50 text-rose-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all active:scale-95"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {booking.status === "accepted" && (
                          <button
                            onClick={() =>
                              handleStatusUpdate(booking._id, "on-the-way")
                            }
                            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-slate-900 transition-all active:scale-95"
                          >
                            I'm on my way
                          </button>
                        )}
                        {booking.status === "on-the-way" && (
                          <button
                            onClick={() =>
                              handleStatusUpdate(booking._id, "started")
                            }
                            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-slate-900 transition-all active:scale-95"
                          >
                            Start Service
                          </button>
                        )}
                        {booking.status === "started" && (
                          <button
                            onClick={() =>
                              handleStatusUpdate(booking._id, "completed")
                            }
                            className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-100 hover:bg-slate-900 transition-all active:scale-95"
                          >
                            Mark as Completed
                          </button>
                        )}
                        {(booking.status === "completed" ||
                          booking.status === "cancelled") && (
                          <div className="p-4 bg-slate-50 rounded-2xl flex items-center gap-3 text-slate-400">
                            <AlertCircle size={16} />
                            <p className="text-[10px] font-black uppercase tracking-widest">
                              No actions available for {booking.status} jobs
                            </p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Bookings;
