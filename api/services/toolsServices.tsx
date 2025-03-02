import apiClient from "../apiClient";

// Estimate commission and fare based on input parameters
export const estimateCommissionAndFare = async (
  sourceCityId: string,
  destinationCityId: string,
  cargoTypeId: string,
  truckTypeId: string,
  insurancePercentage: number
) => {
  try {
    const response = await apiClient.post("/tools/estimate", {
      sourceCityId,
      destinationCityId,
      cargoTypeId,
      truckTypeId,
      insurancePercentage
    });
    return response.data; // Return the estimation data
  } catch (error) {
    console.error("Error estimating commission and fare:", error);
    throw error;
  }
};

// Verify truck smart card (truck verification)
export const verifyTruckSmartCard = async (
  nationalId: string,
  smartCardNumber: string,
  plateNumber: string
) => {
  try {
    const response = await apiClient.post("/tools/verify-truck-smart-card", {
      nationalId,
      smartCardNumber,
      plateNumber
    });
    return response.data; // Return the response data (verification result)
  } catch (error) {
    console.error("Error verifying truck smart card:", error);
    throw error;
  }
};

// Verify driver smart card (driver verification)
export const verifyDriverSmartCard = async form => {
  try {
    const response = await apiClient.get("/tools/verify-driver-smart-card", {
      params: form
    });
    return response.data; // Return the response data (verification result)
  } catch (error) {
    console.error("Error verifying driver smart card:", error);
    throw error;
  }
};
