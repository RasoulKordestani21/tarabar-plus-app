import React, { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

// Create the Global Context
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

  // Load token and login state from SecureStore on app initialization
  useEffect(() => {
    const loadState = async () => {
      try {
        setLoading(true);
        const storedToken = await SecureStore.getItemAsync("token");
        const storedRole = await SecureStore.getItemAsync("role");
        if (storedToken) {
          setTokenState(storedToken);
          setIsLoggedState(true);
          if (storedRole) setRole(storedRole);
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

  // Securely set or remove token
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

  // Securely set or remove role
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

  return (
    <GlobalContext.Provider
      value={{
        isLogged,
        setIsLogged: setIsLoggedState, // Only update the state, not SecureStore
        phoneNumber,
        setPhoneNumber,
        role,
        setRole: setRoleSecure, // Update SecureStore when setting role
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
