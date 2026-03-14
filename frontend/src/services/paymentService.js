import api from "@/utils/api";

export const paymentService = {
  processPayment: async (paymentData) => {
    const response = await api.post("/payments/process", paymentData);
    return response.data;
  },
  getPaymentHistory: async () => {
    const response = await api.get("/payments/history");
    return response.data;
  },
  verifyPayment: async (verificationData) => {
    const response = await api.post("/payments/verify", verificationData);
    return response.data;
  },
};
