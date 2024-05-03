import React, { useState, useEffect } from 'react';
import { Typography, Box, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Grid } from '@mui/material';

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
        console.log(response)
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
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography variant="h4" sx={{ mb: 5 }}>
            Admin Dashboard
          </Typography>
        </Grid>
        <Grid item>
          <Button variant="contained" onClick={fetchUsers} sx={{ mb: 5 }}>Refresh User List</Button>
        </Grid>
      </Grid>
      <Paper elevation={4} sx={{ width: '100%', overflow: 'hidden' }}>
        {users.map(user => (
          <Box key={user.id} sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee' }}>
            <Typography>{user.email}</Typography>
            <Box>
              <Button color="primary" onClick={() => openPasswordDialog(user)} sx={{ marginRight: 1 }}>
                Change Password
              </Button>
              <Button color="error" onClick={() => handleDeleteUser(user.id)}>
                Delete User
              </Button>
            </Box>
          </Box>
        ))}
      </Paper>
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
