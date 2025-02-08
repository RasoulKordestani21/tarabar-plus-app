import CustomButton from "@/components/CustomButton";
import CustomCard from "@/components/CustomCard";

import React, { useEffect, useState } from "react";
import { View, Image, Animated, Text, Alert } from "react-native";
import { router } from "expo-router";

import { useGlobalContext } from "@/context/GlobalProvider";
import tw from "@/libs/twrnc";

export default function OnBoardingScreen({}) {
  const [showButtons, setShowButtons] = useState(false);
  const {
    role,
    setRole,
    isLogged,
    token,
    deviceId,
    deviceName,
    setDeviceInfo,
    setToken,
    setPhoneNumber
  } = useGlobalContext();
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    // Set device info on mount if not already set
    console.log(deviceId, deviceName, " is deviceId and deviceName ");
    if (!deviceId || !deviceName) {
      setDeviceInfo();
    }
  }, [deviceId, setDeviceInfo]);

  useEffect(() => {
    setToken();
    setRole();
    setPhoneNumber();
    console.log(token);
    // if (isLogged && token) {
    //   console.log("loggedin");
    //   router.replace("/home");
    // }
  }, [isLogged]);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 1500,
        useNativeDriver: true
      })
    ]).start(() => setShowButtons(true));
  }, [fadeAnim]);

  const handleRoleSetter = (role: string) => {
    setRole(role);
    router.replace("/otp-sender");
  };


  return (
    <View
      style={tw`flex-1 justify-center items-center px-5 py-15 bg-[#003366]`}
    >
      {!showButtons ? (
        <Animated.View
          style={[tw`items-center justify-center mb-5`, { opacity: fadeAnim }]}
        >
          <Image
            source={require("@/assets/images/tarabarplusicon.png")}
            style={tw``}
          />
        </Animated.View>
      ) : (
        <View style={tw`w-full h-full items-center justify-between gap-12`}>
          <Image
            source={require("@/assets/images/tarabarplusicon.png")}
            // style={tw`w-36 h-36`}
          />
          <CustomCard
            header={
              <Text style={tw`text-text text-center mb-2 font-vazir text-base`}>
                به اپلیکیشن <Text style={tw`text-secondary`}>ترابر پلاس </Text>
                خوش آمدید .
              </Text>
            }
            content={
              <Text style={tw`text-text text-right text-sm font-vazir`}>
                در این اپلیکیشن شما می‌توانید به عوان راننده یا معرف بار ثبت‌نام
                نمایید .{"\n"} ۱- اگر به دنبال بار هستید می‌توانید به عنوان
                راننده وارد شوید.
                {"\n"} ۲- اگر صاحب بار و یا معرف بار هستید به عنوان معرف بار
                وارد شوید.
              </Text>
            }
          />

          <View style={tw`w-full items-center`}>
            <CustomButton
              title="ورود به عنوان راننده "
              handlePress={() => {
                handleRoleSetter("1");
              }}
              containerStyles="w-full mt-7 bg-secondary"
            />
            <CustomButton
              title="ورود به عنوان صاحب بار "
              handlePress={() => {
                handleRoleSetter("2");
              }}
              containerStyles="w-full mt-7 bg-secondary"
            />
          </View>
        </View>
      )}
    </View>
  );
}
