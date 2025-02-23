import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Login from "./Auth/Login";
import Registration from "./Auth/Registration";
import StudentDashboard from "./Dashboard/Student/StudentDashboard/StudentDashboard";
import DashboardWrapper from "./Wrapper/Wrapper";
import { verifyToken } from "../store/authSlice"; 
import PlatformFee from "./Dashboard/Payments/PlatformFee";
import { Box, CircularProgress, Typography } from "@mui/material";
import UniversityDashboard from "./Dashboard/University/UniversityDashboard";

const App = () => {
  const { isAuthenticated, role, platform_access } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(verifyToken()); // ✅ Verify token on app load
  }, [dispatch]);

  // 🔹 Protected Route for Authenticated Users
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  // 🔹 Student Route with Payment Check
  const StudentProtectedRoute = ({ children }) => {
    const { isAuthenticated, role, platform_access, payment_prompt } = useSelector((state) => state.auth);

    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }

    if (role === "student" && platform_access?.payment_required && !payment_prompt) {
      return (
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <CircularProgress />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Loading payment details...
          </Typography>
        </Box>
      );
    }

    if (role === "student" && platform_access?.payment_required) {
      return <Navigate to="/payment/platform-fee" />;
    }

    return children;
  };

  // 🔹 Restrict Access to Payment Page if Already Paid
  const PaymentProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" />; // ✅ Redirect unauthenticated users to login
    }

    if (role === "student" && !platform_access?.payment_required) {
      return <Navigate to="/student/dashboard" />; // ✅ If fee is paid, redirect to dashboard
    }

    return children;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<h1 style={{ textAlign: "center" }}>Connect2Uni Website Content in this page</h1>} />
        <Route path="register" element={<Registration />} />
        <Route path="login" element={<Login />} />
        <Route
          path="agency/dashboard"
          element={
            <ProtectedRoute>
              <DashboardWrapper />
            </ProtectedRoute>
          }
        />

        <Route
          path="university/dashboard"
          element={
            <ProtectedRoute>
              <UniversityDashboard />
            </ProtectedRoute>
          }
        />

        {/* ✅ Restrict Payment Page If User Has Already Paid */}
        <Route
          path="payment/platform-fee"
          element={
            <PaymentProtectedRoute>
              <PlatformFee />
            </PaymentProtectedRoute>
          }
        />

        {/* ✅ Student Dashboard (Only Accessible After Payment) */}
        <Route
          path="student/dashboard"
          element={
            <StudentProtectedRoute>
              <StudentDashboard />
            </StudentProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
