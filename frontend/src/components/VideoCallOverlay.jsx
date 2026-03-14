import { motion, AnimatePresence } from "framer-motion";
import { useVideoCall } from "../store/context/VideoCallContext";
import {
  PhoneOff,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Maximize,
  Minimize,
  User,
  Activity,
  Shield,
  Zap
} from "lucide-react";
import { useState } from "react";

const VideoCallOverlay = () => {
  const {
    stream,
    remoteStream,
    myVideo,
    userVideo,
    leaveCall,
    callAccepted,
    otherUser,
  } = useVideoCall();
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  if (!stream && !callAccepted) return null;

  const toggleMute = () => {
    stream.getAudioTracks()[0].enabled = !stream.getAudioTracks()[0].enabled;
    setIsMuted(!isMuted);
  };

  const toggleVideo = () => {
    stream.getVideoTracks()[0].enabled = !stream.getVideoTracks()[0].enabled;
    setIsVideoOff(!isVideoOff);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-[#060608] z-[9999] flex flex-col overflow-hidden select-none"
    >
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-indigo-600/10 rounded-full blur-[180px] pointer-events-none" />

      {/* Top Header / Status */}
      <div className="absolute top-0 inset-x-0 p-8 flex items-center justify-between z-50 bg-gradient-to-b from-black/40 to-transparent">
        <div className="flex items-center gap-5">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-xl shadow-indigo-500/20"
          >
            <User size={28} />
          </motion.div>
          <div>
            <h2 className="text-xl font-black text-white tracking-tight">Consultation with {otherUser?.name || "Provider"}</h2>
            <div className="flex items-center gap-2">
               <div className={`w-2 h-2 rounded-full ${callAccepted ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" : "bg-amber-500 animate-pulse"}`} />
               <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">
                 {callAccepted ? "Encrypted Connection Active" : "Waiting for Answer..."}
               </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 pr-4">
           <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10">
              <Activity size={12} className="text-indigo-400" />
              <span className="text-[10px] font-black text-white uppercase tracking-widest">124ms Latency</span>
           </div>
           <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 backdrop-blur-md rounded-full border border-emerald-500/20">
              <Shield size={12} className="text-emerald-400" />
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Secure</span>
           </div>
        </div>
      </div>

      {/* Main Video Arena */}
      <div className="relative flex-1 flex items-center justify-center bg-black">
        {callAccepted ? (
          <video
            playsInline
            ref={userVideo}
            autoPlay
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-center relative z-10">
            <div className="w-40 h-40 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-10 relative">
               <motion.div 
                  animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0, 0.1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute inset-0 rounded-full border-2 border-indigo-500"
               />
               <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                  className="absolute inset-4 rounded-full border-t-2 border-indigo-500/50"
               />
               <div className="w-24 h-24 rounded-full bg-indigo-500/20 flex items-center justify-center">
                  <Video size={48} className="text-indigo-400" />
               </div>
            </div>
            <h3 className="text-3xl font-black text-white mb-3 tracking-tighter italic">Initializing Secure Link...</h3>
            <p className="text-slate-500 font-medium tracking-wide">Hang tight, we're bringing you together.</p>
          </div>
        )}

        {/* Self View (Draggable PIP) */}
        <motion.div
          drag
          dragMomentum={false}
          className="absolute bottom-32 right-8 w-72 aspect-video rounded-[2rem] bg-slate-900 border-2 border-white/20 overflow-hidden shadow-2xl z-50 cursor-grab active:cursor-grabbing group shadow-black/50"
        >
          <video
            playsInline
            muted
            ref={myVideo}
            autoPlay
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute bottom-4 left-5 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
             <div className="w-2 h-2 rounded-full bg-indigo-500" />
             <span className="text-[10px] font-black text-white uppercase tracking-widest">Self Mirror</span>
          </div>
        </motion.div>
      </div>

      {/* Bottom Controls */}
      <div className="h-32 bg-gradient-to-t from-black/80 to-transparent backdrop-blur-xl border-t border-white/5 flex items-center justify-center gap-10 relative z-[100]">
        
        {/* Secondary Controls Left */}
        <div className="absolute left-12 flex items-center gap-4">
           <button className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:bg-white/10 hover:text-white transition-all">
              <Maximize size={20} />
           </button>
        </div>

        <div className="flex items-center gap-8">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleMute}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all border shadow-lg ${
              isMuted 
                ? "bg-rose-500 border-rose-500 text-white shadow-rose-500/20" 
                : "bg-white/10 border-white/10 text-white hover:bg-white/20"
            }`}
          >
            {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={leaveCall}
            className="w-20 h-20 rounded-[2.5rem] bg-rose-600 text-white flex items-center justify-center shadow-2xl shadow-rose-600/40 hover:bg-rose-500 transition-colors"
          >
            <PhoneOff size={32} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleVideo}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all border shadow-lg ${
              isVideoOff 
                ? "bg-rose-500 border-rose-500 text-white shadow-rose-500/20" 
                : "bg-white/10 border-white/10 text-white hover:bg-white/20"
            }`}
          >
            {isVideoOff ? <VideoOff size={24} /> : <Video size={24} />}
          </motion.button>
        </div>

        {/* Secondary Controls Right */}
        <div className="absolute right-12 flex items-center gap-4">
           <div className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
              <Zap size={14} className="text-indigo-400" />
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest text-center">Ultra HD<br/><span className="text-[8px] text-white/50">Streaming</span></span>
           </div>
        </div>
      </div>
    </motion.div>
  );
};

export default VideoCallOverlay;
