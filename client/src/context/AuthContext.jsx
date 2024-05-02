import { createContext, useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch('/api/validateToken', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error('Token validation failed');
          }

          const data = await response.json();
          setEmail(data.email);
          setName(data.name);
          setIsLoggedIn(true);
        } catch (error) {
          console.error('Error:', error);
          logout();  // Ensure we clear the token if it's not valid
        }
      }
    };

    checkAuth();
  }, []);

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

      setEmail(email);
      setName(name);
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
      setEmail(email);
      setName(name);
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

    await fetch('/api/signout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setEmail('');
    setName('');
  } catch (error) {
    console.error('Error:', error);
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
