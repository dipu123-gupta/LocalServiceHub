import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Briefcase, 
  CalendarCheck, 
  UserCircle, 
  Wallet, 
  Star, 
  MessageSquare, 
  ShieldCheck, 
  BadgeCheck,
  Menu,
  X,
  Bell,
  LogOut
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/authSlice";

const ProviderLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { userInfo } = useSelector((state) => state.auth);
  const location = useLocation();
  const dispatch = useDispatch();

  const menuItems = [
    { name: "Overview", path: "/provider/dashboard", icon: LayoutDashboard },
    { name: "My Services", path: "/provider/services", icon: Briefcase },
    { name: "Bookings", path: "/provider/bookings", icon: CalendarCheck },
    { name: "Earnings", path: "/provider/earnings", icon: Wallet },
    { name: "Reviews", path: "/provider/reviews", icon: Star },
    { name: "Messages", path: "/provider/messages", icon: MessageSquare },
    { name: "Membership", path: "/provider/membership", icon: BadgeCheck },
    { name: "Trust & Safety", path: "/provider/safety", icon: ShieldCheck },
    { name: "Profile", path: "/provider/profile", icon: UserCircle },
  ];

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={`${isSidebarOpen ? "w-72" : "w-20"} bg-white border-r border-slate-200 transition-all duration-300 flex flex-col z-30`}
      >
        <div className="p-6 flex items-center justify-between">
          <Link to="/" className={`flex items-center gap-2 ${!isSidebarOpen && "justify-center w-full"}`}>
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shrink-0">
              <span className="text-white font-black text-xl italic">H</span>
            </div>
            {isSidebarOpen && (
              <span className="font-black text-xl tracking-tighter text-slate-900 uppercase">
                Hub<span className="text-indigo-600">Pro</span>
              </span>
            )}
          </Link>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all group ${
                  isActive 
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon size={20} className={isActive ? "text-white" : "group-hover:scale-110 transition-transform"} />
                {isSidebarOpen && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={handleLogout}
            className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold text-sm text-rose-500 hover:bg-rose-50 transition-all w-full ${!isSidebarOpen && "justify-center"}`}
          >
            <LogOut size={20} />
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 z-20 sticky top-0">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2.5 text-slate-500 hover:bg-slate-100 rounded-xl transition-all"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              {menuItems.find(i => i.path === location.pathname)?.name || "Dashboard"}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
            </button>
            <div className="h-8 w-[1px] bg-slate-200 mx-2" />
            <div className="flex items-center gap-3 pl-2 group cursor-pointer">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-slate-900 leading-none">{userInfo?.name || "Provider Name"}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Verified Partner</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white font-black shadow-lg shadow-slate-200 overflow-hidden border-2 border-white ring-2 ring-slate-100">
                {userInfo?.profileImage ? (
                  <img src={userInfo.profileImage} alt="" className="w-full h-full object-cover" />
                ) : (
                  userInfo?.name?.[0].toUpperCase()
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-[1400px] mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProviderLayout;
