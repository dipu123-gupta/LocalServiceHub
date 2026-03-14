import { useState } from "react";
import { Link } from "react-router-dom";
import { authService } from "../services/authService";
import { Mail, ArrowRight, Loader2, CheckCircle2, ShieldCheck, Sparkles, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../components/common/Button";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      await authService.forgotPassword(email);
      setSuccess(true);
    } catch (err) {
      setError(
        err.extractedMessage ||
          err.message ||
          "Could not send reset link. Try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0c] selection:bg-indigo-500/30 p-6 relative overflow-hidden">
      {/* Mesh Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/" className="inline-flex items-center gap-3 group mb-8">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-2xl shadow-lg shadow-indigo-500/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                🏠
              </div>
              <span className="text-2xl font-black text-white tracking-tighter">
                Home<span className="text-indigo-500">ServiceHub</span>
              </span>
            </Link>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl font-black text-white mb-3 tracking-tight"
          >
            Forgot Password?
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-slate-400 font-medium"
          >
            No worries, we'll send you reset instructions.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group"
        >
          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center py-4"
              >
                <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-8 relative">
                   <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping opacity-20" />
                   <CheckCircle2 size={40} className="text-emerald-500" />
                </div>
                <h3 className="text-2xl font-black text-white mb-4 tracking-tight">Check your email</h3>
                <p className="text-slate-400 font-medium leading-relaxed mb-10 max-w-[280px] mx-auto">
                  We've sent a password reset link to <span className="text-indigo-400 font-bold">{email}</span>.
                </p>
                <div className="space-y-4">
                   <Button
                      onClick={() => setSuccess(false)}
                      variant="secondary"
                      className="w-full h-14 rounded-2xl border-white/10 text-white font-black uppercase tracking-widest text-[10px] hover:bg-white/5"
                   >
                     Try another email
                   </Button>
                   <Link to="/login" className="inline-flex items-center gap-2 text-slate-400 hover:text-white font-bold text-sm transition-colors pt-4">
                     <ChevronLeft size={16} /> Back to Login
                   </Link>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl mb-8 text-sm font-bold animate-shake text-center">
                    {error}
                  </div>
                )}
                
                <form onSubmit={submitHandler} className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Email Address</label>
                    <div className="relative group/input">
                      <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 group-focus-within/input:opacity-100 transition-opacity" />
                      <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-indigo-500 transition-colors" size={20} />
                      <input
                        type="email"
                        required
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full h-14 bg-white/[0.03] border border-white/10 rounded-2xl pl-14 pr-6 text-white placeholder:text-slate-600 focus:outline-none focus:bg-white/[0.05] focus:border-indigo-500/50 transition-all font-medium"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    isLoading={isLoading}
                    className="w-full h-16 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest text-[11px] shadow-xl shadow-indigo-600/20 active:scale-[0.98] transition-all"
                  >
                    Reset Password <ArrowRight size={18} className="ml-2" />
                  </Button>

                  <div className="text-center pt-4">
                    <Link to="/login" className="inline-flex items-center gap-2 text-slate-500 hover:text-white font-bold text-sm transition-colors">
                      <ChevronLeft size={16} /> Back to Login
                    </Link>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* trust Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-10 flex items-center justify-center gap-6"
        >
           <div className="flex items-center gap-2 opacity-40 grayscale hover:grayscale-0 transition-all cursor-default">
              <ShieldCheck size={16} className="text-white" />
              <span className="text-[10px] font-black text-white uppercase tracking-widest">Secure Link</span>
           </div>
           <div className="h-4 w-px bg-white/5" />
           <div className="flex items-center gap-2 opacity-40 grayscale hover:grayscale-0 transition-all cursor-default">
              <Sparkles size={16} className="text-white" />
              <span className="text-[10px] font-black text-white uppercase tracking-widest">Fast Recovery</span>
           </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;
