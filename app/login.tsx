import CustomButton from "@/components/CustomButton";
import { ThemedText } from "@/components/ThemedText";
import { CustomTheme } from "@/themes/customTheme";
import React, { useEffect, useState } from "react";
import { View, Image, Pressable, Animated, Text } from "react-native";
import { Redirect, router } from "expo-router";
import tw from "twrnc";

export default function LoginScreen({ onLoginDriver, onLoginOwner }) {
  const [showButtons, setShowButtons] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];

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
          <View
            style={tw`w-full bg-[#4CAF50] p-4 rounded-lg items-center mb-5`}
          >
            <Text style={tw`text-white text-center mb-2`}>
              به اپلیکیشن ۰۹۳۸۸۰۰۳۳۱۲۳۴۵۶۷۸۰
            </Text>
            <Text style={tw`text-white text-center mb-2`}>salam</Text>
            <ThemedText style={tw`text-white text-right text-sm`}>
              ۰۹۳۸۸۰۰۳۳۱۲۳۴۵۶۷۸ در این اپلیکیشن شما می‌توانید به عوان راننده یا
              معرف بار ثبت‌نام نمایید .{"\n"} ۱- اگر به دنبال بار هستید
              می‌توانید به عنوان راننده وارد شوید.{"\n"} ۲- اگر صاحب بار و یا
              معرف بار هستید به عنوان معرف بار وارد شوید.
            </ThemedText>
          </View>

          <View style={tw`w-full items-center`}>
            <CustomButton
              title="ورود به عنوان راننده "
              handlePress={() => router.push("/sign-in")}
              containerStyles="w-full mt-7"
            />
            <Pressable
              style={tw`bg-[#4CAF50] py-4 rounded-lg w-full`}
              onPress={onLoginOwner}
            >
              <ThemedText style={tw`text-white text-center text-lg`}>
                ورود به عنوان صاحب بار
              </ThemedText>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}
