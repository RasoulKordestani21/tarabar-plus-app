import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import { showToast } from "@/utils/toast";
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.API_URL;

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json"
  },
  timeout: 10000 // 10 second timeout
});

// Add an interceptor to dynamically set the Authorization header
apiClient.interceptors.request.use(
  async config => {
    try {
      const token = await SecureStore.getItemAsync("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  error => Promise.reject(error)
);

// Add an interceptor to handle errors
apiClient.interceptors.response.use(
  response => response,
  async error => {
    try {
      if (!error.response) {
        showToast.error("Network error. Please check your internet connection.");
        return Promise.reject(new Error("Network error"));
      }

      const { status } = error.response;

      switch (status) {
        case 401: {
          const token = await SecureStore.getItemAsync("token");
          if (token) {
            await SecureStore.deleteItemAsync("token");
            showToast.info("Session expired. Please login again.");
            router.replace("/(auth)/otp-sender");
          }
          break;
        }
        case 403:
          showToast.error("You don't have permission to perform this action.");
          break;
        case 404:
          showToast.error("Resource not found.");
          break;
        case 429:
          showToast.error("Too many requests. Please try again later.");
          break;
        default:
          if (status >= 500) {
            showToast.error("Server error. Please try again later.");
          } else {
            showToast.error(error.response.data?.message || "An error occurred.");
          }
      }
    } catch (handleError) {
      console.error("Error in error handler:", handleError);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
