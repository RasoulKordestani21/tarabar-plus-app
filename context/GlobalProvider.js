// GlobalProvider.js
import React, { createContext, useContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";

const GlobalContext = createContext();

// Custom Hook to Use Global Context
export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};

const GlobalProvider = ({ children }) => {
  const [isLogged, setIsLoggedState] = useState(false);
  const [role, setRole] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(true);
  const [token, setTokenState] = useState("");

  useEffect(() => {
    const loadState = async () => {
      try {
        setLoading(true);
        const storedToken = await SecureStore.getItemAsync("token");
        const storedRole = await SecureStore.getItemAsync("role");
        const storedPhoneNumber = await SecureStore.getItemAsync("phoneNumber");
        if (storedToken) {
          setTokenState(storedToken);
          setIsLoggedState(true);
          if (storedRole) setRole(storedRole);
          if (storedPhoneNumber) setPhoneNumber(storedPhoneNumber);
        } else {
          setIsLoggedState(false);
        }
      } catch (error) {
        console.error("Error loading state from SecureStore:", error);
      } finally {
        setLoading(false);
      }
    };

    loadState();
  }, []);

  const setToken = async newToken => {
    try {
      if (newToken) {
        await SecureStore.setItemAsync("token", newToken);
        setTokenState(newToken);
        setIsLoggedState(true);
      } else {
        await SecureStore.deleteItemAsync("token");
        setTokenState("");
        setIsLoggedState(false);
      }
    } catch (error) {
      console.error("Error saving token to SecureStore:", error);
    }
  };

  const setRoleSecure = async newRole => {
    try {
      if (newRole) {
        await SecureStore.setItemAsync("role", newRole);
        setRole(newRole);
      } else {
        await SecureStore.deleteItemAsync("role");
        setRole("");
      }
    } catch (error) {
      console.error("Error saving role to SecureStore:", error);
    }
  };

  const setPhoneNumberSecure = async newPhoneNumber => {
    try {
      if (newPhoneNumber) {
        await SecureStore.setItemAsync("phoneNumber", newPhoneNumber);
        setPhoneNumber(newPhoneNumber);
      } else {
        await SecureStore.deleteItemAsync("phoneNumber");
        setPhoneNumber("");
      }
    } catch (error) {
      console.error("Error saving phone number to SecureStore:", error);
    }
  };

  return (
    <GlobalContext.Provider
      value={{
        isLogged,
        setIsLogged: setIsLoggedState,
        phoneNumber,
        setPhoneNumber: setPhoneNumberSecure,
        role,
        setRole: setRoleSecure,
        loading,
        setLoading,
        token,
        setToken
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
