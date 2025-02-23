

import React, { useState } from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Tabs, Tab, MenuItem, Select } from '@mui/material';
import * as XLSX from 'xlsx';

const UniversityApplicationManagement = () => {
  const [activeTab, setActiveTab] = useState(0); // 0 = University Applications, 1 = Pending, 2 = Accepted, etc.
  const [applications, setApplications] = useState([
    { name: 'John Doe', id: 'S001', gender: 'Male', dob: '1995-06-15', phone: '1234567890', status: 'Pending' },
    { name: 'Jane Smith', id: 'S002', gender: 'Female', dob: '1996-04-10', phone: '9876543210', status: 'Accepted' },
    { name: 'Alice Johnson', id: 'S003', gender: 'Female', dob: '1998-01-22', phone: '4561237890', status: 'Rejected' },
    { name: 'Michael Brown', id: 'S004', gender: 'Male', dob: '1994-12-05', phone: '7891234560', status: 'Pending' },
  ]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleStatusChange = (id, newStatus) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
    );
  };

  const exportToCSV = () => {
    const filteredApplications = applications.filter((app) => {
      if (activeTab === 0) return true; // University Applications
      if (activeTab === 1) return app.status === 'Pending';
      if (activeTab === 2) return app.status === 'Accepted';
      if (activeTab === 3) return app.status === 'Rejected';
      return false;
    });

    const worksheet = XLSX.utils.json_to_sheet(filteredApplications);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Applications');
    XLSX.writeFile(workbook, 'UniversityApplications.csv');
  };

  const filteredApplications = applications.filter((app) => {
    if (activeTab === 0) return true; // University Applications
    if (activeTab === 1) return app.status === 'Pending';
    if (activeTab === 2) return app.status === 'Accepted';
    if (activeTab === 3) return app.status === 'Rejected';
    return false;
  });

  return (
    <div style={{ padding: '20px' }}>
      <h2>University Application Management</h2>
      <Tabs value={activeTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
        <Tab label="University Applications" />
        <Tab label="Pending Applications" />
        <Tab label="Accepted Applications" />
        <Tab label="Rejected Applications" />
      </Tabs>

      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Null</TableCell>
              <TableCell>DOB</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredApplications.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.gender}</TableCell>
                <TableCell>{row.dob}</TableCell>
                <TableCell>{row.phone}</TableCell>
                {/* <TableCell>
                  {activeTab === 1 ? (
                    <Select
                      value={row.status}
                      onChange={(e) => handleStatusChange(row.id, e.target.value)}
                    >
                      <MenuItem value="Accepted" style={{ color: 'green' }}>
                        Accept
                      </MenuItem>
                      <MenuItem value="Rejected" style={{ color: 'red' }}>
                        Reject
                      </MenuItem>
                    </Select>
                  ) : (
                    row.status
                  )}
                </TableCell> */}
                <TableCell>{row.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Button
        variant="contained"
        color="primary"
        style={{ marginTop: '20px' }}
        onClick={exportToCSV}
      >
        Export Data
      </Button>
    </div>
  );
};

export default UniversityApplicationManagement;
