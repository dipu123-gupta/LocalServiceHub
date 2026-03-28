import api from "@/utils/api";

export const userService = {
  getProfile: async () => {
    const response = await api.get("/auth/profile");
    return response.data;
  },
  updateProfile: async (userData) => {
    const response = await api.put("/auth/profile", userData);
    return response.data;
  },
  getUsers: async (params = {}) => {
    const queryStr = new URLSearchParams(params).toString();
    const response = await api.get(`/users?${queryStr}`);
    return response.data;
  },
  deleteUser: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
  updateUserRole: async (id, role) => {
    const response = await api.put(`/users/${id}/role`, { role });
    return response.data;
  },
  toggleFavorite: async (data) => {
    const response = await api.post("/users/favorites", data);
    return response.data;
  },
  getFavorites: async () => {
    const response = await api.get("/users/favorites");
    return response.data;
  },
  toggleBlockUser: async (id) => {
    const response = await api.put(`/users/${id}/block`);
    return response.data;
  },
  getReferralStats: async () => {
    const response = await api.get("/users/referral-stats");
    return response.data;
  },
};
