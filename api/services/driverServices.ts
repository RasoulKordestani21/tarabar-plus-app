// api/services/driverServices.ts
import { AxiosError } from "axios";
import apiClient from "@/api/apiClient";

type UserDataResponse = {
  isVerified: boolean;
  [key: string]: any;
};

type GetUserParams = {
  phoneNumber: string;
};

/**
 * Fetches user data for a driver
 * @param params - Parameters including phoneNumber
 * @returns User data including verification status
 */
export const getDriverUser = async ({
  phoneNumber
}: GetUserParams): Promise<UserDataResponse> => {
  try {
    const response = await apiClient.get("api/driver/user", {
      params: { phoneNumber }
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error(
      "Error fetching driver user data:",
      axiosError.response?.data || axiosError.message
    );

    // If the backend sends a custom error message, extract it
    const errorMessage =
      axiosError.response?.data?.message ||
      axiosError.response?.data?.errorCode ||
      axiosError.message;

    throw new Error(errorMessage || "خطا در دریافت اطلاعات کاربر");
  }
};

/**
 * Updates driver profile information
 * @param userData - Data to update driver profile
 * @returns Updated user data
 */
export const updateDriverProfile = async (
  userData: any
): Promise<UserDataResponse> => {
  console.log(userData);
  try {
    const response = await apiClient.post(
      "api/driver/update-verification",
      userData
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error(
      "Error updating driver profile:",
      axiosError.response?.data || axiosError.message
    );

    // If the backend sends a custom error message, extract it
    const errorMessage =
      axiosError.response?.data?.message ||
      axiosError.response?.data?.errorCode ||
      axiosError.message;

    throw new Error(errorMessage || "خطا در بروزرسانی پروفایل");
  }
};

// Add more driver-related services as needed
