import { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { setCredentials, logout } from "../store/authSlice";
import api from "@/utils/api";
import {
  User,
  BookOpen,
  Settings,
  Star,
  LogOut,
  TrendingUp,
  MessageSquare,
  Wallet,
  Heart,
  Gift,
} from "lucide-react";

import WalletTab from "../components/WalletTab";
import ChatTab from "../components/ChatTab";
import FavoritesTab from "../components/FavoritesTab";
import ReferralTab from "../components/ReferralTab";
import UserOverviewTab from "../components/user/UserOverviewTab";
import UserBookingsTab from "../components/user/UserBookingsTab";
import UserReviewsTab from "../components/user/UserReviewsTab";
import UserProfileTab from "../components/user/UserProfileTab";
import UserMembershipTab from "../components/user/UserMembershipTab";
import UserSettingsTab from "../components/user/UserSettingsTab";
import Tabs from "../components/common/Tabs";
import Button from "../components/common/Button";
import Badge from "../components/common/Badge";
import Notifications from "./Notifications";

const Dashboard = () => {
  const { userInfo } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const location = useLocation();

  // Map paths to tab IDs
  const pathToTab = useMemo(() => ({
    "/dashboard": "overview",
    "/bookings": "bookings",
    "/reviews": "reviews",
    "/favorites": "favorites",
    "/messages": "chat",
    "/chat": "chat",
    "/wallet": "wallet",
    "/referrals": "referral",
    "/membership": "membership",
    "/profile": "profile",
    "/settings": "settings",
    "/notifications": "notifications"
  }), []);

  const [activeTab, setActiveTab] = useState(() => {
    return pathToTab[location.pathname] || "overview";
  });

  // Sync state with URL changes
  useEffect(() => {
    const tabId = pathToTab[location.pathname];
    if (tabId && tabId !== activeTab) {
      setActiveTab(tabId);
    }
  }, [location.pathname, pathToTab, activeTab]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    // Find the path for the tab and navigate if it exists
    const tabPath = Object.keys(pathToTab).find(path => pathToTab[path] === tabId);
    if (tabPath) {
      navigate(tabPath);
    } else if (tabId === "overview") {
      navigate("/dashboard");
    }
  };
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  // Profile form
  const [name, setName] = useState(userInfo?.name || "");
  const [phone, setPhone] = useState(userInfo?.phone || "");
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    userInfo?.profileImage || "",
  );

  // Wallet data for overview
  const [wallet, setWallet] = useState(null);

  // Password form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwLoading, setPwLoading] = useState(false);

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
      return;
    }
    if (activeTab === "overview") {
      fetchBookings();
      fetchWallet();
    }
    if (activeTab === "bookings") {
      fetchBookings();
    }
    if (activeTab === "reviews") {
      fetchReviews();
    }
  }, [activeTab, userInfo, navigate]);

  const fetchWallet = async () => {
    try {
      const { data } = await api.get("/wallet");
      setWallet(data);
    } catch (err) {
      console.error("Failed to fetch wallet", err);
    }
  };

  const fetchBookings = async () => {
    setBookingsLoading(true);
    try {
      const { data } = await api.get("/bookings/mybookings");
      setBookings(data);
    } catch (err) {
      console.error("Could not load bookings", err);
    } finally {
      setBookingsLoading(false);
    }
  };

  const fetchReviews = async () => {
    setReviewsLoading(true);
    try {
      const { data } = await api.get("/reviews/myreviews");
      setReviews(data);
    } catch (err) {
      console.error("Could not load reviews", err);
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileError("");
    setProfileSuccess(false);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("phone", phone);
      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

      const { data } = await api.put("/auth/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      dispatch(setCredentials({ ...userInfo, ...data }));
      setProfileSuccess(true);
      setProfileImage(null);
    } catch (err) {
      setProfileError(err.extractedMessage || "Update failed.");
    } finally {
      setProfileLoading(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
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

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await api.put(`/bookings/${bookingId}/cancel`);
      alert("Booking cancelled successfully.");
      fetchBookings(); // Refresh list
    } catch (err) {
      alert(err.extractedMessage || "Failed to cancel booking.");
    }
  };

  const totalSpent = bookings
    .filter((b) => b.status === "completed")
    .reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  const completedBookings = bookings.filter(
    (b) => b.status === "completed",
  ).length;

  const tabs = [
    { id: "overview", label: "Overview", icon: <TrendingUp size={16} /> },
    { id: "bookings", label: "Bookings", icon: <BookOpen size={16} /> },
    { id: "reviews", label: "Reviews", icon: <Star size={16} /> },
    { id: "favorites", label: "Favorites", icon: <Heart size={16} /> },
    { id: "chat", label: "Messages", icon: <MessageSquare size={16} /> },
    { id: "wallet", label: "Wallet", icon: <Wallet size={16} /> },
    { id: "referral", label: "Referrals", icon: <Gift size={16} /> },
    {
      id: "membership",
      label: "Plus Membership",
      icon: <Star size={16} className="text-yellow-500" />,
    },
    { id: "profile", label: "Profile", icon: <User size={16} /> },
    { id: "settings", label: "Settings", icon: <Settings size={16} /> },
  ];

  if (!userInfo) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-indigo-950 to-indigo-700 pt-16 pb-20 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-3xl font-black text-white border-4 border-white/20 shadow-xl">
              {userInfo.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-white leading-tight">
                Hello, {userInfo.name?.split(" ")[0]}! 👋
              </h1>
              <p className="text-indigo-200 mt-1 font-medium">{userInfo.email}</p>
              <div className="mt-3">
                <Badge variant={userInfo.role === "admin" ? "secondary" : "primary"} className="px-3 py-1">
                  {userInfo.role || "Customer"}
                </Badge>
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            icon={LogOut}
            className="border-white/20 text-white hover:bg-white/10 transition-all font-bold"
          >
            Logout
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-10 mb-20">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-[2rem] p-3 shadow-xl shadow-indigo-100/50 border border-indigo-50/50 mb-10 overflow-x-auto">
          <Tabs
            tabs={tabs}
            activeTab={activeTab}
            onChange={handleTabChange}
          />
        </div>

        {/* Tab Content */}
        <main className="min-h-[400px]">
          {activeTab === "overview" && (
            <UserOverviewTab
              bookings={bookings}
              completedBookings={completedBookings}
              wallet={wallet}
              reviews={reviews}
              totalSpent={totalSpent}
              bookingsLoading={bookingsLoading}
              navigate={navigate}
            />
          )}
          {activeTab === "notifications" && <Notifications />}
          {activeTab === "bookings" && (
            <UserBookingsTab
              bookings={bookings}
              bookingsLoading={bookingsLoading}
              navigate={navigate}
              onCancel={handleCancelBooking}
            />
          )}
          {activeTab === "reviews" && (
            <UserReviewsTab reviews={reviews} reviewsLoading={reviewsLoading} />
          )}
          {activeTab === "wallet" && <WalletTab userInfo={userInfo} />}
          {activeTab === "referral" && <ReferralTab />}
          {activeTab === "chat" && <ChatTab />}
          {activeTab === "favorites" && <FavoritesTab />}
          {activeTab === "membership" && (
            <UserMembershipTab userInfo={userInfo} navigate={navigate} />
          )}
          {activeTab === "profile" && (
            <UserProfileTab
              userInfo={userInfo}
              name={name}
              setName={setName}
              phone={phone}
              setPhone={setPhone}
              profileImage={profileImage}
              setProfileImage={setProfileImage}
              imagePreview={imagePreview}
              setImagePreview={setImagePreview}
              handleProfileUpdate={handleProfileUpdate}
              profileLoading={profileLoading}
              profileSuccess={profileSuccess}
              profileError={profileError}
            />
          )}
          {activeTab === "settings" && (
            <UserSettingsTab
              currentPassword={currentPassword}
              setCurrentPassword={setCurrentPassword}
              newPassword={newPassword}
              setNewPassword={setNewPassword}
              handlePasswordUpdate={handlePasswordUpdate}
              pwLoading={pwLoading}
              handleLogout={handleLogout}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
