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
  Camera,
  ShieldCheck,
  Plus,
  FileText
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "@/utils/api";
import { useSocket } from "../../store/context/SocketContext";
import BookingInvoice from "../../components/booking/BookingInvoice";

const Bookings = () => {
  const navigate = useNavigate();
  const socket = useSocket();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [updatingId, setUpdatingId] = useState(null);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [targetBooking, setTargetBooking] = useState(null);
  const [isPhotoMode, setIsPhotoMode] = useState(false);
  const [showChargesModal, setShowChargesModal] = useState(false);
  const [chargeItem, setChargeItem] = useState("");
  const [chargePrice, setChargePrice] = useState("");
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("newNotification", (notification) => {
      // Refresh for new bookings or status changes
      if (notification.type?.includes("booking")) {
        fetchBookings();
      }
    });

    return () => {
      socket.off("newNotification");
    };
  }, [socket]);

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

  const handleStatusUpdate = async (id, newStatus, additionalData = {}) => {
    setUpdatingId(id);
    try {
      await api.put(`/bookings/${id}/status`, { status: newStatus, ...additionalData });
      setBookings(
        bookings.map((b) => (b._id === id ? { ...b, status: newStatus, ...additionalData } : b)),
      );
      if (newStatus === "completed") {
        setShowOtpModal(false);
        setOtpValue("");
      }
    } catch (err) {
      console.error("Status update failed", err);
      alert(err.response?.data?.message || "Failed to update status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const initiateCompletion = (booking) => {
    setTargetBooking(booking);
    setShowOtpModal(true);
  };

  const handleAddCharge = async () => {
    if (!chargeItem || !chargePrice) return;
    setUpdatingId(targetBooking._id);
    try {
      const { data } = await api.post(`/bookings/${targetBooking._id}/additional-charge`, {
        item: chargeItem,
        price: parseFloat(chargePrice),
      });
      setBookings(
        bookings.map((b) => (b._id === targetBooking._id ? data : b)),
      );
      setShowChargesModal(false);
      setChargeItem("");
      setChargePrice("");
    } catch (err) {
      console.error("Failed to add charge", err);
      alert(err.response?.data?.message || "Failed to add charge.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleChat = (booking) => {
    navigate("/provider/messages", { 
      state: { 
        recipientId: booking.user?._id, 
        recipientName: booking.user?.name 
      } 
    });
  };

  const filteredBookings = bookings.filter((b) =>
    filterStatus === "all" ? true : b.status === filterStatus,
  );

  const statusConfig = {
    pending: {
      label: "Requested",
      bg: "bg-amber-100 dark:bg-amber-900/20",
      text: "text-amber-700 dark:text-amber-400",
      icon: Clock,
    },
    accepted: {
      label: "Confirmed",
      bg: "bg-indigo-100 dark:bg-indigo-900/20",
      text: "text-indigo-700 dark:text-indigo-400",
      icon: Calendar,
    },
    "on-the-way": {
      label: "On the Way",
      bg: "bg-indigo-100 dark:bg-indigo-900/20",
      text: "text-indigo-700 dark:text-indigo-400",
      icon: MapPin,
    },
    started: {
      label: "Job Started",
      bg: "bg-blue-100 dark:bg-blue-900/20",
      text: "text-blue-700 dark:text-blue-400",
      icon: PlayCircle,
    },
    completed: {
      label: "Completed",
      bg: "bg-emerald-100 dark:bg-emerald-900/20",
      text: "text-emerald-700 dark:text-emerald-400",
      icon: CheckCircle2,
    },
    cancelled: {
      label: "Cancelled",
      bg: "bg-rose-100 dark:bg-rose-900/20",
      text: "text-rose-700 dark:text-rose-400",
      icon: XCircle,
    },
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight transition-colors">
            Job <span className="text-indigo-600 dark:text-indigo-400 font-black">Bookings</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold mt-2 transition-colors">
            You have {bookings.filter((b) => b.status === "pending").length} new
            requests waiting for your approval.
          </p>
        </div>
        <div className="flex bg-white dark:bg-slate-900 p-1.5 rounded-[1.5rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto custom-scrollbar no-scrollbar transition-colors">
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
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg"
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200"
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
        <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 p-20 text-center shadow-sm transition-colors">
          <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 transition-colors border border-slate-100 dark:border-slate-700">
            <Calendar size={40} className="text-slate-200 dark:text-slate-600" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2 transition-colors">
            No Bookings Found
          </h3>
          <p className="text-slate-500 dark:text-slate-400 font-bold max-w-sm mx-auto transition-colors">
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
                className="bg-white dark:bg-slate-900 rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none p-6 md:p-10 flex flex-col xl:flex-row gap-8 md:gap-10 hover:shadow-2xl dark:hover:shadow-none transition-all duration-500 group relative overflow-hidden"
              >
                <div
                  className={`absolute left-0 top-0 bottom-0 w-2 ${Config.bg.replace("bg-", "bg-opacity-80 bg-")}`}
                />

                {/* Left Side: Service & Status */}
                <div className="xl:flex-[1.5] space-y-8">
                  <div className="flex items-start justify-between">
                    <div>
                      <div
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${Config.bg} ${Config.text} mb-4`}
                      >
                        <StatusIcon size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">
                          {Config.label}
                        </span>
                      </div>
                      <h4 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {booking.service?.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-2 text-slate-400 dark:text-slate-500 font-bold text-xs uppercase tracking-widest transition-colors">
                        <IndianRupee size={12} strokeWidth={3} />
                        Earnings:{" "}
                        <span className="text-slate-900 dark:text-slate-200">
                          ₹{booking.providerEarnings?.toFixed(0)}
                        </span>
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 mx-2" />
                        ID:{" "}
                        <span className="text-slate-900 dark:text-slate-200">
                          {booking._id.slice(-8).toUpperCase()}
                        </span>
                      </div>
                      
                      {/* Additional Charges Display */}
                      {booking.additionalCharges?.length > 0 && (
                        <div className="mt-6 p-4 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-2xl border border-indigo-100 dark:border-indigo-800/50">
                          <p className="text-[8px] font-black text-indigo-400 dark:text-indigo-500 uppercase tracking-widest mb-3 text-center">Extra Materials / Parts</p>
                          <div className="space-y-3">
                            {booking.additionalCharges.map((charge, cIdx) => (
                              <div key={cIdx} className="flex items-center justify-between">
                                <div className="flex flex-col">
                                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{charge.item}</span>
                                  <span className={`text-[8px] font-black uppercase tracking-tighter ${
                                    charge.approvalStatus === 'approved' ? 'text-emerald-500' : 
                                    charge.approvalStatus === 'rejected' ? 'text-rose-500' : 'text-amber-500'
                                  }`}>
                                    {charge.approvalStatus || 'pending'}
                                  </span>
                                </div>
                                <span className="text-xs font-black text-slate-900 dark:text-white">₹{charge.price}</span>
                              </div>
                            ))}
                            <div className="pt-2 border-t border-indigo-100 dark:border-indigo-800/50 flex items-center justify-between">
                              <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Extra Total (Approved)</span>
                              <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">
                                ₹{booking.additionalCharges
                                  .filter(c => c.approvalStatus === "approved")
                                  .reduce((sum, c) => sum + c.price, 0)}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 dark:text-slate-500 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/40 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-all">
                          <Calendar size={18} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5 transition-colors">
                            Job Date
                          </p>
                          <p className="text-sm font-black text-slate-800 dark:text-slate-200 transition-colors">
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
                        <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 dark:text-slate-500 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/40 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-all">
                          <Clock size={18} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5 transition-colors">
                            Start Time
                          </p>
                          <p className="text-sm font-black text-slate-800 dark:text-slate-200 transition-colors">
                            {booking.timeSlot}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 dark:text-slate-500 mt-1 shrink-0 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/40 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-all">
                          <MapPin size={18} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5 transition-colors">
                            Location
                          </p>
                          <p className="text-sm font-black text-slate-800 dark:text-slate-200 leading-relaxed transition-colors">
                            {booking.address.city}, {booking.address.state}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side: Customer & Actions */}
                <div className="xl:flex-1 flex flex-col gap-6 xl:border-l xl:border-slate-50 dark:xl:border-slate-800 xl:pl-10 transition-colors">
                  <div className="p-6 bg-slate-50/50 dark:bg-slate-800/30 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-4 relative group/card transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-black border border-slate-100 dark:border-slate-700 shadow-sm text-lg transition-colors">
                        {booking.user?.name?.[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mb-1 transition-colors">
                          Customer
                        </p>
                        <h5 className="font-black text-slate-900 dark:text-white transition-colors">
                          {booking.user?.name}
                        </h5>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 transition-colors">
                      <a
                        href={`tel:${booking.contactNumber}`}
                        className="flex-1 py-3 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-900 dark:hover:bg-slate-700 hover:text-white transition-all shadow-sm group/btn"
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
                        onClick={() => handleChat(booking)}
                        className="flex-1 py-3 bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center gap-2 hover:bg-indigo-600 dark:hover:bg-indigo-500 hover:text-white transition-all shadow-sm group/btn"
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
                          <div className="flex flex-col gap-3">
                            <button
                              onClick={() =>
                                handleStatusUpdate(booking._id, "on-the-way", { 
                                  arrivalPhoto: { url: "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=400&auto=format&fit=crop&q=60" } 
                                })
                              }
                              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-slate-900 transition-all active:scale-95 flex items-center justify-center gap-3"
                            >
                              <Camera size={14} />
                              Upload Arrival Photo & Go
                            </button>
                          </div>
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
                          <div className="flex flex-col gap-3">
                            <button
                              onClick={() => {
                                setTargetBooking(booking);
                                setShowChargesModal(true);
                              }}
                              className="w-full py-4 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-3"
                            >
                              <Plus size={14} />
                              Add Parts/Materials
                            </button>
                            <button
                              onClick={() => initiateCompletion(booking)}
                              className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-100 hover:bg-slate-900 transition-all active:scale-95"
                            >
                              End Job & Verify OTP
                            </button>
                          </div>
                        )}
                        {(booking.status === "completed" ||
                          booking.status === "cancelled") && (
                          <div className="flex flex-col gap-3">
                            {booking.status === "completed" && (
                              <button
                                onClick={() => {
                                  setTargetBooking(booking);
                                  setIsInvoiceOpen(true);
                                }}
                                className="w-full py-4 bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all flex items-center justify-center gap-3 shadow-sm"
                              >
                                <FileText size={14} />
                                View Digital Receipt
                              </button>
                            )}
                            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center gap-3 text-slate-400 dark:text-slate-500 border border-transparent dark:border-slate-700 transition-colors">
                              <AlertCircle size={16} />
                              <p className="text-[10px] font-black uppercase tracking-widest">
                                No further actions for {booking.status} jobs
                              </p>
                            </div>
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
      {/* OTP Verification Modal */}
      <AnimatePresence>
        {showOtpModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowOtpModal(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[3rem] p-10 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-bl-full -mr-8 -mt-8" />
              
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/30 rounded-[2rem] flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck size={40} />
                </div>
                
                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Complete Service</h3>
                  <p className="text-slate-500 dark:text-slate-400 font-bold mt-2">
                    Enter the 4-digit OTP provided by the customer to verify job completion.
                  </p>
                </div>

                <div className="w-full">
                  <input
                    type="text"
                    maxLength={4}
                    value={otpValue}
                    onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ""))}
                    placeholder="0 0 0 0"
                    className="w-full text-center text-4xl font-black tracking-[0.5em] py-6 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-3xl focus:border-indigo-600 focus:ring-0 transition-all text-slate-900 dark:text-white placeholder:text-slate-200"
                  />
                  {otpValue.length > 0 && otpValue.length < 4 && (
                    <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mt-3">Enter all 4 digits</p>
                  )}
                </div>

                <div className="flex flex-col w-full gap-3">
                  <button
                    disabled={otpValue.length !== 4 || updatingId}
                    onClick={() => handleStatusUpdate(targetBooking._id, "completed", { otp: otpValue })}
                    className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                  >
                    {updatingId ? "Verifying..." : "Verify & Complete"}
                  </button>
                  <button
                    onClick={() => setShowOtpModal(false)}
                    className="w-full py-4 text-slate-400 dark:text-slate-500 font-black text-[10px] uppercase tracking-widest hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Additional Charges Modal */}
      <AnimatePresence>
        {showChargesModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowChargesModal(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[3rem] p-10 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-bl-full -mr-8 -mt-8" />
              
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/30 rounded-[2rem] flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <Plus size={40} />
                </div>
                
                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Add Parts/Materials</h3>
                  <p className="text-slate-500 dark:text-slate-400 font-bold mt-2">
                    Add extra costs for materials or spare parts used during the job.
                  </p>
                </div>

                <div className="w-full space-y-4">
                  <div className="text-left">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block">Item Name</label>
                    <input
                      type="text"
                      value={chargeItem}
                      onChange={(e) => setChargeItem(e.target.value)}
                      placeholder="e.g. AC Capacitor"
                      className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl focus:border-indigo-600 focus:ring-0 transition-all text-slate-900 dark:text-white font-bold"
                    />
                  </div>
                  <div className="text-left">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block">Price (₹)</label>
                    <input
                      type="number"
                      value={chargePrice}
                      onChange={(e) => setChargePrice(e.target.value)}
                      placeholder="0.00"
                      className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl focus:border-indigo-600 focus:ring-0 transition-all text-slate-900 dark:text-white font-bold"
                    />
                  </div>
                </div>

                <div className="flex flex-col w-full gap-3">
                  <button
                    disabled={!chargeItem || !chargePrice || updatingId}
                    onClick={handleAddCharge}
                    className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-500/20 hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                  >
                    {updatingId ? "Adding..." : "Add to Booking"}
                  </button>
                  <button
                    onClick={() => setShowChargesModal(false)}
                    className="w-full py-4 text-slate-400 dark:text-slate-500 font-black text-[10px] uppercase tracking-widest hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* Booking Invoice Modal */}
      <BookingInvoice 
        isOpen={isInvoiceOpen}
        onClose={() => {
          setIsInvoiceOpen(false);
          setTargetBooking(null);
        }}
        booking={targetBooking}
      />
    </div>
  );
};

export default Bookings;
