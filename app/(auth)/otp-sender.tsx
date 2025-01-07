import { useEffect, useState } from "react";
import { router } from "expo-router";
import { View, Image, Alert } from "react-native";

import { useGlobalContext } from "@/context/GlobalProvider";
import tw from "@/libs/twrnc";
import CustomButton from "@/components/CustomButton";
import FormField from "@/components/FormField";
import { Platform } from "react-native";

import { generateOtp } from "@/api/services/otpServices";

const OtpSender = () => {
  const { role, setLoading, phoneNumber, setPhoneNumber } = useGlobalContext();
  const [focused, setFocused] = useState(false);
  const [validation, setValidation] = useState({
    validPhoneNumber: true
  });
  useEffect(() => {
    console.log(role);
  }, []);

  useEffect(() => {
    if (/^09\d{9}$/.test(phoneNumber)) {
      setValidation({ ...validation, validPhoneNumber: false });
    } else {
      setValidation({ ...validation, validPhoneNumber: true });
    }
  }, [phoneNumber]);

  const handleOtpSender = async () => {
    setLoading(true);
    try {
      console.log(phoneNumber, role, " is phone number and role");
      const response = await generateOtp({ phoneNumber, role });
      Alert.alert("Success", response.message);
      // Optionally navigate to OTP verification screen
      router.push("/otp-verification");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={tw`bg-primary flex-1 justify-center items-center justify-evenly px-5 py-15`}
    >
      {!focused && (
        <Image
          source={require("@/assets/images/otp-illustration.png")}
          // style={tw`w-[100] max-h-[]`}
        />
      )}

      <FormField
        title="شماره موبایل"
        placeholder="شماره موبایل خودرا وارد کدنید   "
        value={phoneNumber}
        handleChangeText={(e: string) => {
          setPhoneNumber(e);
        }}
        onFocus={() => {
          setFocused(true);
        }}
        onBlur={() => {
          setFocused(false);
        }}
        otherStyles="mt-7"
        keyboardType={Platform.OS === "ios" ? "name-phone-pad" : "number-pad"}
      />

      <CustomButton
        title="دریافت پیامک"
        handlePress={handleOtpSender}
        containerStyles="w-full mt-7"
        disabled={validation.validPhoneNumber}
      />
    </View>
  );
};

export default OtpSender;
