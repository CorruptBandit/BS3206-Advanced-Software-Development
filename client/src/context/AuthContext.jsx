import React, { createContext, useContext, useState, useEffect } from 'react';
import account from '../_mock/account'; // Update the path accordingly

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setUserEmail] = useState("");
  const [name, setUserName] = useState("");

  useEffect(() => {
    // This effect runs whenever the email state changes
    console.log(email, name);
    account.displayName = name;
    account.email = email;
  }, [name, email]);

  const login = async (email) => {
    const response = await fetch(`/api/getUserName?email=${encodeURIComponent(email)}`);
    const data = await response.json();
    // ADD err checking
    setUserEmail(email);
    setUserName(data.userName);
    setIsLoggedIn(true);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserEmail('')
    setUserName('')
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, email, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
