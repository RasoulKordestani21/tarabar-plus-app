import React, { createContext, useContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import * as Device from "expo-device"; // Import expo-device

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
  const [deviceId, setDeviceId] = useState(""); // Add state for deviceId
  const [deviceName, setDeviceName] = useState(""); // Add state for deviceName
  const [userId, setUserIdState] = useState(""); // Add state for userId

  useEffect(() => {
    const loadState = async () => {
      try {
        setLoading(true);

        // Load data from SecureStore
        const storedToken = await SecureStore.getItemAsync("token");
        const storedRole = await SecureStore.getItemAsync("role");
        const storedPhoneNumber = await SecureStore.getItemAsync("phoneNumber");
        const storedDeviceId = await SecureStore.getItemAsync("deviceId");
        const storedDeviceName = await SecureStore.getItemAsync("deviceName");
        const storedUserId = await SecureStore.getItemAsync("userId"); // Add this line

        if (storedToken) {
          setTokenState(storedToken);
          setIsLoggedState(true);
          if (storedRole) setRole(storedRole);
          if (storedPhoneNumber) setPhoneNumber(storedPhoneNumber);
          if (storedDeviceId) setDeviceId(storedDeviceId);
          if (storedDeviceName) setDeviceName(storedDeviceName);
          if (storedUserId) setUserIdState(storedUserId); // Add this line
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

  // Function to get and store device information
  const setDeviceInfo = async () => {
    try {
      const uniqueDeviceId = (await Device.osBuildId) || Device.installationId; // Get unique device ID
      const deviceModelName = Device.modelName; // Get device name

      setDeviceId(uniqueDeviceId);
      setDeviceName(deviceModelName);

      // Save to SecureStore for persistence
      await SecureStore.setItemAsync("deviceId", uniqueDeviceId);
      await SecureStore.setItemAsync("deviceName", deviceModelName);
    } catch (error) {
      console.error("Error getting device information:", error);
    }
  };

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

  // Add a function to set userId
  const setUserId = async newUserId => {
    try {
      if (newUserId) {
        await SecureStore.setItemAsync("userId", newUserId);
        setUserIdState(newUserId);
      } else {
        await SecureStore.deleteItemAsync("userId");
        setUserIdState("");
      }
    } catch (error) {
      console.error("Error saving userId to SecureStore:", error);
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
        setToken,
        deviceId,
        deviceName,
        setDeviceInfo, // Expose the function to set device info
        userId, // Expose userId
        setUserId // Expose setUserId function
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
