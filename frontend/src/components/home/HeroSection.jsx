import { Link } from "react-router-dom";
import { Search, MapPin, Sparkles, ChevronRight, Shield, Star, Users, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import premiumHero from "../../assets/premium_hero.png";

const HeroSection = ({
  searchQuery,
  setSearchQuery,
  localCity,
  setLocalCity,
}) => {
  return (
    <section className="relative pt-20 pb-24 lg:pt-32 lg:pb-40 overflow-hidden bg-[#0A0C10]">
      {/* Dynamic Background Mesh */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[70%] h-[70%] rounded-full bg-indigo-600/20 blur-[130px] animate-pulse" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-600/15 blur-[110px]" />
        <div className="absolute top-[20%] left-[20%] w-[40%] h-[40%] rounded-full bg-purple-600/10 blur-[90px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 h-full">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-8 items-center h-full">
          
          {/* Left Content: Text & Search */}
          <div className="flex flex-col items-start text-left">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-[10px] font-black uppercase tracking-[0.25em] text-indigo-400 bg-indigo-950/40 backdrop-blur-3xl rounded-full border border-indigo-500/20 shadow-2xl"
            >
              <Sparkles size={14} className="text-indigo-400" /> 
              The Gold Standard of Home Care
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black text-white leading-[1.05] tracking-tight mb-8"
            >
              Expert Care. <br />
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Exceptional Life.
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="max-w-xl mb-12 text-lg sm:text-xl text-slate-400 font-medium leading-relaxed"
            >
              Elevate your home experience with India's most trusted professionals. 
              Precision, safety, and excellence—delivered to your doorstep.
            </motion.p>

            {/* Premium Search Hub */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="w-full max-w-2xl group flex flex-col sm:flex-row items-stretch p-2 bg-white/5 backdrop-blur-3xl rounded-[2rem] border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.4)] transition-all hover:bg-white/[0.08]"
            >
              {/* Location input */}
              <div className="flex-1 flex items-center px-6 py-4 rounded-[1.5rem] bg-white/5 sm:bg-transparent mb-2 sm:mb-0">
                <MapPin size={20} className="text-indigo-400 mr-3 shrink-0" />
                <div className="flex flex-col text-left">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Location</span>
                  <input
                    placeholder="E.g. Delhi, Mumbai"
                    value={localCity}
                    onChange={(e) => setLocalCity(e.target.value)}
                    className="bg-transparent border-none outline-none text-white font-bold placeholder:text-slate-600 text-sm w-full"
                  />
                </div>
              </div>

              <div className="hidden sm:block w-[1px] h-10 bg-white/10 self-center mx-2" />

              {/* Service input */}
              <div className="flex-[1.5] flex items-center px-6 py-4 rounded-[1.5rem] bg-white/5 sm:bg-transparent mb-4 sm:mb-0">
                <Search size={20} className="text-indigo-400 mr-3 shrink-0" />
                <div className="flex flex-col text-left">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Service</span>
                  <input
                    placeholder="What do you need?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent border-none outline-none text-white font-bold placeholder:text-slate-600 text-sm w-full"
                  />
                </div>
              </div>

              <Link to="/services" className="sm:ml-2">
                <button className="h-full w-full sm:w-auto px-10 py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl sm:rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] sm:text-xs flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-indigo-600/30">
                  Search
                  <ChevronRight size={18} />
                </button>
              </Link>
            </motion.div>

            {/* Popular Search Chips */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="flex flex-wrap gap-3 mt-8"
            >
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 self-center">Trending:</span>
              {["Painting", "AC Repair", "Cleaning", "Plumbing"].map((chip) => (
                <button
                  key={chip}
                  onClick={() => setSearchQuery(chip)}
                  className="px-4 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-[10px] font-bold text-slate-400 transition-all hover:text-indigo-400 hover:border-indigo-500/30"
                >
                  {chip}
                </button>
              ))}
            </motion.div>
          </div>

          {/* Right Content: Visual Anchor & Floating Cards */}
          <div className="relative hidden lg:block h-full min-h-[500px]">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="relative w-full h-full flex items-center justify-center p-8"
            >
              {/* Main 3D Asset */}
              <div className="relative z-10 w-full aspect-square rounded-[3rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.6)] border border-white/10">
                <img 
                  src={premiumHero} 
                  alt="Premium Home Service" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/40 to-transparent" />
              </div>

              {/* Decorative Glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-indigo-600/10 blur-[150px] pointer-events-none rounded-full" />

              {/* Floating Card 1: Job Completed */}
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[15%] -left-8 z-20 p-5 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl flex items-center gap-4 w-64"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-inner">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <p className="text-xs font-black text-white uppercase tracking-wider">AC Servicing</p>
                  <p className="text-[10px] font-bold text-slate-400">Completed by S. Sharma</p>
                </div>
              </motion.div>

              {/* Floating Card 2: 5-Star Rating */}
              <motion.div
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute bottom-[20%] -right-4 z-20 p-5 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl flex items-center gap-4 w-56"
              >
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-400">
                  <Star fill="currentColor" size={24} />
                </div>
                <div>
                  <p className="text-xs font-black text-emerald-400 uppercase tracking-widest">4.9 / 5.0</p>
                  <p className="text-[10px] font-bold text-slate-400">Average Pro Rating</p>
                </div>
              </motion.div>

              {/* Floating Card 3: Live Verification */}
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-4 left-1/4 z-20 px-6 py-4 bg-indigo-600/90 backdrop-blur-xl border border-indigo-400/50 rounded-2xl shadow-2xl flex items-center gap-3"
              >
                <Shield size={20} className="text-white" />
                <p className="text-[10px] font-black text-white uppercase tracking-widest">100% Background Verified Professionals</p>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Brand Presence Bar */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-24 sm:mt-32 pt-12 border-t border-white/5 flex flex-wrap justify-between items-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-700"
        >
          <span className="text-xs font-black uppercase tracking-[0.4em] text-slate-500">Trusted Partners</span>
          <div className="flex flex-wrap gap-12 sm:gap-20 items-center">
            <h4 className="text-xl font-black text-slate-400 tracking-tighter">METRO PRO</h4>
            <h4 className="text-xl font-black text-slate-400 tracking-tighter">URBAN FIX</h4>
            <h4 className="text-xl font-black text-slate-400 tracking-tighter">PRIME CARE</h4>
            <h4 className="text-xl font-black text-slate-400 tracking-tighter">HOME SHIELD</h4>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
