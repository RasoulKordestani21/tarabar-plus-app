import apiClient from "@/api/apiClient";
import { AxiosError } from "axios";
import { Alert } from "react-native";

type Props = {
  phoneNumber: string;
};

// GET a single user
export const getUser = async (phoneNumber: string, role: string) => {
  const response = await apiClient.get(`/api/auth/user`, {
    params: { phoneNumber, role }
  });
  return response.data;
};

// POST (Create) a user
export const createUser = async (userData: Props) => {
  const response = await apiClient.post("/users", userData);
  return response.data;
};

// PUT (Update) a user
export const updateUser = async (id: string, userData: Props) => {
  const response = await apiClient.put(`/users/${id}`, userData);
  return response.data;
};

// DELETE a user
export const deleteUser = async (id: string) => {
  const response = await apiClient.delete(`/users/${id}`);
  return response.data;
};

export const updateVerificationData = async (
  role: string,
  phoneNumber: string,
  form: {
    userName: string;
    driverSmartNumber: string;
    truckSmartNumber: string;
    nationalId: string;
    truckNavigationId: string;
    licensePlate: string;
    nationalCard: string;
  }
) => {
  try {
    console.log(role, phoneNumber);
    const response = await apiClient.post(`/api/auth/update-verification`, {
      role,
      phoneNumber,
      ...form
    });

    return response.data; // This will contain the server response
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error("Error updating verification data:", axiosError.message);
    const errorMessage =
      axiosError.response?.data?.message || axiosError.message;
    Alert.alert("Error", errorMessage); // Show error alert
    throw new Error(errorMessage);
  }
};
