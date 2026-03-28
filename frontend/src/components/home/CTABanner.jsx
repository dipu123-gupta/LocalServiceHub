import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "../common/Button";
import { ArrowRight, Briefcase } from "lucide-react";

const CTABanner = () => {
  return (
    <section className="relative bg-[#0A0C10] py-32 px-6 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/20 blur-[100px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/10 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 bg-white/5 backdrop-blur-3xl rounded-full border border-white/10"
        >
          <Briefcase size={14} /> Partner With Us
        </motion.div>
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight leading-[1.1]"
        >
          Are you a service <span className="text-indigo-500 underline decoration-indigo-500/30 underline-offset-8 italic">professional?</span>
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-slate-400 text-lg md:text-xl font-medium mb-12 max-w-2xl mx-auto leading-relaxed"
        >
          Join 2,000+ verified experts on HomeServiceHub. Scale your business, manage bookings, and delight customers every day.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row justify-center items-center gap-6"
        >
          <Link to="/register" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto h-14 md:h-16 px-10 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[1.5rem] md:rounded-[2rem] font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-indigo-600/20">
              Become a Provider
              <ArrowRight size={18} />
            </button>
          </Link>
          <Link to="/services" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto h-14 md:h-16 px-10 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-[1.5rem] md:rounded-[2rem] font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 transition-all active:scale-95">
              Explore Services
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default CTABanner;
