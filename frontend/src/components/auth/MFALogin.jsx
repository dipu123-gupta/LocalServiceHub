import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authService } from "../../services/authService";
import { setCredentials, clearMFARequired } from "../../store/authSlice";
import { ShieldAlert, Loader2, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

const MFALogin = () => {
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const { mfaRequired } = useSelector((state) => state.auth);

  if (!mfaRequired) return null;

  const handleVerify = async (e) => {
    e.preventDefault();
    if (token.length !== 6) return toast.error("Please enter a 6-digit code");

    setIsLoading(true);
    try {
      const userData = await authService.loginVerifyMFA(mfaRequired.userId, token);
      dispatch(setCredentials(userData));
      dispatch(clearMFARequired());
      toast.success(`Welcome back, ${userData.name}!`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid authentication code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    dispatch(clearMFARequired());
  };

  return (
    <div className="min-h-[500px] flex items-center justify-center py-12 px-6">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-10 shadow-2xl shadow-indigo-100 dark:shadow-none">
        <button 
          onClick={handleBack}
          className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Login
        </button>

        <div className="flex items-center justify-center w-20 h-20 bg-indigo-50 dark:bg-indigo-900/30 rounded-3xl mx-auto mb-8">
          <ShieldAlert className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
        </div>

        <h3 className="text-2xl font-black text-slate-900 dark:text-white text-center mb-2">
          Identity Verification
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-10 leading-relaxed">
          Your account is protected by 2FA. Please enter the code from your authenticator app for <span className="font-bold text-indigo-600 dark:text-indigo-400">{mfaRequired.email}</span>.
        </p>

        <form onSubmit={handleVerify} className="space-y-6">
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">
              Authentication Code
            </label>
            <input
              type="text"
              maxLength={6}
              value={token}
              onChange={(e) => setToken(e.target.value.replace(/\D/g, ""))}
              placeholder="000000"
              className="w-full h-16 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl px-4 text-center text-3xl font-black tracking-[0.5em] text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all font-mono"
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-16 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-black rounded-2xl transition-all shadow-xl shadow-indigo-200 dark:shadow-none flex items-center justify-center gap-3"
          >
            {isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              "Confirm Identity"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MFALogin;
