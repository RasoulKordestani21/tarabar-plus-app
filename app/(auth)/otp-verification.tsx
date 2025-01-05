import { useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Dimensions, Alert, Image } from "react-native";

// import { images } from "../../constants";
// import { CustomButton, FormField } from "../../components";
// import { getCurrentUser, signIn } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";
import CustomCard from "@/components/CustomCard";
import tw from "@/libs/twrnc";
import CustomButton from "@/components/CustomButton";
import OTPTimer from "@/components/OtpTimer";
import FormField from "@/components/FormField";
import { Platform } from "react-native";

const OtpSender = () => {
  const { setUser, setIsLogged } = useGlobalContext();
  const [focused, setFocused] = useState(false);
  const [form, setForm] = useState({
    mobileNum: ""
  });

  const submit = async () => {
    router.replace("/");

    // if (form.email === "" || form.password === "") {
    //   Alert.alert("Error", "Please fill in all fields");
    // }

    // setSubmitting(true);

    // try {
    //   await signIn(form.email, form.password);
    //   const result = await getCurrentUser();
    //   setUser(result);
    //   setIsLogged(true);

    //   Alert.alert("Success", "User signed in successfully");
    //   router.replace("/home");
    // } catch (error) {
    //   Alert.alert("Error", error.message);
    // } finally {
    //   setSubmitting(false);
    // }
  };

  return (
    <View
      style={tw`bg-primary flex-1 justify-center items-center justify-evenly px-5 py-15`}
    >
      <Image
        source={require("@/assets/images/otp-verification-illustration.png")}
      />
      <View style={tw` w-full`}>
        <FormField
          title="کد تایید ارسال شده "
          placeholder="کد پیامک شده را وارد نمایید ."
          value={form.mobileNum}
          handleChangeText={(e: string) => setForm({ mobileNum: e })}
          otherStyles="mt-7"
          keyboardType={Platform.OS === "ios" ? "name-phone-pad" : "number-pad"}
        />
        <OTPTimer onResend={() => null} duration={120} />
      </View>
      <CustomButton
        title="تایید کد ارسال شده "
        handlePress={() => router.push("/otp-verification")}
        containerStyles="w-full mt-7"
      />
    </View>
  );
};

export default OtpSender;
