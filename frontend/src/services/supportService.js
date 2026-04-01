import api from "@/utils/api";

export const supportService = {
  createTicket: async (ticketData) => {
    const response = await api.post("/support", ticketData);
    return response.data;
  },
  getMyTickets: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const response = await api.get(`/support?${query}`);
    return response.data;
  },
  getAllTickets: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const response = await api.get(`/support/admin?${query}`);
    return response.data;
  },
  updateTicket: async (id, ticketData) => {
    const response = await api.put(`/support/${id}`, ticketData);
    return response.data;
  },
};
