import React, { useState } from "react";
import { View, Text, ScrollView, Alert, Platform } from "react-native";
import tw from "@/libs/twrnc"; // Ensure you configure tailwind-rn or use a similar library
import FormField from "@/components/Input/FormField";
import CustomButton from "@/components/CustomButton";
import LicensePlateInput from "@/components/LicensePlateInput";
import { useGlobalContext } from "@/context/GlobalProvider";
import { verifyDriverSmartCard } from "@/api/services/toolsServices"; // Import verify-driver-smart-card service

const DriverSmartCardInquiry = () => {
  const { phoneNumber } = useGlobalContext(); // Assuming phone number is fetched from global context
  // Assuming userId is passed from a previous route or via context
  const [form, setForm] = useState({
    nationalId: "",
    truckNavigationId: "",
    licensePlate: ""
  });

  // Handle save changes
  const handleSaveChanges = async () => {
    try {
      // Call verifyDriverSmartCard service to verify the driver's smart card
      console.log(form);
      const result = await verifyDriverSmartCard(
        form.nationalId,
        form.truckNavigationId
      );

      if (result.success) {
        // If OTP verification is successful, show success message
        Alert.alert(
          "Success",
          "Your driver verification has been completed successfully."
        );
      } else {
        // If OTP verification fails, show an error message
        Alert.alert("Error", "Failed to verify your driver information.");
      }
    } catch (error) {
      // Handle unexpected errors
      Alert.alert(
        "Error",
        "An error occurred while verifying your driver data."
      );
    }
  };

  return (
    <ScrollView style={tw`m-4`}>
      <View style={tw`min-h-[700px]`}>
        <View style={tw`flex-1`}>
          {/* Form Fields */}
          <FormField
            title="کد ملی"
            placeholder=" کد ملی خودرا وارد کدنید"
            value={form.nationalId}
            handleChangeText={(e: string) => {
              setForm({ ...form, nationalId: e });
            }}
            pattern={{
              type: /^\d{10}$/,
              message: "کد ملی 10 رقمی می‌باشد . "
            }}
            maxLength={10}
            otherStyles="mb-7"
            keyboardType={
              Platform.OS === "ios" ? "name-phone-pad" : "number-pad"
            }
            color="background"
          />

          <FormField
            title="شماره هوشمند خودرو"
            placeholder="شماره هوشمند خودرو را وارد کدنید"
            value={form.truckNavigationId}
            handleChangeText={(e: string) =>
              setForm({ ...form, truckNavigationId: e })
            }
            pattern={{
              type: /^\d{7}$/,
              message: "شماره هوشمند 7 رقمی می‌باشد . "
            }}
            maxLength={7}
            keyboardType={
              Platform.OS === "ios" ? "name-phone-pad" : "number-pad"
            }
            color="background"
          />

          <LicensePlateInput
            value={form.licensePlate}
            handleChangeText={(e: string) =>
              setForm({ ...form, licensePlate: e })
            }
          />
        </View>

        <CustomButton
          title="ذخیره تغییرات"
          handlePress={handleSaveChanges} // Call the handleSaveChanges function here
          containerStyles="w-full mt-7 bg-background mb-5"
        />
      </View>
    </ScrollView>
  );
};

export default DriverSmartCardInquiry;
