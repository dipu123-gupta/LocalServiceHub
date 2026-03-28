import api from "@/utils/api";

export const paymentService = {
  createOrder: async (orderData) => {
    const response = await api.post("/payments/create-order", orderData);
    return response.data;
  },
  verifyPayment: async (verificationData) => {
    const response = await api.post("/payments/verify", verificationData);
    return response.data;
  },
};
