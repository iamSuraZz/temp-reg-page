import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Box, Typography, Button, Grid, Card, CardContent, CardMedia } from "@mui/material";
import Cookies from 'js-cookie';
import { useSelector } from "react-redux";

const StudentDashboard = () => {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  const base_url = import.meta.env.VITE_API_URL;
  const { platform_access, payment_prompt } = useSelector((state) => state.auth);

  useEffect(() => {
     const token = Cookies.get('refreshtoken');
        if (!token) {
          alert("You are not authenticated. Please log in.");
          return;
        }
    if (platform_access?.payment_required) {
      navigate("/payment/platform-fee"); // ✅ Redirect to payment page
    }
    const fetchUniversities = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${base_url}/student/get/universities`, {
          headers : {
            'Authorization': `Bearer ${token}`
          } 
        });
         console.log(response);
         
        setUniversities(response.data.universities); // ✅ Set data if successful
        setError(null); // ✅ Reset error if request succeeds
      } catch (err) {
        setError(err.response); // ✅ Directly store full API response
        console.error("API Error:", err.response);
      } finally {
        setLoading(false);
      }
    };

    fetchUniversities();
  }, [platform_access, navigate]);

  // If API returned a 403, restrict access
  if (error?.status === 403) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h6" color="error">
          {error.data?.message || "Access Denied"} {/* ✅ Use API's error message */}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={() => navigate("/payment/platform-fee")} // ✅ Redirect to payment page
        >
          Complete Payment
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Universities
      </Typography>
      <Grid container spacing={3}>
        {universities.map((university, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardMedia component="img" height="140" image={university.image} alt={university.name} />
              <CardContent>
                <Typography variant="h6">{university.name}</Typography>
                <Typography variant="body2">Rating: {university.rating}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default StudentDashboard;
