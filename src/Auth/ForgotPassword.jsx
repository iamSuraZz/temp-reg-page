import React from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Stack,
} from "@mui/material";

const ForgotPassword = () => {
  return (
    <Container maxWidth="sm" style={{ marginTop: "50px" }}>
      <Box
        sx={{
          marginTop: 12,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          boxShadow: 3,
          borderRadius: 2,
          p: 4,
        }}
      >
        {/* Heading */}
        <Typography variant="h4" align="center" gutterBottom>
          Forgot Password
        </Typography>

        {/* Subheading */}
        <Typography variant="body1" align="center" gutterBottom>
          Enter your registered email to reset your password.
        </Typography>

        {/* Email Input */}
        <Box mt={4}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="body1" style={{ minWidth: "120px" }}>
              Enter your Email
            </Typography>
            <TextField
              variant="outlined"
              placeholder="Enter your email"
              fullWidth
              size="small"
            />
          </Stack>
        </Box>

        {/* Buttons */}
        <Box mt={4} display="flex" justifyContent="center" gap={24}>
          {/* Go Back Button */}
          <Button
            variant="contained"
            style={{ backgroundColor: "#2196F3", color: "#ffffff" }}
          >
            Go Back
          </Button>

          {/* Send Button */}
          <Button
            variant="outlined"
            style={{
              backgroundColor: "#ffffff",
              color: "#000000",
              borderColor: "#2196F3",
            }}
          >
            Send
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default ForgotPassword;
