import axios from "axios";
import * as SecureStore from "expo-secure-store";

const apiClient = axios.create({
  baseURL: "http://192.168.1.103:3000", // Replace with your backend URL
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

export default apiClient;
