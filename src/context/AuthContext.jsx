import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const ADMIN_STORAGE_KEY = 'roamora_admin_auth';

export const AuthProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const saved = localStorage.getItem(ADMIN_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const login = async (email, password, remember = true) => {
    // Simulated auth check
    if (email.toLowerCase() === 'admin@roamora.com' && password === 'Admin@123') {
      const user = {
        name: 'Matteo Bellini',
        email: 'admin@roamora.com',
        role: 'Super Admin',
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
        loginTime: new Date().toISOString()
      };
      setAdminUser(user);
      if (remember) {
        localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(user));
      }
      return { success: true };
    } else {
      return { success: false, message: 'Invalid email or password. Use admin@roamora.com / Admin@123' };
    }
  };

  const logout = () => {
    setAdminUser(null);
    localStorage.removeItem(ADMIN_STORAGE_KEY);
  };

  const updateProfile = (updatedData) => {
    const newUserData = { ...adminUser, ...updatedData };
    setAdminUser(newUserData);
    localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(newUserData));
  };

  return (
    <AuthContext.Provider
      value={{
        adminUser,
        isAuthenticated: !!adminUser,
        login,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
