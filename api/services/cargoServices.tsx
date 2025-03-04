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

export const getAllCargoes = async () => {
  try {
    const response = await apiClient.get("/cargo"); // Use the appropriate endpoint to fetch all cargoes
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
