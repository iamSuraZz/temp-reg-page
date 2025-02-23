import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress, Button } from '@mui/material';
import axios from 'axios';
import Cookies from 'js-cookie';
import PaymentForm from './PaymentForm'; // Adjust the import path as needed

const PlatformFee = () => {
  const { payment_prompt } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [paymentIntent, setPaymentIntent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false); // State to control the visibility of the payment form

  const base_url = import.meta.env.VITE_API_URL;

  const token = Cookies.get('refreshtoken');
      if (!token) {
        alert("You are not authenticated. Please log in.");
        return;
      }

  useEffect(() => {
    if (!payment_prompt) {
      navigate("/student/dashboard");
    }
  }, [payment_prompt, navigate]);

  const createPaymentIntent = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${base_url}/student/create-payment-intent`,
        {}, 
        { headers:{Authorization: `Bearer ${token}`} }
      );
      setPaymentIntent(response.data);
      console.log(response);
      
      setShowPaymentForm(true); // Show the payment form after the payment intent is created
    } catch (error) {
      console.error('Error creating payment intent:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async(paymentIntent) => {
    console.log('Payment succeeded:', paymentIntent);
    // Redirect the user or show a success message`

    try {
      const response = await axios.post(
        `${base_url}/student/stripe-webhook`,{paymentIntent},
        { headers: {
          'Content-Type': 'application/json',
          'Stripe-Signature': 'whsec_FguvRWfK2NIYfcuzhcrftUHhnZ0bNX4a',
          Authorization: `Bearer ${token}`
        } }
      );
      
      console.log(response);
      
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!payment_prompt) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading payment details...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ textAlign: "center", mt: 4 }}>
      <Typography variant="h5" color="error">
        You need to pay the platform fee to access universities & courses.
      </Typography>
      <Typography variant="h6" sx={{ mt: 2 }}>
        Amount: {payment_prompt.amount} {payment_prompt.currency}
      </Typography>

      {/* Pay Now Button */}
      {!showPaymentForm && (
        <Button
          variant="contained"
          color="primary"
          onClick={createPaymentIntent}
          disabled={loading}
          sx={{ mt: 2 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Pay Now'}
        </Button>
      )}

      {/* Payment Form (Displayed after clicking Pay Now) */}
      {showPaymentForm && paymentIntent && (
        <PaymentForm clientSecret={paymentIntent.clientSecret} onSuccess={handlePaymentSuccess} />
      )}
    </Box>
  );
};

export default PlatformFee;