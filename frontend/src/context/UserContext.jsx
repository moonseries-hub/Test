import React, { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");
    return role && token ? { role, token } : null;
  });

  // keep localStorage synced with context
  useEffect(() => {
    if (user) {
      localStorage.setItem("role", user.role);
      localStorage.setItem("token", user.token || "my-secret-token");
    } else {
      localStorage.removeItem("role");
      localStorage.removeItem("token");
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
