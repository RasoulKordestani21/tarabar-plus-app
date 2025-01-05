import { useEffect, useState } from "react";
import { router } from "expo-router";
import { View, Image } from "react-native";

import { useGlobalContext } from "@/context/GlobalProvider";
import tw from "@/libs/twrnc";
import CustomButton from "@/components/CustomButton";
import FormField from "@/components/FormField";
import { Platform } from "react-native";

const OtpSender = () => {
  const { role, setPhoneNum } = useGlobalContext();

  const [form, setForm] = useState({
    phoneNum: ""
  });

  useEffect(() => {
    console.log(role);
  }, []);

  const handleOtpSender = () => {
    setPhoneNum(form.phoneNum);
    router.push("/otp-verification");
  };

  return (
    <View
      style={tw`bg-primary flex-1 justify-center items-center justify-evenly px-5 py-15`}
    >
      <Image
        source={require("@/assets/images/otp-illustration.png")}
        // style={tw`w-[100] max-h-[]`}
      />

      <FormField
        title="شماره موبایل"
        placeholder="شماره موبایل خودرا وارد کدنید   "
        value={form.phoneNum}
        handleChangeText={(e: string) => setForm({ phoneNum: e })}
        otherStyles="mt-7"
        keyboardType={Platform.OS === "ios" ? "name-phone-pad" : "number-pad"}
      />

      <CustomButton
        title="دریافت پیامک"
        handlePress={handleOtpSender}
        containerStyles="w-full mt-7"
      />
    </View>
  );
};

export default OtpSender;
