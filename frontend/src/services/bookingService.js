import api from "@/utils/api";

export const bookingService = {
  createBooking: async (bookingData) => {
    const response = await api.post("/bookings", bookingData);
    return response.data;
  },
  getMyBookings: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const response = await api.get(`/bookings/mybookings?${query}`);
    // Backward-compatible: endpoint may return array (legacy) or paginated object (current)
    return Array.isArray(response.data) ? { bookings: response.data } : response.data;
  },
  getProviderBookings: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const response = await api.get(`/bookings/provider?${query}`);
    return Array.isArray(response.data) ? { bookings: response.data } : response.data;
  },
  getAllBookings: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const response = await api.get(`/bookings?${query}`);
    return Array.isArray(response.data) ? { bookings: response.data } : response.data;
  },
  getBookingById: async (id) => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },
  updateBookingStatus: async (id, statusData) => {
    const response = await api.put(`/bookings/${id}/status`, statusData);
    return response.data;
  },
  addAdditionalCharge: async (id, chargeData) => {
    const response = await api.post(`/bookings/${id}/additional-charge`, chargeData);
    return response.data;
  },
  approveAdditionalCharge: async (id, chargeId, status) => {
    const response = await api.put(`/bookings/${id}/approve-charge/${chargeId}`, { status });
    return response.data;
  },
  cancelBooking: async (id) => {
    const response = await api.put(`/bookings/${id}/cancel`);
    return response.data;
  },
  downloadInvoice: async (id) => {
    const response = await api.get(`/bookings/${id}/invoice`, {
      responseType: "blob",
    });
    return response.data;
  },
};
