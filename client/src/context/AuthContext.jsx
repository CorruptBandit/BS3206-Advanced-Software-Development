import { createContext, useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setUserEmail] = useState("");
  const [name, setUserName] = useState("");

  useEffect(() => {
    // This effect runs whenever the email state changes
  }, [name, email]);

  const login = async (email, password) => {
    try {
      const response = await fetch('/api/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password, // Use the provided password for sign-in
        }),
      });
  
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Login failed');
      }
      
      const data = await response.json();

      const usernameReq = await fetch(`/api/getUserName?email=${encodeURIComponent(email)}`);
      const usernameReqJSON = await usernameReq.json();
      const name = usernameReqJSON.userName;

      setUserEmail(email);
      setUserName(name);
      setIsLoggedIn(true);
      // Save the token in localStorage or secure storage
      localStorage.setItem('token', data.token);
      return null
    } catch (error) {
      console.error('Error:', error);
      return error.message || 'Login failed'; 
    }
  };
  
  const register = async (name, email, password) => {
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });
  
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Registration failed');
      }
  
      const data = await response.json();
      setUserEmail(email);
      setUserName(name);
      setIsLoggedIn(true);
      // Save the token in localStorage or secure storage
      localStorage.setItem('token', data.token);
  
      return null; // Registration success, no error message
    } catch (error) {
      console.error('Error:', error);
      // Handle registration error, e.g., display an error message
      return error.message || 'Registration failed'; // Return the error message
    }
  };
  

  const logout = async () => {
    try {
      const token = localStorage.getItem('token');

      // Call your backend API to sign out and revoke the token
      await fetch('/api/signout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      // Remove the token from localStorage or secure storage
      localStorage.removeItem('token');

      setIsLoggedIn(false);
      setUserEmail('');
      setUserName('');
    } catch (error) {
      console.error('Error:', error);
      // Handle logout error, e.g., display an error message
    }
  };


  return (
    <AuthContext.Provider value={{ isLoggedIn, name, email, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
