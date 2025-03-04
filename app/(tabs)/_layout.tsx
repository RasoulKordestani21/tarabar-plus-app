import React, { useRef, useEffect } from "react";
import {
  Animated,
  Image,
  Pressable,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { router, Tabs } from "expo-router";
import { IconSymbol } from "@/components/ui/IconSymbol";
import tw from "@/libs/twrnc";
import { tabBoxes } from "@/constants/BoxesList";
import { useGlobalContext } from "@/context/GlobalProvider";
import { FontAwesome } from "@expo/vector-icons";
import CustomButton from "@/components/CustomButton";

type TabBarLabelProps = {
  focused: boolean;
  title: string;
  iconName: string;
  scaleAnim: Animated.Value;
};
// separate component for label
const TabBarLabel = React.memo(
  ({ focused, title, iconName, scaleAnim }: TabBarLabelProps) => {
    useEffect(() => {
      Animated.timing(scaleAnim, {
        toValue: focused ? 1 : 0,
        duration: 100,
        useNativeDriver: true
      }).start();
    }, [focused, scaleAnim]);
    return (
      <Animated.View
        style={[
          tw`mx-3 p-2 items-center flex-row justify-center mb-4`,
          {
            backgroundColor: scaleAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ["transparent", "#ffffff"]
            }),
            // width:"105%",
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
              tw`font-vazir-bold  text-[11px]`,
              {
                color: scaleAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["#ffffff", "#003366"]
                }),
                paddingHorizontal: 8
              }
            ]}
          >
            {title}
          </Animated.Text>
        )}
        <IconSymbol
          size={20}
          name={iconName as any}
          color={focused ? "#003366" : "#ffffff"}
        />
      </Animated.View>
    );
  }
);

export default function TabLayout() {
  const { role, setToken, setPhoneNumber, setRole ,setIsLogged, loading } =
    useGlobalContext();
  console.log(tabBoxes(role).length);
  return (
    <Tabs
      screenOptions={({ route }: { route: { name: string } }) => ({
        tabBarStyle: tw`bg-background rounded-5 mx-2 my-3  h-[60px] ${
          loading ? "hidden" : "flex"
        }`,
        tabBarItemStyle: tw` flex-row min-w-1/3  items-center justify-center`,
        tabBarActiveTintColor: "rgba(0, 0, 0, 0)",
        tabBarInactiveTintColor: "rgba(0, 0, 0, 0)",

        headerShown: !loading,
        headerStyle: tw`bg-background `,

        headerTitle: () => (
          <View style={tw`flex-row items-center justify-center  min-w-full`}>
            <TouchableOpacity
              style={tw`absolute left-2`}
              onPress={() => {
                setToken();
                setPhoneNumber();
                setRole();
                setIsLogged(false);
                router.replace("/");
              }}
            >
              <FontAwesome name="sign-out" size={24} color="#fff" />
            </TouchableOpacity>
            <Image
              source={require("@/assets/images/tarabarplusicon.png")}
              resizeMode="contain"
              style={tw` py-2 w-24`}
            />
          </View>
        ),
        headerTitleAlign: "center",
        headerShadowVisible: false,
        tabBarButton: props => (
          <Pressable
            onPress={props.onPress}
            style={({ pressed }) => [
              tw`flex-1 justify-center items-center w-[100px]`
            ]}
          >
            {props.children}
          </Pressable>
        )
      })}
    >
      {tabBoxes(role).map(tab => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarLabel: ({ focused }) => {
              const scaleAnim = useRef(
                new Animated.Value(focused ? 1 : 0)
              ).current;

              return (
                <TabBarLabel
                  focused={focused}
                  title={tab.title}
                  iconName={tab.iconName}
                  scaleAnim={scaleAnim}
                />
              );
            }
          }}
        />
      ))}
    </Tabs>
  );
}
