import React, { useState, useEffect } from "react";
import { X, Upload, Plus, Trash2, Loader2, IndianRupee, Clock, ChevronDown, CheckCircle2, AlertCircle, Sparkles, MapPin, Tag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/utils/api";

const ServiceModal = ({ service, isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    duration: "",
    category: "",
    features: "",
    cities: "Kolkata, Delhi, Mumbai", // Default cities
    isActive: true,
  });
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
    if (service) {
      setFormData({
        title: service.title,
        description: service.description,
        price: service.price,
        duration: service.duration,
        category: service.category?._id || service.category,
        features: service.features?.join(", ") || "",
        cities: service.cities?.join(", ") || "Kolkata, Delhi, Mumbai",
        isActive: service.isActive ?? true,
      });
      if (service.images) {
        setPreviewImages(service.images.map(img => img.url));
      }
    }
  }, [service]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/categories");
      setCategories(data);
    } catch (err) {
      console.error("Failed to load categories", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages([...images, ...files]);

    const previews = files.map(file => URL.createObjectURL(file));
    setPreviewImages([...previewImages, ...previews]);
  };

  const removeImage = (index) => {
    const updatedPreviews = [...previewImages];
    updatedPreviews.splice(index, 1);
    setPreviewImages(updatedPreviews);

    // If it's a new file being added
    if (images[index]) {
      const updatedImages = [...images];
      updatedImages.splice(index, 1);
      setImages(updatedImages);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const data = new FormData();
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });

    images.forEach(image => {
      data.append("images", image);
    });

    try {
      if (service) {
        await api.put(`/services/${service._id}`, data, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      } else {
        await api.post("/services", data, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Submission failed", err);
      alert(err.response?.data?.message || "Something went wrong. Please check your data.");
    } finally {
      setSubmitting(false);
    }
  };

  /* ---- shared input classes ---- */
  const inputBase = "w-full bg-slate-50 border border-slate-200 focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 rounded-lg py-2 px-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400";
  const labelBase = "text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
      />
      
      {/* Modal */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl relative z-10 overflow-hidden flex flex-col"
      >
        {/* ── Header ── */}
        <div className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <Sparkles size={18} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white leading-tight">
                {service ? "Edit Listing" : "New Service"}
              </h3>
              <p className="text-[11px] text-indigo-200">Fill in the details to publish your service</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 bg-white/15 text-white hover:bg-white/30 rounded-lg transition-all">
            <X size={18} />
          </button>
        </div>

        {/* ── Form Body ── */}
        <form id="serviceForm" onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 180px)' }}>
          
          {/* ROW 1 — Gallery + Basic Info side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            {/* Gallery — left 2 cols */}
            <div className="lg:col-span-2">
              <label className={labelBase}>
                <span className="flex items-center gap-1"><Upload size={12} className="text-indigo-500" /> Service Photos</span>
              </label>
              <div className="flex gap-2 flex-wrap">
                <AnimatePresence>
                  {previewImages.map((src, idx) => (
                    <motion.div 
                      key={src}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="w-16 h-16 rounded-lg relative group overflow-hidden border border-slate-200"
                    >
                      <img src={src} className="w-full h-full object-cover" alt="" />
                      <button 
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute inset-0 bg-rose-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      >
                        <Trash2 size={14} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <label className="w-16 h-16 rounded-lg border-2 border-dashed border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 transition-all flex flex-col items-center justify-center gap-1 cursor-pointer group">
                  <Upload size={16} className="text-slate-300 group-hover:text-indigo-500 transition-colors" />
                  <span className="text-[8px] font-bold text-slate-400 group-hover:text-indigo-600 uppercase">Add</span>
                  <input type="file" multiple onChange={handleImageChange} className="hidden" accept="image/*" />
                </label>
              </div>
            </div>

            {/* Title + Category — right 3 cols */}
            <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelBase}>Service Title</label>
                <input 
                  required
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Premium Bathroom Cleaning"
                  className={inputBase}
                />
              </div>
              <div>
                <label className={labelBase}>Category</label>
                <div className="relative">
                  <select
                    required
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`${inputBase} appearance-none pr-8`}
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
                </div>
              </div>
            </div>
          </div>

          {/* ROW 2 — Price, Duration, Description in 3 cols */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            <div>
              <label className={`${labelBase} !text-emerald-600`}>
                <span className="flex items-center gap-1"><IndianRupee size={11} /> Pricing (INR)</span>
              </label>
              <div className="relative">
                <IndianRupee size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500" />
                <input 
                  required
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="999"
                  className={`${inputBase} !bg-emerald-50/50 !border-emerald-200 focus:!border-emerald-400 focus:!ring-emerald-100 pl-8`}
                />
              </div>
            </div>

            <div>
              <label className={`${labelBase} !text-indigo-600`}>
                <span className="flex items-center gap-1"><Clock size={11} /> Duration (Mins)</span>
              </label>
              <div className="relative">
                <Clock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500" />
                <input 
                  required
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="60"
                  className={`${inputBase} !bg-indigo-50/50 !border-indigo-200 focus:!border-indigo-400 focus:!ring-indigo-100 pl-8`}
                />
              </div>
            </div>

            <div>
              <label className={labelBase}>Description</label>
              <textarea 
                required
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={1}
                placeholder="What does this service include?"
                className={`${inputBase} resize-none`}
                style={{ minHeight: '38px' }}
              />
            </div>
          </div>

          {/* ROW 3 — Features + Cities + Active Toggle */}
          <div className="grid grid-cols-1 lg:grid-cols-7 gap-3 items-end">
            {/* Features — 3 cols */}
            <div className="lg:col-span-3">
              <label className={labelBase}>
                <span className="flex items-center gap-1 text-amber-600"><Tag size={11} /> Features</span>
              </label>
              <input 
                name="features"
                value={formData.features}
                onChange={handleChange}
                placeholder="Eco-friendly, 3-Month Warranty"
                className={`${inputBase} !bg-amber-50/50 !border-amber-200 focus:!border-amber-400`}
              />
            </div>

            {/* Cities — 3 cols */}
            <div className="lg:col-span-3">
              <label className={labelBase}>
                <span className="flex items-center gap-1 text-violet-600"><MapPin size={11} /> Operation Cities</span>
              </label>
              <input 
                name="cities"
                value={formData.cities}
                onChange={handleChange}
                placeholder="Kolkata, Delhi, Mumbai"
                className={`${inputBase} !bg-violet-50/50 !border-violet-200 focus:!border-violet-400`}
              />
            </div>

            {/* Active Toggle — 1 col */}
            <div className="lg:col-span-1 flex flex-col items-center">
              <label className={`${labelBase} text-center`}>Active</label>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                className={`w-12 h-7 rounded-full px-0.5 transition-all duration-300 flex items-center ${
                  formData.isActive ? "bg-indigo-600 justify-end" : "bg-slate-300 justify-start"
                }`}
              >
                <motion.div 
                  layout
                  className="w-5 h-5 bg-white rounded-full shadow-md" 
                />
              </button>
            </div>
          </div>
        </form>

        {/* ── Footer ── */}
        <div className="px-5 py-3 border-t border-slate-100 flex gap-3 bg-slate-50 shrink-0">
          <button 
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-lg font-semibold text-sm hover:bg-slate-100 transition-all"
          >
            Discard
          </button>
          <button 
            form="serviceForm"
            disabled={submitting}
            className="flex-[2] py-2.5 bg-indigo-600 text-white rounded-lg font-semibold text-sm shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                <CheckCircle2 size={15} />
                {service ? "Save Changes" : "Create Listing"}
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ServiceModal;
