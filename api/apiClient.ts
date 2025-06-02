// api/apiClient.js
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { showToast } from "@/utils/toast";
import { showAuthErrorModal } from "@/utils/authErrorManager";
import Constants from "expo-constants";
import { router } from "expo-router";
// import { clearAllQueries } from "@/utils/queryClient";

const API_URL = Constants.expoConfig?.extra?.PRODUCTION_URL;
console.log("API_URL", API_URL);

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json"
  },
  timeout: 10000 // 10 second timeout
});

// Function to completely reset the app
const resetAppToInitialState = async () => {
  try {
    console.log("Resetting app to initial state...");

    // // 1. Clear all React Query cache and ongoing requests
    // clearAllQueries();

    // 2. Clear ALL SecureStore data (complete reset)
    await SecureStore.deleteItemAsync("token");
    await SecureStore.deleteItemAsync("isLogged");
    await SecureStore.deleteItemAsync("role");
    await SecureStore.deleteItemAsync("phoneNumber");
    await SecureStore.deleteItemAsync("userId");
    await SecureStore.deleteItemAsync("user");
    await SecureStore.deleteItemAsync("isAcceptedRules");
    await SecureStore.deleteItemAsync("deviceId");
    await SecureStore.deleteItemAsync("deviceName");

    // 3. Reset to initial screen (like app startup)
    router.dismissAll(); // Close all modals and screens
    router.replace("/"); // Go to initial screen

    console.log("App reset completed");
  } catch (error) {
    console.error("Error resetting app:", error);
    // Force reset even if there's an error
    router.dismissAll();
    router.replace("/");
  }
};

// Add an interceptor to dynamically set the Authorization header
apiClient.interceptors.request.use(
  async config => {
    try {
      // Check if the request is for OTP verification
      const isOtpVerification =
        config.url?.includes("/auth/verify-otp") ||
        config.url?.includes("/auth/otp-verification");

      // Add a custom header to identify OTP verification requests
      if (isOtpVerification) {
        config.headers["X-OTP-Verification"] = "true";
      }

      const token = await SecureStore.getItemAsync("token");
      if (token) {
        config.headers.Authorization = `${token}`;
      }
      return config;
    } catch (error) {
      console.error("Error setting auth token:", error);
      return Promise.reject(error);
    }
  },
  error => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Add an interceptor to handle errors
apiClient.interceptors.response.use(
  response => response,
  async error => {
    console.log("API Error:", error);

    try {
      // First check for network errors (no response)
      if (!error.response) {
        console.log("Network error detected");
        showToast.error("خطای اتصال به اینترنت. لطفا اتصال خود را بررسی کنید.");
        return Promise.reject(new Error("Network error"));
      }

      const { status, config } = error.response;

      // Check if this is an OTP verification request
      const isOtpVerification = config.headers["X-OTP-Verification"] === "true";

      switch (status) {
        case 401:
          console.log(isOtpVerification, "isOtpVerification");
          if (isOtpVerification) {
            // For OTP verification, just show a toast instead of the modal
            showToast.error("کد وارد شده نامعتبر است. لطفا دوباره تلاش کنید.");
          } else {
            // For other 401 errors, show modal with callback to reset app
            showAuthErrorModal(
              "جلسه شما منقضی شده است. لطفا دوباره وارد شوید.",
              resetAppToInitialState // Pass reset function as callback
            );
          }
          break;
        case 403:
          // Show auth error modal for forbidden with app reset
          showAuthErrorModal(
            "شما اجازه دسترسی به این بخش را ندارید. لطفا دوباره وارد شوید.",
            resetAppToInitialState // Pass reset function as callback
          );
          break;
        case 404:
          showToast.error("منبع مورد نظر یافت نشد.");
          break;
        case 429:
          showToast.error("درخواست بیش از حد. لطفا بعدا امتحان کنید.");
          break;
        default:
          if (status >= 500) {
            showToast.error("خطای سرور. لطفا بعدا تلاش کنید.");
          } else {
            showToast.error(
              error.response.data?.message || "خطایی رخ داده است."
            );
          }
      }
    } catch (handleError) {
      console.error("Error in error handler:", handleError);
      showToast.error("خطا در پردازش خطای درخواست");
    }
    return Promise.reject(error);
  }
);

// Prevent continuous retries
apiClient.defaults.maxRedirects = 0;

export default apiClient;
