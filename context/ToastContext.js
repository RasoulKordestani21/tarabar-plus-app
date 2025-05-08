// context/ToastContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import CustomToast from "@/components/CustomToast";
import { toastEmitter } from "@/utils/toast"; // Import the emitter

const ToastContext = createContext();

export const useToast = () => {
  return useContext(ToastContext);
};

export const ToastProvider = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("success");
  const [timeoutId, setTimeoutId] = useState(null);

  const showToast = (message, type = "success") => {
    // Clear any existing timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    setMessage(message);
    setType(type);
    setVisible(true);

    // Set a new timeout
    const id = setTimeout(() => setVisible(false), 100 * 1000);
    setTimeoutId(id);
  };

  // Listen for toast events from anywhere in the app
  useEffect(() => {
    const unsubscribe = toastEmitter.on("toast", data => {
      showToast(data.message, data.type);
    });

    // Clean up the listener when component unmounts
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <CustomToast
        visible={visible}
        message={message}
        onClose={() => setVisible(false)}
        type={type}
      />
    </ToastContext.Provider>
  );
};
