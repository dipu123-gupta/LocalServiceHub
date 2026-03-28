import { Calendar, Loader2, TrendingUp, CheckCircle, MapPin, Tag, CreditCard, Wallet, Banknote, ChevronDown } from "lucide-react";
import MapComponent from "../MapComponent";
import { motion, AnimatePresence } from "framer-motion";

const ServiceBookingCard = ({
  service,
  userInfo,
  bookingDate,
  setBookingDate,
  bookingTime,
  setBookingTime,
  timeSlots,
  contactName,
  setContactName,
  contactNumber,
  setContactNumber,
  address,
  setAddress,
  city,
  setCity,
  zipCode,
  setZipCode,
  mapLocation,
  setMapLocation,
  notes,
  setNotes,
  paymentMethod,
  setPaymentMethod,
  couponCode,
  setCouponCode,
  couponApplied,
  handleApplyCoupon,
  couponLoading,
  couponError,
  discount,
  bookingLoading,
  handleBooking,
  bookingSuccess,
  bookingError,
  navigate,
  minDate,
}) => {
  const totalPrice = Math.round(service.price * (service.surgeMultiplier || 1)) - discount;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden shadow-2xl shadow-indigo-100/50 dark:shadow-none border border-slate-100 dark:border-slate-800 sticky top-24 transition-colors duration-300">
      {/* Header / Pricing Banner */}
      <div className="bg-indigo-600 p-8 text-white relative overflow-hidden">
        {/* Decorative Circles */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-purple-500/20 rounded-full blur-xl" />

        <div className="relative z-10">
          <p className="text-indigo-200 text-xs font-bold uppercase tracking-widest mb-1">
            Standard Pricing
          </p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-4xl font-black tracking-tight">
              ₹{Math.round(service.price * (service.surgeMultiplier || 1))}
            </h2>
            {service.surgeMultiplier > 1 && (
              <span className="text-lg text-indigo-300 line-through font-bold">
                ₹{service.price}
              </span>
            )}
          </div>
          <div className="mt-4 flex items-center gap-3">
            <div className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-lg text-[10px] font-bold uppercase border border-white/10 transition-colors">
              {service.duration || 60} min session
            </div>
            {service.surgeMultiplier > 1 && (
              <div className="px-3 py-1 bg-amber-400/20 backdrop-blur-md rounded-lg text-[10px] font-bold uppercase text-amber-200 border border-amber-400/20 flex items-center gap-1">
                <TrendingUp size={10} /> Surge Active
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {bookingSuccess ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="p-10 text-center"
          >
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-100/50">
              <CheckCircle size={40} className="text-emerald-500" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Booking Confirmed!</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
              Your service is locked in. We've sent the details to your email and the provider is being notified.
            </p>
            <button
              onClick={() => navigate("/bookings")}
              className="w-full py-4 px-6 bg-indigo-600 hover:bg-slate-900 text-white rounded-2xl font-bold transition-all duration-300 shadow-lg shadow-indigo-100 active:scale-95"
            >
              Go to My Bookings
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-8"
          >
            <form onSubmit={handleBooking} className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  {userInfo ? "Book Your Appointment" : "Please Login to Book"}
                </h3>
              </div>

              {bookingError && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-semibold flex items-center gap-2"
                >
                  <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />
                  {bookingError}
                </motion.div>
              )}

              {/* Step 1: Schedule */}
              <div className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">
                    1. Preferred Date
                  </label>
                  <div className="relative group">
                    <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-600" />
                    <input
                      type="date"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      min={minDate}
                      required
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-indigo-50 dark:focus:ring-indigo-900/20 focus:border-indigo-200 transition-all appearance-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">
                    2. Available Time Slots
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((t) => (
                      <button
                        type="button"
                        key={t}
                        onClick={() => setBookingTime(t)}
                        className={`py-3 rounded-xl text-xs font-bold transition-all duration-200 border-2 ${
                          bookingTime === t
                            ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100 dark:shadow-none"
                            : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-indigo-200 dark:hover:border-indigo-800 hover:bg-slate-50 dark:hover:bg-slate-700"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Step 2: Contact Info */}
              <div className="space-y-4 pt-4 border-t border-slate-50 dark:border-slate-800">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">
                  3. Contact & Location
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-indigo-50 dark:focus:ring-indigo-900/20 focus:border-indigo-200 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-indigo-50 dark:focus:ring-indigo-900/20 focus:border-indigo-200 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    />
                  </div>
                </div>

                <input
                  type="text"
                  placeholder="Street Address, Area"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-indigo-50 dark:focus:ring-indigo-900/20 focus:border-indigo-200 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-indigo-50 dark:focus:ring-indigo-900/20 focus:border-indigo-200 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                  <input
                    type="text"
                    placeholder="Pincode"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-indigo-50 dark:focus:ring-indigo-900/20 focus:border-indigo-200 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>

                <div className="rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800">
                  <MapComponent
                    height="160px"
                    onLocationSelect={(loc) => setMapLocation(loc)}
                    markers={mapLocation ? [mapLocation] : []}
                    center={mapLocation || { lat: 28.6139, lng: 77.209 }}
                  />
                  <div className="bg-slate-50 px-4 py-2 border-t border-slate-100 flex items-center gap-2">
                    <MapPin size={12} className="text-indigo-500" />
                    <span className="text-[10px] font-bold text-slate-500">Tap to set exact pin on map</span>
                  </div>
                </div>

                <textarea
                  placeholder="Add specific instructions for the professional (house number, landmarks, etc.)..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-indigo-50 dark:focus:ring-indigo-900/20 focus:border-indigo-200 transition-all resize-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>

              {/* Step 3: Payment */}
              <div className="space-y-4 pt-4 border-t border-slate-50 dark:border-slate-800 transition-colors duration-300">
                <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider ml-1">
                  4. Payment Details
                </label>
                
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none transition-colors group-focus-within:text-indigo-600">
                    {paymentMethod === "Razorpay" ? <CreditCard size={18} /> : paymentMethod === "wallet" ? <Wallet size={18} /> : <Banknote size={18} />}
                  </div>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-indigo-50 dark:focus:ring-indigo-900/20 focus:border-indigo-200 transition-all cursor-pointer appearance-none"
                  >
                    <option value="Cash on Delivery">Cash on Delivery</option>
                    <option value="wallet">Pay via Wallet Balance</option>
                    <option value="Razorpay">Pay Online (Razorpay)</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none border-l border-slate-200 dark:border-slate-700 pl-3">
                    <ChevronDown size={14} className="text-slate-400" />
                  </div>
                </div>

                {/* Coupon */}
                <div className="p-5 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-2xl border border-indigo-100 dark:border-indigo-900/50 group shadow-sm transition-colors duration-300">
                  <div className="flex items-center gap-2 mb-3">
                    <Tag size={14} className="text-indigo-600 dark:text-indigo-400" />
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-wider">Promo Code</span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="HUB20"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      disabled={couponApplied}
                      className="flex-1 bg-white dark:bg-slate-800 border border-indigo-100 dark:border-indigo-900 px-4 py-2 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900/50 uppercase placeholder:text-slate-300 dark:placeholder:text-slate-600"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      disabled={couponLoading || couponApplied || !couponCode}
                      className={`px-6 rounded-xl text-xs font-black transition-all ${
                        couponApplied 
                          ? "bg-emerald-500 text-white shadow-none" 
                          : "bg-indigo-600 text-white hover:bg-slate-900 dark:hover:bg-indigo-500 active:scale-95 shadow-md shadow-indigo-100 dark:shadow-none"
                      }`}
                    >
                      {couponLoading ? "..." : couponApplied ? "Applied" : "Apply"}
                    </button>
                  </div>
                  {couponError && <p className="text-[10px] font-bold text-red-500 mt-2 ml-1">{couponError}</p>}
                  {couponApplied && <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mt-2 ml-1">Discount of ₹{discount} applied!</p>}
                </div>
              </div>

              {/* Summary */}
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-6 transition-colors duration-300 space-y-3">
                <div className="flex justify-between text-sm font-semibold text-slate-500 dark:text-slate-400 px-1">
                  <span>Base Amount</span>
                  <span>₹{service.price}</span>
                </div>
                {service.surgeMultiplier > 1 && (
                  <div className="flex justify-between text-sm font-semibold text-amber-600 dark:text-amber-400 px-1">
                    <span className="flex items-center gap-1.5">Surge Adjustment <TrendingUp size={12} /></span>
                    <span>+₹{Math.round(service.price * (service.surgeMultiplier - 1))}</span>
                  </div>
                )}
                {discount > 0 && (
                  <div className="flex justify-between text-sm font-semibold text-emerald-600 dark:text-emerald-400 px-1">
                    <span>Discount Applied</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
                <div className="pt-4 mt-2 border-t-2 border-dashed border-slate-200 dark:border-slate-700 flex justify-between items-center px-1">
                  <span className="text-base font-black text-slate-900 dark:text-white">Total Payable</span>
                  <span className="text-2xl font-black text-indigo-600 dark:text-white tracking-tight">₹{totalPrice}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={bookingLoading}
                className={`w-full py-4.5 px-6 rounded-2xl font-black text-white text-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-xl ${
                  bookingLoading 
                    ? "bg-slate-800 dark:bg-slate-800 cursor-not-allowed" 
                    : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-indigo-200 dark:hover:shadow-none hover:-translate-y-1 active:scale-95"
                }`}
              >
                {bookingLoading ? (
                  <>
                    <Loader2 size={24} className="animate-spin" />
                    Processing...
                  </>
                ) : userInfo ? (
                  "Confirm & Pay"
                ) : (
                  "Login to Continue"
                )}
              </button>
              <p className="text-[10px] text-center text-slate-400 dark:text-slate-500 font-bold px-4">
                By clicking "Confirm & Pay", you agree to our terms of service and professional-grade safety standards.
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ServiceBookingCard;
