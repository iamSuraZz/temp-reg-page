import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Grid } from '@mui/material';

const CreateCourseForm = ({ onCancel, onSubmit }) => {
  const [courseDetails, setCourseDetails] = useState({
    name: '',
    duration: '',
    fee: '',
    rating: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    // Validate and submit the form data
    if (courseDetails.name && courseDetails.duration && courseDetails.fee && courseDetails.rating) {
      onSubmit(courseDetails);
    } else {
      alert('Please fill all the fields.');
    }
  };

  return (
    <Box sx={{ padding: 3, border: '1px solid #ccc', borderRadius: 2, marginTop: 2 }}>
      <Typography variant="h6" sx={{ marginBottom: 2 }}>
        Create New Course
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Course Name"
            name="name"
            value={courseDetails.name}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Duration"
            name="duration"
            value={courseDetails.duration}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Fee"
            name="fee"
            value={courseDetails.fee}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Rating"
            name="rating"
            type="number"
            inputProps={{ min: 0, max: 5, step: 0.1 }}
            value={courseDetails.rating}
            onChange={handleChange}
          />
        </Grid>
      </Grid>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 3 }}>
        <Button variant="contained" color="error" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default CreateCourseForm;