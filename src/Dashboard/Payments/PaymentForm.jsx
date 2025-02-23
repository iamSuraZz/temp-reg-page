import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { Box, Button, Typography, CircularProgress } from '@mui/material';
import '../../App.css'

const PaymentForm = ({ clientSecret, onSuccess }) => {
  const [stripe, setStripe] = useState(null);
  const [cardElement, setCardElement] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load Stripe.js
  useEffect(() => {
    const initializeStripe = async () => {
      const stripeInstance = await loadStripe('pk_test_51QrI14KNRkc3duL3VeFeJx0GsMDzQVbLRJS9vamTKu1umpLjGsnMwDwbBZ95RYtlZydUAGkBP2BG5h7VrfeCq63q00nQ3y7iRC'); // Replace with your Stripe publishable key
      setStripe(stripeInstance);

      // Create a Card Element with custom styling
      const elements = stripeInstance.elements();
      const card = elements.create('card', {
        style: {
          base: {
            fontSize: '16px',
            color: '#424770',
            '::placeholder': {
              color: '#aab7c4',
            },
          },
          invalid: {
            color: '#9e2146',
          },
        },
      });
      card.mount('#card-element');
      setCardElement(card);
    };

    initializeStripe();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !cardElement) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Confirm the payment with Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (stripeError) {
        setError(stripeError.message);
      } else {
        onSuccess(paymentIntent);
      }
    } catch (err) {
      setError('An error occurred while processing the payment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Payment Details
      </Typography>
      {/* Card Element Container */}
      <Box
        id="card-element"
        sx={{
          '& .StripeElement': {
            marginBottom: '16px', // Add spacing between fields
          },
        }}
      ></Box>
      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
      <Button
        fullWidth
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={!stripe || loading}
        sx={{ mt: 2 }}
      >
        {loading ? <CircularProgress size={24} /> : 'Pay Now'}
      </Button>
    </Box>
  );
};

export default PaymentForm;