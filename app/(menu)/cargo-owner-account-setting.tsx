import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Alert,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";
import tw from "@/libs/twrnc";
import { Formik } from "formik";

// Import necessary components and utilities
import FormField from "@/components/Input/FormField";
import CustomButton from "@/components/CustomButton";
import FileInput from "@/components/Input/FileInput";
import Loader from "@/components/Loader";

// Import context and services
import { useGlobalContext } from "@/context/GlobalProvider";
import { uploadFile } from "@/api/services/fileServices";
import {
  getCargoOwner,
  updateCargoOwnerProfile
} from "@/api/services/cargoOwnerServices";
import { useQueryClient, useQuery } from "@tanstack/react-query";

// Import constants
import { cargoOwnerAccountSettingTextInput } from "@/constants/BoxesList";
import {
  cargoOwnerConfirmationInitialValues,
  cargoOwnerConfirmValidationSchema
} from "@/constants/FormikValidation";
import { QUERY_KEYS } from "@/constants/QueryKeys";

const CargoOwnerProfileUpdateScreen = () => {
  const { phoneNumber, role } = useGlobalContext();
  const queryClient = useQueryClient();
  // File upload handler
  const fileUploader = async (file: any) => {
    try {
      const formData = new FormData();

      // Create file object for FormData
      const fileToUpload = {
        uri: file.uri,
        type: file.mimeType,
        name: file.name
      };

      formData.append("file", fileToUpload as any);
      formData.append("fieldName", "national-card");
      formData.append("phoneNumber", phoneNumber);
      formData.append("clientEnvironment", "mobile-app");
      formData.append("role", role);

      // Upload file and return result
      const uploadResult = await uploadFile(
        "upload/cargo-owner/national-card-image",
        formData
      );
      return uploadResult?.data;
    } catch (err) {
      Alert.alert("خطا", "بارگذاری سند با مشکل مواجه شد");
      return null;
    }
  };

  // Submit handler for profile update
  const submitHandler = async (values: any) => {
    try {
      // Create a copy of values to avoid mutating the original
      const formValues = { ...values };

      // Remove nationalCard from formValues if it's a file object (not a string)
      if (
        formValues.nationalCard &&
        typeof formValues.nationalCard === "object" &&
        formValues.nationalCard.uri
      ) {
        // Store the file object temporarily
        const fileToUpload = formValues.nationalCard;

        // Remove nationalCard from formValues to avoid validation error
        delete formValues.nationalCard;

        // First, upload the file
        const uploadedFile = await fileUploader(fileToUpload);

        // If upload successful, add the file path to formValues
        if (uploadedFile?.file?.path) {
          formValues.nationalCard = uploadedFile.file.path;
        }
      }

      // Update verification data
      const result = await updateCargoOwnerProfile({
        ...formValues,
        phoneNumber
      });

      // Show success message
      if (result) {
        queryClient.invalidateQueries([
          QUERY_KEYS.CARGO_OWNER_INFO,
          phoneNumber
        ]);
        Alert.alert("موفقیت", "اطلاعات کاربری شما با موفقیت به روز شد.");
      } else {
        Alert.alert("خطا", "به روزرسانی اطلاعات با مشکل مواجه شد.");
      }
    } catch (err) {
      console.error("Submit error:", err?.message?.split("/")[1]);
      Alert.alert(
        "خطا",
        err?.message?.split("/")[1] || "خطای غیرمنتظره‌ای رخ داده است."
      );
    }
  };

  // Fetch user data
  const { data, isLoading, refetch } = useQuery({
    queryKey: [QUERY_KEYS.CARGO_OWNER_INFO, phoneNumber],
    queryFn: () => getCargoOwner({ phoneNumber })
  });
  useEffect(() => {
    refetch();
  }, []);

  // Render loading state if data is being fetched
  if (isLoading) {
    return <Loader isLoading={isLoading} />;
  }
  console.log(data, "\n  this is user data ---> \n ---> ");
  return (
    <KeyboardAvoidingView
      style={tw`flex-1 bg-white`}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Formik
          initialValues={cargoOwnerConfirmationInitialValues(data)}
          validationSchema={cargoOwnerConfirmValidationSchema}
          onSubmit={submitHandler}
        >
          {({ handleChange, handleSubmit, values, errors }) => (
            <ScrollView keyboardShouldPersistTaps="handled" style={tw`flex-1`}>
              <View style={tw`min-h-full p-5`}>
                {/* Profile Information Section */}
                <View style={tw`flex-1 p-1 rounded-2`}>
                  <Text style={tw`text-lg text-right font-vazir-bold`}>
                    اطلاعات صاحب بار
                  </Text>

                  {/* Divider */}
                  <View
                    style={tw`w-full h-[2px] bg-card mb-3 mt-1 rounded-xl`}
                  ></View>

                  {/* User Information Fields */}
                  <View style={tw`flex-row flex-wrap justify-between`}>
                    {cargoOwnerAccountSettingTextInput.map(field => (
                      <View key={field.name} style={tw`w-[48%]`}>
                        <FormField
                          title={field.title}
                          handleChangeText={handleChange(field.name)}
                          value={values[field.name]}
                          formikError={errors[field.name]}
                          isUsingFormik={true}
                          defaultValue={data?.user[field.name]}
                          otherStyles="mb-1"
                          keyboardType={field.keyboardType}
                          maxLength={field.maxLength}
                          pattern={field.pattern}
                          color="background"
                        />
                      </View>
                    ))}
                  </View>

                  {/* Additional Information */}
                  <View
                    style={tw`flex-row-reverse flex-wrap justify-between items-start mb-10`}
                  >
                    {/* National Card File Upload */}
                    <FileInput
                      name="nationalCard"
                      formikError={errors.nationalCard}
                      defaultValue={data?.user?.nationalCard}
                      label="تصویر کارت ملی"
                    />
                  </View>
                </View>

                {/* Save Changes Button */}
                <CustomButton
                  title="ذخیره تغییرات"
                  handlePress={handleSubmit}
                  containerStyles="w-full mt-7 bg-background mb-5"
                />
              </View>
            </ScrollView>
          )}
        </Formik>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default CargoOwnerProfileUpdateScreen;
