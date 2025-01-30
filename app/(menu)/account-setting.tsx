import React, { useState } from "react";
import { View, Text, ScrollView, Alert } from "react-native";
import tw from "@/libs/twrnc"; // Ensure you configure tailwind-rn or use a similar library
import FormField from "@/components/FormField";
import CustomButton from "@/components/CustomButton";
import LicensePlateInput from "@/components/LicensePlateInput";
import { updateVerificationData } from "@/api/services/userServices"; // Import your service function
import { useGlobalContext } from "@/context/GlobalProvider";

const AccountScreen = () => {
  const { phoneNumber } = useGlobalContext();
  // Assuming userId is passed from a previous route or via context
  const [form, setForm] = useState({
    nationalId: "",
    truckNavigationId: "",
    licensePlate: ""
  });
  console.log(phoneNumber);
  const handleSaveChanges = async () => {
    try {
      // Call the update verification data function
      const result = await updateVerificationData(phoneNumber, form);

      // Handle success (you can navigate or show a success message)
      Alert.alert(
        "Success",
        "Your verification data has been updated successfully."
      );
    } catch (error) {
      // Handle errors
      Alert.alert("Error", "Failed to update your verification data.");
    }
  };

  return (
    <ScrollView style={tw`m-4`}>
      <View style={tw`min-h-[700px]`}>
        <View style={tw`flex-1`}>
          {/* Form Fields */}
          <FormField
            title="کدملی"
            placeholder="کدملی خودرا وارد کدنید"
            value={form.nationalId}
            handleChangeText={(e: string) =>
              setForm({ ...form, nationalId: e })
            }
            color="background"
            keyboardType="numeric"
          />

          <FormField
            title="شماره هوشمند خودرو"
            placeholder="شماره هوشمند خودرو را وارد کدنید"
            value={form.truckNavigationId}
            handleChangeText={(e: string) =>
              setForm({ ...form, truckNavigationId: e })
            }
            color="background"
            keyboardType="numeric"
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

export default AccountScreen;
