import React, { useState, useEffect } from "react";
import { Container, Table, TableHead, TableRow, TableCell, TableBody, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [user, setUser] = useState({ name: "", email: "", phone: "", address: "", paymentMethod: "", image: "" });

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    setUsers(storedUsers);
  }, []);

  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  const handleOpen = (index = null) => {
    setEditingIndex(index);
    setUser(index !== null ? users[index] : { name: "", email: "", phone: "", address: "", paymentMethod: "", image: "" });
    setOpen(true);
  };

  const handleClose = () => setOpen(false);
  const handleDeleteClose = () => setDeleteOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setUser({ ...user, image: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!user.name || !user.email || !user.phone || !user.address || !user.paymentMethod) {
      alert("All fields are required!");
      return;
    }

    if (editingIndex !== null) {
      const updatedUsers = [...users];
      updatedUsers[editingIndex] = user;
      setUsers(updatedUsers);
    } else {
      setUsers([...users, { ...user, image: user.image || "https://via.placeholder.com/50" }]);
    }
    handleClose();
  };

  const handleDeleteConfirm = (index) => {
    setDeleteIndex(index);
    setDeleteOpen(true);
  };

  const handleDelete = () => {
    if (deleteIndex !== null) {
      const updatedUsers = users.filter((_, i) => i !== deleteIndex);
      setUsers(updatedUsers);
      setDeleteIndex(null);
      setDeleteOpen(false);
    }
  };

  return (
    <Container>
      <h2>User Management</h2>
      <Button variant="contained" color="primary" onClick={() => handleOpen()}>Add User</Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Image</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Address</TableCell>
            <TableCell>Payment Method</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user, index) => (
            <TableRow key={index}>
              <TableCell>
                {user.image && <img src={user.image} alt="profile" width="50" height="50" style={{ borderRadius: "50%" }} />}
              </TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.phone}</TableCell>
              <TableCell>{user.address}</TableCell>
              <TableCell>{user.paymentMethod}</TableCell>
              <TableCell>
                <IconButton color="primary" onClick={() => handleOpen(index)}><Edit /></IconButton>
                <IconButton color="secondary" onClick={() => handleDeleteConfirm(index)}><Delete /></IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editingIndex !== null ? "Edit User" : "Add User"}</DialogTitle>
        <DialogContent>
          <TextField label="Name" name="name" value={user.name} onChange={handleChange} fullWidth margin="dense" />
          <TextField label="Email" name="email" value={user.email} onChange={handleChange} fullWidth margin="dense" />
          <TextField label="Phone" name="phone" value={user.phone} onChange={handleChange} fullWidth margin="dense" />
          <TextField label="Address" name="address" value={user.address} onChange={handleChange} fullWidth margin="dense" />
          <TextField label="Payment Method" name="paymentMethod" value={user.paymentMethod} onChange={handleChange} fullWidth margin="dense" />
          <input type="file" accept="image/*" onChange={handleImageChange} style={{ marginTop: "10px" }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">Cancel</Button>
          <Button onClick={handleSave} color="primary">Save</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteOpen} onClose={handleDeleteClose}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Are you sure you want to delete this user?</DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose}>Cancel</Button>
          <Button onClick={handleDelete} variant="contained" color="secondary">Delete</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserManagement;
