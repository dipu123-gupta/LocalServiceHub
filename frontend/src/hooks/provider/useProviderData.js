import { useState, useEffect } from "react";
import api from "../../services/api";

const useProviderData = (userInfo) => {
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [providerProfile, setProviderProfile] = useState(null);
  const [providerServices, setProviderServices] = useState([]);
  const [categories, setCategories] = useState([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [withdrawals, setWithdrawals] = useState([]);
  const [withdrawalsLoading, setWithdrawalsLoading] = useState(false);
  const [providers, setProviders] = useState([]);
  const [providersLoading, setProvidersLoading] = useState(false);

  useEffect(() => {
    if (userInfo && (userInfo.role === "provider" || userInfo.role === "admin")) {
      fetchBookings();
      fetchReviews();
      fetchProviderProfile();
      fetchCategories();
      fetchWithdrawals();
      if (userInfo.role === "admin") {
        fetchProviders();
      }
    }
  }, [userInfo]);

  useEffect(() => {
    if (userInfo && (userInfo.role === "provider" || userInfo.role === "admin")) {
      fetchProviderServices();
    }
  }, [userInfo, providerProfile]);

  const fetchCategories = async () => {
    try {
      const { data } = await api.get("/categories");
      setCategories(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProviderServices = async () => {
    setServicesLoading(true);
    try {
      const { data } = await api.get("/services");
      if (userInfo.role === "admin") {
        setProviderServices(data);
      } else {
        const filtered = data.filter((s) => {
          const serviceProviderId = s.provider?._id || s.provider;
          const serviceUserId = s.provider?.user?._id || s.provider?.user;
          
          return (
            serviceUserId === userInfo?._id ||
            serviceProviderId === providerProfile?._id
          );
        });
        setProviderServices(filtered);
      }
    } catch (err) {
      console.error("Failed to load services", err);
    } finally {
      setServicesLoading(false);
    }
  };

  const fetchProviderProfile = async () => {
    setProfileLoading(true);
    try {
      const { data } = await api.get("/service-providers/profile");
      setProviderProfile(data);
    } catch (err) {
      console.error("Failed to load provider profile", err);
    } finally {
      setProfileLoading(false);
    }
  };

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const endpoint = userInfo.role === "admin" ? "/bookings" : "/bookings/provider";
      const { data } = await api.get(endpoint);
      setBookings(data);
    } catch (err) {
      console.error("Failed to load provider bookings", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchReviews = async () => {
    setReviewsLoading(true);
    try {
      const endpoint = userInfo.role === "admin" ? "/reviews" : "/reviews/provider";
      const { data } = await api.get(endpoint);
      setReviews(data);
    } catch (err) {
      console.error("Failed to load reviews", err);
    } finally {
      setReviewsLoading(false);
    }
  };

  const fetchProviders = async () => {
    setProvidersLoading(true);
    try {
      const { data } = await api.get("/service-providers");
      setProviders(data);
    } catch (err) {
      console.error("Failed to load providers", err);
    } finally {
      setProvidersLoading(false);
    }
  };

  const fetchWithdrawals = async () => {
    setWithdrawalsLoading(true);
    try {
      const endpoint = userInfo.role === "admin" ? "/withdrawals" : "/withdrawals/my";
      const { data } = await api.get(endpoint);
      setWithdrawals(data);
    } catch (err) {
      console.error("Failed to load withdrawals", err);
    } finally {
      setWithdrawalsLoading(false);
    }
  };

  const handleRequestWithdrawal = async (withdrawalData) => {
    try {
      const { data } = await api.post("/withdrawals", withdrawalData);
      setWithdrawals([data, ...withdrawals]);
      fetchBookings(); // Refresh balance if needed
      return { success: true, data };
    } catch (err) {
      console.error("Failed to request withdrawal", err);
      return { success: false, error: err.extractedMessage || "Withdrawal failed" };
    }
  };

  const handleUpdateService = async (id, formData) => {
    setServicesLoading(true);
    try {
      const { data } = await api.put(`/services/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setProviderServices((prev) =>
        prev.map((s) => (s._id === id ? data : s))
      );
      return { success: true, data };
    } catch (err) {
      console.error("Failed to update service", err);
      return { success: false, error: err.extractedMessage || "Update failed" };
    } finally {
      setServicesLoading(false);
    }
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;
    setServicesLoading(true);
    try {
      await api.delete(`/services/${id}`);
      setProviderServices((prev) => prev.filter((s) => s._id !== id));
      return { success: true };
    } catch (err) {
      console.error("Failed to delete service", err);
      return { success: false, error: err.extractedMessage || "Delete failed" };
    } finally {
      setServicesLoading(false);
    }
  };

  const updateProfile = async (formData) => {
    setProfileLoading(true);
    try {
      const { data } = await api.put("/service-providers/profile", formData);
      setProviderProfile(data);
      return { success: true, data };
    } catch (err) {
      console.error("Failed to update profile", err);
      return { success: false, error: err.extractedMessage || "Update failed" };
    } finally {
      setProfileLoading(false);
    }
  };

  return {
    bookings,
    setBookings,
    reviews,
    setReviews,
    providerProfile,
    setProviderProfile,
    providerServices,
    setProviderServices,
    categories,
    isLoading,
    reviewsLoading,
    profileLoading,
    servicesLoading,
    providers,
    providersLoading,
    withdrawals,
    withdrawalsLoading,
    fetchBookings,
    fetchReviews,
    fetchProviderProfile,
    fetchProviderServices,
    fetchCategories,
    fetchProviders,
    fetchWithdrawals,
    handleRequestWithdrawal,
    handleUpdateService,
    handleDeleteService,
    updateProfile,
  };
};

export default useProviderData;
