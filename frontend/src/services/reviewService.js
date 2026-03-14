import api from "@/utils/api";

export const reviewService = {
  getServiceReviews: async (serviceId) => {
    const response = await api.get(`/reviews/service/${serviceId}`);
    return response.data;
  },
  createReview: async (reviewData) => {
    const response = await api.post("/reviews", reviewData);
    return response.data;
  },
};
