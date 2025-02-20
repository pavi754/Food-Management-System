import React, { useState, useEffect } from "react";
import { Container, Table, TableHead, TableRow, TableCell, TableBody, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, MenuItem } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

const roles = ["Chef", "Delivery Boy", "Waiter", "Manager", "Senior Chef"];

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [employee, setEmployee] = useState({ name: "", role: roles[0], salary: "", image: "" });

  useEffect(() => {
    fetch("https://randomuser.me/api/?results=5")
      .then(response => response.json())
      .then(data => {
        const fetchedEmployees = data.results.map((user, index) => ({
          name: `${user.name.first} ${user.name.last}`,
          role: roles[index % roles.length],
          salary: Math.floor(Math.random() * 50000) + 30000,
          image: user.picture.medium
        }));
        setEmployees(fetchedEmployees);
      })
      .catch(error => console.error("Error fetching data:", error));
  }, []);

  const handleOpen = (index = null) => {
    setEditingIndex(index);
    setEmployee(index !== null ? employees[index] : { name: "", role: roles[0], salary: "", image: "" });
    setOpen(true);
  };

  const handleClose = () => setOpen(false);
  const handleDeleteClose = () => setDeleteOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee({ ...employee, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setEmployee({ ...employee, image: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!employee.name || !employee.salary) {
      alert("Please fill in all fields.");
      return;
    }
    if (editingIndex !== null) {
      const updatedEmployees = [...employees];
      updatedEmployees[editingIndex] = employee;
      setEmployees(updatedEmployees);
    } else {
      setEmployees([...employees, employee]);
    }
    handleClose();
  };

  const handleDeleteConfirm = (index) => {
    setDeleteIndex(index);
    setDeleteOpen(true);
  };

  const handleDelete = () => {
    if (deleteIndex !== null) {
      const updatedEmployees = employees.filter((_, i) => i !== deleteIndex);
      setEmployees(updatedEmployees);
      setDeleteIndex(null);
      setDeleteOpen(false);
    }
  };

  return (
    <Container>
      <h2>Employee Management</h2>
      <Button variant="contained" color="primary" onClick={() => handleOpen()}>Add Employee</Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Image</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Salary</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {employees.map((emp, index) => (
            <TableRow key={index}>
              <TableCell>
                {emp.image && <img src={emp.image} alt="profile" width="50" height="50" style={{ borderRadius: "50%" }} />}
              </TableCell>
              <TableCell>{emp.name}</TableCell>
              <TableCell>{emp.role}</TableCell>
              <TableCell>${emp.salary}</TableCell>
              <TableCell>
                <IconButton color="primary" onClick={() => handleOpen(index)}><Edit /></IconButton>
                <IconButton color="secondary" onClick={() => handleDeleteConfirm(index)}><Delete /></IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editingIndex !== null ? "Edit Employee" : "Add Employee"}</DialogTitle>
        <DialogContent>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {employee.image && <img src={employee.image} alt="preview" width="100" style={{ display: "block", margin: "10px 0" }} />}
          <TextField margin="dense" name="name" label="Name" fullWidth value={employee.name} onChange={handleChange} />
          <TextField select margin="dense" name="role" label="Role" fullWidth value={employee.role} onChange={handleChange}>
            {roles.map(role => (
              <MenuItem key={role} value={role}>{role}</MenuItem>
            ))}
          </TextField>
          <TextField margin="dense" name="salary" label="Salary" type="number" fullWidth value={employee.salary} onChange={handleChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="primary">Save</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteOpen} onClose={handleDeleteClose}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Are you sure you want to delete this employee?</DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose}>Cancel</Button>
          <Button onClick={handleDelete} variant="contained" color="secondary">Delete</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EmployeeManagement;
