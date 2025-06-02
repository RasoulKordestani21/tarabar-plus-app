import React, { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  Text,
  View,
  Image,
  ActivityIndicator,
  TouchableOpacity
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { useGlobalContext } from "@/context/GlobalProvider";
import tw from "@/libs/twrnc";
import { useFormikContext } from "formik";
import CustomButton from "../CustomButton";
import { AppUrl } from "@/constants/UrlConstants";

const FileInput = ({
  name,
  formikError,
  defaultValue,
  label = "انتخاب فایل",
  acceptedTypes = ["jpg", "jpeg"],
  disabled
}) => {
  const { phoneNumber, setLoading } = useGlobalContext();
  const { setFieldValue, setFieldTouched, setFieldError } = useFormikContext();

  const [imageModal, setImageModal] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);

  useEffect(() => {
    if (defaultValue) {
      const fullUrl = defaultValue?.startsWith("http")
        ? defaultValue
        : `${AppUrl()?.development}/${defaultValue}`;

      setImageUrl(fullUrl);
      setFieldError(name, undefined);

      // Extract filename from URL if possible
      const fileNameFromUrl = defaultValue?.split("/")?.pop();
      if (fileNameFromUrl) {
        setFileName(fileNameFromUrl);
      }
    }
  }, [defaultValue]);

  // Function to validate file extension
  const validateFileType = fileUri => {
    if (!fileUri) return false;
    const extension = fileUri.split(".").pop().toLowerCase();
    return acceptedTypes.includes(extension);
  };

  // Function to compress image
  const compressImage = async (imageUri, fileName) => {
    try {
      // Calculate compression based on file size
      let compression = 0.5; // Default compression (lower = more compression)
      if (fileSize > 5 * 1024 * 1024)
        compression = 0.2; // > 5MB: very high compression
      else if (fileSize > 2 * 1024 * 1024)
        compression = 0.3; // > 2MB: high compression
      else if (fileSize > 1 * 1024 * 1024) compression = 0.4; // > 1MB: medium-high compression

      // Calculate target dimensions to scale down large images
      const MAX_WIDTH = 1200; // Maximum width for any image
      const MAX_HEIGHT = 1200; // Maximum height for any image

      // Prepare resize action if needed
      const actions = [];

      // First, let's get the image dimensions
      const imageInfo = await ImageManipulator.manipulateAsync(imageUri, [], {
        format: ImageManipulator.SaveFormat.JPEG
      });

      // If image is larger than max dimensions, resize it
      if (imageInfo.width > MAX_WIDTH || imageInfo.height > MAX_HEIGHT) {
        const aspectRatio = imageInfo.width / imageInfo.height;

        let newWidth, newHeight;
        if (aspectRatio > 1) {
          // Landscape
          newWidth = Math.min(MAX_WIDTH, imageInfo.width);
          newHeight = Math.round(newWidth / aspectRatio);
        } else {
          // Portrait
          newHeight = Math.min(MAX_HEIGHT, imageInfo.height);
          newWidth = Math.round(newHeight * aspectRatio);
        }

        actions.push({ resize: { width: newWidth, height: newHeight } });
        console.log(
          `Resizing image from ${imageInfo.width}x${imageInfo.height} to ${newWidth}x${newHeight}`
        );
      }

      // Compress the image
      const result = await ImageManipulator.manipulateAsync(imageUri, actions, {
        compress: compression,
        format: ImageManipulator.SaveFormat.JPEG
      });

      console.log("Compressed image uri:", result.uri);
      console.log("New dimensions:", result.width, "x", result.height);

      // Create a file object that mimics the DocumentPicker result
      return {
        uri: result.uri,
        name: fileName.replace(/\.[^.]+$/, ".jpg"), // Replace extension with jpg
        type: "image/jpeg",
        mimeType: "image/jpeg",
        size: Math.floor((result.width * result.height * compression) / 10), // Rough estimate
        width: result.width,
        height: result.height
      };
    } catch (error) {
      console.error("Image compression failed:", error);
      // Return original file if compression fails
      return null;
    }
  };

  // Handle file selection
  const openPicker = async () => {
    try {
      setIsUploading(true);

      const result = await DocumentPicker.getDocumentAsync({
        type: "image/*",
        copyToCacheDirectory: true
      });

      const file = result?.assets?.[0];

      if (!file) {
        setIsUploading(false);
        setFieldTouched(name, true);
        setFieldValue(name, null);
        return;
      }

      // Set file size for compression calculation
      setFileSize(file.size || 0);

      // Extract file extension
      const fileExt = file.name
        ? file.name.split(".").pop().toLowerCase()
        : "jpg";

      // Check if file type is valid
      if (!acceptedTypes.includes(fileExt)) {
        setIsUploading(false);
        Alert.alert(
          "خطای فرمت فایل",
          `لطفاً فقط از فرمت‌های ${acceptedTypes.join(", ")} استفاده کنید.`,
          [{ text: "بستن", style: "cancel" }]
        );
        return;
      }

      // Compress image
      const compressedFile = await compressImage(
        file.uri,
        file.name || "image.jpg"
      );

      if (compressedFile) {
        // Set file info using compressed file
        setImageUrl(compressedFile.uri);
        setFileName(compressedFile.name || "compressed-image.jpg");
        setFieldTouched(name, true);
        setFieldValue(name, compressedFile);
      } else {
        // Fallback to original file if compression fails
        setImageUrl(file.uri);
        setFileName(file.name || "image.jpg");
        setFieldTouched(name, true);
        setFieldValue(name, file);
      }

      setIsUploading(false);
    } catch (err) {
      console.error("File selection error:", err);
      setIsUploading(false);
      Alert.alert("خطا", "انتخاب فایل با مشکل مواجه شد", [
        { text: "بستن", style: "cancel" }
      ]);
    }
  };

  return (
    <View style={tw`mb-4 w-[49%]`}>
      <Text style={tw`text-right text-background font-vazir text-base mb-1`}>
        {label}
      </Text>

      {/* File Selection Area */}
      <View
        style={tw`border border-background border-dashed border-2 rounded-lg p-3 ${
          formikError ? "border-red-600" : ""
        }`}
      >
        {isUploading ? (
          <View style={tw`py-3 items-center`}>
            <ActivityIndicator size="large" color="#0077b6" />
            <Text style={tw`mt-2 text-center text-gray-600`}>
              در حال پردازش تصویر...
            </Text>
          </View>
        ) : imageUrl ? (
          <View style={tw`mb-2`}>
            {/* <View style={tw`flex-row items-center justify-between mb-2`}>
              <Text
                style={tw`text-right text-gray-700 flex-1 text-xs`}
                numberOfLines={1}
              >
                {fileName || "تصویر انتخاب شده"}
              </Text>
              <Ionicons name="document" size={20} color="#0077b6" />
            </View> */}

            <View style={tw`flex-row`}>
              <CustomButton
                title="مشاهده تصویر"
                handlePress={() => setImageModal(true)}
                containerStyles="bg-gray-100 flex-1 mr-1"
                textStyles="text-gray-700 text-xs"
              />

              <CustomButton
                title=" فایل"
                handlePress={openPicker}
                containerStyles="bg-background flex-1 ml-1"
                textStyles="text-xs"
                disabled={disabled}
              />
            </View>
          </View>
        ) : (
          <CustomButton
            title="بارگذاری تصویر"
            handlePress={openPicker}
            containerStyles="w-full bg-white"
            iconName="cloud-upload"
            textStyles="text-background"
          />
        )}

        <Text style={tw`text-xs text-gray-500 text-center mt-1 font-vazir`}>
          فقط فرمت‌های {acceptedTypes.join("، ")} پذیرفته می‌شوند
        </Text>
      </View>
      {formikError && (
        <Text style={tw`text-red-500 text-xs mt-1 text-right`}>
          {formikError}
        </Text>
      )}
      {/* Image Preview Modal */}
      <Modal
        visible={imageModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setImageModal(false)}
      >
        <View
          style={tw`flex-1 justify-center items-center bg-black-50 bg-opacity-80`}
        >
          <TouchableOpacity
            style={tw`absolute top-10 right-10 z-10`}
            onPress={() => setImageModal(false)}
          >
            <Ionicons name="close-circle" size={36} color="white" />
          </TouchableOpacity>

          <Image
            source={{ uri: imageUrl }}
            style={tw`w-4/5 h-2/3 rounded-lg`}
            resizeMode="contain"
          />

          <CustomButton
            title="بستن"
            handlePress={() => setImageModal(false)}
            containerStyles="w-1/2 mt-5 bg-white border-2"
            textStyles="text-background"
          />
        </View>
      </Modal>
    </View>
  );
};

export default FileInput;
