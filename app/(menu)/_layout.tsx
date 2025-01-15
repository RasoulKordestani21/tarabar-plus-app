import React from "react";
import { router, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { FontAwesome } from "@expo/vector-icons"; // Import the FontAwesome icon library
import tw from "@/libs/twrnc";
import { Text, View, TouchableOpacity } from "react-native";

// Header component
const Header = ({ title }: { title: string }) => {
  return (
    <View style={tw`bg-background p-4`}>
      <Text style={tw`font-vazir text-white text-xl text-right`}>{title}</Text>
    </View>
  );
};

const MenuLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen
          name="find-cargo-by-location"
          options={{
            headerShown: false
          }}
        />

        <Stack.Screen
          name="estimate-fee"
          options={{
            title: "محاسبه کرایه", // Title of the screen
            headerStyle: tw`bg-background p-8`, // Apply Tailwind classes to header
            headerTintColor: "white", // Set header text color to white
            headerTitle: () => <Header title="محاسبه کرایه" /> // Use the custom Header component
          }}
        />

        <Stack.Screen
          name="account-setting"
          options={{
            title: "تنظیمات حساب کاربری", // Title of the screen
            headerStyle: tw`bg-background p-8`, // Apply Tailwind classes to header
            headerTintColor: "white", // Set header text color to white
            headerTitle: () => <Header title="تنظیمات حساب کاربری" /> // Use the custom Header component
          }}
        />
        <Stack.Screen
          name="wallet-plans"
          options={{
            title: "مدریرت کیف پول و اشتراک", // Title of the screen
            headerStyle: tw`bg-background p-8`, // Apply Tailwind classes to header
            headerTintColor: "white", // Set header text color to white
            headerTitle: () => <Header title="مدیریت کیف پول و اشتراک" /> // Use the custom Header component
          }}
        />
        <Stack.Screen
          name="about-us"
          options={{
            title: "درباره ترابرپلاس  ", // Title of the screen
            headerStyle: tw`bg-background p-8`, // Apply Tailwind classes to header
            headerTintColor: "white", // Set header text color to white
            headerTitle: () => <Header title="ِِِدرباره ترابر پلاس" /> // Use the custom Header component
          }}
        />
        <Stack.Screen
          name="support-faq"
          options={{
            title: "پشتیبانی", // Title of the screen
            headerStyle: tw`bg-background p-8`, // Apply Tailwind classes to header
            headerTintColor: "white", // Set header text color to white
            headerTitle: () => <Header title="پشتیبانی" /> // Use the custom Header component
          }}
        />
      </Stack>

      <StatusBar style="auto" />
    </>
  );
};

export default MenuLayout;
