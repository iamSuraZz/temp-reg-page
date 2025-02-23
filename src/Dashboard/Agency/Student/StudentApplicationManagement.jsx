import React, { useState } from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Tabs, Tab, MenuItem, Select } from '@mui/material';
import * as XLSX from 'xlsx';

const StudentApplicationManagement = () => {
  const [activeTab, setActiveTab] = useState(0); // 0 = Student Applications, 1 = Pending, 2 = Accepted, etc.
  const [applications, setApplications] = useState([
    { name: 'John Doe', id: 'S001', gender: 'Male', course: 'Chemical Engineering', phone: '1234567890', status: 'Pending' },
    { name: 'Jane Smith', id: 'S002', gender: 'Female', course: 'Dip. Civil Engineering', phone: '9876543210', status: 'Accepted' },
    { name: 'Alice Johnson', id: 'S003', gender: 'Female', course: 'Bsc Computer Eng', phone: '4561237890', status: 'Rejected' },
    { name: 'Michael Brown', id: 'S004', gender: 'Male', course: 'MBA Finance', phone: '7891234560', status: 'Pending' },
    { name: 'Emma Davis', id: 'S005', gender: 'Female', course: 'Msc Data Science', phone: '6547893210', status: 'Withdrawn' },
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
      if (activeTab === 0) return true; // Student Applications
      if (activeTab === 1) return app.status === 'Pending';
      if (activeTab === 2) return app.status === 'Accepted';
      if (activeTab === 3) return app.status === 'Rejected';
      if (activeTab === 4) return app.status === 'Withdrawn';
      return false;
    });

    const worksheet = XLSX.utils.json_to_sheet(filteredApplications);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Applications');
    XLSX.writeFile(workbook, 'StudentApplications.csv');
  };

  const filteredApplications = applications.filter((app) => {
    if (activeTab === 0) return true; // Student Applications
    if (activeTab === 1) return app.status === 'Pending';
    if (activeTab === 2) return app.status === 'Accepted';
    if (activeTab === 3) return app.status === 'Rejected';
    if (activeTab === 4) return app.status === 'Withdrawn';
    return false;
  });

  return (
    <div style={{ padding: '20px' }}>
      <h2>Student Application Management</h2>
      <Tabs value={activeTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
        <Tab label="Student Applications" />
        <Tab label="Pending Applications" />
        <Tab label="Accepted Applications" />
        <Tab label="Rejected Applications" />
        <Tab label="Withdrawn Applications" />
      </Tabs>

      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Course</TableCell>
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
                <TableCell>{row.course}</TableCell>
                <TableCell>{row.phone}</TableCell>
                <TableCell>
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
                </TableCell>
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

export default StudentApplicationManagement;
