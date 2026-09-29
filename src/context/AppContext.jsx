import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, subscribeToDataChange } from '../services/api.js';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);
  const [loadingSettings, setLoadingSettings] = useState(true);

  // Enquiry Modal state
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [enquiryModalPrefill, setEnquiryModalPrefill] = useState({});

  // Toast notifications state
  const [toasts, setToasts] = useState([]);

  const loadSettings = async () => {
    try {
      const data = await api.getSettings();
      setSettings(data);
    } catch (err) {
      console.error("Failed to load settings:", err);
    } finally {
      setLoadingSettings(false);
    }
  };

  useEffect(() => {
    loadSettings();

    // Subscribe to API data changes for real-time reactivity across site and admin
    const unsubscribe = subscribeToDataChange((entityType) => {
      if (entityType === 'settings' || !entityType) {
        loadSettings();
      }
    });

    return () => unsubscribe();
  }, []);

  const openEnquiryModal = (prefill = {}) => {
    setEnquiryModalPrefill(prefill);
    setIsEnquiryModalOpen(true);
  };

  const closeEnquiryModal = () => {
    setIsEnquiryModalOpen(false);
    setEnquiryModalPrefill({});
  };

  const addToast = (message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        settings,
        loadingSettings,
        isEnquiryModalOpen,
        enquiryModalPrefill,
        openEnquiryModal,
        closeEnquiryModal,
        toasts,
        addToast,
        removeToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
