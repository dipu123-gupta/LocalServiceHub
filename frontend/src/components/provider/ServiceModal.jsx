import React, { useState, useEffect } from "react";
import { X, Upload, Plus, Trash2, Loader2, IndianRupee, Clock, ChevronDown, CheckCircle2, AlertCircle } from "lucide-react";
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-10 py-8 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              {service ? "Edit Listing" : "New Service"}
            </h3>
            <p className="text-sm font-bold text-slate-500 mt-1 uppercase tracking-widest text-[10px]">
              Fill in the details to publish your service
            </p>
          </div>
          <button onClick={onClose} className="p-3 bg-white text-slate-400 hover:text-rose-500 rounded-2xl shadow-sm transition-all border border-slate-100">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar space-y-8">
          <form id="serviceForm" onSubmit={handleSubmit} className="space-y-10">
            {/* Gallery */}
            <div className="space-y-4">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Service Gallery</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <AnimatePresence>
                  {previewImages.map((src, idx) => (
                    <motion.div 
                      key={src}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="aspect-square rounded-3xl relative group overflow-hidden border-2 border-slate-50"
                    >
                      <img src={src} className="w-full h-full object-cover" alt="" />
                      <button 
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute inset-0 bg-rose-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm"
                      >
                        <Trash2 size={24} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <label className="aspect-square rounded-3xl border-2 border-dashed border-slate-200 hover:border-indigo-600 hover:bg-indigo-50 transition-all flex flex-col items-center justify-center gap-3 cursor-pointer group">
                  <Upload size={24} className="text-slate-300 group-hover:text-indigo-600 group-hover:scale-110 transition-all" />
                  <span className="text-[10px] font-black text-slate-400 group-hover:text-indigo-600 uppercase tracking-tighter">Add Photo</span>
                  <input type="file" multiple onChange={handleImageChange} className="hidden" accept="image/*" />
                </label>
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Service Title</label>
                <input 
                  required
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Premium Bathroom Cleaning"
                  className="w-full bg-slate-50 border-2 border-slate-50 focus:border-indigo-100 focus:bg-white rounded-2xl py-4 px-6 text-sm font-bold text-slate-900 outline-none transition-all shadow-inner"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                <div className="relative">
                  <select
                    required
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full appearance-none bg-slate-50 border-2 border-slate-50 focus:border-indigo-100 focus:bg-white rounded-2xl py-4 px-6 text-sm font-bold text-slate-900 outline-none transition-all shadow-inner"
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

            {/* Pricing & Duration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-emerald-600">Pricing (INR)</label>
                <div className="relative">
                  <IndianRupee size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-500" />
                  <input 
                    required
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="999"
                    className="w-full bg-emerald-50/30 border-2 border-emerald-50/50 focus:border-emerald-100 focus:bg-white rounded-2xl py-4 pl-12 pr-6 text-sm font-black text-slate-900 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-indigo-600">Duration (Minutes)</label>
                <div className="relative">
                  <Clock size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-indigo-500" />
                  <input 
                    required
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    placeholder="60"
                    className="w-full bg-indigo-50/30 border-2 border-indigo-50/50 focus:border-indigo-100 focus:bg-white rounded-2xl py-4 pl-12 pr-6 text-sm font-black text-slate-900 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Detail Description</label>
              <textarea 
                required
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="What does this service include? Highlight your expertise..."
                className="w-full bg-slate-50 border-2 border-slate-50 focus:border-indigo-100 focus:bg-white rounded-3xl py-4 px-6 text-sm font-bold text-slate-900 outline-none transition-all shadow-inner resize-none"
              />
            </div>

            {/* Features & Tags */}
            <div className="space-y-3 p-8 bg-amber-50/50 rounded-[2.5rem] border border-amber-100">
              <div className="flex items-center gap-2 mb-2 text-amber-700">
                <AlertCircle size={14} />
                <label className="text-[10px] font-black uppercase tracking-widest leading-none">Highlights & Areas</label>
              </div>
              <div className="space-y-4">
                <div>
                  <input 
                    name="features"
                    value={formData.features}
                    onChange={handleChange}
                    placeholder="Features (comma separated: Eco-friendly, 3-Month Warranty)"
                    className="w-full bg-white/60 border border-amber-100 focus:border-amber-300 rounded-xl py-3 px-5 text-xs font-bold text-slate-700 outline-none transition-all"
                  />
                </div>
                <div>
                  <input 
                    name="cities"
                    value={formData.cities}
                    onChange={handleChange}
                    placeholder="Operation Cities (comma separated: Kolkata, Delhi)"
                    className="w-full bg-white/60 border border-amber-100 focus:border-amber-300 rounded-xl py-3 px-5 text-xs font-bold text-slate-700 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Active Toggle */}
            <div className="flex items-center justify-between p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
              <div>
                <h4 className="text-sm font-black text-slate-900 tracking-tight">Active Status</h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Pause or resume this service listing</p>
              </div>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                className={`w-16 h-8 rounded-full pr-1 pl-1 transition-all duration-300 flex items-center ${
                  formData.isActive ? "bg-indigo-600 justify-end" : "bg-slate-200 justify-start"
                }`}
              >
                <motion.div 
                  layout
                  className="w-6 h-6 bg-white rounded-full shadow-lg" 
                />
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-10 border-t border-slate-100 flex gap-4">
          <button 
            type="button"
            onClick={onClose}
            className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-sm hover:bg-slate-200 transition-all uppercase tracking-widest"
          >
            Discard
          </button>
          <button 
            form="serviceForm"
            disabled={submitting}
            className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-indigo-100 hover:bg-slate-900 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 uppercase tracking-widest"
          >
            {submitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                <CheckCircle2 size={18} />
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
