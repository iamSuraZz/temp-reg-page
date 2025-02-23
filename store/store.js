import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice"; // Import your auth slice

const store = configureStore({
  reducer: {
    auth: authReducer, // Add your reducers here
  },
  devTools: true,
});

export default store;