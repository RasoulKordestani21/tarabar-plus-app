import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React from "react";
import { FontAwesome } from "@expo/vector-icons";
import tw from "@/libs/twrnc";
import { router } from "expo-router";

export default function ToolsScreen() {
  // Extended tools array with four items
  const tools = [
    {
      title: "تخمین کرایه",
      description:
        "در قسمت تخمین کرایه شما می‌توانید با تعیین مبدا، مقصد و همچنین نوع بار، کرایه بار خود را محاسبه کنید.",
      bgColor: "bg-text",
      iconName: "calculator",
      onPress: () => {
        router.push("/estimate-fee");
      }
    }
    // {
    //   title: "تخمین کمیسیون",
    //   description:
    //     "با استفاده از تخمین کمیسیون، می‌توانید کمیسیون بار خود را محاسبه کرده و به صورت لیست بارها مشاهده کنید.",
    //   bgColor: "bg-green-400",
    //   iconName: "desktop",
    //   onPress: () => {
    //     console.log("Calculate commission pressed");
    //   }
    // },
    // {
    //   title: "استعلام هوشمند راننده",
    //   description:
    //     "در این بخش شما می‌توانید وضعیت و اعتبار کارت هوشمند خود را بررسی کرده و اطلاعات لازم را مشاهده کنید.",
    //   bgColor: "bg-green-400",
    //   iconName: "id-card",
    //   onPress: () => {
    //     router.push("/driver-smart-card-inquiry");
    //   }
    // }
    // ,
    // {
    //   title: "استعلام کارت هوشمند راننده",
    //   description:
    //     "در این بخش شما می‌توانید مشخصات کارت هوشمند راننده را جستجو کرده و اطلاعات مورد نیاز را بررسی کنید.",
    //   bgColor: "bg-green-400",
    //   iconName: "user-circle",
    //   onPress: () => {
    //     console.log("Driver smart card inquiry pressed");
    //   }
    // }
  ];

  // Reusable ToolBox component
  const ToolBox = ({ title, description, bgColor, iconName, onPress }) => {
    return (
      <TouchableOpacity
        style={tw`${bgColor} rounded-lg mb-5 w-full border-2 border-background `}
        onPress={onPress}
      >
        <View style={tw`flex-row items-center p-4`}>
          {/* Left Icon */}
          <FontAwesome
            name="caret-left"
            size={28}
            style={tw`text-background mr-2`}
          />

          {/* Text Content */}
          <View style={tw`flex-1 mr-4 ml-2`}>
            <Text
              style={tw`text-background text-lg mb-1 text-right font-vazir-bold`}
            >
              {title}
            </Text>
            {/* <View style={tw`w-full h-[1px] bg-background mb-5 mt-1`} />
            <Text style={tw`text-background text-sm text-right font-vazir`}>
              {description}
            </Text> */}
          </View>

          {/* Right-side Icon */}
          <FontAwesome name={iconName} size={24} style={tw`text-background`} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={tw`flex-1 p-4`}>
      <View style={tw`flex-wrap flex-row justify-between`}>
        {tools.map((tool, index) => (
          <ToolBox
            key={index}
            title={tool.title}
            description={tool.description}
            bgColor={tool.bgColor}
            iconName={tool.iconName}
            onPress={tool.onPress}
          />
        ))}
      </View>
    </ScrollView>
  );
}
