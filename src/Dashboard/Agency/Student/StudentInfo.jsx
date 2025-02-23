import React, { useEffect, useState } from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, InputAdornment, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import * as XLSX from 'xlsx';

const StudentInfo = () => {
  const base_url = 'http://localhost:3000';
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // State for search term

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${base_url}/agency/students`);
        const data = await response.json();
        console.log(data);
        setStudents(data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Transform the data to the desired format
  const transformedData = students.map(student => ({
    name: `${student.firstName} ${student.middleName || ''} ${student.lastName}`,
    email: student.email,
    nationality: student.countryApplyingFrom,
    phone: student.telephoneNumber,
    preferred_University: student.preferredUniversity,
  }));

  // Filter data based on search term
  const filteredData = transformedData.filter(student => {
    const searchLower = searchTerm.toLowerCase();
    return (
      student.name?.toLowerCase().includes(searchLower) ||
      student.email?.toLowerCase().includes(searchLower) ||
      student.nationality?.toLowerCase().includes(searchLower) ||
      student.phone?.toLowerCase().includes(searchLower) ||
      student.preferred_University?.toLowerCase().includes(searchLower)
    );
  });

  // Function to export data to Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData); // Use filtered data for export
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Student Info');
    XLSX.writeFile(workbook, 'StudentInfo.xlsx');
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* Header and Search Input */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        marginBottom="20px"
      >
        <h2>Student Information</h2>
        {/* Search Input Field */}
        <TextField
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          style={{ width: '300px' }} // Adjust the width as needed
        />
      </Box>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Nationality</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Preferred University</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.nationality}</TableCell>
                <TableCell>{row.phone}</TableCell>
                <TableCell>{row.preferred_University}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Export Button */}
      <Button
        variant="contained"
        color="primary"
        style={{ marginTop: '20px' }}
        onClick={exportToExcel}
      >
        Export Data
      </Button>
    </div>
  );
};

export default StudentInfo;