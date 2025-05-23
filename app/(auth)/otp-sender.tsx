import React, { useEffect, useState, useCallback } from "react";
import { router } from "expo-router";
import { View, Image, Platform, Text, TouchableOpacity } from "react-native";

import { useGlobalContext } from "@/context/GlobalProvider";
import tw from "@/libs/twrnc";
import CustomButton from "@/components/CustomButton";
import FormField from "@/components/Input/FormField";
import { generateOtp } from "@/api/services/otpServices";
import { useToast } from "@/context/ToastContext";
import Loader from "@/components/Loader";
import RulesModal from "@/components/RulesModal";
import { MaterialIcons } from "@expo/vector-icons";

const OtpSender = () => {
  const { showToast } = useToast();
  const {
    role,
    setLoading,
    phoneNumber,
    setPhoneNumber,
    loading,
    isAcceptedRules,
    setIsAcceptedRules
  } = useGlobalContext();

  const [isFormValid, setIsFormValid] = useState(false);
  const [localPhoneNumber, setLocalPhoneNumber] = useState(phoneNumber);
  const [rulesModalVisible, setRulesModalVisible] = useState(false);

  useEffect(() => {
    setLoading(false);

    // Check if rules haven't been accepted yet, show the modal
    if (!isAcceptedRules) {
      // Delay showing modal slightly for better UX
      setTimeout(() => {
        setRulesModalVisible(true);
      }, 500);
    }
  }, []);

  const handlePhoneNumberChange = useCallback(
    (value: string) => {
      setLocalPhoneNumber(value);
      setPhoneNumber(value);
    },
    [setPhoneNumber]
  );

  const handleAcceptRules = useCallback(() => {
    setIsAcceptedRules(true);
    setRulesModalVisible(false);
    showToast("قوانین و مقررات با موفقیت پذیرفته شد", "success");
  }, [setIsAcceptedRules, showToast]);

  const handleOtpSender = async () => {
    if (!isFormValid) {
      await showToast("لطفا شماره موبایل معتبر وارد کنید", "error");
      return;
    }

    // Check if rules are accepted before proceeding
    if (!isAcceptedRules) {
      setRulesModalVisible(true);
      await showToast(
        "لطفا ابتدا قوانین و مقررات را مطالعه و تایید کنید",
        "info"
      );
      return;
    }

    setLoading(true);
    try {
      await generateOtp({
        phoneNumber: localPhoneNumber,
        role,
        isAcceptedRules: true // Send the rules acceptance to the API
      });
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

      {/* Enhanced Rules Modal */}
      <RulesModal
        visible={rulesModalVisible}
        onAccept={handleAcceptRules}
        onClose={() => setRulesModalVisible(false)}
      />

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

        {/* Rules acceptance status indicator */}
        <View style={tw`flex-row items-center justify-center mt-5`}>
          <MaterialIcons
            name={isAcceptedRules ? "check-circle" : "info-outline"}
            size={20}
            color={isAcceptedRules ? "#22c55e" : "#f59e0b"}
            style={tw`ml-2`}
          />
          <Text style={tw`text-sm text-white text-gray-700 font-vazir`}>
            {isAcceptedRules
              ? "قوانین و مقررات پذیرفته شده است"
              : "قوانین و مقررات باید پذیرفته شود"}
          </Text>

          <TouchableOpacity
            onPress={() => setRulesModalVisible(true)}
            style={tw`mr-2 ml-1`}
          >
            <Text style={tw`text-sm text-secondary font-vazir-bold underline`}>
              {isAcceptedRules ? "مشاهده مجدد" : "مشاهده"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default OtpSender;
