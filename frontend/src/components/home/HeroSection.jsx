import { Link } from "react-router-dom";
import { Search, MapPin, Sparkles, ChevronRight, Shield, Star, Users } from "lucide-react";
import { motion } from "framer-motion";
import Button from "../common/Button";

const HeroSection = ({
  searchQuery,
  setSearchQuery,
  localCity,
  setLocalCity,
}) => {
  return (
    <section className="relative px-6 pt-32 pb-40 overflow-hidden bg-[#0A0C10]">
      {/* Premium Background Mesh */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[60%] h-[60%] rounded-full bg-indigo-600/20 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[100px]" />
        <div className="absolute top-[20%] left-[10%] w-[30%] h-[30%] rounded-full bg-purple-600/10 blur-[80px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="flex flex-col items-center text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-xs font-black uppercase tracking-[0.2em] text-indigo-400 bg-indigo-950/40 backdrop-blur-xl rounded-full border border-indigo-500/20 shadow-[0_0_20px_rgba(79,70,229,0.1)]"
          >
            <Sparkles size={14} className="animate-pulse" /> India's #1 Home Services Platform
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[1.05] tracking-tight mb-8"
          >
            Expert Services, <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Elevated Living.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-2xl mx-auto mb-12 text-lg md:text-xl text-slate-400 font-medium leading-relaxed"
          >
            Experience the future of home care. Book top-tier, verified professionals 
            for all your household needs with absolute confidence.
          </motion.p>

          {/* Premium Search Hub */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="w-full max-w-4xl p-2 bg-white/5 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-wrap gap-4"
          >
            <div className="flex-1 min-w-[200px] flex items-center px-6 py-4 bg-white/5 rounded-3xl group transition-all hover:bg-white/[0.08]">
              <MapPin size={20} className="text-indigo-400 mr-4 shrink-0" />
              <div className="flex flex-col items-start w-full">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-0.5">Location</span>
                <input
                  placeholder="Where do you live?"
                  value={localCity}
                  onChange={(e) => setLocalCity(e.target.value)}
                  className="w-full bg-transparent outline-none text-white font-bold placeholder:text-slate-600 text-sm"
                />
              </div>
            </div>

            <div className="flex-[1.5] min-w-[280px] flex items-center px-6 py-4 bg-white/5 rounded-3xl group transition-all hover:bg-white/[0.08]">
              <Search size={20} className="text-indigo-400 mr-4 shrink-0" />
              <div className="flex flex-col items-start w-full">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-0.5">Search Service</span>
                <input
                  placeholder="What are you looking for?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent outline-none text-white font-bold placeholder:text-slate-600 text-sm"
                />
              </div>
            </div>

            <Link to="/services" className="w-full md:w-auto">
              <button className="w-full h-[72px] px-10 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg shadow-indigo-600/20">
                Find Professionals
                <ChevronRight size={18} />
              </button>
            </Link>
          </motion.div>

          {/* Premium Trust Markers */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="flex flex-wrap justify-center gap-10 mt-16"
          >
            {[
              { icon: Shield, text: "Background Verified", color: "text-emerald-400" },
              { icon: Star, text: "Quality Guaranteed", color: "text-amber-400" },
              { icon: Users, text: "50k+ Happy Users", color: "text-indigo-400" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 shrink-0"
              >
                <div className={`p-2 rounded-xl bg-white/5 border border-white/10 ${item.color}`}>
                  <item.icon size={16} />
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-slate-400">{item.text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
