import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

// Link api url
const token = localStorage.getItem('token');

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const login = () => {
    // Perform your authentication logic here
    setIsAuthenticated(true);
    localStorage.setItem('token', 'yourAuthToken'); // Set token in local storage
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.clear();

    window.location = '/login';
  };

  return <AuthContext.Provider value={{ isAuthenticated, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
