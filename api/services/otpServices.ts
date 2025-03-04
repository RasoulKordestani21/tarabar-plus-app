import { deviceName } from "./../../node_modules/expo-device/src/Device";
import { Alert } from "react-native";
import { AxiosError } from "axios"; // Import AxiosError type
import apiClient from "@/api/apiClient";
import { useToast } from "@/context/ToastContext"; // Uncomment if you're using toast for error handling

type Props = {
  phoneNumber: string;
  role: string;
};

type VerifyProps = {
  phoneNumber: string;
  otp: string;
  deviceId: string;
  deviceName: string;
  role: String;
};

export const generateOtp = async ({ phoneNumber, role }: Props) => {
  // const { showToast } = useToast();
  console.log(phoneNumber, role);
  try {
    const response = await apiClient.get("api/auth/generate-otp", {
      params: { phoneNumber, role }
    });
    return response.data; // { message, otp }
  } catch (error) {
    const axiosError = error as AxiosError;
    console.log("Error generating OTP:", axiosError.message);
    console.log("Error generating OTP:", axiosError?.response?.data);

    // If the backend sends a custom error message, show it
    const errorMessage =
      axiosError.response?.data?.errorCode || axiosError.message;

    // Show the error message (uncomment the next line if you're using toast)
    // await showToast(errorMessage, "error");

    throw new Error(errorMessage);
  }
};

export const verifyOtp = async ({
  phoneNumber,
  otp,
  deviceId,
  deviceName,
  role
}: VerifyProps) => {
  console.log(
    `Verifying OTP for phoneNumber: ${phoneNumber} with OTP: ${otp} ${role}`
  );
  try {
    const response = await apiClient.get("api/auth/verify-otp", {
      params: { phoneNumber, otp, deviceId, deviceName, role } // Send as query parameters
    });
    // console.log("Response from server:", response.data); // Debugging log
    return response.data; // Return the data property
  } catch (error: any) {
    const axiosError = error as AxiosError;
    console.error(
      "Error during OTP verification:",
      axiosError.response?.data || error.message
    );

    // If the backend sends a custom error message, show it
    const errorMessage =
      axiosError.response?.data?.message || axiosError.message;

    // Show the error message (uncomment the next line if you're using toast)
    // await showToast(errorMessage, "error");

    // Alert.alert("Error", errorMessage); // Show detailed error in the alert
    throw new Error(errorMessage || "Error verifying OTP. Please try again.");
  }
};

// In your service file
