// api/services/otpServices.ts - Complete Updated Version
import { deviceName } from "./../../node_modules/expo-device/src/Device";
import { Alert } from "react-native";
import { AxiosError } from "axios";
import apiClient from "@/api/apiClient";
import { useToast } from "@/context/ToastContext";

// Add the missing RulesResponse interface
interface RulesResponse {
  success: boolean;
  message: string;
  rules: string;
  version?: string;
  lastUpdated?: string;
  metadata?: {
    language: string;
    sections: number;
  };
}

type Props = {
  phoneNumber: string;
  role: string;
  isAcceptedRules: boolean;
};

type VerifyProps = {
  phoneNumber: string;
  otp: string;
  deviceId: string;
  deviceName: string;
  role: string;
};

export const generateOtp = async ({
  phoneNumber,
  role,
  isAcceptedRules
}: Props) => {
  try {
    const response = await apiClient.get("api/auth/generate-otp", {
      params: { phoneNumber, role, isAcceptedRules }
    });
    return response.data; // { message, otp }
  } catch (error) {
    const axiosError = error as AxiosError;
    console.log("Error generating OTP:", axiosError.message);
    console.log("Error generating OTP:", axiosError?.response?.data);

    // If the backend sends a custom error message, show it
    const errorMessage =
      axiosError.response?.data?.errorCode ||
      axiosError.response?.data?.message ||
      axiosError.message ||
      "خطا در ارسال کد تایید";

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
      params: { phoneNumber, otp, deviceId, deviceName, role }
    });
    return response.data;
  } catch (error: any) {
    const axiosError = error as AxiosError;
    console.error(
      "Error during OTP verification:",
      axiosError.response?.data || error.message
    );

    // If the backend sends a custom error message, show it
    const errorMessage =
      axiosError.response?.data?.message ||
      axiosError.response?.data?.errorCode ||
      axiosError.message ||
      "خطا در تایید کد. لطفا مجددا تلاش کنید";

    throw new Error(errorMessage);
  }
};

export const getRules = async (): Promise<RulesResponse> => {
  try {
    console.log("Fetching rules from backend...");
    const response = await apiClient.get("api/auth/rules");
    console.log("Rules fetched successfully:", response.data);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error("Error fetching rules:", axiosError.message);
    console.error("Error response:", axiosError?.response?.data);

    // If the backend sends a custom error message, show it
    const errorMessage =
      axiosError.response?.data?.message ||
      axiosError.response?.data?.errorCode ||
      axiosError.message ||
      "خطا در دریافت قوانین و مقررات";

    throw new Error(errorMessage);
  }
};

export const getWalletConfig = async () => {
  try {
    console.log("Fetching wallet config from backend...");
    const response = await apiClient.get("api/auth/wallet-config");

    return response.data?.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error("Error fetching wallet config:", axiosError.message);

    const errorMessage =
      axiosError.response?.data?.message ||
      axiosError.response?.data?.errorCode ||
      axiosError.message ||
      "خطا در دریافت تنظیمات کیف پول";

    throw new Error(errorMessage);
  }
};

// FAQ Service
export const getSupportData = async () => {
  try {
    const response = await apiClient.get("api/auth/support-data");
    console.log(response.data?.data);
    return response.data?.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw new Error(
      axiosError.response?.data?.message || "خطا در دریافت سوالات متداول"
    );
  }
};

// Account/About Service
export const getAboutContent = async () => {
  try {
    const response = await apiClient.get("api/auth/about-us");
    return response.data?.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw new Error(
      axiosError.response?.data?.message || "خطا در دریافت اطلاعات حساب"
    );
  }
};
