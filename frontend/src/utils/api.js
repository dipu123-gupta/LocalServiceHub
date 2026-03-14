import axios from "axios";

// Create an Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL.endsWith("/api")
      ? import.meta.env.VITE_API_URL
      : `${import.meta.env.VITE_API_URL}/api`
    : "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Standardize error message extraction
    const message =
      error.response?.data?.message ||
      error.message ||
      "An unexpected error occurred";

    // Handle 401 Unauthorized (Session Expired)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("userInfo");
      // Only redirect if not already on the login/register page
      if (
        !window.location.pathname.includes("/login") &&
        !window.location.pathname.includes("/register")
      ) {
        window.location.href = "/login";
      }
    }

    // Attach extracted message to a standard field for easier component access
    error.extractedMessage = message;

    return Promise.reject(error);
  },
);

export default api;
