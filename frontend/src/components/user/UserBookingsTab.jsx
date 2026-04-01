import { BookOpen, Loader2, Clock, MapPin, Star, ShieldCheck, AlertCircle, MessageCircle, Phone, FileText } from "lucide-react";
import { useState } from "react";
import Badge from "../common/Badge";
import Button from "../common/Button";
import ReviewModal from "./ReviewModal";
import ApproveChargesModal from "../booking/ApproveChargesModal";
import BookingInvoice from "../booking/BookingInvoice";

const UserBookingsTab = ({ bookings = [], bookingsLoading, navigate, onCancel, refreshBookings }) => {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  const handleReviewSuccess = () => {
    alert("Review posted! Thank you for your feedback.");
  };

  const handleChat = (provider) => {
    if (!provider?.user?._id) {
      alert("Chat is not available for this booking yet.");
      return;
    }
    navigate("/chat", { 
      state: { 
        recipientId: provider.user._id,
        recipientName: provider.user.name 
      } 
    });
  };

  const handleCall = (phoneNumber) => {
    if (!phoneNumber) {
      alert("Phone number not available.");
      return;
    }
    window.location.href = `tel:${phoneNumber}`;
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-300">
      <ReviewModal 
        isOpen={isReviewOpen}
        onClose={() => {
          setIsReviewOpen(false);
          setSelectedBooking(null);
        }}
        booking={selectedBooking}
        onSuccess={handleReviewSuccess}
      />
      
      <ApproveChargesModal 
        isOpen={isApproveOpen}
        onClose={() => {
          setIsApproveOpen(false);
          setSelectedBooking(null);
        }}
        booking={selectedBooking}
        onSuccess={() => {
          refreshBookings?.();
        }}
      />

      <BookingInvoice 
        isOpen={isInvoiceOpen}
        onClose={() => {
          setIsInvoiceOpen(false);
          setSelectedBooking(null);
        }}
        booking={selectedBooking}
      />

      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight transition-colors">
          All Bookings ({(bookings || []).length})
        </h2>
      </div>

      {bookingsLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 text-indigo-600 dark:text-indigo-400 animate-spin transition-colors" />
        </div>
      ) : (bookings || []).length === 0 ? (
        <div className="text-center py-20 px-6">
          <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-colors">
            <BookOpen className="text-slate-300 dark:text-slate-600" size={40} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 transition-colors">No bookings yet</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-xs mx-auto transition-colors">
            Start booking home services today and enjoy a hassle-free experience!
          </p>
          <Button onClick={() => navigate("/services")} size="lg">
            Browse Services
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {(bookings || []).map((b) => {
            const pendingCharges = b.additionalCharges?.filter(c => c.approvalStatus === "pending") || [];
            const hasPendingCharges = pendingCharges.length > 0;
            const isConfirmed = ["accepted", "on-the-way", "started"].includes(b.status);

            return (
              <div
                key={b._id}
                className={`group bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl p-6 border transition-all hover:shadow-xl dark:hover:shadow-none duration-300 ${
                  hasPendingCharges 
                    ? "border-amber-200 dark:border-amber-900/50 bg-amber-50/20 dark:bg-amber-900/10" 
                    : "border-slate-100 dark:border-slate-800"
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                        {b.service?.title || "Service"}
                      </h3>
                      {hasPendingCharges && (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-500 text-white rounded-full text-[8px] font-black uppercase tracking-widest animate-pulse shrink-0">
                          <AlertCircle size={10} />
                          Needs Approval
                        </div>
                      )}
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider transition-colors">
                      ID: #{b._id?.slice(-8).toUpperCase()}
                    </div>
                  </div>
                  <Badge variant={b.status} className="px-3 py-1 sm:px-4 sm:py-1.5 uppercase tracking-widest text-[0.6rem] sm:text-[0.65rem] shrink-0">
                    {b.status === "on-the-way" ? "On the Way" : b.status === "started" ? "In Progress" : b.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-slate-200/60 dark:border-slate-800 transition-colors">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2.5 text-sm font-semibold text-slate-600 dark:text-slate-400 transition-colors">
                      <Clock size={16} className="text-slate-400 dark:text-slate-500 transition-colors" />
                      {b.bookingDate
                        ? new Date(b.bookingDate).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                          })
                        : "TBD"}{" "}
                      • {b.timeSlot || "TBD"}
                    </div>
                    {isConfirmed && b.provider && (
                      <div className="flex items-center gap-3 p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-black text-sm transition-colors">
                          {b.provider.user?.name?.[0].toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mb-1 transition-colors">Provider</p>
                          <p className="text-xs font-black text-slate-900 dark:text-white truncate transition-colors">{b.provider.user?.name}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-3">
                    {b.address?.city && (
                      <div className="flex items-center gap-2.5 text-sm font-semibold text-slate-600 dark:text-slate-400 transition-colors">
                        <MapPin size={16} className="text-slate-400 dark:text-slate-500 transition-colors" /> {b.address.city}
                      </div>
                    )}
                    {hasPendingCharges && (
                      <button 
                         onClick={() => {
                           setSelectedBooking(b);
                           setIsApproveOpen(true);
                         }}
                         className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-500 hover:text-amber-700 transition-colors bg-amber-50 dark:bg-amber-900/30 px-3 py-1.5 rounded-xl w-fit border border-amber-200 dark:border-amber-800"
                      >
                         <AlertCircle size={12} />
                         Review ₹{pendingCharges.reduce((sum, c) => sum + c.price, 0)} Charges
                      </button>
                    )}
                    {isConfirmed && (
                      <div className="flex items-center gap-3 mt-1">
                        <button
                          onClick={() => handleChat(b.provider)}
                          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-indigo-100 dark:shadow-none"
                        >
                          <MessageCircle size={14} />
                          Chat
                        </button>
                        <button
                          onClick={() => handleCall(b.provider?.user?.phone)}
                          className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95"
                        >
                          <Phone size={14} />
                          Call
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center justify-between sm:justify-end gap-4 text-right">
                      {isConfirmed && b.otp && (
                        <div className="flex items-center gap-3 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 rounded-2xl group/otp transition-all hover:bg-indigo-600 dark:hover:bg-indigo-600 group-hover:dark:border-indigo-500 w-full sm:w-auto">
                          <ShieldCheck size={16} className="text-indigo-600 dark:text-indigo-400 group-hover/otp:text-white transition-colors" />
                          <div className="text-left">
                            <p className="text-[8px] font-black text-indigo-400 dark:text-indigo-500 uppercase tracking-widest group-hover/otp:text-indigo-100 transition-colors">Completion OTP</p>
                            <p className="text-sm font-black text-indigo-900 dark:text-white tracking-widest group-hover/otp:text-white transition-colors">{b.otp}</p>
                          </div>
                        </div>
                      )}
                      {(b.status === "pending" || b.status === "accepted") && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-rose-900/20"
                          onClick={() => onCancel(b._id)}
                        >
                          Cancel
                        </Button>
                      )}
                      <div className="flex flex-col items-end">
                        <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">
                          {b.status === "completed" ? "Paid Amount" : "Current Amount"}
                        </div>
                        <div className="text-lg font-black text-slate-900 dark:text-white transition-colors">
                          ₹{b.totalAmount}
                        </div>
                        {hasPendingCharges && (
                          <div className="text-[9px] font-black text-amber-500 uppercase tracking-tighter mt-0.5">
                            +₹{pendingCharges.reduce((sum, c) => sum + c.price, 0)} Pending
                          </div>
                        )}
                      </div>
                      {b.status === "completed" && (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs font-bold"
                            onClick={() => {
                              setSelectedBooking(b);
                              setIsInvoiceOpen(true);
                            }}
                            icon={FileText}
                          >
                            Invoice
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs font-bold"
                            onClick={() => {
                              setSelectedBooking(b);
                              setIsReviewOpen(true);
                            }}
                            icon={Star}
                          >
                            Review
                          </Button>
                        </div>
                      )}
                    </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UserBookingsTab;
