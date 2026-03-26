import api from "@/utils/api";

export const authService = {
  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },

  logout: async () => {
    const response = await api.post("/auth/logout");
    return response.data;
  },
  
  getProfile: async () => {
    const response = await api.get("/auth/profile");
    return response.data;
  },

  verifyEmail: async (token) => {
    const response = await api.get(`/auth/verify-email/${token}`);
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
  },

  resetPassword: async (token, passwords) => {
    const response = await api.put(`/auth/reset-password/${token}`, passwords);
    return response.data;
  },

  googleAuth: async (idToken) => {
    const response = await api.post("/auth/google", { idToken });
    return response.data;
  },
};
