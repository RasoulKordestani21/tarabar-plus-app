export const handleApiError = (error: any) => {
  if (error.response) {
    // Errors from the server
    console.error("API Error:", error.response.data.message);
    return error.response.data.message || "Something went wrong!";
  } else if (error.request) {
    // No response received
    console.error("Network Error:", error.message);
    return "Network error. Please check your connection.";
  } else {
    console.error("Error:", error.message);
    return "Unexpected error occurred.";
  }
};
