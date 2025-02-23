import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Grid, MenuItem } from "@mui/material";
import { CountryCodes } from "../../../Auth/CountryCodes";
import Cookies from 'js-cookie';
import toast, { Toaster } from 'react-hot-toast';

const base_url = import.meta.env.VITE_API_URL;

const AddUniversityForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneCode: "+1",  // Default country code
    phoneNumber: "",
    website: "",
    address: {
      country: "United States",
      city: "",
      zipCode: "",
    },
    institutionType: "",
    ratings: [],       // ✅ Changed from "" to []
    description: "",
    bannerImage: null, // ✅ Correctly handling file uploads
    isCountryAutoFilled: true,
  });
  

  const handleChange = (e) => {
  const { name, value, files } = e.target;
  if (name.startsWith("address.")) {
    const key = name.split(".")[1];
    setFormData((prev) => ({
      ...prev,
      address: { ...prev.address, [key]: value },
    }));
  } else {
    setFormData((prev) => ({
      ...prev,
      [name]: name === "ratings" ? Number(value) : files ? files[0] : value, // Convert ratings to number
    }));
  }
};


  const handlePhoneCodeChange = (e) => {
    const selectedCode = e.target.value;
    const selectedCountry = CountryCodes.find((country) => country.code === selectedCode);

    setFormData((prev) => ({
      ...prev,
      phoneCode: selectedCode,
      address: {
        ...prev.address,
        country: prev.isCountryAutoFilled ? selectedCountry?.name || "" : prev.address.country,
      },
    }));
  };

  const handleCountryChange = (e) => {
    setFormData({
      ...formData,
      address: { ...formData.address, country: e.target.value },
      isCountryAutoFilled: e.target.value === "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = Cookies.get('refreshtoken');
    if (!token) {
      alert("You are not authenticated. Please log in.");
      return;
    }

    const formPayload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== "isCountryAutoFilled" && key !== "phoneCode" && key !== "phoneNumber") {
        if (key === "address") {
          Object.entries(value).forEach(([addrKey, addrValue]) => {
            formPayload.append(`address[${addrKey}]`, addrValue);
          });
        } else {
          formPayload.append(key, value);
        }
      }
    });

    formPayload.append("phoneNumber", `${formData.phoneCode}${formData.phoneNumber}`);

    try {
      
      const response = await axios.post(`${base_url}/agency/create/university`, formPayload, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        },
      });
      

      if (response.status === 201) {
        toast.success("University added successfully!");
        onClose();
      } else {
        toast.error("Failed to add university. Try again later");
      }
    } catch (error) {
      console.log(error.response.data.message);
      toast.error(error.response.data.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField label="University Name" name="name" fullWidth required onChange={handleChange} />
        </Grid>
        <Grid item xs={12}>
          <TextField label="Official Website" name="website" type="url" fullWidth required onChange={handleChange} />
        </Grid>
        <Grid item xs={12}>
          <TextField label="Email ID" name="email" type="email" fullWidth required onChange={handleChange} />
        </Grid>

        <Grid item xs={12} container spacing={1} alignItems="center">
          <Grid item xs={4}>
            <TextField select name="phoneCode" value={formData.phoneCode} onChange={handlePhoneCodeChange} fullWidth>
              {CountryCodes.map((country) => (
                <MenuItem key={country.code} value={country.code}>
                  {country.name} ({country.code})
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={8}>
            <TextField label="Phone Number" name="phoneNumber" type="tel" fullWidth required onChange={handleChange} />
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <TextField label="Country" name="address.country" fullWidth required value={formData.address.country} onChange={handleCountryChange} />
        </Grid>
        <Grid item xs={12}>
          <TextField label="City" name="address.city" fullWidth required onChange={handleChange} />
        </Grid>
        <Grid item xs={12}>
          <TextField label="ZIP Code" name="address.zipCode" type="text" fullWidth required onChange={handleChange} />
        </Grid>
        <Grid item xs={12}>
          <TextField select label="Type of Institution" name="institutionType" fullWidth required onChange={handleChange}>
            <MenuItem value="Public">Public</MenuItem>
            <MenuItem value="Private">Private</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <TextField label="University Ratings" name="ratings" type="number" fullWidth required onChange={handleChange} />
        </Grid>
        <Grid item xs={12}>
          <TextField type="file" name="bannerImage" fullWidth required inputProps={{ accept: "image/*" }} onChange={handleChange} />
        </Grid>
        <Grid item xs={12}>
          <TextField label="University Description" name="description" multiline rows={3} fullWidth required onChange={handleChange} />
        </Grid>

        <Grid item xs={12} container justifyContent="space-between">
          <Button variant="contained" color="error" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" type="submit">
            Submit
          </Button>
        </Grid>
      </Grid>
      <Toaster
       position="top-center"
       reverseOrder={false}
     />
    </form>
  );
};

export default AddUniversityForm;
