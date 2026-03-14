import { motion, AnimatePresence } from "framer-motion";
import { useVideoCall } from "../store/context/VideoCallContext";
import { Phone, PhoneOff, Video, Sparkles } from "lucide-react";

const IncomingCallModal = () => {
  const { call, answerCall, declineCall } = useVideoCall();

  if (!call.isReceivingCall) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0, scale: 0.9, rotate: -2 }}
        animate={{ y: 0, opacity: 1, scale: 1, rotate: 0 }}
        exit={{ y: 100, opacity: 0, scale: 0.9, rotate: 2 }}
        transition={{ type: "spring", damping: 15 }}
        className="fixed bottom-10 right-10 w-[420px] bg-white/[0.8] backdrop-blur-2xl rounded-[2.5rem] border border-white/40 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] z-[10000] overflow-hidden group"
      >
        {/* Animated Ringer Accent */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-violet-500/5 pointer-events-none" />

        <div className="p-10 relative">
          <div className="flex items-center gap-6 mb-10">
            <div className="relative">
              <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-indigo-600 to-violet-700 flex items-center justify-center text-white text-3xl font-black shadow-2xl shadow-indigo-600/30 group-hover:scale-105 transition-transform duration-500">
                {call.name?.[0] || "U"}
              </div>
              <motion.div
                animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute inset-x-0 inset-y-0 rounded-[2rem] border-2 border-indigo-500"
              />
              <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-lg">
                 <Video size={20} className="text-indigo-600" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
               <div className="flex items-center gap-2 mb-1">
                  <Sparkles size={14} className="text-indigo-500" />
                  <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em]">Consultation</span>
               </div>
              <h3 className="text-2xl font-black text-slate-900 truncate tracking-tight">
                {call.name}
              </h3>
              <p className="text-sm font-medium text-slate-400 mt-1 flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                Calling you...
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={declineCall}
              className="flex-1 h-16 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100/50 font-black uppercase tracking-widest text-[11px] transition-all flex items-center justify-center gap-3"
            >
              <PhoneOff size={18} /> Decline
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={answerCall}
              className="flex-1 h-16 rounded-2xl bg-slate-900 hover:bg-black text-white font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-slate-900/40 transition-all flex items-center justify-center gap-3"
            >
              <Phone size={18} /> Accept Call
            </motion.button>
          </div>
        </div>

        {/* Bottom Security Badge */}
        <div className="bg-slate-50/80 backdrop-blur-md px-10 py-3 flex items-center justify-center border-t border-white/20">
           <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">End-to-End Encrypted Session</span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default IncomingCallModal;
