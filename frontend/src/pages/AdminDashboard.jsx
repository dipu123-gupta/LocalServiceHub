import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Users,
  LayoutGrid,
  Briefcase,
  BarChart3,
  MapPin,
  ShieldCheck,
  Landmark,
  CreditCard,
  Send,
  Loader2,
  LayoutDashboard,
} from "lucide-react";

import useAdminData from "../hooks/admin/useAdminData";
import AdminOverviewTab from "../components/admin/AdminOverviewTab";
import AdminUsersTab from "../components/admin/AdminUsersTab";
import AdminCategoriesTab from "../components/admin/AdminCategoriesTab";
import AdminServicesTab from "../components/admin/AdminServicesTab";
import AdminVerificationsTab from "../components/admin/AdminVerificationsTab";
import AdminCitiesTab from "../components/admin/AdminCitiesTab";
import AdminWithdrawalsTab from "../components/admin/AdminWithdrawalsTab";
import AdminAnnouncementsTab from "../components/admin/AdminAnnouncementsTab";
import AdminBookingsTab from "../components/admin/AdminBookingsTab";
import AdminFinancialTab from "../components/admin/AdminFinancialTab";
import api from "../services/api";
import Tabs from "../components/common/Tabs";
import Button from "../components/common/Button";

const AdminDashboard = () => {
  const { userInfo } = useSelector((s) => s.auth);
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState(() => {
    const params = new URLSearchParams(location.search);
    return params.get("tab") || "overview";
  });

  // Sync state with URL changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabId = params.get("tab") || "overview";
    if (tabId !== activeTab) {
      setActiveTab(tabId);
    }
  }, [location.search, activeTab]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    navigate(`${location.pathname}?tab=${tabId}`);
  };

  const {
    users,
    setUsers,
    categories,
    setCategories,
    services,
    setServices,
    pendingProviders,
    setPendingProviders,
    cities,
    setCities,
    withdrawals,
    setWithdrawals,
    stats,
    announcements,
    bookings,
    setBookings,
    paymentTransactions,
    setPaymentTransactions,
    isLoading,
    fetchAllData,
  } = useAdminData(userInfo);

  // Form states
  const [catName, setCatName] = useState("");
  const [catIcon, setCatIcon] = useState("");
  const [showCatForm, setShowCatForm] = useState(false);

  // City form states
  const [cityName, setCityName] = useState("");
  const [cityState, setCityState] = useState("");
  const [showCityForm, setShowCityForm] = useState(false);

  const [announcementForm, setAnnouncementForm] = useState({
    title: "",
    message: "",
    targetRole: "all",
  });
  const [isSendingAnnouncement, setIsSendingAnnouncement] = useState(false);

  // Handlers
  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/users/${id}`);
      setUsers(users.filter((u) => u._id !== id));
    } catch (err) {
      alert(err.extractedMessage || "Delete failed");
    }
  };

  const handleToggleBlockUser = async (id) => {
    try {
      const { data } = await api.put(`/users/${id}/block`);
      setUsers(users.map((u) => (u._id === id ? data : u)));
    } catch (err) {
      alert(err.extractedMessage || "Action failed");
    }
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm("Delete this service?")) return;
    try {
      await api.delete(`/services/${id}`);
      setServices(services.filter((s) => s._id !== id));
    } catch (err) {
      alert(err.extractedMessage || "Delete failed");
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/categories", {
        name: catName,
        icon: catIcon,
      });
      setCategories([...categories, data]);
      setCatName("");
      setCatIcon("");
      setShowCatForm(false);
    } catch (err) {
      alert(err.extractedMessage || "Create failed");
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Delete category?")) return;
    try {
      await api.delete(`/categories/${id}`);
      setCategories(categories.filter((c) => c._id !== id));
    } catch (err) {
      alert(err.extractedMessage || "Delete failed");
    }
  };

  const handleToggleCategory = async (id) => {
    try {
      const { data } = await api.put(`/categories/${id}/toggle`);
      setCategories(categories.map((c) => (c._id === id ? data : c)));
    } catch (err) {
      alert("Toggle failed");
    }
  };

  const handleModerateService = async (id, moderationStatus) => {
    try {
      const { data } = await api.put(`/services/${id}/moderate`, {
        moderationStatus,
        isActive: moderationStatus === "approved",
      });
      setServices(services.map((s) => (s._id === id ? data : s)));
    } catch (err) {
      alert("Moderation update failed");
    }
  };

  const handleCreateCity = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/cities", {
        name: cityName,
        state: cityState,
      });
      setCities([...cities, data]);
      setCityName("");
      setCityState("");
      setShowCityForm(false);
    } catch (err) {
      alert(err.extractedMessage || "Create failed");
    }
  };

  const handleToggleCity = async (id, isAvailable) => {
    try {
      const { data } = await api.put(`/cities/${id}`, {
        isAvailable: !isAvailable,
      });
      setCities(cities.map((c) => (c._id === id ? data : c)));
    } catch (err) {
      alert("Update failed");
    }
  };

  const handleDeleteCity = async (id) => {
    if (!window.confirm("Delete city?")) return;
    try {
      await api.delete(`/cities/${id}`);
      setCities(cities.filter((c) => c._id !== id));
    } catch (err) {
      alert("Delete failed");
    }
  };

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    setIsSendingAnnouncement(true);
    try {
      await api.post("/announcements", announcementForm);
      setAnnouncementForm({ title: "", message: "", targetRole: "all" });
      fetchAllData();
      alert("Announcement sent successfully!");
    } catch (err) {
      alert(err.extractedMessage || "Failed to send announcement");
    } finally {
      setIsSendingAnnouncement(false);
    }
  };

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
      </div>
    );

  const tabs = [
    { id: "overview", label: "Stats Overview", icon: <BarChart3 size={18} /> },
    { id: "users", label: "Users", icon: <Users size={18} /> },
    { id: "bookings", label: "Bookings", icon: <Briefcase size={18} /> },
    { id: "categories", label: "Categories", icon: <LayoutGrid size={18} /> },
    { id: "services", label: "Services", icon: <Briefcase size={18} /> },
    {
      id: "verifications",
      label: "Verifications",
      icon: <ShieldCheck size={18} />,
    },
    { id: "cities", label: "Cities", icon: <MapPin size={18} /> },
    { id: "financials", label: "Financials", icon: <CreditCard size={18} /> },
    { id: "withdrawals", label: "Withdrawals", icon: <Landmark size={18} /> },
    { id: "announcements", label: "Announcements", icon: <Send size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 pt-16 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-5 mb-3">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 shadow-xl">
              <ShieldCheck size={32} className="text-indigo-400" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white tracking-tight">
                Admin Control Center
              </h1>
              <p className="text-slate-400 font-medium">
                Manage users, services, categories and platform performance.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-10 mb-20">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-[2rem] p-3 shadow-xl shadow-indigo-100/50 border border-indigo-50/50 mb-10 overflow-x-auto scrollbar-hide">
          <Tabs
            tabs={tabs}
            activeTab={activeTab}
            onChange={handleTabChange}
          />
        </div>

        {/* Tab Content */}
        <main className="min-h-[500px]">
          {activeTab === "overview" && (
            <AdminOverviewTab
              users={users}
              services={services}
              pendingProviders={pendingProviders}
              categories={categories}
              stats={stats}
              cities={cities}
              setActiveTab={setActiveTab}
              setShowCatForm={setShowCatForm}
            />
          )}

          {activeTab === "users" && (
            <AdminUsersTab
              users={users}
              handleDeleteUser={handleDeleteUser}
              handleToggleBlockUser={handleToggleBlockUser}
              userInfo={userInfo}
            />
          )}

          {activeTab === "bookings" && (
            <AdminBookingsTab bookings={bookings} fetchAllData={fetchAllData} />
          )}

          {activeTab === "categories" && (
            <AdminCategoriesTab
              categories={categories}
              showCatForm={showCatForm}
              setShowCatForm={setShowCatForm}
              catName={catName}
              setCatName={setCatName}
              catIcon={catIcon}
              setCatIcon={setCatIcon}
              handleCreateCategory={handleCreateCategory}
              handleDeleteCategory={handleDeleteCategory}
              handleToggleCategory={handleToggleCategory}
            />
          )}

          {activeTab === "services" && (
            <AdminServicesTab
              services={services}
              handleDeleteService={handleDeleteService}
              handleModerateService={handleModerateService}
            />
          )}

          {activeTab === "verifications" && (
            <AdminVerificationsTab
              pendingProviders={pendingProviders}
              setPendingProviders={setPendingProviders}
            />
          )}

          {activeTab === "cities" && (
            <AdminCitiesTab
              cities={cities}
              showCityForm={showCityForm}
              setShowCityForm={setShowCityForm}
              cityName={cityName}
              setCityName={setCityName}
              cityState={cityState}
              setCityState={setCityState}
              handleCreateCity={handleCreateCity}
              handleToggleCity={handleToggleCity}
              handleDeleteCity={handleDeleteCity}
            />
          )}

          {activeTab === "financials" && (
            <AdminFinancialTab
              transactions={paymentTransactions}
              stats={stats}
            />
          )}

          {activeTab === "withdrawals" && (
            <AdminWithdrawalsTab
              withdrawals={withdrawals}
              setWithdrawals={setWithdrawals}
            />
          )}

          {activeTab === "announcements" && (
            <AdminAnnouncementsTab
              announcements={announcements}
              announcementForm={announcementForm}
              setAnnouncementForm={setAnnouncementForm}
              isSendingAnnouncement={isSendingAnnouncement}
              handleCreateAnnouncement={handleCreateAnnouncement}
              fetchAllData={fetchAllData}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
