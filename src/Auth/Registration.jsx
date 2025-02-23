import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Stack,
  MenuItem,
  LinearProgress,
  IconButton,
  InputAdornment,
  Checkbox,
  FormControlLabel,
  Link,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { countryCodes } from "./countryCodes";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from "react-hot-toast";


const base_url = import.meta.env.VITE_API_URL;

const Registration = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    email: "",
    confirmEmail: "",
    password: "",
    countryCode: "+1",
    telephoneNumber: "",
    address: {
      country: "United States",
      zip_postalCode: "",
      state_province_region: "",
      city: "",
      addressLine: "",
    },
    documentType: "",
    mostRecentEducation: "",
    yearOfGraduation: "",
    collegeUniversity: "",
    programType: "",
    discipline: "",
    // countryApplyingFrom: "",
    // countryName: "",
    preferredUniversity: "",
    NameOfUniversity: "",
    preferredCourse: "",
    NameOfCourse: "",
    courseStartTimeline: "",
    englishLanguageRequirement: "",
    testName: "",
    score: "",
    referralSource: "",
    // preferredCommunicationMethod: "", Remove this
    termsAndConditionsAccepted: false,
    gdprAccepted: false,
    documentUpload: null,
    document: null,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    // Check if the field is nested (e.g., address.country)
    if (name.includes(".")) {
      const [parent, child] = name.split("."); // Split into parent and child keys
      setFormData((prevFormData) => ({
        ...prevFormData,
        [parent]: {
          ...prevFormData[parent],
          [child]: value,
        },
      }));
    } else {
      // Handle non-nested fields
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  
    // Automatically set the country name when country code is selected
    if (name === "countryCode") {
      let selectedCountryName = "";
  
      // Handle the case for +1 (United States and Canada share the same code)
      if (value === "+1") {
        selectedCountryName = "United States"; // Explicitly set to United States
      } else {
        const selectedCountry = countryCodes.find((country) => country.code === value);
        selectedCountryName = selectedCountry ? selectedCountry.name : "";
      }
  
      setFormData((prevFormData) => ({
        ...prevFormData,
        address: {
          ...prevFormData.address,
          country: selectedCountryName, // Update the country name in the address section
        },
      }));
    }
  
    // Clear test-related fields when English test is not required
    if (name === "englishLanguageRequirement" && value === "No") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        testName: "",
        score: "",
        documentUpload: null,
      }));
    }
  
    // Clear errors for the current field
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const loginPageRedirect = () => {
    navigate('/login')
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        [e.target.name]: file,
        documentType: "Passport", // Automatically set documentType to 'Passport'
      });
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleNext = () => {
    let newErrors = {};

    // Step 1: Personal Information Validation
    if (step === 1) {
      if (!formData.firstName.trim()) {
        newErrors.firstName = "First Name is required";
      }
      if (!formData.lastName.trim()) {
        newErrors.lastName = "Last Name is required";
      }
      if (!formData.dateOfBirth) {
        newErrors.dateOfBirth = "Date of Birth is required";
      }
      if (!formData.gender) {
        newErrors.gender = "Gender is required";
      }
    }

    // Step 2: Contact Information Validation
    if (step === 2) {
      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Email is invalid";
      }
      if (!formData.confirmEmail.trim()) {
        newErrors.confirmEmail = "Please re-enter your email";
      } else if (formData.confirmEmail !== formData.email) {
        newErrors.confirmEmail = "Emails do not match";
      }
      if (!formData.password.trim()) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      }
      if (!formData.telephoneNumber.trim()) {
        newErrors.telephoneNumber = "Mobile Number is required";
      } else if (!/^\d+$/.test(formData.telephoneNumber)) {
        newErrors.telephoneNumber = "Mobile Number must contain only digits";
      }
      if (!formData.document) {
        newErrors.document = "Passport file is required";
      }
    }
    
    // Step 3: Educational Background Validation
    if (step === 3) {
      if (!formData.address.country) {
        newErrors.country = "Country is required";
      }
      if (!formData.address.zip_postalCode.trim()) {
        newErrors.zip_postalCode = "ZIP/Postal Code is required";
      }
      if (!formData.address.state_province_region.trim()) {
        newErrors.state_province_region = "State/Province/Region is required";
      }
      if (!formData.address.city.trim()) {
        newErrors.city = "City is required";
      }
      if (!formData.address.addressLine.trim()) {
        newErrors.addressLine = "Address Line is required";
      }
    }

    // Step 4: Educational Background Validation
    if (step === 4) {
      if (!formData.mostRecentEducation) {
        newErrors.mostRecentEducation = "Recent Education is required";
      }
      if (formData.mostRecentEducation === "Other" && !formData.otherEducationName.trim()) {
        newErrors.otherEducationName = "Please specify your recent education";
      }
      if (!formData.yearOfGraduation) {
        newErrors.yearOfGraduation = "Year of Graduation is required";
      }
      if (!formData.collegeUniversity.trim()) {
        newErrors.collegeUniversity = "College/University Name is required";
      }
      if (!formData.programType) {
        newErrors.programType = "Program Type is required";
      }
      if (formData.programType === "Other" && !formData.otherProgramName.trim()) {
        newErrors.otherProgramName = "Please specify the program";
      }
      if (!formData.discipline) {
        newErrors.discipline = "Discipline is required";
      }
      if (formData.discipline === "Other" && !formData.otherDisciplineName.trim()) {
        newErrors.otherDisciplineName = "Please specify the discipline";
      }
    }

    // Step 4: Program Preferences Validation
    if (step === 5) {
      // if (!formData.countryApplyingFrom) {
      //   newErrors.countryApplyingFrom = "Applying Country is required";
      // }
      // if (formData.countryApplyingFrom === "Other" && !formData.countryName.trim()) {
      //   newErrors.countryName = "Please specify the country";
      // }
      if (!formData.preferredUniversity) {
        newErrors.preferredUniversity = "Preferred University is required";
      }
      if (formData.preferredUniversity === "Yes" && !formData.NameOfUniversity.trim()) {
        newErrors.NameOfUniversity = "Please specify the university";
      }
      if (!formData.preferredCourse) {
        newErrors.preferredCourse = "Preferred Course is required";
      }
      if (formData.preferredCourse === "Yes" && !formData.NameOfCourse.trim()) {
        newErrors.NameOfCourse = "Please specify the course";
      }
      if (!formData.courseStartTimeline) {
        newErrors.courseStartTimeline = "Course Start Date is required";
      }
      if (!formData.englishLanguageRequirement) {
        newErrors.englishLanguageRequirement = "English Requirement is required";
      }
      if (formData.englishLanguageRequirement === "Yes") {
        if (!formData.testName) {
          newErrors.testName = "Test Taken is required";
        }
        if (!formData.score) {
          newErrors.score = "Test Score is required";
        }
        if (!formData.documentUpload) {
          newErrors.documentUpload = "Document Upload is required";
        }
      }
      if (!formData.englishLanguageRequirement) {
        newErrors.englishLanguageRequirement = "English Requirement is required";
      }
  
      // Only validate testName, score, and documentUpload if English test is given
      if (formData.englishLanguageRequirement === "Yes") {
        if (!formData.testName) {
          newErrors.testName = "Test Taken is required";
        }
        if (!formData.score) {
          newErrors.score = "Test Score is required";
        }
        if (!formData.documentUpload) {
          newErrors.documentUpload = "Document Upload is required";
        }
      }
    }

    // Step 5: Terms and Conditions Validation
    if (step === 6) {
      if (!formData.referralSource) {
        newErrors.referralSource = "Please specify how you heard about us";
      }
      if (!formData.termsAndConditionsAccepted) {
        newErrors.termsAndConditionsAccepted = "You must agree to the Terms and Conditions";
      }
      if (!formData.gdprAccepted) {
        newErrors.gdprAccepted = "You must agree to the GDPR Regulations";
      }
    }

    // If there are errors, set them and prevent moving to the next step
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // If no errors, proceed to the next step
    setStep(step + 1);
    setErrors({});
  };

  const handleBack = () => {
    setStep(step - 1);
    setErrors({});
  };

  const handleSubmit = async () => {
    if (!formData.termsAndConditionsAccepted || !formData.gdprAccepted) {
      toast.error("Please agree to the Terms and Conditions and GDPR Regulations.");
      return;
    }

    console.log(formData);
    

    const formDataToSend = new FormData();
    for (const key in formData) {
      if (formData[key] !== null && formData[key] !== undefined) {
        if (key === "document" || key === "documentUpload") {
          formDataToSend.append(key, formData[key]);
        } else {
          formDataToSend.append(key, formData[key]);
        }
      }
    }

    try {
      setLoading(true);
      const response = await axios.post(`${base_url}/student/register`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        toast.success("Registration successful. Please check your email for instructions. ");
        loginPageRedirect()
      }

    } catch (error) {
        toast.error("Error registering student:", error);
      if (error.response) {
        toast.error(`Error: ${error.response.data.message || "Registration failed. Please try again."}`);
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

 

  const getProgress = () => {
    return step * 16.67;
  };

  const getMinDate = () => {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 14);
    return today.toISOString().split("T")[0];
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
          {/* Heading */}
          <Typography variant="h4" align="center" gutterBottom>
            {step === 1
              ? "Personal Information"
              : step === 2
              ? "Contact Information"
              : step === 3
              ? "Address"
              : step === 4
              ? "Educational Background"
              : step === 5
              ? "Program Preferences"
              : "Terms and Conditions"}
          </Typography>

          {/* Progress Bar */}
          <LinearProgress variant="determinate" value={getProgress()} sx={{ mb: 3 }} />

          {/* Step 1: Personal Information */}
          {step === 1 && (
            <>
              <Stack spacing={2}>
                <TextField
                  label="First Name *"
                  name="firstName"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={formData.firstName}
                  onChange={handleChange}
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                />
                <TextField
                  label="Middle Name"
                  name="middleName"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={formData.middleName}
                  onChange={handleChange}
                />
                <TextField
                  label="Last Name *"
                  name="lastName"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={formData.lastName}
                  onChange={handleChange}
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                />
                <TextField
                  label="Date of Birth *"
                  type="date"
                  name="dateOfBirth"
                  variant="outlined"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  size="small"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  inputProps={{ max: getMinDate() }}
                  error={!!errors.dateOfBirth}
                  helperText={errors.dateOfBirth}
                />
                <TextField
                  select
                  label="Gender *"
                  name="gender"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={formData.gender}
                  onChange={handleChange}
                  error={!!errors.gender}
                  helperText={errors.gender}
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </TextField>
              </Stack>
              <Box mt={4} display="flex" justifyContent="flex-end">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                  sx={{ backgroundColor: "#2196F3", color: "#ffffff" }}
                >
                  Save & Next
                </Button>
              </Box>
            </>
          )}

          {/* Step 2: Contact Information */}
          {step === 2 && (
            <>
              <Stack spacing={2}>
                <TextField
                  label="Email ID *"
                  name="email"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={formData.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                />
                <TextField
                  label="Re-Enter Email ID *"
                  name="confirmEmail"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={formData.confirmEmail}
                  onChange={handleChange}
                  error={!!errors.confirmEmail}
                  helperText={errors.confirmEmail}
                />
                <TextField
                  label="Password *"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={formData.password}
                  onChange={handleChange}
                  error={!!errors.password}
                  helperText={errors.password}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleTogglePassword}>
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Box display="flex" gap={2}>
                  <TextField
                    select
                    label="Country Code"
                    name="countryCode"
                    value={formData.countryCode}
                    onChange={handleChange}
                  >
                    {countryCodes.map((country) => (
                      <MenuItem key={`${country.code}-${country.name}`} value={country.code}>
                        {`${country.code} (${country.name})`}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    label="Mobile No *"
                    name="telephoneNumber"
                    variant="outlined"
                    fullWidth
                    size="small"
                    value={formData.telephoneNumber}
                    onChange={handleChange}
                    error={!!errors.telephoneNumber}
                    helperText={errors.telephoneNumber}
                    inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }} // Restrict to numbers
                  />
                </Box>
                <Typography variant="body1" sx={{ mt: 2 }}>
                  Upload Passport *
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                  The details in the passport should be clearly visible.
                </Typography>
                <input
                  type="file"
                  accept=".jpg, .png, .pdf, .doc, .docx"
                  name="document"
                  onChange={handleFileChange}
                  style={{ marginTop: "8px" }}
                />
                {errors.document && (
                  <Typography variant="body2" color="error">
                    {errors.document}
                  </Typography>
                )}
              </Stack>
              <Box mt={4} display="flex" justifyContent="space-between">
                <Button variant="outlined" onClick={handleBack}>
                  Back
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                  sx={{ backgroundColor: "#2196F3", color: "#ffffff" }}
                >
                  Save & Next
                </Button>
              </Box>
            </>
          )}

        {step === 3 && (
          <>
            <Stack spacing={2}>
              <TextField
                select
                label="Country *"
                name="address.country"
                variant="outlined"
                fullWidth
                size="small"
                value={formData.address.country}
                onChange={handleChange}
                error={!!errors.country}
                helperText={errors.country}
              >
                {countryCodes.map((country) => (
                  <MenuItem key={`${country.code}-${country.name}`} value={country.name}>
                    {country.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="ZIP/Postal Code *"
                name="address.zip_postalCode"
                variant="outlined"
                fullWidth
                size="small"
                value={formData.address.zip_postalCode}
                onChange={handleChange}
                error={!!errors.zip_postalCode}
                helperText={errors.zip_postalCode}
              />
              <TextField
                label="State/Province/Region *"
                name="address.state_province_region"
                variant="outlined"
                fullWidth
                size="small"
                value={formData.address.state_province_region}
                onChange={handleChange}
                error={!!errors.state_province_region}
                helperText={errors.state_province_region}
              />
              <TextField
                label="City *"
                name="address.city"
                variant="outlined"
                fullWidth
                size="small"
                value={formData.address.city}
                onChange={handleChange}
                error={!!errors.city}
                helperText={errors.city}
              />
              <TextField
                label="Address Line *"
                name="address.addressLine"
                variant="outlined"
                fullWidth
                size="small"
                value={formData.address.addressLine}
                onChange={handleChange}
                error={!!errors.addressLine}
                helperText={errors.addressLine}
                placeholder="Enter address"
              />
            </Stack>
            <Box mt={4} display="flex" justifyContent="space-between">
              <Button variant="outlined" onClick={handleBack}>
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                sx={{ backgroundColor: "#2196F3", color: "#ffffff" }}
              >
                Save & Next
              </Button>
            </Box>
          </>
        )}


          {step === 4 && (
            <>
              <Stack spacing={2}>
                <TextField
                  select
                  label="Most Recent Education *"
                  name="mostRecentEducation"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={formData.mostRecentEducation}
                  onChange={handleChange}
                  error={!!errors.mostRecentEducation}
                  helperText={errors.mostRecentEducation}
                >
                  <MenuItem value="BTech">BTech</MenuItem>
                  <MenuItem value="Diploma">Diploma</MenuItem>
                  <MenuItem value="Degree">Degree</MenuItem>
                  <MenuItem value="Masters">Masters</MenuItem>
                  <MenuItem value="PHD">PHD</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </TextField>
                {formData.mostRecentEducation === "Other" && (
                  <TextField
                    label="Name of Recent Education *"
                    name="otherEducationName"
                    variant="outlined"
                    fullWidth
                    size="small"
                    value={formData.otherEducationName}
                    onChange={handleChange}
                    error={!!errors.otherEducationName}
                    helperText={errors.otherEducationName}
                  />
                )}
                <TextField
                  select
                  label="Year of Graduation *"
                  name="yearOfGraduation"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={formData.yearOfGraduation}
                  onChange={handleChange}
                  error={!!errors.yearOfGraduation}
                  helperText={errors.yearOfGraduation}
                >
                  {Array.from({ length: 11 }, (_, i) => 2024 - i).map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  label="Name of College/University *"
                  name="collegeUniversity"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={formData.collegeUniversity}
                  onChange={handleChange}
                  error={!!errors.collegeUniversity}
                  helperText={errors.collegeUniversity}
                />
                <TextField
                  select
                  label="What type of program you are interested in? *"
                  name="programType"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={formData.programType}
                  onChange={handleChange}
                  error={!!errors.programType}
                  helperText={errors.programType}
                >
                  <MenuItem value="Graduation">Graduation</MenuItem>
                  <MenuItem value="Post Graduation">Post Graduation</MenuItem>
                  <MenuItem value="Under Graduation">Under Graduation</MenuItem>
                  <MenuItem value="PHD">PHD</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </TextField>
                {formData.programType === "Other" && (
                  <TextField
                    label="Name of Program *"
                    name="otherProgramName"
                    variant="outlined"
                    fullWidth
                    size="small"
                    value={formData.otherProgramName}
                    onChange={handleChange}
                    error={!!errors.otherProgramName}
                    helperText={errors.otherProgramName}
                  />
                )}
                <TextField
                  select
                  label="Any specific discipline? *"
                  name="discipline"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={formData.discipline}
                  onChange={handleChange}
                  error={!!errors.discipline}
                  helperText={errors.discipline}
                >
                  <MenuItem value="Computers">Computers</MenuItem>
                  <MenuItem value="Business">Business</MenuItem>
                  <MenuItem value="Marketing">Marketing</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </TextField>
                {formData.discipline === "Other" && (
                  <TextField
                    label="Name of discipline *"
                    name="otherDisciplineName"
                    variant="outlined"
                    fullWidth
                    size="small"
                    value={formData.otherDisciplineName}
                    onChange={handleChange}
                    error={!!errors.otherDisciplineName}
                    helperText={errors.otherDisciplineName}
                  />
                )}
              </Stack>
              <Box mt={4} display="flex" justifyContent="space-between">
                <Button variant="outlined" onClick={handleBack}>
                  Back
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                  sx={{ backgroundColor: "#2196F3", color: "#ffffff" }}
                >
                  Save & Next
                </Button>
              </Box>
            </>
          )}

          {/* Step 4: Program Preferences */}
          {step === 5 && (
            <>
              <Stack spacing={2}>
                {/* <TextField
                  select
                  label="Country you are applying from *"
                  name="countryApplyingFrom"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={formData.countryApplyingFrom}
                  onChange={handleChange}
                  error={!!errors.countryApplyingFrom}
                  helperText={errors.countryApplyingFrom}
                >
                  <MenuItem value="UK">UK</MenuItem>
                  <MenuItem value="India">India</MenuItem>
                  <MenuItem value="Nepal">Nepal</MenuItem>
                  <MenuItem value="Pakistan">Pakistan</MenuItem>
                  <MenuItem value="Bangladesh">Bangladesh</MenuItem>
                  <MenuItem value="Philippines">Philippines</MenuItem>
                  <MenuItem value="Vietnam">Vietnam</MenuItem>
                  <MenuItem value="Sudan">Sudan</MenuItem>
                  <MenuItem value="Egypt">Egypt</MenuItem>
                  <MenuItem value="Bhutan">Bhutan</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </TextField>
                {formData.countryApplyingFrom === "Other" && (
                  <TextField
                    label="Name of Country *"
                    name="countryName"
                    variant="outlined"
                    fullWidth
                    size="small"
                    value={formData.countryName}
                    onChange={handleChange}
                    error={!!errors.countryName}
                    helperText={errors.countryName}
                  />
                )} */}
                <TextField
                  select
                  label="Any preferred university? *"
                  name="preferredUniversity"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={formData.preferredUniversity}
                  onChange={handleChange}
                  error={!!errors.preferredUniversity}
                  helperText={errors.preferredUniversity}
                >
                  <MenuItem value="Yes">Yes</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                </TextField>
                {formData.preferredUniversity === "Yes" && (
                  <TextField
                    label="Name of University *"
                    name="NameOfUniversity"
                    variant="outlined"
                    fullWidth
                    size="small"
                    value={formData.NameOfUniversity}
                    onChange={handleChange}
                    error={!!errors.NameOfUniversity}
                    helperText={errors.NameOfUniversity}
                  />
                )}
                <TextField
                  select
                  label="Any preferred course? *"
                  name="preferredCourse"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={formData.preferredCourse}
                  onChange={handleChange}
                  error={!!errors.preferredCourse}
                  helperText={errors.preferredCourse}
                >
                  <MenuItem value="Yes">Yes</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                </TextField>
                {formData.preferredCourse === "Yes" && (
                  <TextField
                    label="Name of Course *"
                    name="NameOfCourse"
                    variant="outlined"
                    fullWidth
                    size="small"
                    value={formData.NameOfCourse}
                    onChange={handleChange}
                    error={!!errors.NameOfCourse}
                    helperText={errors.NameOfCourse}
                  />
                )}
                <TextField
                  select
                  label="When do you want to start your course? *"
                  name="courseStartTimeline"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={formData.courseStartTimeline}
                  onChange={handleChange}
                  error={!!errors.courseStartTimeline}
                  helperText={errors.courseStartTimeline}
                >
                  <MenuItem value="3 months">3 months</MenuItem>
                  <MenuItem value="6 months">6 months</MenuItem>
                  <MenuItem value="9 months">9 months</MenuItem>
                  <MenuItem value="1 year">1 year</MenuItem>
                </TextField>
                <TextField
                  select
                  label="Any English Language Test Given? *"
                  name="englishLanguageRequirement"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={formData.englishLanguageRequirement}
                  onChange={handleChange}
                  error={!!errors.englishLanguageRequirement}
                  helperText={errors.englishLanguageRequirement}
                >
                  <MenuItem value="Yes">Yes</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                </TextField>
                {formData.englishLanguageRequirement === "Yes" && (
  <>
    <TextField
      select
      label="Name of the test taken *"
      name="testName"
      variant="outlined"
      fullWidth
      size="small"
      value={formData.testName}
      onChange={handleChange}
      error={!!errors.testName}
      helperText={errors.testName}
    >
      <MenuItem value="TOEFL">TOEFL</MenuItem>
      <MenuItem value="IELTS">IELTS</MenuItem>
      <MenuItem value="Other">Other</MenuItem>
    </TextField>
    <TextField
      label="Score *"
      name="score"
      variant="outlined"
      fullWidth
      size="small"
      value={formData.score}
      onChange={handleChange}
      error={!!errors.score}
      helperText={errors.score}
    />
    <Typography variant="body1" sx={{ mt: 2 }}>
      Upload Document *
    </Typography>
    <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
      Upload your English language test score document.
    </Typography>
    <input
      type="file"
      accept=".jpg, .png, .pdf, .doc, .docx"
      name="documentUpload"
      onChange={handleFileChange}
      style={{ marginTop: "8px" }}
    />
    {errors.documentUpload && (
      <Typography variant="body2" color="error">
        {errors.documentUpload}
      </Typography>
    )}
  </>
)}
              </Stack>
              <Box mt={4} display="flex" justifyContent="space-between">
                <Button variant="outlined" onClick={handleBack}>
                  Back
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                  sx={{ backgroundColor: "#2196F3", color: "#ffffff" }}
                >
                  Save & Next
                </Button>
              </Box>
            </>
          )}

          {/* Step 5: Terms and Conditions */}
          {step === 6 && (
            <>
              <Stack spacing={2}>
                <TextField
                  select
                  label="How did you hear about us? *"
                  name="referralSource"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={formData.referralSource}
                  onChange={handleChange}
                >
                  <MenuItem value="Social media">Social media (e.g., Facebook, Instagram, LinkedIn)</MenuItem>
                  <MenuItem value="Referral">Referral from a friend/family member</MenuItem>
                  <MenuItem value="Online search">Online search/Google</MenuItem>
                  <MenuItem value="Education fair">Education fair/exhibition</MenuItem>
                  <MenuItem value="Advertisement">Advertisement (online/offline)</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </TextField>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="termsAndConditionsAccepted"
                      checked={formData.termsAndConditionsAccepted}
                      onChange={(e) => setFormData({ ...formData, termsAndConditionsAccepted: e.target.checked })}
                    />
                  }
                  label={
                    <Typography>
                      I agree to{" "}
                      <Link href="#" underline="always">
                        Terms and Conditions
                      </Link>
                    </Typography>
                  }
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      name="gdprAccepted"
                      checked={formData.gdprAccepted}
                      onChange={(e) => setFormData({ ...formData, gdprAccepted: e.target.checked })}
                    />
                  }
                  label={
                    <Typography>
                      I agree to{" "}
                      <Link href="#" underline="always">
                        GDPR Regulations
                      </Link>
                    </Typography>
                  }
                />
              </Stack>
              <Box mt={4} display="flex" justifyContent="space-between">
                <Button variant="outlined" onClick={handleBack}>
                  Back
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  sx={{ backgroundColor: "#2196F3", color: "#ffffff" }}
                >
                  Submit
                </Button>
              </Box>
            </>
          )}
        </Box>
        <Toaster />
    </Container>
  );
};

export default Registration;