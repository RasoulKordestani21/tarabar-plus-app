// context/AuthErrorProvider.js
import React, { useState, useEffect } from "react";
import AuthErrorModal from "@/components/AuthErrorModal";
import { authErrorEmitter } from "@/utils/authErrorManager";

const AuthErrorProvider = ({ children }) => {
  const [modalState, setModalState] = useState({
    visible: false,
    message: "",
    onConfirm: null
  });

  useEffect(() => {
    const unsubscribe = authErrorEmitter.on("authError", data => {
      setModalState(data);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleClose = async () => {
    // Hide modal first
    setModalState({ visible: false, message: "", onConfirm: null });

    // If there's a callback (like app reset), execute it
    if (modalState.onConfirm) {
      try {
        await modalState.onConfirm();
      } catch (error) {
        console.error("Error executing auth error callback:", error);
      }
    }
  };

  return (
    <>
      {children}
      <AuthErrorModal
        visible={modalState.visible}
        message={modalState.message}
        onClose={handleClose}
      />
    </>
  );
};

export default AuthErrorProvider;
