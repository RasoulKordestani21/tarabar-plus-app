import apiClient from "@/api/apiClient"; // Import the apiClient
import { CargoSubmitProps } from "@/app/(menu)/types";

// Fetch all cities
export const getAllCities = async () => {
  try {
    const response = await apiClient.get("/api/cities");
    return response.data; // Return the data from the response
  } catch (error) {
    console.error("Error fetching cities:", error);
    throw error;
  }
};

// Add a new cargo
export const addCargo = async (cargoData: CargoSubmitProps) => {
  try {
    const response = await apiClient.post("/cargo", cargoData); // Use apiClient.post
    return response.data; // Return the data from the response
  } catch (error) {
    console.error("Error adding cargo:", error);
    throw error;
  }
};

export const editCargo = async (cargoData: {
  id: number;
  originProvinceId: number;
  originCityId: number;
  destinationProvinceId: number;
  destinationCityId: number;
  someAdditionalData: string;
}) => {
  try {
    // Destructure and exclude the id field
    const { id, ...payload } = cargoData;

    // Send the PUT request with the remaining data
    const response = await apiClient.put(`/cargo/${id}`, payload);

    return response.data; // Return the response data
  } catch (error) {
    console.error("Error editing cargo:", error);
    throw error;
  }
};

export const deleteCargo = async cargoId => {
  try {
    // Send the PUT request with the remaining data
    const response = await apiClient.delete(`/cargo/${cargoId}`);

    return response.data; // Return the response data
  } catch (error) {
    console.error("Error deleting cargo:", error);
    throw error;
  }
};

export const getAllCargoes = async (phoneNumber: string) => {
  try {
    const response = await apiClient.get("/cargo/history", {
      params: { ownerPhone: phoneNumber } // Pass phoneNumber as a parameter
    }); // Use the appropriate endpoint to fetch all cargoes
    return response.data; // Return the data from the response
  } catch (error) {
    console.error("Error fetching cargoes:", error);
    throw error;
  }
};

export const getUserHistoryCargoes = async (ownerPhone: string) => {
  try {
    const response = await apiClient.get("/cargo/history", {
      params: { ownerPhone }
    }); // Use the appropriate endpoint to fetch all cargoes
    return response.data; // Return the data from the response
  } catch (error) {
    console.error("Error fetching cargoes:", error);
    throw error;
  }
};

// Fetch cargos based on the location (latitude, longitude)
export const getCargoesByLocation = async (
  latitude: number,
  longitude: number
) => {
  try {
    const response = await apiClient.get("/cargo/filter", {
      params: {
        latitude,
        longitude
      }
    });

    return response.data; // Return the filtered cargos data
  } catch (error) {
    console.error("Error fetching cargoes by location:", error);
    throw error;
  }
};

// Fetch cargos based on origin and destination
export const getCargoesByOriginDestination = async params => {
  try {
    const response = await apiClient.get("/cargo/filter", {
      params
    });
    return response.data; // Return the filtered cargos data
  } catch (error) {
    console.error("Error fetching cargoes by origin and destination:", error);
    throw error;
  }
};

// New function for fetching available cargoes for drivers
export const getAvailableCargosForDriver = async (
  latitude: number,
  longitude: number,
  radius: number,
  phoneNumber: string
) => {
  try {
    console.log(latitude, longitude, phoneNumber);
    const response = await apiClient.get(
      "/api/carrier-cargos-for-drivers/available",
      {
        params: {
          lat: latitude,
          lng: longitude,
          radius,
          phoneNumber
        }
      }
    );
    return response.data.data || []; // Return the available cargos data with fallback to empty array
  } catch (error) {
    console.error("Error fetching available cargoes for driver:", error);
    throw error;
  }
};

export const registerDriverToCargo = async (
  cargoId: string,
  driverInfo: { driverId: string; vehicle: string }
) => {
  try {
    const response = await apiClient.post(
      `/api/carrier-cargos-for-drivers/${cargoId}/register`,
      driverInfo
    );

    if (response.data && response.data.success) {
      return response.data.data;
    }

    throw new Error(response.data?.message || "Failed to register for cargo");
  } catch (error) {
    console.error("Error registering for cargo:", error);
    throw error;
  }
};
