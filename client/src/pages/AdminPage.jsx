import React, { useState, useEffect } from 'react';
import { Typography, Box, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    fetch('/api/users')
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error fetching user data:', error));
  };

  const handleDeleteUser = (userId) => {
    fetch(`/api/users/${userId}`, { method: 'DELETE' })
      .then(response => {
        if (response.ok) {
          setUsers(users.filter(user => user.id !== userId));
          alert('User deleted successfully');
        }
      })
      .catch(error => console.error('Error deleting user:', error));
  };

  const handleChangePassword = (userId) => {
    fetch(`/api/users/${userId}/password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password: newPassword })
    })
    .then(response => {
      if (response.ok) {
        alert('Password updated successfully');
        setSelectedUser(null); // Close dialog
      }
    })
    .catch(error => console.error('Error updating password:', error));
  };

  const openPasswordDialog = (user) => {
    setSelectedUser(user);
    setNewPassword('');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 5 }}>
        Admin Dashboard
      </Typography>
      <Button onClick={fetchUsers}>Refresh User List</Button>
      {users.map(user => (
        <Box key={user.id}>
          <Typography>{user.email}</Typography>
          <Button onClick={() => handleDeleteUser(user.id)}>Delete User</Button>
          <Button onClick={() => openPasswordDialog(user)}>Change Password</Button>
        </Box>
      ))}
      {selectedUser && (
        <Dialog open={Boolean(selectedUser)} onClose={() => setSelectedUser(null)}>
          <DialogTitle>Change Password</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="password"
              label="New Password"
              type="password"
              fullWidth
              variant="outlined"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelectedUser(null)}>Cancel</Button>
            <Button onClick={() => handleChangePassword(selectedUser.id)}>Update Password</Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}
