// components/AuthErrorProvider.js
import React, { useState, useEffect } from "react";
import AuthErrorModal from "@/components/AuthErrorModal";
import { authErrorEmitter } from "@/utils/authErrorManager";

const AuthErrorProvider = ({ children }) => {
  const [modalState, setModalState] = useState({
    visible: false,
    message: ""
  });

  useEffect(() => {
    const unsubscribe = authErrorEmitter.on("authError", data => {
      setModalState(data);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleClose = () => {
    setModalState({ visible: false, message: "" });
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
