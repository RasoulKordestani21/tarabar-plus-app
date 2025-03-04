import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import tw from "@/libs/twrnc";
import { Route } from "expo-router";

type BoxButtonProps = {
  id: number;
  source: any;
  text: string;
  route: Route;
  onPress: () => void;
};

const BoxButton: React.FC<BoxButtonProps> = ({
  id,
  source,
  text,
  route,
  onPress
}) => {
  return (
    <TouchableOpacity
      key={id}
      onPress={onPress}
      style={tw`w-[48%] mb-4  bg-white border-2 border-background rounded-lg items-center p-4`}
    >
      <Image source={source} style={tw`h-20 w-20`} resizeMode="contain" />
      <View style={tw`w-full h-[1px] bg-background mb-5 mt-3`}></View>
      <Text style={tw`text-center font-vazir text-background`}>{text}</Text>
    </TouchableOpacity>
  );
};

export default BoxButton;
