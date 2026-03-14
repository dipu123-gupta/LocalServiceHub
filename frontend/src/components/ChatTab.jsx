import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import api from "../services/api";
import {
  Send,
  User,
  Loader2,
  MessageSquare,
  Clock,
  Video as VideoIcon,
  Search,
  MoreVertical,
  Hash
} from "lucide-react";
import { useSocket } from "../store/context/SocketContext";
import { useVideoCall } from "../store/context/VideoCallContext";
import { motion, AnimatePresence } from "framer-motion";

const ChatTab = () => {
  const { userInfo } = useSelector((s) => s.auth);
  const socket = useSocket();
  const { callUser } = useVideoCall();
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loadingChats, setLoadingChats] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const scrollRef = useRef();

  useEffect(() => {
    if (!socket) return;

    socket.on("newMessage", (msg) => {
      if (
        activeChat &&
        (msg.sender._id === activeChat._id ||
          msg.recipient._id === activeChat._id)
      ) {
        setMessages((prev) => [...prev, msg]);
      }
      fetchChats();
    });

    fetchChats();

    return () => {
      socket.off("newMessage");
    };
  }, [activeChat, socket]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchChats = async () => {
    setLoadingChats(true);
    try {
      const { data } = await api.get("/chat/list");
      setChats(data);
    } catch (err) {
      console.error("Error fetching chats", err);
    } finally {
      setLoadingChats(false);
    }
  };

  const fetchMessages = async (user) => {
    setActiveChat(user);
    setLoadingMessages(true);
    try {
      const { data } = await api.get(`/chat/${user._id}`);
      setMessages(data);
    } catch (err) {
      console.error("Error fetching messages", err)
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;

    try {
      const { data } = await api.post("/chat", {
        recipientId: activeChat._id,
        message: newMessage,
      });
      setMessages((prev) => [...prev, data]);
      setNewMessage("");
      fetchChats();
    } catch (err) {
      console.error("Error sending message", err);
    }
  };

  return (
    <div className="flex h-[650px] bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden relative">
      <div className="w-[340px] border-r border-slate-50 flex flex-col bg-slate-50/50">
        <div className="p-8 border-b border-slate-50 bg-white">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-black text-slate-900 leading-none">Inboxes</h3>
            <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
              <MessageSquare size={18} />
            </div>
          </div>
          <div className="relative group">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
            <input 
              type="text" 
              placeholder="Search conversations..."
              className="w-full bg-slate-100 border-none rounded-2xl py-3 pl-11 pr-4 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-indigo-100 transition-all outline-none placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
          {loadingChats && chats.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 gap-3">
              <Loader2 size={32} className="text-indigo-600 animate-spin" />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Loading chats...</p>
            </div>
          ) : chats.length === 0 ? (
            <div className="text-center p-12 space-y-4">
              <div className="w-16 h-16 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto">
                <Hash size={24} className="text-slate-300" />
              </div>
              <p className="text-sm font-bold text-slate-400">No active conversations yet.</p>
            </div>
          ) : (
            chats.map((chat) => (
              <motion.div
                layout
                key={chat.user._id}
                onClick={() => fetchMessages(chat.user)}
                className={`p-4 rounded-[1.5rem] flex gap-4 items-center cursor-pointer transition-all ${
                  activeChat?._id === chat.user._id
                    ? "bg-white shadow-xl shadow-slate-200/50 border border-slate-100 ring-1 ring-indigo-50"
                    : "hover:bg-white hover:shadow-lg transition-all"
                }`}
              >
                <div className="relative shrink-0">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-black shadow-inner ${
                    activeChat?._id === chat.user._id ? "bg-indigo-600 text-white" : "bg-white text-indigo-600 border border-slate-100"
                  }`}>
                    {chat.user.name?.[0]?.toUpperCase()}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-black text-slate-900 text-sm truncate pr-2">
                      {chat.user.name}
                    </span>
                    <span className="text-[10px] font-black text-slate-400 uppercase">
                      {new Date(chat.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-500 truncate">
                    {chat.lastMessage}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-slate-50/30">
        {activeChat ? (
          <>
            <div className="px-8 py-5 bg-white border-b border-slate-50 flex items-center justify-between z-10 shadow-sm relative">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-base font-black border border-indigo-100 shadow-sm">
                  {activeChat.name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <h4 className="font-black text-slate-900 leading-tight">{activeChat.name}</h4>
                  <div className="flex items-center gap-1.5 text-[0.65rem] font-bold text-emerald-500 uppercase tracking-widest mt-0.5">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    Online
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => callUser(activeChat._id, activeChat.name)}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-[1.25rem] text-xs font-black shadow-lg shadow-indigo-200 hover:bg-slate-900 transition-all flex items-center gap-2 group active:scale-95"
                >
                  <VideoIcon size={16} className="group-hover:rotate-12 transition-transform" />
                  Video Call
                </button>
                <button className="p-3 text-slate-400 hover:text-slate-600 transition-colors">
                  <MoreVertical size={20} />
                </button>
              </div>
            </div>

            <div
              ref={scrollRef}
              className="flex-1 p-10 overflow-y-auto custom-scrollbar flex flex-col gap-8"
            >
              {loadingMessages ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-slate-300">
                  <Loader2 size={40} className="animate-spin text-indigo-200" />
                  <p className="text-[10px] font-black uppercase tracking-[0.2em]">Syncing history</p>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {messages.map((msg, idx) => (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      key={msg._id || idx}
                      className={`flex flex-col ${
                        msg.sender._id === userInfo._id ? "items-end" : "items-start"
                      }`}
                    >
                      <div className="flex items-end gap-3 max-w-[80%]">
                        {msg.sender._id !== userInfo._id && (
                          <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 shadow-sm flex items-center justify-center text-xs font-black text-indigo-400 shrink-0">
                            {activeChat?.name?.[0]}
                          </div>
                        )}
                        <div
                          className={`px-6 py-4 rounded-[1.8rem] text-sm font-bold shadow-sm leading-relaxed ${
                            msg.sender._id === userInfo._id
                              ? "bg-slate-900 text-white rounded-br-none"
                              : "bg-white text-slate-700 border border-slate-100 rounded-bl-none"
                          }`}
                        >
                          {msg.message}
                        </div>
                      </div>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2 px-1">
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            <form
              onSubmit={handleSendMessage}
              className="p-8 bg-white border-t border-slate-50 flex gap-4 items-center"
            >
              <div className="flex-1 relative flex items-center">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Ask a question or share details..."
                  className="w-full bg-slate-50 border-2 border-slate-50 focus:border-indigo-100 focus:bg-white rounded-[1.5rem] py-4 pl-6 pr-14 text-sm font-bold text-slate-900 outline-none transition-all placeholder:text-slate-400 ring-0 shadow-inner"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className={`absolute right-2 w-11 h-11 rounded-[1.1rem] flex items-center justify-center transition-all ${
                    !newMessage.trim() 
                      ? "bg-slate-100 text-slate-300 cursor-not-allowed" 
                      : "bg-indigo-600 text-white shadow-lg shadow-indigo-100 hover:bg-slate-900 active:scale-90"
                  }`}
                >
                  <Send size={18} />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-20 text-center">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative mb-12"
            >
              <div className="absolute inset-0 bg-indigo-500/10 blur-[80px] rounded-full" />
              <div className="relative w-32 h-32 bg-white rounded-[3rem] border border-slate-100 shadow-2xl flex items-center justify-center text-slate-200">
                <MessageSquare size={48} strokeWidth={1.5} />
              </div>
            </motion.div>
            <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">Conversations with Experts</h3>
            <p className="text-slate-400 font-bold max-w-[320px] text-sm leading-relaxed">
              Select a professional from your inboxes to discuss project details or start a video consultation.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatTab;
