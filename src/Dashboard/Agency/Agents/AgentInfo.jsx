import React, { useState } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Modal,
  Box,
  Select,
  MenuItem,
} from "@mui/material";
import * as XLSX from "xlsx";

const AgentInfo = () => {
  const [rows, setRows] = useState([
    { name: "Boris Johnson", id: "A001", gender: "Male", availability: "yes", applications_handled: 4 },
    { name: "Rishi Sunak", id: "A002", gender: "Male", availability: "yes", applications_handled: 4 },
    { name: "Keir Starmer", id: "A003", gender: "Male", availability: "no", applications_handled: 4 },
    { name: "Theresa May", id: "A004", gender: "Female", availability: "yes", applications_handled: 4 },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAgentIndex, setSelectedAgentIndex] = useState(null);
  const [students, setStudents] = useState([
    { id: 1, name: "John Doe", documents: ["doc1.pdf", "doc2.pdf"], agent: "Boris Johnson" },
    { id: 2, name: "Jane Smith", documents: ["doc3.pdf"], agent: "Boris Johnson" },
    { id: 3, name: "Alice Johnson", documents: ["doc4.pdf"], agent: "Boris Johnson" },
    { id: 4, name: "Bob Brown", documents: ["doc5.pdf"], agent: "Boris Johnson" },
  ]);
  const [batchedUpdates, setBatchedUpdates] = useState([]);

  const openModal = (index) => {
    setSelectedAgentIndex(index);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedAgentIndex(null);
    setBatchedUpdates([]);
  };

  const handleReassign = (studentIndex, newAgent) => {
    const updatedStudents = [...students];
    const updatedStudent = { ...updatedStudents[studentIndex], agent: newAgent };
    updatedStudents[studentIndex] = updatedStudent;

    // Add or update the batched changes
    const existingUpdateIndex = batchedUpdates.findIndex((update) => update.id === updatedStudent.id);
    if (existingUpdateIndex !== -1) {
      batchedUpdates[existingUpdateIndex] = { id: updatedStudent.id, newAgent };
    } else {
      batchedUpdates.push({ id: updatedStudent.id, newAgent });
    }

    setStudents(updatedStudents);
    setBatchedUpdates([...batchedUpdates]);
  };

  const handleSaveChanges = async () => {
    try {
      // Perform a single POST request with batched updates
      const response = await fetch("/api/updateAgents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(batchedUpdates),
      });

      if (response.ok) {
        console.log("Updates saved successfully");
        setBatchedUpdates([]);
        closeModal();
      } else {
        console.error("Failed to save updates");
      }
    } catch (error) {
      console.error("Error during save changes:", error);
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Agent Info");
    XLSX.writeFile(workbook, "AgentInfo.xlsx");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Agent Information</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Availability</TableCell>
              <TableCell>Documents Handled</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.gender}</TableCell>
                <TableCell
                  style={{
                    color: row.availability === "yes" ? "green" : "red",
                    fontWeight: "bold",
                  }}
                >
                  {row.availability}
                </TableCell>
                <TableCell>
                  {row.applications_handled}{" "}
                  <Button
                    style={{ marginLeft: "10px" }}
                    variant="contained"
                    size="small"
                    onClick={() => openModal(index)}
                  >
                    View Applications
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button
        variant="contained"
        color="primary"
        style={{ marginTop: "20px" }}
        onClick={exportToExcel}
      >
        Export Data
      </Button>

      {/* Modal */}
      {selectedAgentIndex !== null && (
        <Modal open={modalOpen} onClose={closeModal}>
          <Box
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 600,
              backgroundColor: "white",
              borderRadius: 8,
              boxShadow: 24,
              padding: "20px",
            }}
          >
            <h3>Agent: {rows[selectedAgentIndex].name}</h3>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Student Name</TableCell>
                  <TableCell>View Application</TableCell>
                  <TableCell>Assign</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students
                  .filter((student) => student.agent === rows[selectedAgentIndex].name)
                  .map((student, studentIndex) => (
                    <TableRow key={studentIndex}>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() =>
                            window.open(
                              `/applications/${student.name}`,
                              "_blank"
                            )
                          }
                        >
                          View
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={student.agent}
                          onChange={(e) =>
                            handleReassign(studentIndex, e.target.value)
                          }
                        >
                          {rows.map((agent) => (
                            <MenuItem
                              key={agent.name}
                              value={agent.name}
                              disabled={agent.name === student.agent}
                            >
                              {agent.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            {batchedUpdates.length > 0 && (
              <Button
                variant="contained"
                color="secondary"
                style={{ marginTop: "20px" }}
                onClick={handleSaveChanges}
              >
                Save Changes
              </Button>
            )}
            <Button
              variant="outlined"
              color="secondary"
              style={{ marginTop: "10px", marginLeft: "10px" }}
              onClick={closeModal}
            >
              Close
            </Button>
          </Box>
        </Modal>
      )}
    </div>
  );
};

export default AgentInfo;
