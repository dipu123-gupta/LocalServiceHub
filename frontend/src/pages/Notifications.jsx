import React, { useState, useEffect } from "react";
import PageHeader from "../components/PageHeader";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, ShieldCheck, Tag, Info, Calendar, Loader2, CheckCircle, CheckCheck, Inbox, MessageSquare, Star, AlertCircle } from "lucide-react";
import api from "@/utils/api";
import { useSelector } from "react-redux";

const typeConfig = {
  booking_confirmed: { icon: Calendar, color: "text-indigo-600", bg: "bg-indigo-50", label: "Booking" },
  booking_cancelled: { icon: AlertCircle, color: "text-rose-600", bg: "bg-rose-50", label: "Cancelled" },
  booking_completed: { icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50", label: "Completed" },
  payment: { icon: Tag, color: "text-blue-600", bg: "bg-blue-50", label: "Payment" },
  review: { icon: Star, color: "text-amber-600", bg: "bg-amber-50", label: "Review" },
  system: { icon: Info, color: "text-slate-600", bg: "bg-slate-50", label: "System" },
  chat: { icon: MessageSquare, color: "text-violet-600", bg: "bg-violet-50", label: "Message" },
};

const Notifications = () => {
  const { userInfo } = useSelector((s) => s.auth);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get("/notifications");
      setNotifications(data);
      setUnreadCount(data.filter((n) => !n.isRead).length);
    } catch (err) {
      console.error("Could not load notifications", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo) fetchNotifications();
  }, [userInfo]);

  const markAllRead = async () => {
    try {
      await api.put("/notifications/readall");
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  const markOneRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-24">
      <PageHeader
        title="Account Activity"
        description="Monitor your bookings, interactions, and stay updated with the platform alerts in real-time."
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div className="p-10 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white sticky top-0 z-30 gap-6">
            <div className="flex items-center gap-4">
               <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                  <Bell size={24} />
               </div>
               <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Recent Alerts</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 rounded-full bg-indigo-500" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                       {unreadCount} Unread Notifications
                    </p>
                  </div>
               </div>
            </div>
            
            {unreadCount > 0 && (
              <button 
                onClick={markAllRead}
                className="group flex items-center gap-3 px-6 py-3 bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95"
              >
                <CheckCheck size={16} className="transition-transform group-hover:scale-110" />
                Mark all read
              </button>
            )}
          </div>

          <div className="min-h-[400px]">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-40 gap-4">
                <Loader2 size={48} className="text-indigo-600 animate-spin" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Syncing Feed...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-32 px-12 text-center">
                <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                  <Inbox className="text-slate-200" size={48} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-3">Quiet morning!</h3>
                <p className="text-slate-400 font-bold max-w-xs mx-auto text-sm leading-relaxed">
                  You don't have any notifications right now. We'll alert you when there's an update to your bookings.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                <AnimatePresence initial={false}>
                  {notifications.map((notif, index) => {
                    const config = typeConfig[notif.type] || typeConfig.system;
                    return (
                      <motion.div
                        key={notif._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => !notif.isRead && markOneRead(notif._id)}
                        className={`group p-8 flex gap-6 transition-all cursor-pointer relative ${notif.isRead ? "bg-white opacity-70" : "bg-indigo-50/10 hover:bg-indigo-50/20"}`}
                      >
                        {!notif.isRead && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600" />
                        )}
                        
                        <div
                          className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-white transition-transform group-hover:scale-110 ${config.bg} ${config.color}`}
                        >
                          <config.icon size={24} />
                        </div>
                        
                        <div className="flex-grow min-w-0">
                          <div className="flex justify-between items-start mb-2">
                             <div>
                                <div className="flex items-center gap-3 mb-1">
                                   <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg ${config.bg} ${config.color}`}>
                                      {config.label}
                                   </span>
                                   <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                                      {new Date(notif.createdAt).toLocaleDateString("en-IN", {
                                        day: "numeric", month: "short"
                                      })} • {new Date(notif.createdAt).toLocaleTimeString("en-IN", {
                                        hour: "2-digit", minute: "2-digit"
                                      })}
                                   </span>
                                </div>
                                <h4 className={`text-lg tracking-tight ${notif.isRead ? "font-bold text-slate-600" : "font-black text-slate-900"}`}>
                                  {notif.title}
                                </h4>
                             </div>
                             {!notif.isRead && (
                               <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-lg shadow-indigo-200 mt-2" />
                             )}
                          </div>
                          <p className={`text-sm leading-relaxed max-w-2xl ${notif.isRead ? "text-slate-400 font-medium" : "text-slate-600 font-bold"}`}>
                            {notif.message}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-12 text-center">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">System Health: Fully Operational • End-to-End Encrypted</p>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
