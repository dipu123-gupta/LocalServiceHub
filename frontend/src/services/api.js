import axios from "axios";

// Create an Axios instance
const api = axios.create({
  baseURL: "/api",
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

    // Handle 401 Unauthorized
    if (error.response && error.response.status === 401) {
      // Import store dynamically to avoid circular dependencies if needed,
      // but here we can try a direct import if it doesn't cause issues.
      // Alternatively, we can just clear localStorage and let the APP state sync.
      localStorage.removeItem("userInfo");
      window.location.href = "/login";
    }

    // attach extracted message to a standard field
    error.extractedMessage = message;

    return Promise.reject(error);
  },
);

export default api;
