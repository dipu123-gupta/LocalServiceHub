import { Lock } from "lucide-react";
import { motion } from "framer-motion";

const PasswordInput = ({ label, value, onChange }) => (
  <div className="flex flex-col gap-2.5 group">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 group-focus-within:text-indigo-600 transition-colors">
      {label}
    </label>
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors z-10 pointer-events-none">
         <Lock size={18} className="stroke-[2]" />
      </div>
      
      <input
        type="password"
        required
        minLength={6}
        placeholder="••••••••"
        value={value}
        onChange={onChange}
        className="w-full h-14 bg-slate-50 border-2 border-slate-100 rounded-2xl py-3.5 pl-14 pr-6 text-sm font-bold text-slate-900 outline-none focus:border-indigo-600 focus:bg-white focus:shadow-2xl focus:shadow-indigo-500/10 transition-all placeholder:text-slate-200"
      />
      
      {/* Premium focus ring accent */}
      <motion.div 
        layoutId="input-glow"
        className="absolute inset-0 rounded-2xl border-2 border-indigo-600/0 group-focus-within:border-indigo-600/10 pointer-events-none transition-all duration-500"
      />
    </div>
  </div>
);

export default PasswordInput;
