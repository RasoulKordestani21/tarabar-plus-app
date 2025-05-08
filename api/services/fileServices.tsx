import apiClient from "../apiClient";
import { Alert } from "react-native";

/**
 * Upload a file for different user roles
 * @param {File} file - The file object from DocumentPicker
 * @param {String} fieldName - The field name for the file
 * @param {Number} role - User role (1 for Driver, 2 for CargoOwner)
 * @param {String} phoneNumber - User's phone number
 * @returns {Promise} - Response from API
 */
export const uploadFile = async (
  file: any,
  fieldName: string,
  role: string,
  phoneNumber: string
) => {
  try {
    const formData = new FormData();

    // Prepare file object for FormData
    formData?.append("file", {
      uri: file.uri,
      type: file.mimeType || "image/jpeg", // Fallback type
      name: file.name || `file_${Date.now()}.jpg` // Fallback name
    });

    // Add metadata fields
    formData.append("fieldName", fieldName);
    formData.append("phoneNumber", phoneNumber);
    formData.append("clientEnvironment", "mobile-app");
    formData.append("role", role.toString());

    // Determine the appropriate endpoint based on role
    let endpoint;
    if (role === "1") {
      // Driver
      endpoint = "/upload/driver/national-card-image";
    } else if (role === "2") {
      // CargoOwner
      endpoint = "/upload/national-card-image";
    } else {
      throw new Error("Invalid role specified");
    }

    // Make the API request
    const response = await apiClient.post(endpoint, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });

    return response.data;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error; // Rethrow to handle in the component
  }
};

/**
 * Get file URL based on fieldName and role
 * @param {String} fieldName - The field name of the file
 * @param {Number} role - User role (1 for Driver, 2 for CargoOwner)
 * @param {String} phoneNumber - User's phone number
 * @returns {Promise<String|null>} - File URL or null if not found
 */
export const getFileUrl = async (
  fieldName: string,
  role: number,
  phoneNumber: string
) => {
  try {
    const response = await apiClient.get("/upload/file", {
      params: {
        fieldName,
        role,
        phoneNumber,
        clientEnvironment: "mobile-app"
      }
    });

    // Return the URL from the response
    return response.data?.fileData?.storageUrl || null;
  } catch (error) {
    console.error("Error fetching file URL:", error);
    return null;
  }
};

/**
 * Delete a file by fieldName and role
 * @param {String} fieldName - The field name of the file to delete
 * @param {Number} role - User role
 * @param {String} phoneNumber - User's phone number
 * @returns {Promise} - Response from API
 */
export const deleteFile = async (
  fieldName: string,
  role: number,
  phoneNumber: string
) => {
  try {
    const response = await apiClient.delete("/upload/file", {
      params: {
        fieldName,
        role,
        phoneNumber,
        clientEnvironment: "mobile-app"
      }
    });

    return response.data;
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
};
