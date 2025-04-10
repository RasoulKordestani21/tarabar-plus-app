// OtpVerifier.js
import React, { useState, useCallback } from "react";
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
  } = useGlobalContext();

  const [form, setForm] = useState({ otp: "" });
  const [focused, setFocused] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const handleVerification = async () => {
    if (!isFormValid) {
      await showToast("لطفا کد تایید را وارد کنید", "error");
      return;
    }

    setLoading(true);
    try {
      const response = await verifyOtp({
        phoneNumber,
        otp: form.otp,
        deviceId,
        deviceName,
        role
      });

      if (!response?.token) {
        throw new Error("توکن دریافت نشد");
      }

      setToken(response.token);
      setIsLogged(true);
      setPhoneNumber(phoneNumber);

      const homeRoute = role === "1" ? "/driver-home" : "/cargo-owner-home";
      router.replace(homeRoute);
    } catch (error: any) {
      const errorMessage = error.message || "خطا در تایید کد";
      await showToast(errorMessage, "error");
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
      const errorMessage = error.message || "خطا در ارسال مجدد کد";
      await showToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = useCallback((value: string) => {
    setForm({ otp: value });
  }, []);

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
            handleChangeText={handleOtpChange}
            onValidationChange={setIsFormValid}
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
          <View style={tw`flex-row items-center justify-between`}>
            <OTPTimer onResend={handleResend} duration={120} />
            <CustomButton
              title="اصلاح شماره تلفن"
              handlePress={() => router.replace("/otp-sender")}
              containerStyles="align-left bg-primary"
              textStyles="text-sm px-2"
            />
          </View>
        </View>
        <CustomButton
          title="تایید کد ارسال شده"
          handlePress={handleVerification}
          containerStyles="w-full mt-7"
          disabled={!isFormValid || loading}
        />
      </SafeAreaView>
    </>
  );
};

export default OtpVerifier;
