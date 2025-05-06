import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import tw from "@/libs/twrnc";
import { Route } from "expo-router";
import {
  FontAwesome5,
  MaterialIcons,
  MaterialCommunityIcons,
  Ionicons
} from "@expo/vector-icons";

type BoxButtonProps = {
  id: number;
  iconType: "fontAwesome" | "material" | "materialCommunity" | "ionicons";
  iconName: string;
  text: string;
  route: Route;
  onPress: () => void;
  bgColor?: string;
  textColor?: string;
  iconColor?: string;
  iconSize?: number;
};

const BoxButton: React.FC<BoxButtonProps> = ({
  id,
  iconType,
  iconName,
  text,
  route,
  onPress,
  bgColor = "bg-white",
  textColor = "text-background",
  iconColor = "#0055AA", // Default Primary color
  iconSize = 36
}) => {
  // Render appropriate icon based on iconType
  const renderIcon = () => {
    switch (iconType) {
      case "fontAwesome":
        return (
          <FontAwesome5 name={iconName} size={iconSize} color={iconColor} />
        );
      case "material":
        return (
          <MaterialIcons name={iconName} size={iconSize} color={iconColor} />
        );
      case "materialCommunity":
        return (
          <MaterialCommunityIcons
            name={iconName}
            size={iconSize}
            color={iconColor}
          />
        );
      case "ionicons":
        return <Ionicons name={iconName} size={iconSize} color={iconColor} />;
      default:
        return (
          <FontAwesome5
            name="question-circle"
            size={iconSize}
            color={iconColor}
          />
        );
    }
  };

  return (
    <TouchableOpacity
      key={id}
      onPress={onPress}
      style={tw`w-[48%] mb-4 ${bgColor} border-2 border-background rounded-lg items-center p-2 shadow-sm bg-black-300`}
      activeOpacity={0.7}
    >
      <View style={tw`h-20 w-20 items-center justify-center bg- rounded-full `}>
        {renderIcon()}
      </View>
      {/* <View style={tw`w-full h-[1px] bg-background mb-5 mt-3`}></View> */}
      <Text style={tw`text-center font-vazir ${textColor}`}>{text}</Text>
    </TouchableOpacity>
  );
};

export default BoxButton;
