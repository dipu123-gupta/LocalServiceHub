import React, { useState, useEffect } from "react";
import { authService } from "../../services/authService";
import { ShieldCheck, Loader2, KeyRound } from "lucide-react";
import toast from "react-hot-toast";

const MFASetup = ({ onComplete }) => {
  const [qrCode, setQrCode] = useState("");
  const [secret, setSecret] = useState("");
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    const fetchMFAData = async () => {
      try {
        const data = await authService.setupMFA();
        setQrCode(data.qrCode);
        setSecret(data.secret);
      } catch (err) {
        toast.error("Failed to setup MFA. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchMFAData();
  }, []);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (token.length !== 6) return toast.error("Please enter a 6-digit code");

    setIsVerifying(true);
    try {
      await authService.verifyMFA(token);
      toast.success("MFA Enabled Successfully!");
      if (onComplete) onComplete();
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid verification code");
    } finally {
      setIsVerifying(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-8 max-w-md mx-auto shadow-2xl shadow-slate-200/50 dark:shadow-none">
      <div className="flex items-center justify-center w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl mx-auto mb-6">
        <ShieldCheck className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
      </div>

      <h3 className="text-xl font-black text-slate-900 dark:text-white text-center mb-2">
        Secure Your Account
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-8">
        Scan the QR code below using Google Authenticator or Authy to enable Two-Factor Authentication.
      </p>

      <div className="bg-white p-4 rounded-xl border-2 border-indigo-100 dark:border-indigo-900/50 mb-8 flex justify-center">
        <img src={qrCode} alt="MFA QR Code" className="w-48 h-48" />
      </div>

      <div className="mb-8">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
          Or Enter Secret Manually
        </p>
        <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800">
          <KeyRound className="w-4 h-4 text-slate-400" />
          <code className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 tracking-wider">
            {secret}
          </code>
        </div>
      </div>

      <form onSubmit={handleVerify} className="space-y-4">
        <div>
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">
            Verification Code
          </label>
          <input
            type="text"
            maxLength={6}
            value={token}
            onChange={(e) => setToken(e.target.value.replace(/\D/g, ""))}
            placeholder="000000"
            className="w-full h-14 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl px-4 text-center text-2xl font-black tracking-[0.5em] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={isVerifying}
          className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-black rounded-xl transition-all shadow-lg shadow-indigo-200 dark:shadow-none flex items-center justify-center gap-2"
        >
          {isVerifying ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            "Verify & Enable"
          )}
        </button>
      </form>
    </div>
  );
};

export default MFASetup;
