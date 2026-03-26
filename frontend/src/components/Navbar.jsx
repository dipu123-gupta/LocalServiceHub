import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
import {
  Menu,
  X,
  ChevronDown,
  User,
  BookOpen,
  LogOut,
  LayoutDashboard,
  Briefcase,
  Megaphone,
  Search,
  Bell,
  ShieldCheck,
  CreditCard,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSocket } from "../store/context/SocketContext";
import NotificationBell from "./NotificationBell";
import LocationSelector from "./LocationSelector";

const Navbar = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const socket = useSocket();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropOpen, setIsDropOpen] = useState(false);
  const [isCategoryDropOpen, setIsCategoryDropOpen] = useState(false);
  const [announcement, setAnnouncement] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const dropdownRef = useRef(null);
  const categoryRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropOpen(false);
      }
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setIsCategoryDropOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const logoutHandler = () => {
    dispatch(logout());
    setIsDropOpen(false);
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    if (!socket) return;
    socket.on("broadcastAnnouncement", (data) => {
      if (data.targetRole === "all" || data.targetRole === userInfo?.role) {
        setAnnouncement(data);
        setTimeout(() => setAnnouncement(null), 10000);
      }
    });
    return () => socket.off("broadcastAnnouncement");
  }, [socket, userInfo]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/services?search=${searchQuery}`);
      setSearchQuery("");
    }
  };

  const categories = [
    { label: "Cleaning", to: "/categories/cleaning" },
    { label: "Plumbing", to: "/categories/plumbing" },
    { label: "Electrical", to: "/categories/electrical" },
    { label: "Appliance Repair", to: "/categories/appliance-repair" },
    { label: "Painting", to: "/categories/painting" },
  ];

  return (
    <>
      <AnimatePresence>
        {announcement && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-indigo-600 text-white relative z-[1000] overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-center gap-3">
              <Megaphone size={16} />
              <div className="text-sm font-medium">
                <span className="font-bold mr-2">{announcement.title}:</span>
                {announcement.message}
              </div>
              <button
                onClick={() => setAnnouncement(null)}
                className="absolute right-4 p-1 rounded-full hover:bg-white/20 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <nav className="sticky top-0 z-[60] bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm px-4 lg:px-8 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-20">
          {/* Logo & Location */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-xl shadow-lg shadow-indigo-200 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                🏠
              </div>
              <span className="text-2xl font-black text-slate-900 tracking-tight hidden lg:block group-hover:text-indigo-600 transition-colors">
                Local<span className="text-indigo-600 group-hover:text-slate-900 transition-colors">ServiceHub</span>
              </span>
            </Link>
            <div className="hidden md:block">
              <LocationSelector />
            </div>
          </div>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-8">
            <Link
              to="/services"
              className="text-gray-600 hover:text-indigo-600 font-medium transition-colors"
            >
              Services
            </Link>
          </div>

          {/* Right Area: Search, Notifs, Auth */}
          <div className="flex items-center gap-4 lg:gap-6">
            <form
              onSubmit={handleSearch}
              className="hidden md:flex items-center relative"
            >
              <Search size={18} className="absolute left-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
              <input
                type="text"
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-2.5 w-64 xl:w-80 rounded-[1.25rem] border-2 border-transparent bg-gray-50/80 hover:bg-gray-100/80 focus:bg-white focus:outline-none focus:border-indigo-100 focus:ring-4 focus:ring-indigo-50/50 transition-all text-sm font-semibold placeholder:text-gray-400"
              />
            </form>

            {userInfo && <NotificationBell />}

            {userInfo ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropOpen(!isDropOpen)}
                  className="flex items-center gap-2.5 bg-white border border-slate-100 rounded-2xl pl-1.5 pr-4 py-1.5 hover:shadow-xl hover:shadow-indigo-100/50 hover:border-indigo-100 transition-all duration-300"
                >
                  <div className="w-9 h-9 rounded-xl overflow-hidden bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center text-white text-sm font-black shadow-md">
                    {userInfo.profileImage ? (
                      <img
                        src={userInfo.profileImage}
                        alt={userInfo.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = ""; // Fallback will show initials if img fails
                        }}
                      />
                    ) : (
                      userInfo.name?.charAt(0).toUpperCase()
                    )}
                    {!userInfo.profileImage && userInfo.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left hidden sm:block">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none mb-0.5">Account</p>
                    <p className="text-sm font-bold text-slate-900 leading-none">
                      {userInfo.name?.split(" ")[0]}
                    </p>
                  </div>
                  <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${isDropOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isDropOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 top-full mt-2 w-60 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden z-50"
                    >
                      <div className="p-4 border-b border-gray-50 bg-gray-50/50">
                        <p className="font-bold text-gray-900 truncate">
                          {userInfo.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {userInfo.email}
                        </p>
                      </div>

                      <div className="py-2">
                        {/* Common Links */}
                        <Link
                          to="/profile"
                          onClick={() => setIsDropOpen(false)}
                          className="px-4 py-2 flex items-center gap-3 text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                        >
                          <User size={16} /> My Profile
                        </Link>

                        {/* Provider Links */}
                        {userInfo.role === "provider" ||
                        userInfo.role === "admin" ? (
                          <>
                            {userInfo.role === "admin" && (
                              <Link
                                to="/admin/dashboard"
                                onClick={() => setIsDropOpen(false)}
                                className="px-4 py-2 flex items-center gap-3 text-sm font-black text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors"
                              >
                                <ShieldCheck size={16} /> Admin Panel
                              </Link>
                            )}
                            <Link
                              to="/provider/dashboard"
                              onClick={() => setIsDropOpen(false)}
                              className="px-4 py-2 flex items-center gap-3 text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                            >
                              <LayoutDashboard size={16} />{" "}
                              {userInfo.role === "admin"
                                ? "Provider View"
                                : "Dashboard"}
                            </Link>
                            <Link
                              to="/provider/services"
                              onClick={() => setIsDropOpen(false)}
                              className="px-4 py-2 flex items-center gap-3 text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                            >
                              <Briefcase size={16} /> My Services
                            </Link>
                            <Link
                              to="/provider/bookings"
                              onClick={() => setIsDropOpen(false)}
                              className="px-4 py-2 flex items-center gap-3 text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                            >
                              <BookOpen size={16} /> Job Bookings
                            </Link>
                            <Link
                              to="/provider/earnings"
                              onClick={() => setIsDropOpen(false)}
                              className="px-4 py-2 flex items-center gap-3 text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                            >
                              <CreditCard size={16} /> Earnings
                            </Link>
                          </>
                        ) : (
                          /* Customer Links */
                          <>
                            <Link
                              to="/bookings"
                              onClick={() => setIsDropOpen(false)}
                              className="px-4 py-2 flex items-center gap-3 text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                            >
                              <BookOpen size={16} /> My Bookings
                            </Link>
                            <Link
                              to="/wallet"
                              onClick={() => setIsDropOpen(false)}
                              className="px-4 py-2 flex items-center gap-3 text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                            >
                              <User size={16} /> Wallet
                            </Link>
                            <Link
                              to="/notifications"
                              onClick={() => setIsDropOpen(false)}
                              className="px-4 py-2 flex items-center gap-3 text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                            >
                              <Bell size={16} /> Notifications
                            </Link>
                          </>
                        )}
                      </div>

                      <div className="p-2 border-t border-gray-100">
                        <button
                          onClick={logoutHandler}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
                        >
                          <LogOut size={16} /> Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm font-bold text-gray-700 hover:text-indigo-600 px-3 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 rounded-full shadow-sm shadow-indigo-200 transition-all hover:shadow-md"
                >
                  Sign up
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden bg-white/95 backdrop-blur-xl border-b border-gray-100 absolute w-full z-[55] shadow-2xl p-6"
          >
            <div className="flex flex-col gap-3">
              <form onSubmit={handleSearch} className="mb-4 relative group">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors"
                />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-transparent bg-gray-50/80 focus:bg-white focus:outline-none focus:border-indigo-100 focus:ring-4 focus:ring-indigo-50 transition-all font-semibold"
                />
              </form>

              <Link
                to="/services"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-4 flex items-center justify-between font-black text-slate-800 hover:bg-indigo-50 hover:text-indigo-600 rounded-2xl transition-all group"
              >
                <span>Services</span>
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                  <Menu size={16} />
                </div>
              </Link>

              {!userInfo && (
                <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-3">
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-center p-3 font-bold text-gray-800 border border-gray-200 rounded-xl"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-center p-3 font-bold text-white bg-indigo-600 rounded-xl"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
