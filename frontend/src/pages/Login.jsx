import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../store/authSlice";
import { authService } from "../services/authService";
import { Mail, Lock, ArrowRight, Info, ShieldCheck, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import InputField from "../components/common/InputField";
import Button from "../components/common/Button";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const data = await authService.login({ email, password });

      if (!data.isEmailVerified && data.role !== "admin") {
        setError(
          "Please verify your email before logging in. Check your inbox for the verification link.",
        );
        setIsLoading(false);
        return;
      }

      dispatch(setCredentials(data));
      navigate("/");
    } catch (err) {
      setError(
        err.extractedMessage ||
          err.message ||
          "Login failed. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0C10] px-4 py-20 relative overflow-hidden">
      {/* Premium Background Mesh */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[70%] h-[70%] rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-600/5 blur-[100px]" />
      </div>

      <div className="w-full max-w-[480px] relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <Link to="/" className="inline-flex items-center gap-3 mb-8 group">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-xl shadow-[0_0_20px_rgba(79,70,229,0.4)] group-hover:scale-110 transition-transform duration-500">
              🏠
            </div>
            <span className="text-3xl font-black text-white tracking-tight">
              Home<span className="text-indigo-400">Hub</span>
            </span>
          </Link>
          <h1 className="text-4xl font-black text-white tracking-tight mb-3">
            Welcome Back
          </h1>
          <p className="text-slate-500 font-medium">
            New here?{" "}
            <Link
              to="/register"
              className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors"
            >
              Start your journey today
            </Link>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white/[0.03] backdrop-blur-3xl rounded-[3rem] p-10 md:p-12 border border-white/10 shadow-2xl relative"
        >
          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 mb-8 flex items-start gap-4"
            >
              <div className="bg-red-500 text-white rounded-full p-1 mt-0.5 shrink-0 shadow-lg shadow-red-500/20">
                <Info size={14} />
              </div>
              <p className="text-sm text-red-200 font-semibold leading-tight">{error}</p>
            </motion.div>
          )}

          <form onSubmit={submitHandler} className="flex flex-col gap-8">
            <div className="space-y-6">
              <div className="group">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block ml-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-600 group-focus-within:text-indigo-400 transition-colors">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-white/[0.03] border border-white/10 text-white rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-indigo-500/50 focus:bg-white/[0.06] transition-all font-bold placeholder:text-slate-700"
                  />
                </div>
              </div>

              <div className="group">
                <div className="flex justify-between items-center mb-2 px-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Password</label>
                  <Link to="/forgot-password" size="sm" className="text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition-colors">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-600 group-focus-within:text-indigo-400 transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-white/[0.03] border border-white/10 text-white rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-indigo-500/50 focus:bg-white/[0.06] transition-all font-bold placeholder:text-slate-700"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-16 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-indigo-600/20 mt-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Connect Now
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-10 border-t border-white/5 flex flex-wrap justify-center gap-6">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">
              <ShieldCheck size={14} className="text-emerald-500" /> Secure Login
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">
              <Sparkles size={14} className="text-indigo-400" /> Trusted Platform
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
