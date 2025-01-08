import React, { useRef, useEffect } from "react";
import { Animated, Image, Pressable, Text, View } from "react-native";
import { Tabs } from "expo-router";
import { IconSymbol } from "@/components/ui/IconSymbol";
import tw from "@/libs/twrnc"; // Tailwind setup in your project

const tabsData = [
  {
    name: "account",
    title: "کاربر",
    iconName: "person.crop.circle"
  },
  {
    name: "inquiry",
    title: "استعلام",
    iconName: "doc.plaintext.fill"
  },
  {
    name: "tools",
    title: "ابزار",
    iconName: "wrench.fill"
  },
  {
    name: "home",
    title: "خانه",
    iconName: "house.fill"
  }
];

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }: { route: { name: string } }) => ({
        tabBarStyle: tw`bg-background rounded-5 mx-2 mb-2 h-[85px]`,
        tabBarItemStyle: tw`flex-row items-center justify-center`,
        tabBarActiveTintColor: "rgba(0, 0, 0, 0)",
        tabBarInactiveTintColor: "rgba(0, 0, 0, 0)",
        headerShown: true,
        headerStyle: tw`bg-background`,
        // headerTintColor: "white",
        headerTitle: () => (
          <Image
            source={require("@/assets/images/tarabarplusicon.png")}
            // style={tw`h-20 w-20`}
            resizeMode="contain"
          />
        ),
        headerTitleAlign: "center",
        headerShadowVisible: false,
        tabBarButton: props => (
          <Pressable
            onPress={props.onPress}
            style={({ pressed }) => [tw`flex-1 justify-center items-center`]}
          >
            {props.children}
          </Pressable>
        )
      })}
    >
      {tabsData.map(tab => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarLabel: ({ focused }) => {
              // Set up animation
              const scaleAnim = useRef(
                new Animated.Value(focused ? 1 : 0)
              ).current;

              useEffect(() => {
                Animated.timing(scaleAnim, {
                  toValue: focused ? 1 : 0,
                  duration: 200, // Animation duration in ms
                  useNativeDriver: true // Better performance
                }).start();
              }, [focused]);

              return (
                <Animated.View
                  style={[
                    tw`mx-3 p-2 items-center flex-row justify-center mb-5`,
                    {
                      backgroundColor: scaleAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ["transparent", "#ffffff"]
                      }),
                      borderRadius: 8,
                      transform: [
                        {
                          scale: scaleAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [1, 1.1]
                          })
                        }
                      ]
                    }
                  ]}
                >
                  {focused && (
                    <Animated.Text
                      style={[
                        tw`font-vazir font-bold text-[11px]`,
                        {
                          color: scaleAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: ["#ffffff", "#003366"]
                          }),
                          paddingHorizontal: 8
                        }
                      ]}
                    >
                      {tab.title}
                    </Animated.Text>
                  )}
                  <IconSymbol
                    size={28}
                    name={tab.iconName as any}
                    color={focused ? "#003366" : "#ffffff"}
                  />
                </Animated.View>
              );
            }
          }}
        />
      ))}
    </Tabs>
  );
}
