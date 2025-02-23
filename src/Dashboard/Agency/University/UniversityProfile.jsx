import React from 'react';
import { Typography, Card, CardContent, CardMedia, Grid, Container, Paper, Box, Rating } from '@mui/material';

const UniversityProfile = () => {
  // Dummy data for now
  const universityData = {
    name: 'Stanford University',
    image: 'https://cdn.pixabay.com/photo/2023/09/17/19/10/building-8259184_1280.jpg', // Placeholder image URL
    description:
      'Stanford University is a private research university in Stanford, California. Known for its academic excellence, entrepreneurial spirit, and cutting-edge research, Stanford is consistently ranked among the top universities in the world.',
    courses: [
      {
        name: 'Computer Science',
        fee: '$50,000/year',
        duration: '4 years',
        rating: 4.8,
      },
      {
        name: 'Business Administration',
        fee: '$45,000/year',
        duration: '3 years',
        rating: 4.7,
      },
      {
        name: 'Electrical Engineering',
        fee: '$48,000/year',
        duration: '4 years',
        rating: 4.6,
      },
      {
        name: 'Mechanical Engineering',
        fee: '$47,000/year',
        duration: '4 years',
        rating: 4.5,
      },
      {
        name: 'Medicine',
        fee: '$60,000/year',
        duration: '5 years',
        rating: 4.9,
      },
    ],
  };

  return (
    <Container style={{ padding: '20px' }}>
      {/* University Title */}
      <Typography variant="h4" gutterBottom style={{ textAlign: 'left', fontWeight: 'bold' }}>
        {universityData.name}
      </Typography>

      {/* Image */}
      <Paper elevation={3} style={{ marginBottom: '20px', padding: '10px' }}>
        <CardMedia
          component="img"
          image={universityData.image}
          alt={universityData.name}
          style={{ borderRadius: '10px', height: 'auto' }}
        />
      </Paper>

      {/* Description */}
      <Typography variant="body1" style={{ lineHeight: 1.8, marginBottom: '20px', textAlign: 'justify' }}>
        {universityData.description}
      </Typography>

      {/* Courses Section */}
      <Typography variant="h5" gutterBottom style={{ marginBottom: '20px', fontWeight: 'bold' }}>
        Courses Offered
      </Typography>
      <Grid container spacing={3}>
        {universityData.courses.map((course, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card elevation={3} style={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom style={{ fontWeight: 'bold' }}>
                  {course.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Fee: {course.fee}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Duration: {course.duration}
                </Typography>
                <Box display="flex" alignItems="center" marginTop="10px">
                  <Typography variant="body2" style={{ marginRight: '8px' }}>
                    Rating:
                  </Typography>
                  <Rating value={course.rating} precision={0.1} readOnly />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default UniversityProfile;
