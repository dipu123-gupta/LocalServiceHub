import { useState, useEffect } from "react";
import api from "@/utils/api";

const useAdminData = (userInfo) => {
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [pendingProviders, setPendingProviders] = useState([]);
  const [cities, setCities] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [stats, setStats] = useState({
    financials: { totalRevenue: 0, totalCommission: 0, totalBookings: 0 },
    statusBreakdown: [],
  });
  const [paymentTransactions, setPaymentTransactions] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      const [uRes, cRes, sRes, pRes, cityRes, statsRes, aRes, bRes, ptRes] =
        await Promise.all([
          api.get("/users"),
          api.get("/categories"),
          api.get("/services"),
          api.get("/service-providers/pending"),
          api.get("/cities"),
          api.get("/bookings/admin/stats"),
          api.get("/announcements"),
          api.get("/bookings"),
          api.get("/bookings/admin/transactions"),
        ]);
      setUsers(uRes.data);
      setCategories(cRes.data);
      setServices(sRes.data);
      setPendingProviders(pRes.data);
      setCities(cityRes.data);
      setStats(statsRes.data);
      setAnnouncements(aRes.data);
      setBookings(bRes.data);
      setPaymentTransactions(ptRes.data);

      const [wRes] = await Promise.all([api.get("/withdrawals")]);
      setWithdrawals(wRes.data);
    } catch (err) {
      console.error("Failed to load admin data", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo && userInfo.role === "admin") {
      fetchAllData();
    }
  }, [userInfo]);

  return {
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
    setStats,
    announcements,
    setAnnouncements,
    bookings,
    setBookings,
    paymentTransactions,
    setPaymentTransactions,
    isLoading,
    fetchAllData,
  };
};

export default useAdminData;
