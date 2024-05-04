import { useState } from "react";
import validator from 'validator'; // Import validator for email checking
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useAuth } from "../context/AuthContext";
import MD5 from 'crypto-js/md5';
import { useNavigate } from 'react-router-dom';

const defaultTheme = createTheme();

export default function SignIn() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const email = data.get("email");
    const password = data.get("password");
    const passwordHash = MD5(password).toString();

    // Validate email
    // to do check name, after 3 times say contact admin, fix state for admin
    if (!validator.isEmail(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    try {
      if (isRegistering) {
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/;
        if (!passwordRegex.test(password)) {
          alert("Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.");
          return;
        }
        // Registration
        const name = data.get("name");
        const registrationError = await register(name, email, passwordHash);
        if (!registrationError) {
          navigate('/'); // Redirect to homepage only if registration is successful
        } else {
          // Display the registration error message or handle it accordingly
          console.error("Registration failed:", registrationError);
          alert(`Registration failed: ${registrationError}`);
        }
      } else {
        const loginError = await login(email, passwordHash);
        if (!loginError) {
          navigate('/'); // Redirect to homepage
        }
        else {
          console.error("Login failed:", loginError);
          alert(`Login failed: ${loginError}`);
        }
      }
    } catch (error) {
      console.error(
        `${isRegistering ? "Registration" : "Sign-in"} failed:`,
        error
      );
      // Display an error message or handle it accordingly
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="sm">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            {isRegistering ? "New User" : "Existing User"}
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1, alignItems: "center" }}
          >
            {isRegistering && (
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Full Name"
                name="name"
                autoComplete="name"
                autoFocus
              />
            )}
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {isRegistering ? "Register" : "Sign In"}
            </Button>
            <Button
              fullWidth
              onClick={() => setIsRegistering(!isRegistering)}
            >
              {isRegistering
                ? "Already have an account? Sign In"
                : "Don't have an account? Register"}
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
