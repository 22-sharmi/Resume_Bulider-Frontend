import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:5555/auth/user', { withCredentials: true });
        setUser(response.data);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const signOutUser = async () => {
    try {
      await axios.get('http://localhost:5555/auth/logout', { withCredentials: true });
      setUser(null);
    } catch (error) {
      console.error("Error signing out: ", error.response || error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading ,signOutUser}}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
