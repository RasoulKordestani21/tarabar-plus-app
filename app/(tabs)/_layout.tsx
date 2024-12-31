import { Tabs } from "expo-router";
import React from "react";
import { Platform, StyleSheet, View, Pressable } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarStyle: {
          borderTopLeftRadius: 14,
          borderTopRightRadius: 14,
          height: 85,
          backgroundColor: "#002244",
          ...Platform.select({
            ios: {
              position: "absolute"
            },
            default: {}
          })
        },
        tabBarItemStyle: {
          display: "flex",
          flexDirection: "row-reverse",
          alignItems: "center",
          justifyContent: "center"
        },
        tabBarActiveTintColor: "white",
        headerShown: false,
        tabBarButton: props => (
          <Pressable
            onPress={props.onPress}
            style={({ pressed }) => [
              styles.tabItem,
              props.accessibilityState?.selected && styles.activeTab,
              pressed && styles.pressedTab
            ]}
          >
            {props.children}
          </Pressable>
        ),
        tabBarBackground: TabBarBackground
      })}
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

const styles = StyleSheet.create({
  tabItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  activeTab: {
    borderWidth: 2,
    borderColor: "#FFFFFF",
    borderRadius: 16,
    padding: 10
  },
  pressedTab: {
    opacity: 0.75
  }
});
