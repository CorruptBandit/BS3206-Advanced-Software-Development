import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setUserEmail] = useState("");
  const [name, setUserName] = useState("");

  useEffect(() => {
    // This effect runs whenever the email state changes
    console.log(email, name);
  }, [name, email]);

  const login = async (email, name) => {
    // ADD err checking
    setUserEmail(email);
    setUserName(name);
    setIsLoggedIn(true);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserEmail("");
    setUserName("");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, name, email, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
