import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Star,
  Clock,
  CheckCircle,
  Shield,
  ChevronLeft,
  ChevronDown,
  ShieldCheck,
  Loader2,
  Heart,
  MessageCircle,
  AlertCircle,
  Share2,
  Info,
  Award,
  Zap
} from "lucide-react";
import useServiceDetail from "../hooks/service/useServiceDetail";
import ServiceBookingCard from "../components/service/ServiceBookingCard";
import { ServiceReviews } from "../components/service/ServiceReviews";
import { motion, AnimatePresence } from "framer-motion";

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useSelector((s) => s.auth);

  const {
    service,
    reviews,
    isLoading,
    error,
    isFavorite,
    bookingDate,
    setBookingDate,
    bookingTime,
    setBookingTime,
    contactNumber,
    setContactNumber,
    contactName,
    setContactName,
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
    bookingLoading,
    bookingSuccess,
    bookingError,
    paymentMethod,
    setPaymentMethod,
    couponCode,
    setCouponCode,
    discount,
    couponLoading,
    couponApplied,
    couponError,
    reviewRating,
    setReviewRating,
    reviewComment,
    setReviewComment,
    isReviewLoading,
    reviewSuccess,
    reviewError,
    handleApplyCoupon,
    handleBooking,
    toggleFavorite,
    handleStartChat,
    handleReviewSubmit,
  } = useServiceDetail(id, userInfo, navigate);

  const timeSlots = [
    "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM",
  ];

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={48} className="text-indigo-600 animate-spin" />
          <p className="text-slate-400 font-bold animate-pulse">Loading experience...</p>
        </div>
      </div>
    );

  if (error || !service)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center bg-white p-12 rounded-[3rem] shadow-xl border border-slate-100"
        >
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={40} className="text-red-500" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Service Unavailable</h2>
          <p className="text-slate-500 font-semibold mb-8">{error || "The service you're looking for was not found."}</p>
          <button
            onClick={() => navigate("/services")}
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-indigo-600 transition-all active:scale-95 shadow-lg"
          >
            Browse Collections
          </button>
        </motion.div>
      </div>
    );

  const heroImage = typeof service.images?.[0] === "string" 
    ? service.images[0] 
    : service.images?.[0]?.url;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 transition-colors duration-300">
      {/* Dynamic Hero Section */}
      <div className="relative h-[450px] overflow-hidden bg-slate-900">
        <AnimatePresence>
          <motion.img
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.4 }}
            src={heroImage}
            alt={service.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>
        
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-4 h-full flex flex-col justify-end pb-16 relative z-10">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate("/services")}
            className="flex items-center gap-2 text-indigo-300 font-bold text-sm mb-8 hover:text-white transition-colors w-fit"
          >
            <ChevronLeft size={18} /> Explore Services
          </motion.button>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 mb-4"
              >
                <span className="px-4 py-1.5 bg-indigo-500/20 backdrop-blur-md border border-indigo-500/30 text-indigo-200 text-[10px] font-black uppercase tracking-widest rounded-full">
                  {service.category?.name || "Professional Service"}
                </span>
                {service.provider?.isVerified && (
                  <span className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 text-emerald-300 text-[10px] font-black uppercase tracking-widest rounded-full">
                    <ShieldCheck size={12} /> Verified
                  </span>
                )}
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight leading-tight"
              >
                {service.title}
              </motion.h1>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap items-center gap-6"
              >
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center gap-1 bg-amber-400/20 border border-amber-400/30 px-3 py-1 rounded-xl">
                    <Star size={16} className="fill-amber-400 stroke-amber-400" />
                    <span className="text-amber-400 font-black text-lg">{service.rating?.toFixed(1) || "5.0"}</span>
                  </div>
                  <span className="text-slate-400 font-bold text-sm">({reviews.length} Verified Reviews)</span>
                </div>
                <div className="h-4 w-[1px] bg-white/10 hidden sm:block" />
                <div className="flex items-center gap-2 text-slate-300 font-bold text-sm">
                  <Clock size={16} className="text-indigo-400" />
                  {service.duration || 60} Min Sessions
                </div>
              </motion.div>
            </div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-3"
            >
              <button 
                onClick={toggleFavorite}
                className="p-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white hover:bg-white hover:text-red-500 transition-all active:scale-90 group"
              >
                <Heart size={20} className={isFavorite ? "fill-red-500 stroke-red-500" : "group-hover:fill-red-500"} />
              </button>
              <button className="p-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white hover:bg-white hover:text-indigo-600 transition-all active:scale-90">
                <Share2 size={20} />
              </button>
              <button 
                onClick={handleStartChat}
                className="flex items-center gap-3 px-8 py-4 bg-indigo-600 hover:bg-white hover:text-indigo-600 text-white font-black rounded-2xl transition-all shadow-2xl shadow-indigo-600/20 active:scale-95"
              >
                <MessageCircle size={20} /> Contact Expert
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content Layout */}
      <div className="max-w-7xl mx-auto px-4 mt-12">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* Detailed Info Column */}
          <div className="flex-1 space-y-12">
            
            {/* Gallery Section */}
            {service.images?.length > 1 && (
              <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-300 overflow-hidden">
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-8 flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-indigo-600 rounded-full" /> Captured Experience
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {service.images.slice(0, 8).map((img, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.05 }}
                      className="aspect-[4/3] rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-50 dark:border-slate-700 cursor-pointer group"
                    >
                      <img
                        src={typeof img === "string" ? img : img.url}
                        alt={`Gallery ${i + 1}`}
                        className="w-full h-full object-cover transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Zap size={24} className="text-white drop-shadow-lg" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* Main Details Section */}
            <section className="bg-white dark:bg-slate-900 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 border border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 dark:bg-slate-800 rounded-full blur-3xl -mr-32 -mt-32 opacity-50" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl">
                    <Info size={24} className="text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">Service Overview</h3>
                    <p className="text-slate-400 dark:text-slate-500 text-sm font-bold uppercase tracking-wider">Premium Package Details</p>
                  </div>
                </div>

                <div className="prose prose-slate dark:prose-invert max-w-none mb-12">
                  <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed font-medium">
                    {service.description}
                  </p>
                </div>

                {/* Features List */}
                {service.features?.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {service.features.map((f, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-4 p-5 bg-slate-50 dark:bg-slate-800/50 rounded-[1.5rem] border border-slate-100 dark:border-slate-700 group hover:border-indigo-100 dark:hover:border-indigo-900 hover:bg-white dark:hover:bg-slate-800 transition-all duration-300"
                      >
                        <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                          <CheckCircle size={16} className="text-emerald-600 dark:text-emerald-400 group-hover:text-white" />
                        </div>
                        <span className="text-slate-700 dark:text-slate-200 font-bold text-sm">{f}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* Expert Profile Section */}
            {service.provider && (
              <section className="bg-white dark:bg-slate-900 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-xl hover:shadow-indigo-50/50 dark:hover:shadow-indigo-900/10 group">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-[2rem] bg-indigo-600 flex items-center justify-center text-white text-3xl font-black relative z-10 shadow-xl shadow-indigo-100 group-hover:bg-slate-900 transition-colors duration-500">
                      {service.provider.businessName?.[0] || "P"}
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 border-4 border-white rounded-full flex items-center justify-center z-20 shadow-lg">
                      <ShieldCheck size={20} className="text-white" />
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-2xl font-black text-slate-900 dark:text-white">{service.provider.businessName}</h4>
                      <div className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-lg border border-emerald-100 dark:border-emerald-800/50">Verified Professional</div>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 font-semibold mb-6 leading-relaxed max-w-xl">
                      {service.provider.businessDescription}
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs font-black text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-700">
                        <Award size={14} className="text-indigo-500 dark:text-indigo-400" /> Top Rated Expert
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs font-black text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-700">
                        <Shield size={14} className="text-emerald-500 dark:text-emerald-400" /> Licensed Provider
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Premium Benefits Grid */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: "Service Guarantee", desc: "100% Satisfaction or free re-work", icon: <ShieldCheck className="text-emerald-500" /> },
                { title: "Background Verified", desc: "Top 1% experts with strict checks", icon: <CheckCircle className="text-indigo-500" /> },
                { title: "No Hidden Costs", desc: "Transparent pricing with no surprises", icon: <Zap className="text-amber-500" /> }
              ].map((item, i) => (
                <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center text-center gap-3 group hover:border-indigo-100 dark:hover:border-indigo-900 transition-all">
                  <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center group-hover:bg-indigo-600 transition-all">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tighter">{item.title}</h4>
                    <p className="text-[10px] font-bold text-slate-400 mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </section>

            {/* Inclusions & Exclusions */}
            <section className="bg-white dark:bg-slate-900 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm divide-y lg:divide-y-0 lg:divide-x divide-slate-50 dark:divide-slate-800 flex flex-col lg:flex-row transition-colors duration-300">
              <div className="flex-1 p-6 md:p-10">
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                  <CheckCircle size={20} className="text-emerald-500" /> What's Included
                </h3>
                <ul className="space-y-4">
                  {(service.inclusions?.length > 0 ? service.inclusions : ["Verified professional", "Standard equipment usage", "Post-service cleanup", "30-day warranty"]).map((inc, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm font-bold text-slate-600 dark:text-slate-300">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 shrink-0" />
                      {inc}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex-1 p-6 md:p-10 bg-slate-50/50 dark:bg-slate-800/20">
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                  <AlertCircle size={20} className="text-amber-500" /> What's Excluded
                </h3>
                <ul className="space-y-4">
                  {(service.exclusions?.length > 0 ? service.exclusions : ["Heavy furniture moving", "Structural changes", "Material costs (unless specified)", "Extra spare parts"]).map((exc, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm font-bold text-slate-400 dark:text-slate-500">
                      <div className="w-1.5 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mt-2 shrink-0" />
                      {exc}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* FAQ Accordion Section */}
            <section className="bg-white dark:bg-slate-900 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 border border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-300">
              <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mb-8 flex items-center gap-3">
                <div className="w-1.5 h-6 bg-indigo-600 rounded-full" /> Frequently Asked Questions
              </h3>
              <div className="space-y-4">
                {(service.faqs?.length > 0 ? service.faqs : [
                  { question: "When will the professional arrive?", answer: "The expert will arrive exactly at your chosen time slot. You can track their status in real-time through the 'My Bookings' section." },
                  { question: "Is the pricing inclusive of materials?", answer: "Currently, our base pricing covers labor and standard equipment. If specialized materials are needed, the provider will discuss the costs with you upfront." },
                  { question: "Can I reschedule my booking?", answer: "Yes, you can reschedule your session for free up to 4 hours before the appointment. Later adjustments may incur a small fee." }
                ]).map((faq, i) => (
                  <details key={i} className="group border border-slate-50 dark:border-slate-800 rounded-2xl overflow-hidden hover:border-indigo-100 dark:hover:border-indigo-900 transition-all">
                    <summary className="flex items-center justify-between p-6 cursor-pointer bg-slate-50/30 dark:bg-slate-800/10 hover:bg-white dark:hover:bg-slate-800 transition-colors list-none">
                      <span className="text-sm font-black text-slate-700 dark:text-slate-200">{faq.question}</span>
                      <ChevronDown size={18} className="text-slate-400 group-open:rotate-180 transition-transform" />
                    </summary>
                    <div className="p-6 bg-white dark:bg-slate-900 text-sm font-bold text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-50 dark:border-slate-800">
                      {faq.answer}
                    </div>
                  </details>
                ))}
              </div>
            </section>

            {/* Reviews Section Integration */}
            <div className="pt-8 mb-12">
              <ServiceReviews
                reviews={reviews}
                service={service}
                userInfo={userInfo}
                reviewSuccess={reviewSuccess}
                reviewError={reviewError}
                reviewRating={reviewRating}
                setReviewRating={setReviewRating}
                reviewComment={reviewComment}
                setReviewComment={setReviewComment}
                handleReviewSubmit={handleReviewSubmit}
                isReviewLoading={isReviewLoading}
              />
            </div>
          </div>

          {/* Sticky Sidebar Column */}
          <aside className="lg:w-[420px] shrink-0 sticky top-24 pb-8 hidden lg:block">
            <ServiceBookingCard
              service={service}
              userInfo={userInfo}
              bookingDate={bookingDate}
              setBookingDate={setBookingDate}
              bookingTime={bookingTime}
              setBookingTime={setBookingTime}
              timeSlots={timeSlots}
              contactName={contactName}
              setContactName={setContactName}
              contactNumber={contactNumber}
              setContactNumber={setContactNumber}
              address={address}
              setAddress={setAddress}
              city={city}
              setCity={setCity}
              zipCode={zipCode}
              setZipCode={setZipCode}
              mapLocation={mapLocation}
              setMapLocation={setMapLocation}
              notes={notes}
              setNotes={setNotes}
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              couponCode={couponCode}
              setCouponCode={setCouponCode}
              couponApplied={couponApplied}
              handleApplyCoupon={handleApplyCoupon}
              couponLoading={couponLoading}
              couponError={couponError}
              discount={discount}
              bookingLoading={bookingLoading}
              handleBooking={handleBooking}
              bookingSuccess={bookingSuccess}
              bookingError={bookingError}
              navigate={navigate}
              minDate={minDate}
            />

            {/* Security Badges */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 text-center flex flex-col items-center gap-3 shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                  <ShieldCheck size={24} className="text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">Payment Security</h5>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">256-bit SSL Layer</p>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 text-center flex flex-col items-center gap-3 shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                  <Award size={24} className="text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">Quality Guaranteed</h5>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">100% Satisfaction</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Sticky Mobile Footer */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800 z-50 flex items-center justify-between gap-4">
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Starts from</span>
          <span className="text-2xl font-black text-slate-900 dark:text-white">₹{service.price}</span>
        </div>
        <button 
          onClick={() => {
            const el = document.getElementById("mobile-booking-anchor");
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="flex-1 max-w-[200px] py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-600/20 active:scale-95 transition-all"
        >
          Book Now
        </button>
      </div>

      {/* Mobile Booking Section (Hidden on desktop, visible on scroll trigger) */}
      <div id="mobile-booking-anchor" className="lg:hidden max-w-7xl mx-auto px-4 mt-12 pb-24">
         <ServiceBookingCard
              service={service}
              userInfo={userInfo}
              bookingDate={bookingDate}
              setBookingDate={setBookingDate}
              bookingTime={bookingTime}
              setBookingTime={setBookingTime}
              timeSlots={timeSlots}
              contactName={contactName}
              setContactName={setContactName}
              contactNumber={contactNumber}
              setContactNumber={setContactNumber}
              address={address}
              setAddress={setAddress}
              city={city}
              setCity={setCity}
              zipCode={zipCode}
              setZipCode={setZipCode}
              mapLocation={mapLocation}
              setMapLocation={setMapLocation}
              notes={notes}
              setNotes={setNotes}
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              couponCode={couponCode}
              setCouponCode={setCouponCode}
              couponApplied={couponApplied}
              handleApplyCoupon={handleApplyCoupon}
              couponLoading={couponLoading}
              couponError={couponError}
              discount={discount}
              bookingLoading={bookingLoading}
              handleBooking={handleBooking}
              bookingSuccess={bookingSuccess}
              bookingError={bookingError}
              navigate={navigate}
              minDate={minDate}
            />
      </div>
    </div>
  );
};

export default ServiceDetail;
