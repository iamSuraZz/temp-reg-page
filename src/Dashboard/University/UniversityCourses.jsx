import React, { useState } from 'react';
import { Button, Card, CardContent, Typography, Box, Grid } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import CreateCourseForm from './CreateCourseForm'; // Import the new form component

const UniversityCourses = () => {
  const [showForm, setShowForm] = useState(false);
  const [activeCourses, setActiveCourses] = useState([
    { name: 'Computer Science', duration: '4 Years', fee: '$10,000', rating: 4.5 },
    { name: 'Business Administration', duration: '3 Years', fee: '$8,000', rating: 4.2 },
    { name: 'Mechanical Engineering', duration: '4 Years', fee: '$12,000', rating: 4.7 },
    { name: 'Psychology', duration: '3 Years', fee: '$9,000', rating: 4.0 },
    { name: 'Graphic Design', duration: '2 Years', fee: '$7,000', rating: 4.3 },
  ]);

  const inactiveCourses = [
    { name: 'Civil Engineering', duration: '4 Years', fee: '$11,000', rating: 4.1 },
    { name: 'Marketing', duration: '3 Years', fee: '$8,500', rating: 3.9 },
    { name: 'Biotechnology', duration: '4 Years', fee: '$13,000', rating: 4.4 },
  ];

  // Function to render star rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating); // Number of full stars
    const hasHalfStar = rating % 1 !== 0; // Check if there's a half star

    // Render full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<StarIcon key={`full-${i}`} sx={{ color: 'gold' }} />);
    }

    // Render half star if needed
    if (hasHalfStar) {
      stars.push(<StarHalfIcon key="half" sx={{ color: 'gold' }} />);
    }

    // Render empty stars to fill up to 5
    const remainingStars = 5 - stars.length;
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<StarBorderIcon key={`empty-${i}`} sx={{ color: 'gold' }} />);
    }

    return stars;
  };

  // Handle form submission
  const handleSubmit = (newCourse) => {
    setActiveCourses((prev) => [...prev, newCourse]);
    setShowForm(false); // Hide the form after submission
  };

  return (
    <Box sx={{ padding: 3 }}>
      {/* Create Course Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 3 }}>
        <Button variant="contained" color="primary" onClick={() => setShowForm(!showForm)}>
          Create Course
        </Button>
      </Box>

      {/* Show Create Course Form */}
      {showForm && (
        <CreateCourseForm
          onCancel={() => setShowForm(false)}
          onSubmit={handleSubmit}
        />
      )}

      {/* Active Courses Section */}
      <Typography variant="h4" sx={{ marginBottom: 2 }}>
        Active Courses
      </Typography>
      <Grid container spacing={3}>
        {activeCourses.map((course, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                  {course.name}
                </Typography>
                <Typography variant="body1" sx={{ marginBottom: 1 }}>
                  Duration: {course.duration}
                </Typography>
                <Typography variant="body1" sx={{ marginBottom: 1 }}>
                  Fee: {course.fee}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body1" sx={{ marginRight: 1 }}>
                    Rating:
                  </Typography>
                  {renderStars(course.rating)}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Inactive Courses Section */}
      <Typography variant="h4" sx={{ marginTop: 4, marginBottom: 2 }}>
        Inactive Courses
      </Typography>
      <Grid container spacing={3}>
        {inactiveCourses.map((course, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', opacity: 0.6 }}>
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                  {course.name}
                </Typography>
                <Typography variant="body1" sx={{ marginBottom: 1 }}>
                  Duration: {course.duration}
                </Typography>
                <Typography variant="body1" sx={{ marginBottom: 1 }}>
                  Fee: {course.fee}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body1" sx={{ marginRight: 1 }}>
                    Rating:
                  </Typography>
                  {renderStars(course.rating)}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default UniversityCourses;