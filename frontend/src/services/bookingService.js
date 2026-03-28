import api from "@/utils/api";

export const bookingService = {
  createBooking: async (bookingData) => {
    const response = await api.post("/bookings", bookingData);
    return response.data;
  },
  getMyBookings: async () => {
    const response = await api.get("/bookings/mybookings");
    return response.data;
  },
  getProviderBookings: async () => {
    const response = await api.get("/bookings/provider");
    return response.data;
  },
  getAllBookings: async () => {
    const response = await api.get("/bookings");
    return response.data;
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
};
