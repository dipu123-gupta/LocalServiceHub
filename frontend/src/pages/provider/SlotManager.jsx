import React, { useState, useEffect } from "react";
import { 
  Calendar, 
  Clock, 
  Save, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Clock3,
  ChevronRight,
  ShieldCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/utils/api";

const SlotManager = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedDays, setSelectedDays] = useState([]);
  const [slots, setSlots] = useState([]);

  // Professional Slots (2-hour windows)
  const defaultSlots = [
    { id: 1, startTime: "08:00", endTime: "10:00", label: "Morning" },
    { id: 2, startTime: "10:00", endTime: "12:00", label: "Late Morning" },
    { id: 3, startTime: "12:00", endTime: "14:00", label: "Early Afternoon" },
    { id: 4, startTime: "14:00", endTime: "16:00", label: "Late Afternoon" },
    { id: 5, startTime: "16:00", endTime: "18:00", label: "Evening" },
    { id: 6, startTime: "18:00", endTime: "20:00", label: "Late Evening" },
  ];

  const weekDays = [
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
  ];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get("/service-providers/profile");
      setProfile(data);
      setSelectedDays(data.availability?.days || []);
      
      // If no slots exist, initialize with default slots (all unblocked)
      if (!data.availability?.slots || data.availability.slots.length === 0) {
        setSlots(defaultSlots.map(s => ({ ...s, isBlocked: false })));
      } else {
        // Map saved slots to labels for UI
        setSlots(data.availability.slots.map(s => {
          const matchingDefault = defaultSlots.find(d => d.startTime === s.startTime);
          return { ...s, label: matchingDefault?.label || "Power Slot" };
        }));
      }
    } catch (err) {
      console.error("Failed to load profile", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleDay = (day) => {
    setSelectedDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const toggleSlot = (id) => {
    setSlots(prev => prev.map(s => 
      s.id === id ? { ...s, isBlocked: !s.isBlocked } : s
    ));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put("/service-providers/availability-slots", {
        days: selectedDays,
        slots: slots.map(({ startTime, endTime, isBlocked }) => ({ startTime, endTime, isBlocked }))
      });
      alert("Professional availability updated successfully!");
    } catch (err) {
      console.error("Failed to save", err);
      alert("Failed to update availability.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 size={40} className="text-indigo-600 animate-spin" />
        <p className="text-sm font-black text-slate-400 uppercase tracking-widest">
          Syncing Professional Schedule...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Slot <span className="text-indigo-600 dark:text-indigo-400">Manager</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold mt-2">
            Configure your professional availability with 2-hour granular booking windows.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-10 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-3xl font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-indigo-600 dark:hover:bg-indigo-500 hover:text-white transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
          {saving ? "Optimizing..." : "Commit Changes"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Days Selection */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-6 md:p-8 shadow-sm transition-colors">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Calendar size={20} />
              </div>
              <div>
                <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-tight text-sm">Working Days</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select your active days</p>
              </div>
            </div>
            
            <div className="space-y-2">
              {weekDays.map(day => (
                <button
                  key={day}
                  onClick={() => toggleDay(day)}
                  className={`w-full p-4 rounded-2xl flex items-center justify-between group transition-all ${
                    selectedDays.includes(day)
                      ? "bg-indigo-600 text-white shadow-xl shadow-indigo-100 dark:shadow-none"
                      : "bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <span className="font-black text-xs uppercase tracking-widest">{day}</span>
                  {selectedDays.includes(day) ? (
                    <CheckCircle2 size={16} />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-slate-200 dark:border-slate-700" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/10 rounded-3xl p-6 border border-amber-100/50 dark:border-amber-900/20 flex gap-4">
            <AlertCircle className="text-amber-500 shrink-0" size={20} />
            <p className="text-[10px] font-bold text-amber-700 dark:text-amber-400 leading-relaxed uppercase tracking-widest">
              Blocking a slot will prevent customers from booking you during those hours across all active days.
            </p>
          </div>
        </div>

        {/* Slots Grid */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[2rem] md:rounded-[3rem] border border-slate-100 dark:border-slate-800 p-6 md:p-10 shadow-sm transition-colors">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-900/30 rounded-3xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Clock3 size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Time Slots</h3>
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Configure your professional windows</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {slots.map((slot, idx) => (
              <motion.button
                key={slot.id || idx}
                onClick={() => toggleSlot(slot.id)}
                whileHover={{ y: -4 }}
                className={`p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border-2 transition-all text-left relative overflow-hidden group ${
                  slot.isBlocked
                    ? "bg-slate-50 dark:bg-slate-800/50 border-transparent opacity-60 grayscale"
                    : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-indigo-600 dark:hover:border-indigo-400 shadow-xl shadow-slate-100/50 dark:shadow-none"
                }`}
              >
                {!slot.isBlocked && (
                  <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-50 dark:bg-indigo-900/20 rounded-bl-full -mr-4 -mt-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
                
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                    slot.isBlocked ? "bg-slate-200 dark:bg-slate-700 text-slate-400" : "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                  }`}>
                    <Clock size={18} />
                  </div>
                  <div>
                    <h4 className={`text-sm font-black uppercase tracking-widest transition-colors ${
                      slot.isBlocked ? "text-slate-400" : "text-slate-900 dark:text-white"
                    }`}>
                      {slot.startTime} - {slot.endTime}
                    </h4>
                    <p className={`text-[10px] font-bold mt-1 transition-colors ${
                      slot.isBlocked ? "text-slate-300" : "text-slate-400"
                    }`}>
                      {slot.label}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <div className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-colors ${
                    slot.isBlocked 
                      ? "bg-slate-200 dark:bg-slate-700 text-slate-500" 
                      : "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
                  }`}>
                    {slot.isBlocked ? "Blocked" : "Available"}
                  </div>
                  {!slot.isBlocked && (
                    <ChevronRight size={14} className="text-slate-300 group-hover:text-indigo-600 transition-colors" />
                  )}
                </div>
              </motion.button>
            ))}
          </div>

          <div className="mt-12 p-6 md:p-8 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-[2rem] md:rounded-[2.5rem] border border-indigo-100 dark:border-indigo-800/50 flex flex-col md:flex-row items-center gap-8">
            <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-3xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm shrink-0">
              <ShieldCheck size={28} />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h5 className="font-black text-slate-900 dark:text-white uppercase tracking-tight text-sm">Professional Warranty</h5>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                By maintaining accurate slots, you ensure a premium experience for your customers and maintain a high professional ranking on HomeServiceHub.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlotManager;
