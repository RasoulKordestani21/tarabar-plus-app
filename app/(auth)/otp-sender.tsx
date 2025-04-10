import React, { useEffect, useState, useCallback } from "react";
import { router } from "expo-router";
import { View, Image, Platform } from "react-native";

import { useGlobalContext } from "@/context/GlobalProvider";
import tw from "@/libs/twrnc";
import CustomButton from "@/components/CustomButton";
import FormField from "@/components/Input/FormField";
import { generateOtp } from "@/api/services/otpServices";
import { useToast } from "@/context/ToastContext";
import Loader from "@/components/Loader"; // Import the Loader component

const OtpSender = () => {
  const { showToast } = useToast();
  const { role, setLoading, phoneNumber, setPhoneNumber, loading } =
    useGlobalContext();
  const [isFormValid, setIsFormValid] = useState(false);
  const [localPhoneNumber, setLocalPhoneNumber] = useState(phoneNumber);

  useEffect(() => {
    setLoading(false);
  }, []);

  const handlePhoneNumberChange = useCallback(
    (value: string) => {
      setLocalPhoneNumber(value);
      setPhoneNumber(value);
    },
    [setPhoneNumber]
  );

  const handleOtpSender = async () => {
    if (!isFormValid) {
      await showToast("لطفا شماره موبایل معتبر وارد کنید", "error");
      return;
    }

    setLoading(true);
    try {
      await generateOtp({ phoneNumber: localPhoneNumber, role });
      await showToast(`کد به شماره ${localPhoneNumber} ارسال گردید`, "success");
      router.replace("/otp-verification");
    } catch (error: any) {
      const errorMessage = error.message || "خطا در ارسال کد تایید";
      await showToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Display loader when loading */}
      <Loader isLoading={loading} />
      <View
        style={tw`bg-background flex-1 justify-center items-center justify-evenly px-5 py-15`}
      >
        <Image
          source={require("@/assets/images/otp-illustration.png")}
          style={tw`w-[200px] h-[200px]`}
        />

        <FormField
          title="شماره موبایل"
          placeholder="شماره موبایل خود را وارد کنید"
          value={localPhoneNumber}
          handleChangeText={handlePhoneNumberChange}
          pattern={{
            type: /^09(0[0-5]|1[0-9]|2[0-2]|3[0-9]|9[0-9])\d{7}$/,
            message: "شماره همراه باید ۱۱ رقمی و با 09 شروع شود"
          }}
          maxLength={11}
          onValidationChange={setIsFormValid}
          otherStyles="mt-7"
          keyboardType={Platform.OS === "ios" ? "name-phone-pad" : "number-pad"}
        />

        <CustomButton
          title="دریافت پیامک"
          handlePress={handleOtpSender}
          containerStyles="w-full mt-7"
          disabled={!isFormValid || loading}
        />
      </View>
    </>
  );
};

export default OtpSender;
