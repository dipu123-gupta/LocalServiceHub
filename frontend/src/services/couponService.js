import api from "@/utils/api";

export const couponService = {
  validateCoupon: async (validationData) => {
    const response = await api.post("/coupons/validate", validationData);
    return response.data;
  },
};
