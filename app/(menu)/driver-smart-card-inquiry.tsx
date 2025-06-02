import React, { useState } from "react";
import { View, Text, ScrollView, Alert, Platform } from "react-native";
import tw from "@/libs/twrnc"; // Ensure you configure tailwind-rn or use a similar library
import FormField from "@/components/Input/FormField";
import CustomButton from "@/components/CustomButton";
import LicensePlateInput from "@/components/LicensePlateInput";
import { useGlobalContext } from "@/context/GlobalProvider";
import { verifyDriverSmartCard } from "@/api/services/toolsServices"; // Import verify-driver-smart-card service
import { Formik } from "formik";
import {
  smartCardInquiryInitialValues,
  smartCardInquirySchema
} from "@/constants/FormikValidation";

const DriverSmartCardInquiry = () => {
  const { phoneNumber } = useGlobalContext(); // Assuming phone number is fetched from global context
  // Assuming userId is passed from a previous route or via context

  // Handle save changes
  const handleSubmit = async values => {
    try {
      // Call verifyDriverSmartCard service to verify the driver's smart card

      const result = await verifyDriverSmartCard({
        nationalId: values.nationalId,
        driverSmartNumber: values.driverSmartNumber,
        licensePlate: values.licensePlate
      });

      if (result.success) {
        // If OTP verification is successful, show success message
        Alert.alert(
          "Success",
          "Your driver verification has been completed successfully.",
          [{ text: "بستن", style: "cancel" }]
        );
      } else {
        // If OTP verification fails, show an error message
        Alert.alert("Error", "Failed to verify your driver information.", [
          { text: "بستن", style: "cancel" }
        ]);
      }
    } catch (error) {
      // Handle unexpected errors
      Alert.alert(
        "Error",
        "An error occurred while verifying your driver data.",
        [{ text: "بستن", style: "cancel" }]
      );
    }
  };

  return (
    <ScrollView style={tw`m-4`}>
      <View style={tw`min-h-[700px]`}>
        <Formik
          initialValues={smartCardInquiryInitialValues()}
          validationSchema={smartCardInquirySchema}
          onSubmit={handleSubmit}
        >
          {({ handleChange, handleSubmit, values, errors }) => (
            <>
              <View style={tw`flex-1`}>
                {/* Form Fields */}

                <View style={tw`w-full  mt-5`}>
                  <FormField
                    title={"کدملی"}
                    handleChangeText={handleChange("nationalId")}
                    value={values.nationalId}
                    formikError={errors.nationalId}
                    isUsingFormik={true}
                    otherStyles="mb-1 w-full"
                    keyboardType={
                      Platform.OS === "ios" ? "name-phone-pad" : "number-pad"
                    }
                    color="background"
                  />
                </View>

                <View style={tw`w-full `}>
                  <FormField
                    title={"شماره هوشمند راننده"}
                    handleChangeText={handleChange("driverSmartNumber")}
                    value={values.driverSmartNumber}
                    formikError={errors.driverSmartNumber}
                    isUsingFormik={true}
                    otherStyles="mb-1 w-full"
                    keyboardType={
                      Platform.OS === "ios" ? "name-phone-pad" : "number-pad"
                    }
                    color="background"
                  />
                </View>

                <LicensePlateInput
                  error={errors.licensePlate}
                  value={values.licensePlate}
                  handleChangeText={handleChange("licensePlate")}
                />
              </View>
              <CustomButton
                title="ذخیره تغییرات"
                handlePress={handleSubmit} // Call the handleSaveChanges function here
                containerStyles="w-full mt-7 bg-background mb-5"
              />
            </>
          )}
        </Formik>
      </View>
    </ScrollView>
  );
};

export default DriverSmartCardInquiry;
