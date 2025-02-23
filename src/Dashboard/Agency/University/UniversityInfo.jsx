import React, { useState } from 'react';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import * as XLSX from 'xlsx';
import AddUniversityForm from './AddUniversityForm';

const UniversityInfo = () => {
  const [open, setOpen] = useState(false); // State to control modal visibility

  // Dummy data for the table
  const rows = [
    { name: 'Stanford University', id: 'U001', gender: 'Male', dob: '1995-06-15', phone: '1234567890' },
    { name: 'Oxford University', id: 'U002', gender: 'Female', dob: '1996-04-10', phone: '9876543210' },
    { name: 'Imperial College London', id: 'U003', gender: 'Female', dob: '1998-01-22', phone: '4561237890' },
    { name: 'University of Edinburgh', id: 'U004', gender: 'Male', dob: '1994-12-05', phone: '7891234560' },
  ];

  // Function to export data to Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(rows); // Convert rows to Excel sheet
    const workbook = XLSX.utils.book_new(); // Create a new workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'University Info'); // Append sheet to workbook
    XLSX.writeFile(workbook, 'UniversityInfo.xlsx'); // Save as file
  };

  // Handlers for modal
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>University Information</h2>
        <Button variant="contained" color="secondary" onClick={handleOpen}>
          Add University
        </Button>
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>DOB</TableCell>
              <TableCell>Phone Number</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.gender}</TableCell>
                <TableCell>{row.dob}</TableCell>
                <TableCell>{row.phone}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button variant="contained" color="primary" style={{ marginTop: '20px' }} onClick={exportToExcel}>
        Export Data
      </Button>

      {/* Modal for Add University */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Add University</DialogTitle>
        <DialogContent>
          <AddUniversityForm onClose={handleClose} />
        </DialogContent>
        {/* <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
        </DialogActions> */}
      </Dialog>
    </div>
  );
};

export default UniversityInfo;
