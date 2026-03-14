import { BookOpen, Loader2, Clock, MapPin, Star } from "lucide-react";
import { useState } from "react";
import Badge from "../common/Badge";
import Button from "../common/Button";
import ReviewModal from "./ReviewModal";

const UserBookingsTab = ({ bookings, bookingsLoading, navigate, onCancel }) => {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  const handleReviewSuccess = () => {
    alert("Review posted! Thank you for your feedback.");
    // Optionally refresh or update local state if needed
  };

  return (
    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
      {/* ... header ... */}
      <ReviewModal 
        isOpen={isReviewOpen}
        onClose={() => {
          setIsReviewOpen(false);
          setSelectedBooking(null);
        }}
        booking={selectedBooking}
        onSuccess={handleReviewSuccess}
      />
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-black text-slate-900 tracking-tight">
          All Bookings ({bookings.length})
        </h2>
      </div>

      {bookingsLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-20 px-6">
          <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <BookOpen className="text-slate-300" size={40} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No bookings yet</h3>
          <p className="text-slate-500 mb-8 max-w-xs mx-auto">
            Start booking home services today and enjoy a hassle-free experience!
          </p>
          <Button onClick={() => navigate("/services")} size="lg">
            Browse Services
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {bookings.map((b) => (
            <div
              key={b._id}
              className="group bg-slate-50/50 rounded-2xl p-6 border border-slate-100 transition-all hover:bg-white hover:shadow-xl hover:shadow-indigo-100/40"
            >
              <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-black text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">
                    {b.service?.title || "Service"}
                  </h3>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Booking ID: #{b._id?.slice(-8).toUpperCase()}
                  </div>
                </div>
                <Badge variant={b.status} className="px-4 py-1.5 uppercase tracking-widest text-[0.65rem]">
                  {b.status === "on-the-way" ? "On the Way" : b.status === "started" ? "In Progress" : b.status}
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-slate-200/60">
                <div className="flex items-center gap-2.5 text-sm font-semibold text-slate-600">
                  <Clock size={16} className="text-slate-400" />
                  {b.bookingDate
                    ? new Date(b.bookingDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                      })
                    : "TBD"}{" "}
                  • {b.timeSlot || "TBD"}
                </div>
                {b.address?.city && (
                  <div className="flex items-center gap-2.5 text-sm font-semibold text-slate-600">
                    <MapPin size={16} className="text-slate-400" /> {b.address.city}
                  </div>
                )}
                  <div className="flex items-center justify-between sm:justify-end gap-3 text-right">
                    {(b.status === "pending" || b.status === "accepted") && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs font-bold text-red-500 hover:bg-red-50"
                        onClick={() => onCancel(b._id)}
                      >
                        Cancel Booking
                      </Button>
                    )}
                    <div className="text-lg font-black text-slate-900">
                      ₹{b.totalAmount}
                    </div>
                    {b.status === "completed" && (
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
                        Write Review
                      </Button>
                    )}
                  </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserBookingsTab;
