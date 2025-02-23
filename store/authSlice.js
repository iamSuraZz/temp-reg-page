import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from 'js-cookie';

const base_url = import.meta.env.VITE_API_URL;

const initialState = {
  user: null,
  isAuthenticated: !!Cookies.get('refreshtoken'), // Check if token exists
  loading: false,
  error: null,
  role: null,
  token: Cookies.get('refreshtoken') || null, // Initialize token from Cookies
  platform_access: null,
  notifications: [],
  payment_status: null,
  payment_prompt: null, // Add payment_prompt to initialState
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      // console.log("🚀 Dispatching loginSuccess Action");
      // console.log("Action Payload:", action.payload); // ✅ Check if `payment_prompt` exists here
    
      state.user = action.payload.user;
      state.role = action.payload.role;
      state.token = action.payload.token;
      state.platform_access = action.payload.platform_access;
      state.notifications = action.payload.notifications;
      state.payment_status = action.payload.payment_status;
      state.payment_prompt = action.payload.payment_prompt || null; // ✅ Ensure payment_prompt is set
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
    
      // console.log("🔥 Updated Redux State (After loginSuccess):", state); // ✅ Verify Redux state contains `payment_prompt`
    },
    
    loginFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    logout: (state) => {
      state.user = null;
      state.role = null;
      state.token = null;
      state.platform_access = null;
      state.notifications = [];
      state.payment_status = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      state.payment_prompt = null; // Clear payment_prompt on logout
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;

// Verify token action
export const verifyToken = () => async (dispatch) => {
  const token = Cookies.get('refreshtoken');
  if (!token) return;
  

  try {
    const response = await axios.post(
      `${base_url}/student/verify-token`, 
      {}, // Empty object as POST data since no body is sent
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    

    // Dispatch login success with all user data
    dispatch(loginSuccess({
      user: response.data.user,
      role: response.data.role,
      token: token, // Use the token from Cookies
      platform_access: response.data.platform_access,
      notifications: response.data.notifications,
      payment_status: response.data.payment_status,
      payment_prompt: response.data.payment_prompt, // Include payment_prompt in the payload
    }));
  } catch (error) {
    console.error(error);
    dispatch(logout());
    Cookies.remove('refreshtoken');
  }
};

export default authSlice.reducer;