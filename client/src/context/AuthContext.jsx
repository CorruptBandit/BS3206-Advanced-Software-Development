import { createContext, useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('isLoggedIn') === 'true');
  const [email, setEmail] = useState(localStorage.getItem('email') || "");
  const [name, setName] = useState(localStorage.getItem('name') || "");
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true); 
      try {
        const response = await fetch('/api/validateToken', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Token validation failed');
        }

        const data = await response.json();
        setEmail(data.email);
        setName(data.name);
        setIsLoggedIn(true);
        // Update local storage
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('email', data.email);
        localStorage.setItem('name', data.name);
      } catch (error) {
        console.error('Error:', error);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    if (!isLoggedIn) {
      checkAuth();
    }
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
          password,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Login failed');
      }

      const data = await response.json();
      setEmail(data.email);
      setName(data.name);
      setIsLoggedIn(true);
      // Update local storage
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('email', data.email);
      localStorage.setItem('name', data.name);
      return null;
    } catch (error) {
      console.error('Error:', error);
      return error.message || 'Login failed'; 
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/signout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setIsLoggedIn(false);
      setEmail('');
      setName('');
      // Clear local storage
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('email');
      localStorage.removeItem('name');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, name, email, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
