import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, 
  Upload, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Loader2, 
  X,
  Lock,
  ExternalLink,
  Info,
  BadgeCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../services/api";

const Safety = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get("/service-providers/profile");
      setProfile(data);
    } catch (err) {
      console.error("Failed to load safety data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("document", selectedFile);

    try {
      await api.post("/service-providers/documents", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      alert("Document uploaded successfully for review!");
      fetchProfile();
      setSelectedFile(null);
    } catch (err) {
      console.error("Upload failed", err);
      alert("Upload failed. Please ensure the file is under 5MB and a valid format.");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 size={40} className="text-indigo-600 animate-spin" />
        <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Verifying security protocols...</p>
      </div>
    );
  }

  const documentStatus = profile?.isVerified ? "Verified" : (profile?.documents?.length > 0 ? "Under Review" : "Action Required");

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Trust <span className="text-indigo-600">& Safety</span>
          </h1>
          <p className="text-slate-500 font-bold mt-2">
            Secure your account and build customer confidence through verification.
          </p>
        </div>
        <div className="hidden lg:flex items-center gap-3 px-6 py-4 bg-white border border-slate-100 rounded-3xl shadow-sm">
          <BadgeCheck className="text-emerald-500" size={24} />
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-1">Account Standing</p>
            <p className="text-sm font-black text-slate-900">{profile?.isVerified ? "Premium Verified" : "Verification Pending"}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {/* Identity Verification Status */}
          <section className="bg-white rounded-[3.5rem] border border-slate-100 shadow-xl overflow-hidden relative group">
             <div className={`absolute top-0 right-0 w-3 w-full h-2 ${
               profile?.isVerified ? 'bg-emerald-500' : (profile?.documents?.length > 0 ? 'bg-amber-500' : 'bg-rose-500')
             }`} />
             <div className="p-12 space-y-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-[1.5rem] flex items-center justify-center shadow-inner">
                      <ShieldCheck size={28} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Identity Verification</h3>
                  </div>
                  <div className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest ${
                    profile?.isVerified ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                  }`}>
                    {documentStatus}
                  </div>
                </div>

                <p className="text-sm font-bold text-slate-500 leading-relaxed">
                  To maintain a safe marketplace, we require all partners to verify their government-issued identity documents. This data is encrypted and used only for internal background checks.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-8 bg-slate-50/50 rounded-[2.5rem] border border-slate-50 flex items-center gap-6">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${profile?.isVerified ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400 shadow-inner'}`}>
                      <CheckCircle2 size={24} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900 leading-tight">Govt. Photo ID</h4>
                      <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{profile?.isVerified ? "Completed" : "Awaiting Upload"}</p>
                    </div>
                  </div>
                  <div className="p-8 bg-slate-50/50 rounded-[2.5rem] border border-slate-50 flex items-center gap-6">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm">
                      <Clock size={24} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900 leading-tight">Exp. Approval</h4>
                      <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{profile?.isVerified ? "Standard Done" : "Within 48 Hours"}</p>
                    </div>
                  </div>
                </div>
             </div>
          </section>

          {/* Document Upload Section */}
          <section className="bg-slate-900 rounded-[3.5rem] p-12 text-white relative overflow-hidden shadow-2xl shadow-indigo-100">
             <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/10 blur-[100px] -mr-40 -mt-40" />
             <div className="relative z-10 space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white">
                    <Upload size={24} />
                  </div>
                  <h3 className="text-xl font-black tracking-tight">Requirement Checklist</h3>
                </div>

                <div className="space-y-4">
                  {[
                    "Original copy of Aadhaar Card or PAN Card",
                    "Clear selfie holding the identity document",
                    "Current address proof (Light bill or Rent agreement)",
                    "Maximum file size 5MB (JPG, PNG or PDF)"
                  ].map((req) => (
                    <div key={req} className="flex items-center gap-4 text-slate-400">
                      <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                      <span className="text-xs font-bold leading-relaxed">{req}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col md:flex-row gap-4 pt-4">
                  <label className="flex-1 px-8 py-5 bg-white/5 border-2 border-dashed border-white/20 hover:border-indigo-400 hover:bg-white/10 rounded-3xl transition-all flex items-center justify-center gap-3 cursor-pointer group">
                    <FileText size={20} className="text-indigo-400 group-hover:scale-120 transition-transform" />
                    <span className="text-xs font-black uppercase tracking-[0.2em]">{selectedFile ? selectedFile.name : "Choose Document"}</span>
                    <input type="file" className="hidden" onChange={handleFileChange} accept="image/*,.pdf" />
                  </label>
                  <button 
                    disabled={!selectedFile || uploading}
                    onClick={handleUpload}
                    className="md:w-56 py-5 bg-indigo-600 text-white rounded-3xl font-black text-xs uppercase tracking-[0.2em] hover:bg-white hover:text-indigo-600 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                  >
                    {uploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
                    {uploading ? "Uploading..." : "Submit"}
                  </button>
                </div>
             </div>
          </section>
        </div>

        <aside className="space-y-8">
          <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl p-8 space-y-8">
            <h4 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-3">
              <Lock className="text-indigo-400" size={18} />
              Privacy Matters
            </h4>
            <div className="space-y-6">
              <div className="p-6 bg-slate-50/50 rounded-2xl border border-slate-50">
                <p className="text-xs font-bold text-slate-500 leading-relaxed mb-4">You have {profile?.documents?.length || 0} documents safely stored in our encrypted vault.</p>
                <div className="flex flex-wrap gap-2">
                  {profile?.documents?.map((doc, i) => (
                    <div key={i} className="px-3 py-1.5 bg-white border border-slate-100 rounded-lg text-[10px] font-black text-indigo-600 uppercase tracking-widest shadow-sm">
                      Doc {i + 1}
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={16} />
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">Encrypted Storage</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={16} />
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">No shared data</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 rounded-[3rem] p-8 border border-amber-100 space-y-6 relative overflow-hidden group">
            <AlertTriangle className="absolute top-[-30px] right-[-30px] text-amber-100 group-hover:scale-125 transition-transform duration-700" size={120} />
            <h4 className="text-lg font-black text-amber-900 tracking-tight relative z-10">Account Warning</h4>
            <p className="text-xs font-bold text-amber-800 leading-relaxed relative z-10"> Failure to maintain correct documentation or providing false information can lead to immediate account suspension.</p>
            <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-amber-900 hover:gap-4 transition-all relative z-10">
              Read Safety Policy <ExternalLink size={14} />
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Safety;
