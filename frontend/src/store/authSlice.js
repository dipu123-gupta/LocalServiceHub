import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem("userInfo", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.userInfo = null;
      localStorage.removeItem("userInfo");
    },
    updateUserInfo: (state, action) => {
      state.userInfo = { ...state.userInfo, ...action.payload };
      localStorage.setItem("userInfo", JSON.stringify(state.userInfo));
    },
    setMFARequired: (state, action) => {
      state.mfaRequired = action.payload; // { userId, email }
    },
    clearMFARequired: (state) => {
      state.mfaRequired = null;
    },
  },
});

export const {
  setCredentials,
  logout,
  updateUserInfo,
  setMFARequired,
  clearMFARequired,
} = authSlice.actions;
export default authSlice.reducer;
