// api/services/cargoOwnerServices.ts
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
 * Fetches user data for a cargo owner
 * @param params - Parameters including phoneNumber
 * @returns User data including verification status
 */
export const getCargoOwner = async ({
  phoneNumber
}: GetUserParams): Promise<UserDataResponse> => {
  try {
    const response = await apiClient.get("api/cargo-owner/user", {
      params: { phoneNumber }
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error(
      "Error fetching cargo owner user data:",
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
 * Updates cargo owner profile information
 * @param userData - Data to update cargo owner profile
 * @returns Updated user data
 */
export const updateCargoOwnerProfile = async (
  userData: any
): Promise<UserDataResponse> => {
  try {
    const response = await apiClient.post(
      "api/cargo-owner/update-verification",
      userData
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error(
      "Error updating cargo owner profile:",
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

// Add more cargo owner-related services as needed