// OtpVerifier.js
import React, { useState } from "react";
import { Alert, View, Image, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "@/libs/twrnc";
import FormField from "@/components/Input/FormField";
import CustomButton from "@/components/CustomButton";
import OTPTimer from "@/components/OtpTimer";
import { verifyOtp, generateOtp } from "@/api/services/otpServices";
import { useGlobalContext } from "@/context/GlobalProvider";
import { useToast } from "@/context/ToastContext";
import { router } from "expo-router";
import Loader from "@/components/Loader";

const OtpVerifier = () => {
  const { showToast } = useToast();
  const {
    setLoading,
    loading,
    phoneNumber,
    role,
    setToken,
    setIsLogged,
    setPhoneNumber,
    deviceId,
    deviceName
  } = useGlobalContext(); // Get setPhoneNumber from the context
  const [form, setForm] = useState({ otp: "" });
  const [focused, setFocused] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const handleVerification = async () => {
    setLoading(true);
    try {
      const response = await verifyOtp({
        phoneNumber,
        otp: form.otp,
        deviceId,
        deviceName,
        role
      });
      console.log("Verification Response:", response); // Debugging log

      if (response?.token) {
        setToken(response.token); // Save the token in global context
        setIsLogged(true); // Update logged-in status
        setPhoneNumber(phoneNumber); // Set the phone number in the context securely
        if (role === "1") {
          router.replace("/driver-home");
        } else {
          router.replace("/cargo-owner-home");
        } // Navigate to the account screen
      } else {
        // Alert.alert("Error", "Failed to retrieve token from the server.");
        await showToast("Failed to retrieve token from the server.");
      }
    } catch (error: any) {
      // console.error("Error in handleVerification:", error.message); // Debugging log
      await showToast(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    try {
      await generateOtp({ phoneNumber, role });
      await showToast(`کد به شماره ${phoneNumber} ارسال گردید`, "success");
    } catch (error: any) {
      await showToast(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Loader isLoading={loading} />
      <SafeAreaView
        style={tw`bg-background flex-1 justify-center items-center px-5`}
      >
        <Image
          source={require("@/assets/images/otp-verification-illustration.png")}
          style={tw`w-[200px] h-[200px]`}
        />

        <View style={tw`w-full`}>
          <FormField
            title="کد تایید ارسال شده"
            placeholder="کد پیامک شده را وارد نمایید."
            value={form.otp}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            handleChangeText={(e: string) => setForm({ ...form, otp: e })}
            onValidationChange={(isValid: boolean) => setIsFormValid(isValid)} // Handle validation
            pattern={{
              type: /^\d{4}$/,
              message: "کد چهاررقمی می‌باشد."
            }}
            otherStyles="mt-7"
            keyboardType={
              Platform.OS === "ios" ? "name-phone-pad" : "number-pad"
            }
            maxLength={4}
          />
          <View style={tw`flex-row items-center justify-between `}>
            <OTPTimer onResend={handleResend} duration={120} />
            <CustomButton
              title="اصلاح شماره تلفن"
              handlePress={() => {
                router.replace("/otp-sender");
              }}
              containerStyles="align-left  bg-primary"
              textStyles="text-sm px-2"
            />
          </View>
        </View>
        <CustomButton
          title="تایید کد ارسال شده"
          handlePress={handleVerification}
          containerStyles="w-full mt-7"
          disabled={!isFormValid}
        />
      </SafeAreaView>
    </>
  );
};

export default OtpVerifier;
