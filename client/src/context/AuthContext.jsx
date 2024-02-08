import React, { createContext, useContext, useState, useEffect } from 'react';
import account from '../_mock/account'; // Update the path accordingly

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setUserEmail] = useState("");

  useEffect(() => {
    // This effect runs whenever the email state changes
    account.displayName = email;
    account.email = email;
  }, [email]);

  const login = (email) => {
    console.log('Login function called with email:', email);
    setUserEmail(email);
    setIsLoggedIn(true);
    // No need to set account.displayName and account.email here
    // They will be set automatically by the useEffect
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserEmail('N/A')
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, email, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
