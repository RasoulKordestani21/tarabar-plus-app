// ToastContext.js
import React, { createContext, useState, useContext } from "react";
import CustomToast from "@/components/CustomToast"; // Import the CustomToast component

const ToastContext = createContext();

export const useToast = () => {
  return useContext(ToastContext);
};

export const ToastProvider = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("success");

  const showToast = (message, type = "success") => {
    setMessage(message);
    setType(type);
    setVisible(true);
    setTimeout(() => setVisible(false), 3000); // Hide after 3 seconds
  };

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
