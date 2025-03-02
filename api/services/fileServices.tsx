import { Alert } from "react-native";
import apiClient from "../apiClient";

export const uploadFile = async (endPoint: string, formData: FormData) => {
  try {
    const response = await apiClient.post(endPoint, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });

    Alert.alert("File uploaded successfully!");
    return response;
  } catch (error) {
    console.error("Error uploading file: ", error);
    Alert.alert("Error uploading file");
  }
};
