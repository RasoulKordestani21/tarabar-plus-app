import apiClient from "@/api/apiClient";
import { Alert } from "react-native";
import { AxiosError } from "axios"; // Import AxiosError type

type Props = {
  phoneNumber: string;
  role: string;
};

type VerifyProps = {
  phoneNumber: string;
  otp: string;
};

export const generateOtp = async ({ phoneNumber, role }: Props) => {
  console.log(phoneNumber, role);
  try {
    const response = await apiClient.get("/generate-otp", {
      params: { phoneNumber, role }
    });
    return response.data; // { message, otp }
  } catch (error) {
    const axiosError = error as AxiosError;
    Alert.alert(
      "Error",
      JSON.stringify(axiosError.response?.data || axiosError.message)
    );
    // console.log(error);
    throw new Error(
      axiosError.message || "Error generating OTP. Please try again."
    );
  }
};

export const verifyOtp = async ({ phoneNumber, otp }: VerifyProps) => {
  console.log(`Verifying OTP for phoneNumber: ${phoneNumber} with OTP: ${otp}`);
  try {
    const response = await apiClient.get("/verify-otp", {
      params: { phoneNumber, otp } // Send as query parameters
    });
    console.log("Response from server:", response.data); // Debugging log
    return response.data; // Return the data property
  } catch (error: any) {
    const axiosError = error as AxiosError;
    console.error(
      "Error during OTP verification:",
      axiosError.response?.data || error.message
    ); // Debugging log
    Alert.alert(
      "Error",
      JSON.stringify(axiosError.response?.data || axiosError.message)
    );
    throw new Error(
      axiosError.message || "Error verifying OTP. Please try again."
    );
  }
};
