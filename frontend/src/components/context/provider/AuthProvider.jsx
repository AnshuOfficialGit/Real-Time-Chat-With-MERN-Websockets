import { useState, useEffect } from "react";
import { AuthContext } from "..";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  // On initial load, read user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Login function
  const login = (userData, tokenValue) => {
    console.log("AuthContext", userData);
    setUser(userData.id);
    setUser(userData.id);
    setToken(tokenValue);
    localStorage.setItem("user", JSON.stringify(userData.id));
    localStorage.setItem("user_name", JSON.stringify(userData.name));
    localStorage.setItem("token", tokenValue);
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
