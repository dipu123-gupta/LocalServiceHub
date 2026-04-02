import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../store/authSlice";
import { authService } from "../services/authService";
import { googleSignIn } from "../utils/firebase.config.js";
import { Mail, Lock, User, ArrowRight, CheckCircle, Gift, Info, ShieldCheck, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import InputField from "../components/common/InputField";
import Button from "../components/common/Button";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const ref = params.get("ref");
    if (ref) setReferralCode(ref.toUpperCase());
  }, [location]);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((s) => s.auth);

  useEffect(() => {
    if (userInfo) navigate("/");
  }, [navigate, userInfo]);

  const googleLoginHandler = async () => {
    setIsLoading(true);
    setError("");
    try {
      const firebaseUser = await googleSignIn();
      const idToken = await firebaseUser.getIdToken();
      const data = await authService.googleAuth(idToken);
      dispatch(setCredentials(data));
      navigate("/");
    } catch (err) {
      setError(
        err.extractedMessage ||
          err.message ||
          "Google registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const data = await authService.register({
        name,
        email,
        password,
        referralCode,
      });
      if (data.requiresOTP) {
        setShowOTP(true);
        setError(""); 
      } else {
        dispatch(setCredentials(data));
        navigate("/");
      }
    } catch (err) {
      setError(
        err.extractedMessage ||
          err.message ||
          "Registration failed. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const otpSubmitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const data = await authService.verifyOTP({ email, otp });
      dispatch(setCredentials(data));
      navigate("/");
    } catch (err) {
      setError(
        err.extractedMessage ||
          err.message ||
          "OTP Verification failed. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const perks = [
    "Book 30+ home services",
    "Track bookings in real time",
    "Secure online payments",
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0C10] px-4 py-20 relative overflow-hidden">
      {/* Premium Background Mesh */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-600/5 blur-[100px]" />
      </div>

      <div className="w-full max-w-[500px] relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
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
            Join the Community
          </h1>
          <p className="text-slate-500 font-medium font-medium">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors"
            >
              Sign in here
            </Link>
          </p>
        </motion.div>

        {/* Dynamic Perks */}
        <div className="flex flex-wrap justify-center gap-3 mb-10 text-center">
          {perks.map((p, i) => (
            <motion.div
              key={p}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + (i * 0.1) }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-400 shadow-sm"
            >
              <CheckCircle size={12} className="text-emerald-500" /> {p}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white/[0.03] backdrop-blur-3xl rounded-[2.5rem] p-6 md:p-12 border border-white/10 shadow-2xl relative"
        >
          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 mb-8 flex items-start gap-4 animate-shake"
            >
              <div className="bg-red-500 text-white rounded-full p-1 mt-0.5 shrink-0 shadow-lg shadow-red-500/20">
                <Info size={14} />
              </div>
              <p className="text-sm text-red-200 font-semibold leading-tight">{error}</p>
            </motion.div>
          )}

          {showOTP ? (
            <form onSubmit={otpSubmitHandler} className="flex flex-col gap-8">
               <div className="text-center mb-2">
                 <h2 className="text-2xl font-black text-white">Enter Verification Code</h2>
                 <p className="text-slate-400 text-sm mt-2">We sent a 6-digit code to <span className="font-bold text-indigo-400">{email}</span></p>
               </div>
               
               <div className="group">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block ml-1">6-Digit OTP</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-600 group-focus-within:text-indigo-400 transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    type="text"
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    maxLength={6}
                    className="w-full bg-white/[0.03] border border-white/10 text-white rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-indigo-500/50 focus:bg-white/[0.06] transition-all font-bold placeholder:text-slate-700 text-lg tracking-widest text-center"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-16 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-indigo-600/20"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Verify & Login
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
              
              <button 
                type="button"
                onClick={() => setShowOTP(false)}
                className="text-xs font-bold text-slate-500 hover:text-white transition-colors mt-2"
                disabled={isLoading}
              >
                Change Email Address
              </button>
            </form>
          ) : (
          <div className="flex flex-col w-full">
          <form onSubmit={submitHandler} className="flex flex-col gap-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block ml-1">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-600 group-focus-within:text-indigo-400 transition-colors">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-white/[0.03] border border-white/10 text-white rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-indigo-500/50 focus:bg-white/[0.06] transition-all font-bold placeholder:text-slate-700 text-sm"
                  />
                </div>
              </div>
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
                    className="w-full bg-white/[0.03] border border-white/10 text-white rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-indigo-500/50 focus:bg-white/[0.06] transition-all font-bold placeholder:text-slate-700 text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="group">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block ml-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-600 group-focus-within:text-indigo-400 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full bg-white/[0.03] border border-white/10 text-white rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-indigo-500/50 focus:bg-white/[0.06] transition-all font-bold placeholder:text-slate-700 text-sm"
                />
              </div>
            </div>

            <div className="group">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block ml-1">Referral Code (Optional)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-600 group-focus-within:text-indigo-400 transition-colors">
                  <Gift size={18} />
                </div>
                <input
                  type="text"
                  placeholder="CODE2024"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                  className="w-full bg-white/[0.03] border border-white/10 text-white rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-indigo-500/50 focus:bg-white/[0.06] transition-all font-bold placeholder:text-slate-700 text-sm"
                />
              </div>
            </div>

            <p className="text-[10px] text-slate-600 leading-relaxed font-medium px-1">
              By creating an account, you agree to our{" "}
              <Link to="/terms" className="text-indigo-400 font-bold hover:underline">Terms</Link>
              {" "}and{" "}
              <Link to="/privacy" className="text-indigo-400 font-bold hover:underline">Privacy Policy</Link>
              .
            </p>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-16 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-indigo-600/20"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#12141C] px-4 text-slate-500 font-bold tracking-widest">Or continue with</span>
              </div>
            </div>

            <button
              onClick={googleLoginHandler}
              disabled={isLoading}
              className="w-full h-16 bg-white/[0.03] border border-white/10 hover:bg-white/[0.08] text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all active:scale-95 transition-all"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </button>
          </div>
          </div>
          )}

          <div className="mt-10 pt-10 border-t border-white/5 flex flex-wrap justify-center gap-6">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">
              <ShieldCheck size={14} className="text-emerald-500" /> Secure Registration
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">
              <Sparkles size={14} className="text-indigo-400" /> Membership Perks
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
