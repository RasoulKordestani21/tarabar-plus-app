import React, { useEffect, useState } from "react";
import { Alert, Modal, Pressable, Text, View, Image } from "react-native";
import CustomButton from "../CustomButton";
import * as DocumentPicker from "expo-document-picker"; // Use Expo Document Picker
import { useGlobalContext } from "@/context/GlobalProvider";
import { uploadFile } from "@/api/services/fileServices";
import tw from "@/libs/twrnc";
import { useFormikContext } from "formik"; // Import useFormikContext to access Formik methods
import { AppUrl } from "@/constants/UrlConstants";

const Fileinput = ({
  name,
  formikError,
  defaultValue,
  label
}: {
  name: string;
  formikError: string;
  defaultValue?: string;
  label?: string;
}) => {
  const { phoneNumber, setLoading } = useGlobalContext();
  const { setFieldValue, setFieldTouched, setFieldError } = useFormikContext(); // Get Formik context

  const [imageModal, setImageModal] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    if (defaultValue) {
      setImageUrl(`${AppUrl()?.development}/${defaultValue}`);
      setFieldError(name, undefined);
    }
  }, []);
  const openPicker = async () => {
    console.log("openPicker called ");
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "image/*" // Only allow image files
      });

      const file = result?.assets[0];

      // If no file is selected, set an error and return
      if (!file) {
        setFieldTouched(name, true); // Mark as touched
        setFieldValue(name, null); // Set value to null
        return;
      }

      // Clear previous errors if any

      // Validate file type (only images)
      setImageUrl(file?.uri);
      setFieldTouched(name, true);
      setFieldValue(name, file);
    } catch (err) {
      Alert.alert("Error", "Failed to pick document");
    }

    // Proceed with file upload if validation is successful
  };

  return (
    <View style={tw`flex-col w-[49%]`}>
      <Text style={tw`text-background text-right font-vazir`}>
        {label ?? " ----"}
      </Text>

      <CustomButton
        title="بارگذاری "
        handlePress={openPicker}
        containerStyles={`w-full mt-1 mb-1 bg-white border-2 border-dashed rounded-2 ${
          formikError ? "border-red-600" : ""
        }`}
        iconName="upload"
        textStyles="text-background"
      />

      {formikError && (
        <Text style={tw`text-xs text-red-500 mt-1 font-vazir text-right`}>
          {formikError}
        </Text>
      )}

      {/* Show image preview if file is selected */}
      {imageUrl && (
        <Pressable onPress={() => setImageModal(true)}>
          <Text style={tw`text-background text-right font-vazir`}>
            مشاهده تصویر
          </Text>
        </Pressable>
      )}

      <Modal visible={imageModal} animationType="fade" transparent={true}>
        <View style={tw`flex-col w-full h-full bg-black-50`}>
          <View
            style={tw`items-center justify-center my-auto p-3 rounded-3 bg-text`}
          >
            <Image
              source={{
                uri: imageUrl || ``
              }}
              style={{ width: 200, height: 200 }}
            />
            <CustomButton
              title="بستن"
              handlePress={() => setImageModal(false)}
              containerStyles="w-full mt-7 bg-white border-2 mb-5 text-background"
              textStyles="text-background"
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Fileinput;
