import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Make sure to import useNavigate
// @mui
import { alpha } from '@mui/material/styles';
import {
  Box, Divider, Typography, Stack, MenuItem, Avatar, IconButton, Button, Popover,
} from '@mui/material';
// mocks
import account from '../../../_mock/account';
import { useAuth } from '../../../context/AuthContext';

const MENU_OPTIONS = [
  { label: 'Home', icon: 'eva:home-fill' },
  { label: 'Profile', icon: 'eva:person-fill' },
  { label: 'Settings', icon: 'eva:settings-2-fill' },
];

export default function AccountPopover() {
  const [open, setOpen] = useState(null);
  // Placeholder for isLoggedIn state. This might be passed down from a parent component or managed globally
  const [setIsLoggedIn] = useState(false); // Assuming this state is managed here for simplicity
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleLogin = () => {
    navigate('/login'); // Redirect to /login
  };


  const handleLogout = async () => {
  try {
    const response = await fetch("/api/signout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // No need to send email and password for logging out
    });

    if (response.ok) {
      logout(); // Correctly update logout state
      // If `handleClose` is meant to close a dialog or similar component
      handleClose();
    } else {
      throw new Error('Logout failed');
    }
  } catch (error) {
    console.error('Logout error:', error);
    // Optionally handle error state here (e.g., show an error message)
  }
};


  
  return (
    <>
      {!isLoggedIn && <Button onClick={handleLogin}>Login</Button>}
      {isLoggedIn && (
        <>
          <IconButton
            onClick={handleOpen}
            sx={{
              p: 0,
              ...(open && {
                '&:before': {
                  zIndex: 1,
                  content: "''",
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  position: 'absolute',
                  bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
                },
              }),
            }}
          >
            <Avatar src={account.photoURL} alt="photoURL" />
          </IconButton>

          <Popover
            open={Boolean(open)}
            anchorEl={open}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            PaperProps={{
              sx: {
                p: 0,
                mt: 1.5,
                ml: 0.75,
                width: 180,
                '& .MuiMenuItem-root': {
                  typography: 'body2',
                  borderRadius: 0.75,
                },
              },
            }}
          >
            <Box sx={{ my: 1.5, px: 2.5 }}>
              <Typography variant="subtitle2" noWrap>
                {account.displayName}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                {account.email}
              </Typography>
            </Box>

            <Divider sx={{ borderStyle: 'dashed' }} />

            <Stack sx={{ p: 1 }}>
              {MENU_OPTIONS.map((option) => (
                <MenuItem key={option.label} onClick={handleClose}>
                  {option.label}
                </MenuItem>
              ))}
            </Stack>

            <Divider sx={{ borderStyle: 'dashed' }} />

            <MenuItem onClick={handleLogout} sx={{ m: 1 }}>
              Logout
            </MenuItem>
          </Popover>
        </>
      )}
    </>
  );
}
