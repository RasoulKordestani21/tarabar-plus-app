import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";

const apiClient = axios.create({
  baseURL:
    // "https://tarabar-plus.com",
    "http://192.168.1.103:3000", // Replace with your backend URL
  headers: {
    "Content-Type": "application/json"
  }
});

// Add an interceptor to dynamically set the Authorization header
apiClient.interceptors.request.use(
  async config => {
    const token = await SecureStore.getItemAsync("token"); // Retrieve the token
    if (token) {
      config.headers.Authorization = `${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Add an interceptor to handle 401 errors
apiClient.interceptors.response.use(
  response => response, // If response is successful, return it
  async error => {
    // Check if the error status is 401
    const token = await SecureStore.getItemAsync("token");
    console.log(token, " is token ");
    if (error.response && error.response.status === 401 && token) {
      console.log("conditions satisfied");
      // Perform redirection on 401 Unauthorized

      router.replace("/error");
      // Optionally handle logging out or token removal here

      // You can also add other logic, like logging out the user, etc.

      return Promise.reject(error); // Reject the error to propagate it
    }

    return Promise.reject(error); // For other errors, reject and propagate the error
  }
);

export default apiClient;
