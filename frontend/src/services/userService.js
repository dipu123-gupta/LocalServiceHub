import api from "@/utils/api";

export const userService = {
  getProfile: async () => {
    const response = await api.get("/users/profile");
    return response.data;
  },
  updateProfile: async (userData) => {
    const response = await api.put("/users/profile", userData);
    return response.data;
  },
  getUsers: async () => {
    const response = await api.get("/users");
    return response.data;
  },
  deleteUser: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
  updateUserByAdmin: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },
  toggleFavorite: async (data) => {
    const response = await api.post("/users/favorites", data);
    return response.data;
  },
};
