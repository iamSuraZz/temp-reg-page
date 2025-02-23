import React, { useState, useEffect } from 'react';
import { Typography, Box, Container } from '@mui/material';
import AgencyDashboard from '../Dashboard/Agency/DashboardMain/AgencyDashboard';


const DashboardWrapper = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Cleanup the event listener on component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isMobile) {
    return (
      <Container>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh" // Center vertically
          textAlign="center"
        >
          <Typography variant="h5" color="error">
            You can only view your dashboard on a desktop.
          </Typography>
        </Box>
      </Container>
    );
  }

  return <AgencyDashboard />;
};

export default DashboardWrapper;