import React, { useState, useRef } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Link,
  Chip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const base_url = "http://localhost:3000";

const OtpVerification = ({ email, onOtpVerified, onEmailChange }) => {

  const [otp, setOtp] = useState(["", "", "", "", "", ""]); // Array to store each digit of the OTP
  const [newEmail, setNewEmail] = useState("");
  const [showChangeEmail, setShowChangeEmail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const otpInputRefs = useRef([]); // Refs for each OTP input box

  const navigate = useNavigate();


  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // Allow only numbers
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move focus to the next input box if a digit is entered
    if (value && index < 5) {
      otpInputRefs.current[index + 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").slice(0, 6); // Get only the first 6 digits
    if (/^\d+$/.test(pasteData)) {
      const newOtp = [...otp];
      for (let i = 0; i < pasteData.length; i++) {
        newOtp[i] = pasteData[i];
      }
      setOtp(newOtp);
    }
  };

  const handleNewEmailChange = (e) => {
    setNewEmail(e.target.value);
  };

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${base_url}/student/resend/otp`, { email });
      if (response.status === 200) {
        alert("OTP resent successfully!");
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
      setError("Failed to resend OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangeEmailClick = () => {
    setShowChangeEmail(true);
  };

  const handleSendOtpToNewEmail = async () => {
    if (!newEmail.trim() || !/\S+@\S+\.\S+/.test(newEmail)) {
      setError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    try {
      console.log(email , newEmail);
      
      const response = await axios.post(`${base_url}/student/verify/otp`, { email: newEmail });
      if (response.status === 200) {
        alert("OTP has been sent to the new email.");
        onEmailChange(newEmail); // Update the email state
        setShowChangeEmail(false);
        setNewEmail("");
      }
    } catch (error) {
      console.error("Error changing email:", error);
      setError("Failed to change email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${base_url}/student/verify/registration/otp`, { email, otp: otpValue });
      if (response.status === 200) {
        onOtpVerified();
        navigate("/login"); 
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setError("Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: "50px" }}>
      <Box
        sx={{
          marginTop: 12,
          boxShadow: 3,
          borderRadius: 2,
          p: 4,
        }}
      >
        {showChangeEmail ? (
          // Change Email Form
          <>
            <Typography variant="h4" align="center" gutterBottom>
              Change Email
            </Typography>
            <Typography variant="body1" align="center" gutterBottom>
              Enter the email where you want to receive the OTP.
            </Typography>
            <TextField
              label="New Email"
              variant="outlined"
              fullWidth
              size="small"
              value={newEmail}
              onChange={handleNewEmailChange}
              error={!!error}
              helperText={error}
              sx={{ mt: 2 }}
            />
            <Box mt={2} display="flex" justifyContent="center">
              <Button
                variant="contained"
                color="primary"
                onClick={handleSendOtpToNewEmail}
                sx={{ backgroundColor: "#2196F3", color: "#ffffff" }}
              >
                Send OTP
              </Button>
            </Box>
          </>
        ) : (
          // OTP Verification Form
          <>
            <Typography variant="h4" align="center" gutterBottom>
              OTP Verification
            </Typography>
            <Typography variant="body1" align="center" gutterBottom>
              An OTP has been sent to:
            </Typography>
            <Box display="flex" justifyContent="center" sx={{ mt: 1, mb: 2 }}>
              <Chip
                label={email}
                variant="outlined"
                sx={{
                  fontSize: "1rem",
                  fontWeight: "bold",
                  padding: "8px 16px",
                  backgroundColor: "#f5f5f5",
                  borderColor: "#2196F3",
                }}
              />
            </Box>
            <Box display="flex" justifyContent="center" gap={1} sx={{ mt: 2 }}>
              {otp.map((digit, index) => (
                <TextField
                  key={index}
                  inputRef={(ref) => (otpInputRefs.current[index] = ref)}
                  variant="outlined"
                  size="small"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onPaste={handlePaste}
                  inputProps={{
                    maxLength: 1,
                    style: { textAlign: "center" },
                  }}
                  sx={{ width: "50px" }}
                />
              ))}
            </Box>
            {error && (
              <Typography variant="body2" color="error" align="center" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}
            <Box mt={2} display="flex" justifyContent="space-between">
              <Link href="#" onClick={handleResendOtp} underline="always">
                Not received OTP? Resend OTP
              </Link>
              {/* <Link href="#" onClick={handleChangeEmailClick} underline="always">
                Change Email
              </Link> */}
            </Box>
            <Box mt={4} display="flex" justifyContent="center">
              <Button
                variant="contained"
                color="primary"
                onClick={handleVerifyOtp}
                sx={{ backgroundColor: "#2196F3", color: "#ffffff" }}
              >
                Verify OTP
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Container>
  );
};

export default OtpVerification;