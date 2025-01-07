import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://192.168.1.103:3000/api/auth", // Replace with your backend URL
  headers: {
    "Content-Type": "application/json"
  }
});

// Add interceptors
// apiClient.interceptors.request.use(
//   config => {
//     const token = getTokenFromStorage(); // Replace with actual token logic
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   error => Promise.reject(error)
// );

// apiClient.interceptors.response.use(
//   response => response,
//   error => {
//     if (error.response?.status === 401) {
//       console.log("Unauthorized, logging out...");
//       logoutUser(); // Handle token expiration or invalid token
//     }
//     return Promise.reject(error);
//   }
// );

export default apiClient;
