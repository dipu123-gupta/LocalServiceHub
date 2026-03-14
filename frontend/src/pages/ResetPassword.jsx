import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../store/authSlice";
import { authService } from "../services/authService";
import { Lock, ArrowRight, Loader2, ShieldCheck, Sparkles, ChevronLeft, KeyRound } from "lucide-react";
import { motion } from "framer-motion";
import PasswordInput from "../components/common/PasswordInput";
import Button from "../components/common/Button";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { resettoken } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((s) => s.auth);

  useEffect(() => {
    if (userInfo) navigate("/");
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      const data = await authService.resetPassword(resettoken, { password });
      dispatch(setCredentials(data));
      navigate("/");
    } catch (err) {
      setError(
        err.extractedMessage ||
          err.message ||
          "Reset failed. The link may have expired.",
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
            New Password
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-slate-400 font-medium"
          >
            Secure your account with a strong password.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group"
        >
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl mb-8 text-sm font-bold animate-shake text-center">
              {error}
            </div>
          )}
          
          <form onSubmit={submitHandler} className="space-y-8">
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">New Password</label>
                <PasswordInput
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white/[0.03] border-white/10 rounded-2xl h-14"
                  icon={KeyRound}
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Confirm Password</label>
                <PasswordInput
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-white/[0.03] border-white/10 rounded-2xl h-14"
                  icon={ShieldCheck}
                />
              </div>
            </div>

            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full h-16 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest text-[11px] shadow-xl shadow-indigo-600/20 active:scale-[0.98] transition-all"
            >
              Update Password <ArrowRight size={18} className="ml-2" />
            </Button>

            <div className="text-center pt-4">
              <Link to="/login" className="inline-flex items-center gap-2 text-slate-500 hover:text-white font-bold text-sm transition-colors">
                <ChevronLeft size={16} /> Back to Login
              </Link>
            </div>
          </form>
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
              <span className="text-[10px] font-black text-white uppercase tracking-widest">Protected</span>
           </div>
           <div className="h-4 w-px bg-white/5" />
           <div className="flex items-center gap-2 opacity-40 grayscale hover:grayscale-0 transition-all cursor-default">
              <Sparkles size={16} className="text-white" />
              <span className="text-[10px] font-black text-white uppercase tracking-widest">Secure Reset</span>
           </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ResetPassword;
