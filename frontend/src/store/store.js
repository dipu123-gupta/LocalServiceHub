import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    // services: serviceReducer,
    // bookings: bookingReducer,
  },
});

export default store;
