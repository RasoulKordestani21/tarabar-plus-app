import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Alert,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Submit handler for profile update
  const submitHandler = async values => {
    try {
      setIsSubmitting(true);

      // Create a copy of values to avoid mutating the original
      const formValues = { ...values };

      // Check if nationalCard is a file object (not a string/URL)
      if (
        formValues.nationalCard &&
        typeof formValues.nationalCard === "object" &&
        formValues.nationalCard.uri
      ) {
        try {
          // console.log("Uploading nationalCard file:", formValues.nationalCard);

          // Upload the file first
          const uploadResult = await uploadFile(
            formValues.nationalCard,
            "national-card",
            role,
            phoneNumber
          );

          // If upload successful, use the path or URL
          if (uploadResult?.file?.storageUrl) {
            // If using Liara, use the storage URL
            formValues.nationalCard = uploadResult.file.storageUrl;
          } else if (uploadResult?.file?.path) {
            formValues.nationalCard = uploadResult.file.path;
          } else if (uploadResult?.file?.url) {
            formValues.nationalCard = uploadResult.file.url;
          } else {
            // Fallback to URI if upload succeeded but no path was returned
            console.log("No file path in upload result, using URI");
            formValues.nationalCard = formValues.nationalCard.uri;
          }
        } catch (uploadError) {
          console.error("Upload error:", uploadError);
          setIsSubmitting(false);
          Alert.alert("خطا", "بارگذاری تصویر کارت ملی با مشکل مواجه شد");
          return;
        }
      } else if (
        formValues.nationalCard &&
        typeof formValues.nationalCard === "object"
      ) {
        // This handles the case where nationalCard is an object but doesn't have a URI
        console.warn(
          "nationalCard is an object without URI:",
          formValues.nationalCard
        );
        // Set to empty or null to avoid cast errors
        formValues.nationalCard = null;
      }

      // Update verification data
      console.log("Submitting form values:", formValues);
      const result = await updateCargoOwnerProfile({
        ...formValues,
        phoneNumber
      });

      setIsSubmitting(false);

      // Show success message
      if (result) {
        queryClient.invalidateQueries([
          QUERY_KEYS.CARGO_OWNER_INFO,
          phoneNumber
        ]);
        console.log(result);
        Alert.alert("موفقیت", "اطلاعات کاربری شما با موفقیت به روز شد.");
      } else {
        Alert.alert("خطا", "به روزرسانی اطلاعات با مشکل مواجه شد.");
      }
    } catch (err) {
      setIsSubmitting(false);
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

  console.log(data?.user?.nationalCardUrl, "this is data from cargo owner");
  useEffect(() => {
    refetch();
  }, []);

  // Render loading state if data is being fetched
  if (isLoading) {
    return <Loader isLoading={isLoading} />;
  }

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
                      defaultValue={data?.user?.nationalCardUrl}
                      label="تصویر کارت ملی"
                      acceptedTypes={["jpg", "jpeg", "png", "heic"]}
                      disabled={data?.user?.isVerified}
                    />
                  </View>
                </View>

                {/* Save Changes Button */}
                <CustomButton
                  title={
                    isSubmitting ? "در حال ذخیره سازی..." : "ذخیره تغییرات"
                  }
                  handlePress={handleSubmit}
                  containerStyles={`w-full mt-7 ${
                    isSubmitting ? "bg-gray-400" : "bg-background"
                  } mb-5`}
                  disabled={isSubmitting}
                  icon={
                    isSubmitting ? (
                      <ActivityIndicator size="small" color="white" />
                    ) : null
                  }
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
