import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import CustomHeader from "@/components/CustomHeader";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarItemStyle: {
          backgroundColor: "#003366",
          display: "flex",
          flexDirection: "row-reverse",
          alignItems: "center",
          justifyContent: "center",
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16
        },
        tabBarActiveTintColor: "white",
        
        // Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: {
          borderTopLeftRadius: 14,
          borderTopRightRadius: 14,
          height: 80,
          borderRadius: 10,
          backgroundColor: "#003366",
          ...Platform.select({
            ios: {
              // Use a transparent background on iOS to show the blur effect
              position: "absolute"
            },
            default: {}
          })
        }
      }}
    >
      <Tabs.Screen
        name="account"
        options={{
          title: "حساب کاربری",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="person.crop.circle" color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="tools"
        options={{
          title: "ابزار",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="wrench.fill" color={color} />
          )
        }}
      />

      <Tabs.Screen
        name="inquiry"
        options={{
          title: "استعلام ها",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="doc.plaintext.fill" color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "خانه",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          )
        }}
      />
    </Tabs>
  );
}
