import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useSocket } from "../store/context/SocketContext";
import api from "@/utils/api";
import { Bell, Check, CheckCheck, X, Sparkles, Inbox } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const typeEmoji = {
  booking_confirmed: "📅",
  booking_cancelled: "❌",
  booking_completed: "✅",
  payment: "💳",
  review: "⭐",
  system: "🔔",
};

const NotificationBell = () => {
  const { userInfo } = useSelector((s) => s.auth);
  const socket = useSocket();
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const panelRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      const [notifsRes, countRes] = await Promise.all([
        api.get("/notifications"),
        api.get("/notifications/unread"),
      ]);
      setNotifications(notifsRes.data);
      setUnread(countRes.data.unreadCount);
    } catch (err) {
      console.error("Could not load notifications", err);
    }
  };

  useEffect(() => {
    if (!userInfo) return;
    fetchNotifications();
  }, [userInfo]);

  useEffect(() => {
    if (!socket) return;
    socket.on("newNotification", (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnread((prev) => prev + 1);
    });
    return () => socket.off("newNotification");
  }, [socket]);

  useEffect(() => {
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target))
        setIsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const markAllRead = async () => {
    try {
      await api.put("/notifications/readall");
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnread(0);
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
      setUnread((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
    }
  };

  if (!userInfo) return null;

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`relative w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 border ${
          isOpen 
            ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/20" 
            : "bg-white border-slate-100 text-slate-500 hover:bg-slate-50 hover:border-slate-200 shadow-sm"
        }`}
      >
        <Bell size={20} />
        <AnimatePresence>
          {unread > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1.5 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center border-2 border-white shadow-sm"
            >
              {unread > 9 ? "9+" : unread}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="absolute top-14 right-0 w-[calc(100vw-2rem)] sm:w-[400px] bg-white rounded-[2rem] sm:rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-indigo-900/10 z-[100] overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 md:p-8 border-b border-slate-50 flex items-center justify-between">
              <div>
                <h3 className="text-lg md:text-xl font-black text-slate-900 tracking-tight">Notifications</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
                  {unread} Unread Items
                </p>
              </div>
              <div className="flex gap-2 md:gap-3">
                {unread > 0 && (
                  <button
                    onClick={markAllRead}
                    className="h-9 md:h-10 px-3 md:px-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-colors flex items-center gap-2"
                  >
                    <CheckCheck size={12} className="md:w-3.5 md:h-3.5" /> <span className="hidden xs:inline">Clear All</span>
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center bg-slate-50 hover:bg-slate-100 text-slate-400 rounded-xl transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="max-h-[420px] overflow-y-auto overscroll-contain py-2 custom-scrollbar">
              {notifications.length === 0 ? (
                <div className="py-24 px-10 text-center">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Inbox size={40} className="text-slate-200" />
                  </div>
                  <h4 className="text-lg font-black text-slate-900 mb-2">All caught up!</h4>
                  <p className="text-sm font-medium text-slate-400 max-w-[200px] mx-auto leading-relaxed">
                    No new notifications in your inbox right now.
                  </p>
                </div>
              ) : (
                notifications.map((n, i) => (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={n._id}
                    onClick={() => {
                      if (!n.isRead) markOneRead(n._id);
                    }}
                    className={`px-6 py-4 md:px-8 md:py-6 flex gap-4 md:gap-5 cursor-pointer transition-all border-b border-transparent last:border-none ${
                      n.isRead 
                        ? "bg-white hover:bg-slate-50/80 grayscale-[0.5] opacity-70" 
                        : "bg-indigo-50/5 hover:bg-indigo-50/10"
                    }`}
                  >
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-xl md:text-2xl shadow-sm flex-shrink-0 group-hover:scale-110 transition-transform">
                      {typeEmoji[n.type] || "🔔"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-1">
                        <h4 className={`text-sm tracking-tight truncate ${n.isRead ? "font-bold text-slate-600" : "font-black text-slate-900"}`}>
                          {n.title}
                        </h4>
                        {!n.isRead && (
                          <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-lg shadow-indigo-400/50 flex-shrink-0 mt-1.5" />
                        )}
                      </div>
                      <p className={`text-[11px] md:text-xs leading-relaxed mb-3 ${n.isRead ? "text-slate-400 font-medium" : "text-slate-500 font-bold"}`}>
                        {n.message}
                      </p>
                      <div className="flex items-center gap-3">
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                           {new Date(n.createdAt).toLocaleDateString("en-IN", {
                             day: "numeric",
                             month: "short",
                             hour: "2-digit",
                             minute: "2-digit",
                           })}
                         </span>
                         {n.isRead && (
                            <span className="flex items-center gap-1 text-[10px] font-black text-indigo-400 uppercase tracking-widest">
                               <Check size={10} strokeWidth={3} /> Read
                            </span>
                         )}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-4 md:p-6 bg-slate-50/50 border-t border-slate-50">
                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="w-full h-12 md:h-14 bg-white border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/30 text-slate-900 hover:text-indigo-600 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-[0.15em] md:tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-sm active:scale-[0.98]"
                >
                  <Sparkles size={14} /> View All Activity
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
