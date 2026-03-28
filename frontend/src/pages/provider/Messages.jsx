import React, { useState, useEffect, useRef } from "react";
import { 
  Send, 
  Search, 
  Phone, 
  Video, 
  MoreVertical, 
  User, 
  MessageSquare, 
  Clock, 
  Loader2,
  Paperclip,
  Smile,
  CheckCheck,
  Image as ImageIcon,
  ArrowLeft
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { useSocket } from "../../store/context/SocketContext";
import { useVideoCall } from "../../store/context/VideoCallContext";

const Messages = () => {
  const location = useLocation();
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);
  const { callUser } = useVideoCall();
  const socket = useSocket();
  const messagesEndRef = useRef(null);
  const [showChatMobile, setShowChatMobile] = useState(false);

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("newMessage", (msg) => {
      // If it's from the person we're talking to or we're the sender
      if (activeChat && (msg.sender._id === activeChat.user._id || msg.sender._id === userInfo._id)) {
        setMessages((prev) => [...prev, msg]);
      }
      fetchChats(); // Always refresh list for preview
    });

    return () => {
      socket.off("newMessage");
    };
  }, [activeChat, socket]);

  useEffect(() => {
    // If we're coming from another page with a recipientId
    if (location.state?.recipientId && !loading) {
      const { recipientId, recipientName } = location.state;
      
      const existingChat = chats.find(c => c.user._id === recipientId);
      if (existingChat) {
        if (activeChat?.user?._id !== recipientId) {
          setActiveChat(existingChat);
          fetchMessages(existingChat.user._id);
        }
        setShowChatMobile(true);
      } else {
        // Virtual chat for new recipient
        if (activeChat?.user?._id !== recipientId) {
          const mockChat = {
            user: { _id: recipientId, name: recipientName || "Customer" },
            lastMessage: "",
            isNew: true
          };
          setActiveChat(mockChat);
          setMessages([]);
        }
        setShowChatMobile(true);
      }
    }
  }, [location.state, chats, loading]);


  const fetchChats = async () => {
    try {
      const { data } = await api.get("/chat/list");
      setChats(data);
    } catch (err) {
      console.error("Failed to load chats", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (userId) => {
    try {
      const { data } = await api.get(`/chat/${userId}`);
      setMessages(data);
    } catch (err) {
      console.error("Failed to load messages", err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;

    setSending(true);
    try {
      const { data } = await api.post("/chat", {
        message: newMessage,
        recipientId: activeChat.user._id,
      });
      setMessages([...messages, data]);
      setNewMessage("");
      fetchChats();
    } catch (err) {
      console.error("Failed to send message", err);
    } finally {
      setSending(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 size={40} className="text-indigo-600 animate-spin" />
        <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Connecting to secured server...</p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-160px)] flex bg-white rounded-[3.5rem] border border-slate-100 shadow-2xl overflow-hidden relative">
      {/* Sidebar: Chat List */}
      <aside className={`w-full md:w-96 border-r border-slate-50 flex flex-col bg-slate-50/30 ${showChatMobile ? "hidden md:flex" : "flex"}`}>
        <div className="p-8 space-y-6">
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Conversations</h3>
          {/* ... search box ... */}
        </div>

        <div className="flex-1 overflow-y-auto px-4 custom-scrollbar space-y-2">
          {chats.map((chat) => {
            const isActive = activeChat?.user?._id === chat.user._id;
            return (
              <motion.button
                whileHover={{ x: 4 }}
                key={chat.user._id}
                onClick={() => {
                  setActiveChat(chat);
                  fetchMessages(chat.user._id);
                  setShowChatMobile(true);
                }}
                className={`w-full p-6 flex items-center gap-4 rounded-[2.5rem] transition-all relative group ${
                  isActive 
                    ? "bg-slate-900 text-white shadow-2xl shadow-slate-900/20" 
                    : "hover:bg-white hover:shadow-xl hover:shadow-slate-100"
                }`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black ${
                  isActive ? "bg-white/10 text-white" : "bg-indigo-50 text-indigo-600"
                } shadow-inner`}>
                  {chat.user.name?.[0].toUpperCase()}
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-black tracking-tight">{chat.user.name}</h4>
                    <span className={`text-[10px] font-bold ${isActive ? "text-slate-400" : "text-slate-400 uppercase tracking-widest"}`}>
                      {chat.createdAt ? new Date(chat.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                    </span>
                  </div>
                  <p className={`text-xs font-bold line-clamp-1 ${isActive ? "text-slate-400" : "text-slate-500"}`}>
                    {chat.lastMessage || "Start a new conversation"}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className={`flex-1 flex flex-col relative bg-white ${!showChatMobile ? "hidden md:flex" : "flex"}`}>
        {activeChat ? (
          <>
            {/* Chat Header */}
            <header className="p-8 border-b border-slate-50 flex items-center justify-between z-10 bg-white/80 backdrop-blur-md">
              <div className="flex items-center gap-6">
                <button 
                  onClick={() => setShowChatMobile(false)}
                  className="p-3 bg-slate-50 text-slate-500 rounded-xl hover:bg-slate-900 hover:text-white transition-all md:hidden"
                >
                  <ArrowLeft size={18} />
                </button>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-xl font-black shadow-sm">
                    {activeChat.user.name?.[0].toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">
                      {activeChat.user.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-[0.65rem] font-bold text-emerald-500 uppercase tracking-widest mt-0.5">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                      Online
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <button
                  onClick={() => callUser(activeChat.user._id, activeChat.user.name)}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-2xl text-xs font-black shadow-lg shadow-indigo-100 hover:bg-slate-900 transition-all flex items-center gap-2 group active:scale-95"
                >
                  <Video size={16} className="group-hover:rotate-12 transition-transform" />
                  Video Call
                </button>
                <button className="p-3 text-slate-400 hover:text-slate-900 transition-colors">
                  <MoreVertical size={20} />
                </button>
              </div>
            </header>

            {/* Messages Content */}
            <div className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed opacity-[0.4]">
              {messages.map((m, idx) => {
                const isMine = m.sender._id === userInfo._id;
                return (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    key={m._id}
                    className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                  >
                    <div className="max-w-[70%] space-y-2">
                       <div className={`p-6 rounded-[2rem] shadow-xl ${
                        isMine 
                          ? "bg-indigo-600 text-white rounded-tr-none shadow-indigo-100" 
                          : "bg-white text-slate-900 rounded-tl-none border border-slate-100 shadow-slate-200/50"
                      }`}>
                        <p className="text-sm font-bold leading-relaxed">{m.message}</p>
                      </div>
                      <div className={`flex items-center gap-2 px-2 ${isMine ? "justify-end" : "justify-start"}`}>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {isMine && <CheckCheck size={14} className="text-indigo-400" />}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <footer className="p-8 bg-white border-t border-slate-50 z-10">
              <form onSubmit={handleSendMessage} className="relative flex items-center gap-4">
                <div className="flex items-center gap-2 px-2 border-r border-slate-100 pr-4">
                  <button type="button" className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"><Smile size={20}/></button>
                  <button type="button" className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"><Paperclip size={20}/></button>
                </div>
                <input 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message here..."
                  className="flex-1 bg-slate-50 border border-slate-100 rounded-[2rem] py-5 px-8 text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-indigo-50 focus:bg-white transition-all shadow-inner"
                />
                <button 
                  type="submit"
                  disabled={!newMessage.trim() || sending}
                  className="w-16 h-16 bg-slate-900 text-white rounded-[1.8rem] flex items-center justify-center shadow-2xl hover:bg-indigo-600 transition-all active:scale-90 disabled:opacity-50 group"
                >
                  {sending ? <Loader2 size={24} className="animate-spin" /> : <Send size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                </button>
              </form>
            </footer>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-20 text-center space-y-8">
             <div className="w-32 h-32 bg-slate-50 text-indigo-200 rounded-[3rem] flex items-center justify-center border-2 border-dashed border-indigo-100 shadow-inner">
              <MessageSquare size={48} />
            </div>
            <div className="space-y-3">
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">Select a conversation</h3>
              <p className="text-slate-500 font-bold max-w-sm">Stay connected with your clients. Real-time updates and secure messaging are ready for you.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
               <div className="px-6 py-3 bg-indigo-50 text-indigo-600 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-indigo-100">End-to-End Encrypted</div>
               <div className="px-6 py-3 bg-emerald-50 text-emerald-600 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-emerald-100">Real-time Delivery</div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Messages;
