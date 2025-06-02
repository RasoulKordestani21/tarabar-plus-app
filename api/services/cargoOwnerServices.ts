import { AxiosError } from "axios";
import apiClient from "@/api/apiClient";

type UserDataResponse = {
  isVerified: boolean;
  [key: string]: any;
};

type GetUserParams = {
  phoneNumber: string;
};

type CargoResponse = {
  message: string;
  activeCargoes: any[];
  archivedCargoes: any[];
  totalCargos: number;
  balance?: number;
  subscriptionPlan: any;
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

/**
 * Get all cargoes (both active and archived) for a cargo owner
 * @param phoneNumber - Phone number of the cargo owner
 * @returns Object containing active and archived cargoes
 */
export const getAllCargoes = async (
  phoneNumber: string
): Promise<CargoResponse> => {
  try {
    const response = await apiClient.get("api/cargo-owner/cargos", {
      params: { phoneNumber }
    });

    // The backend now returns both active and archived cargoes
    const data = response.data;

    // Ensure we have the expected structure
    return {
      message: data.message || "Cargoes retrieved successfully",
      activeCargoes: data.activeCargoes || data.cargos || [], // Support both new and old API responses
      archivedCargoes: data.archivedCargoes || [],
      totalCargos:
        data.totalCargos ||
        (data.activeCargoes?.length || 0) + (data.archivedCargoes?.length || 0),
      subscriptionPlan: data.subscriptionPlan,
      balance: data.balance
    };
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error(
      "Error fetching cargoes:",
      axiosError.response?.data || axiosError.message
    );

    // Handle different error scenarios
    if (axiosError.response?.status === 404) {
      throw new Error("کاربر یافت نشد");
    }

    const errorMessage =
      axiosError.response?.data?.message ||
      axiosError.response?.data?.errorCode ||
      axiosError.message;

    throw new Error(errorMessage || "خطا در دریافت لیست بارها");
  }
};

/**
 * Archive a cargo (move from active to archived)
 * @param phoneNumber - Phone number of the cargo owner
 * @param cargoId - ID of the cargo to archive
 * @returns Success response
 */
export const archiveCargo = async (phoneNumber: string, cargoId: string) => {
  try {
    const response = await apiClient.post("api/cargo-owner/archive-cargo", {
      phoneNumber,
      cargoId
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error(
      "Error archiving cargo:",
      axiosError.response?.data || axiosError.message
    );

    const errorMessage =
      axiosError.response?.data?.message ||
      axiosError.response?.data?.errorCode ||
      axiosError.message;

    throw new Error(errorMessage || "خطا در آرشیو کردن بار");
  }
};

/**
 * Restore an archived cargo (move from archived back to active)
 * @param phoneNumber - Phone number of the cargo owner
 * @param cargoId - ID of the cargo to restore
 * @returns Success response
 */
export const restoreCargo = async (phoneNumber: string, cargoId: string) => {
  try {
    const response = await apiClient.post("api/cargo-owner/restore-cargo", {
      phoneNumber,
      cargoId
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error(
      "Error restoring cargo:",
      axiosError.response?.data || axiosError.message
    );

    const errorMessage =
      axiosError.response?.data?.message ||
      axiosError.response?.data?.errorCode ||
      axiosError.message;

    throw new Error(errorMessage || "خطا در بازگردانی بار");
  }
};

/**
 * Get cargo statistics for a cargo owner
 * @param phoneNumber - Phone number of the cargo owner
 * @returns Statistics object
 */
export const getCargoStatistics = async (phoneNumber: string) => {
  try {
    const response = await apiClient.get("api/cargo-owner/cargo-statistics", {
      params: { phoneNumber }
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error(
      "Error fetching cargo statistics:",
      axiosError.response?.data || axiosError.message
    );

    const errorMessage =
      axiosError.response?.data?.message ||
      axiosError.response?.data?.errorCode ||
      axiosError.message;

    throw new Error(errorMessage || "خطا در دریافت آمار بارها");
  }
};

/**
 * Search cargoes by various criteria
 * @param phoneNumber - Phone number of the cargo owner
 * @param searchParams - Search parameters (origin, destination, date range, etc.)
 * @returns Filtered cargoes
 */
export const searchCargoes = async (
  phoneNumber: string,
  searchParams: {
    query?: string;
    origin?: string;
    destination?: string;
    truckType?: string;
    cargoType?: string;
    dateFrom?: string;
    dateTo?: string;
    status?: "active" | "archived";
  }
) => {
  try {
    const response = await apiClient.get("api/cargo-owner/search-cargoes", {
      params: {
        phoneNumber,
        ...searchParams
      }
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error(
      "Error searching cargoes:",
      axiosError.response?.data || axiosError.message
    );

    const errorMessage =
      axiosError.response?.data?.message ||
      axiosError.response?.data?.errorCode ||
      axiosError.message;

    throw new Error(errorMessage || "خطا در جستجوی بارها");
  }
};
