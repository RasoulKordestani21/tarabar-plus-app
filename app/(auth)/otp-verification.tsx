import { useState } from "react";
import { router } from "expo-router";
import { Alert, View, Image, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "@/libs/twrnc";
import FormField from "@/components/FormField";
import CustomButton from "@/components/CustomButton";
import OTPTimer from "@/components/OtpTimer";
import { verifyOtp, generateOtp } from "@/api/services/otpServices";
import { useGlobalContext } from "@/context/GlobalProvider";

const OtpVerifier = () => {
  const { setLoading, phoneNumber, role, setToken, setIsLogged } =
    useGlobalContext();
  const [form, setForm] = useState({ otp: "" });
  const [focused, setFocused] = useState(false);

  const handleVerification = async () => {
    if (!form.otp.trim()) {
      return Alert.alert("Error", "Please enter the OTP.");
    }

    setLoading(true);
    try {
      const response = await verifyOtp({ phoneNumber, otp: form.otp });
      console.log("Verification Response:", response); // Debugging log

      if (response?.token) {
        setToken(response.token); // Save the token in global context
        setIsLogged(true); // Update logged-in status
        router.replace("/home"); // Navigate to the account screen
      } else {
        Alert.alert("Error", "Failed to retrieve token from the server.");
      }
    } catch (error: any) {
      console.error("Error in handleVerification:", error.message); // Debugging log
      Alert.alert("Error", error.message || "Failed to verify OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    try {
      const response = await generateOtp({ phoneNumber, role });
      Alert.alert("Success", response.message || "OTP resent successfully.");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to resend OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={tw`bg-primary flex-1 justify-center items-center px-5`}
    >
      {!focused && (
        <Image
          source={require("@/assets/images/otp-verification-illustration.png")}
          style={tw`mb-5`}
        />
      )}
      <View style={tw`w-full`}>
        <FormField
          title="کد تایید ارسال شده"
          placeholder="کد پیامک شده را وارد نمایید."
          value={form.otp}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          handleChangeText={(e: string) => setForm({ ...form, otp: e })}
          otherStyles="mt-7"
          keyboardType={Platform.OS === "ios" ? "name-phone-pad" : "number-pad"}
        />
        <OTPTimer onResend={handleResend} duration={120} />
      </View>
      <CustomButton
        title="تایید کد ارسال شده"
        handlePress={handleVerification}
        containerStyles="w-full mt-7"
      />
    </SafeAreaView>
  );
};

export default OtpVerifier;
