import CustomButton from "@/components/CustomButton";
import CustomCard from "@/components/CustomCard";

import React, { useEffect, useState } from "react";
import { View, Image, Animated, Text, Alert, StatusBar } from "react-native";
import { router } from "expo-router";

import { useGlobalContext } from "@/context/GlobalProvider";
import tw from "@/libs/twrnc";
import Constants from "expo-constants";

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
    console.log(
      deviceId,
      deviceName,
      Constants?.expoConfig?.version,
      " is deviceId and deviceName "
    );
    if (!deviceId || !deviceName) {
      setDeviceInfo();
    }
  }, [deviceId, setDeviceInfo]);

  useEffect(() => {
    // setToken();
    // setRole();
    // setPhoneNumber();
    // console.log(token);
    if (isLogged) {
      if (role === "1") {
        router.replace("/driver-home");
      } else {
        router.replace("/cargo-owner-home");
      }
    }
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
    <>
      <StatusBar barStyle="light-content" backgroundColor="#003366" />
      <View
        style={tw`flex-1 justify-center items-center px-5 py-15 bg-[#003366]`}
      >
        {!showButtons ? (
          <Animated.View
            style={[
              tw`items-center justify-center mb-5`,
              { opacity: fadeAnim }
            ]}
          >
            <Image
              source={require("@/assets/images/splash.png")}
              style={tw`w-72 h-72`}
            />
            {/* Version text during splash animation */}
            <Text
              style={tw`text-white text-center font-vazir text-sm mt-6 opacity-80`}
            >
              نسخه {Constants.expoConfig?.version}
            </Text>
          </Animated.View>
        ) : (
          <View style={tw`w-full h-full items-center justify-between py-8`}>
            {/* Top section with logo */}
            <View style={tw`items-center mt-4`}>
              <Image
                source={require("@/assets/images/splash.png")}
                style={tw`w-72 h-20`}
                // resizeMode="contain"
              />
            </View>

            {/* Middle section with welcome card */}
            <View style={tw`flex-1 justify-center w-full`}>
              <CustomCard
                header={
                  <Text
                    style={tw`text-text text-center mb-3 font-vazir text-lg font-vazir`}
                  >
                    به اپلیکیشن{" "}
                    <Text style={tw`text-secondary`}>ترابر پلاس</Text> خوش آمدید
                  </Text>
                }
                content={
                  <Text
                    style={tw`text-text text-right text-sm font-vazir leading-6`}
                  >
                    در این اپلیکیشن شما می‌توانید به عنوان راننده یا صاحب بار
                    ثبت‌نام نمایید.{"\n\n"}
                    🚛 اگر به دنبال بار هستید، به عنوان راننده وارد شوید.
                    {"\n\n"}
                    📦 اگر صاحب بار یا معرف بار هستید، به عنوان صاحب بار وارد
                    شوید.
                  </Text>
                }
              />
            </View>

            {/* Bottom section with buttons and version */}
            <View style={tw`w-full items-center`}>
              <CustomButton
                title=" ورود به عنوان راننده"
                handlePress={() => {
                  handleRoleSetter("1");
                }}
                containerStyles="w-full mt-4 mb-2 bg-secondary rounded-xl"
                textStyles="font-vazir text-base font-vazir"
              />
              <CustomButton
                title="ورود به عنوان صاحب بار"
                handlePress={() => {
                  handleRoleSetter("2");
                }}
                containerStyles="w-full mt-4 bg-secondary rounded-xl"
                textStyles="font-vazir text-base font-vazir"
              />

              {/* Version at bottom */}
              <View
                style={tw`mt-6 bg-white bg-opacity-10 px-4 py-2 rounded-full`}
              >
                <Text style={tw`text-white text-xs font-vazir text-center`}>
                  نسخه {Constants.expoConfig?.version}
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>
    </>
  );
}
