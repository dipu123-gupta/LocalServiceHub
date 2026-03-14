import React, { useState, useEffect } from "react";
import { 
  User, 
  Briefcase, 
  MapPin, 
  Phone, 
  Mail, 
  Save, 
  Loader2, 
  BadgeCheck, 
  Camera,
  Layers,
  Clock,
  Globe,
  CheckCircle2,
  AlertCircle,
  Building,
  ChevronDown,
  ShieldCheck,
  CreditCard,
  FileUp,
} from "lucide-react";
import { motion } from "framer-motion";
import api from "../../services/api";
import { useSelector, useDispatch } from "react-redux";
import { logout, setCredentials } from "../../store/authSlice";
import PasswordInput from "../../components/common/PasswordInput";
import Button from "../../components/common/Button";
import { Key } from "lucide-react";

const Profile = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    businessName: "",
    description: "",
    experience: "",
    serviceArea: "",
    category: "",
    name: "", // User level
    phone: "", // User level
    skills: "", // Comma separated for input
    bankDetails: {
      accountHolderName: "",
      accountNumber: "",
      ifscCode: "",
      bankName: "",
    },
  });

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwLoading, setPwLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [profileRes, categoriesRes] = await Promise.all([
        api.get("/service-providers/profile"),
        api.get("/categories")
      ]);
      
      const p = profileRes.data;
      setProfile(p);
      setCategories(categoriesRes.data);
      
      setFormData({
        businessName: p.businessName || "",
        description: p.description || "",
        experience: p.experience || "",
        serviceArea: p.serviceArea || "",
        category: p.category?._id || p.category || "",
        phone: userInfo?.phone || "",
        skills: p.skills?.join(", ") || "",
        bankDetails: {
          accountHolderName: p.bankDetails?.accountHolderName || "",
          accountNumber: p.bankDetails?.accountNumber || "",
          ifscCode: p.bankDetails?.ifscCode || "",
          bankName: p.bankDetails?.bankName || "",
        },
      });
    } catch (err) {
      console.error("Failed to load profile data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBankChange = (e) => {
    setFormData({
      ...formData,
      bankDetails: {
        ...formData.bankDetails,
        [e.target.name]: e.target.value
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.put("/service-providers/profile", formData);
      setProfile(data);
      
      // Update Redux userInfo with the updated name/phone from formData
      dispatch(setCredentials({
        ...userInfo,
        name: formData.name,
        phone: formData.phone
      }));

      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Update failed", err);
      alert("Failed to update profile. Please check your data.");
    } finally {
      setSaving(false);
    }
  };

  const [uploadingDoc, setUploadingDoc] = useState(false);

  const handleDocumentUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const docType = window.prompt("Enter Document Type (Identity Proof, Address Proof, Business License, Other):", "Identity Proof");
    if (!docType) return;

    setUploadingDoc(true);
    const data = new FormData();
    data.append("document", file);
    data.append("name", docType);

    try {
      await api.post("/service-providers/documents", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      alert("Document uploaded for verification!");
      fetchData(); // Refresh profile to show new document
    } catch (err) {
      alert("Upload failed. Try again.");
    } finally {
      setUploadingDoc(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      alert("Please provide both current and new passwords.");
      return;
    }
    setPwLoading(true);
    try {
      await api.put("/auth/update-password", {
        currentPassword,
        newPassword
      });
      alert("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      alert(err.extractedMessage || "Failed to update password.");
    } finally {
      setPwLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 size={40} className="text-indigo-600 animate-spin" />
        <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Loading your details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="flex items-center gap-8">
          <div className="relative group">
            <div className="w-32 h-32 rounded-[3rem] bg-slate-900 border-4 border-white shadow-2xl flex items-center justify-center text-white text-4xl font-black overflow-hidden ring-4 ring-slate-100 transition-transform duration-500 group-hover:scale-105">
              {userInfo?.profileImage ? (
                <img src={userInfo.profileImage} alt="" className="w-full h-full object-cover" />
              ) : (
                userInfo?.name?.[0].toUpperCase()
              )}
            </div>
            <button className="absolute -bottom-2 -right-2 p-3 bg-indigo-600 text-white rounded-2xl shadow-xl hover:bg-slate-900 transition-all border-4 border-white group-hover:translate-all active:scale-90">
              <Camera size={20} />
            </button>
          </div>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">{profile?.businessName}</h1>
              {profile?.isVerified && (
                <div className="p-1 bg-indigo-50 text-indigo-600 rounded-lg shadow-sm">
                  <BadgeCheck size={20} />
                </div>
              )}
            </div>
            <p className="text-slate-500 font-bold flex items-center gap-2">
              <Mail size={14} className="text-slate-400" />
              {userInfo?.email}
              <span className="w-1.5 h-1.5 rounded-full bg-slate-200 mx-2" />
              <span className="uppercase text-[10px] tracking-widest text-indigo-600 font-black">Partner Since {new Date(profile?.createdAt).getFullYear()}</span>
            </p>
          </div>
        </div>
        <button 
          form="profileForm"
          disabled={saving}
          className="px-10 py-5 bg-indigo-600 text-white rounded-3xl font-black shadow-2xl shadow-indigo-100 hover:bg-slate-900 transition-all flex items-center gap-3 group active:scale-95 disabled:opacity-50"
        >
          {saving ? <Loader2 size={24} className="animate-spin" /> : <Save size={24} />}
          {saving ? "SAVING..." : "SAVE CHANGES"}
        </button>
      </div>

      <form id="profileForm" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {/* Business Details */}
          <section className="bg-white rounded-[3rem] border border-slate-100 shadow-xl p-10 space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                <Building size={20} />
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Business Profile</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Business Registered Name</label>
                <input 
                  required
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border-2 border-slate-50 focus:border-indigo-100 focus:bg-white rounded-2xl py-4 px-6 text-sm font-bold text-slate-900 outline-none transition-all"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Primary Category</label>
                <div className="relative">
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full appearance-none bg-slate-50 border-2 border-slate-50 focus:border-indigo-100 focus:bg-white rounded-2xl py-4 px-6 text-sm font-bold text-slate-900 outline-none transition-all"
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Company Description</label>
              <textarea 
                rows={5}
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Talk about your services and professional experience..."
                className="w-full bg-slate-50 border-2 border-slate-50 focus:border-indigo-100 focus:bg-white rounded-3xl py-4 px-6 text-sm font-bold text-slate-900 outline-none transition-all resize-none"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Years of Experience</label>
                <div className="relative">
                  <Clock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    placeholder="e.g. 5"
                    className="w-full bg-slate-50 border-2 border-slate-50 focus:border-indigo-100 focus:bg-white rounded-2xl py-4 pl-14 pr-6 text-sm font-bold text-slate-900 outline-none transition-all"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Operating Area</label>
                <div className="relative">
                  <Globe className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    name="serviceArea"
                    value={formData.serviceArea}
                    onChange={handleChange}
                    placeholder="e.g. Kolkata North"
                    className="w-full bg-slate-50 border-2 border-slate-50 focus:border-indigo-100 focus:bg-white rounded-2xl py-4 pl-14 pr-6 text-sm font-bold text-slate-900 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Skills Tagging */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Professional Skills</label>
              <input 
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="e.g. Plumbing, Electrical, Deep Cleaning (comma separated)"
                className="w-full bg-slate-50 border-2 border-slate-50 focus:border-indigo-100 focus:bg-white rounded-2xl py-4 px-6 text-sm font-bold text-slate-900 outline-none transition-all"
              />
            </div>
          </section>

          {/* Bank Details */}
          <section className="bg-white rounded-[3rem] border border-slate-100 shadow-xl p-10 space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                <CreditCard size={20} />
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Financial & Settlements</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Account Holder Name</label>
                <input 
                  name="accountHolderName"
                  value={formData.bankDetails.accountHolderName}
                  onChange={handleBankChange}
                  className="w-full bg-slate-50 border-2 border-slate-50 focus:border-indigo-100 focus:bg-white rounded-2xl py-4 px-6 text-sm font-bold text-slate-900 outline-none transition-all"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Account Number</label>
                <input 
                  name="accountNumber"
                  value={formData.bankDetails.accountNumber}
                  onChange={handleBankChange}
                  className="w-full bg-slate-50 border-2 border-slate-50 focus:border-indigo-100 focus:bg-white rounded-2xl py-4 px-6 text-sm font-bold text-slate-900 outline-none transition-all"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Bank Name</label>
                <input 
                  name="bankName"
                  value={formData.bankDetails.bankName}
                  onChange={handleBankChange}
                  className="w-full bg-slate-50 border-2 border-slate-50 focus:border-indigo-100 focus:bg-white rounded-2xl py-4 px-6 text-sm font-bold text-slate-900 outline-none transition-all"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">IFSC Code</label>
                <input 
                  name="ifscCode"
                  value={formData.bankDetails.ifscCode}
                  onChange={handleBankChange}
                  className="w-full bg-slate-50 border-2 border-slate-50 focus:border-indigo-100 focus:bg-white rounded-2xl py-4 px-6 text-sm font-bold text-slate-900 outline-none transition-all uppercase"
                />
              </div>
            </div>
          </section>

          {/* Contact Details */}
          <section className="bg-white rounded-[3rem] border border-slate-100 shadow-xl p-10 space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                <User size={20} />
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Identity & Contact</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Public Name</label>
                <input 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border-2 border-slate-50 focus:border-indigo-100 focus:bg-white rounded-2xl py-4 px-6 text-sm font-bold text-slate-900 outline-none transition-all"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Verified Phone</label>
                <div className="relative">
                  <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border-2 border-slate-50 focus:border-indigo-100 focus:bg-white rounded-2xl py-4 pl-14 pr-6 text-sm font-bold text-slate-900 outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Password Section */}
          <section className="bg-white rounded-[3rem] border border-slate-100 shadow-xl p-10 space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                <ShieldCheck size={20} />
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Security & Password</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Password</label>
                <PasswordInput 
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  icon={Key}
                  className="bg-slate-50 border-2 border-slate-50 focus:border-indigo-100 focus:bg-white rounded-2xl h-14"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">New Password</label>
                <PasswordInput 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  icon={Key}
                  className="bg-slate-50 border-2 border-slate-50 focus:border-indigo-100 focus:bg-white rounded-2xl h-14"
                />
              </div>
            </div>
            <div className="flex justify-start">
              <Button
                onClick={handlePasswordUpdate}
                isLoading={pwLoading}
                className="px-8 rounded-2xl font-black text-xs uppercase tracking-widest"
              >
                Update Password
              </Button>
            </div>
          </section>
        </div>

        {/* Sidebar info */}
        <div className="space-y-8">
          <div className="bg-slate-900 rounded-[3rem] p-8 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[50px] -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
            <h4 className="text-lg font-black tracking-tight mb-6">Verification Status</h4>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 ${profile?.isVerified ? "bg-emerald-500" : "bg-amber-500"} rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform`}>
                  {profile?.isVerified ? <CheckCircle2 size={18} /> : <Clock size={18} />}
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest leading-none mb-1">{profile?.isVerified ? "Approved" : "Pending"}</p>
                  <p className="text-[10px] text-slate-400 font-bold leading-tight">{profile?.isVerified ? "All systems active" : "Documents under review"}</p>
                </div>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-[10px] font-bold text-slate-400 leading-relaxed italic">"Keep your profile complete to build trust with high-value customers."</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl p-8 space-y-6">
            <h4 className="text-lg font-black text-slate-900 tracking-tight">Verification Documents</h4>
            <div className="space-y-4">
              {profile?.documents?.map((doc, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <FileUp size={16} className="text-indigo-400" />
                    <div>
                      <p className="text-[10px] font-black text-slate-900 uppercase tracking-tight">{doc.name}</p>
                      <p className={`text-[8px] font-bold uppercase tracking-widest ${doc.status === 'approved' ? 'text-emerald-500' : doc.status === 'rejected' ? 'text-rose-500' : 'text-amber-500'}`}>
                        {doc.status}
                      </p>
                    </div>
                  </div>
                  <a href={doc.url} target="_blank" rel="noreferrer" className="p-2 bg-white rounded-lg shadow-sm hover:text-indigo-600 transition-colors">
                    <Globe size={12} />
                  </a>
                </div>
              ))}
              
              <label className={`flex flex-col items-center justify-center p-6 border-2 border-dashed border-indigo-100 rounded-[2rem] bg-indigo-50/30 hover:bg-indigo-50 transition-all cursor-pointer ${uploadingDoc ? 'opacity-50 pointer-events-none' : ''}`}>
                <FileUp className={`mb-2 ${uploadingDoc ? 'animate-bounce text-indigo-400' : 'text-indigo-200'}`} size={24} />
                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{uploadingDoc ? 'Uploading...' : 'Upload Document'}</span>
                <input type="file" onChange={handleDocumentUpload} className="hidden" />
              </label>
            </div>
          </div>

          <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl p-8 space-y-6">
            <h4 className="text-lg font-black text-slate-900 tracking-tight">Support Policy</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-indigo-400 shrink-0 mt-0.5" size={16} />
                <p className="text-xs font-bold text-slate-500 leading-relaxed">System updates to Business Name or Contact will take up to 24h to reflect across all listings.</p>
              </div>
              <div className="flex items-start gap-3">
                <Globe className="text-slate-300 shrink-0 mt-0.5" size={16} />
                <p className="text-xs font-bold text-slate-500 leading-relaxed">Your operating area helps our search engine match you with local customers.</p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Profile;
