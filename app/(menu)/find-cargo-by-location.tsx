import { useEffect, useState } from "react";
import { router } from "expo-router";
import { View, Image, Alert, Text } from "react-native";

import { useGlobalContext } from "@/context/GlobalProvider";
import tw from "@/libs/twrnc";
import CustomButton from "@/components/CustomButton";
import FormField from "@/components/Input/FormField";
import { Platform } from "react-native";

import { generateOtp } from "@/api/services/otpServices";

const FindCargoByLocation = () => {
  const { role, setLoading, phoneNumber, setPhoneNumber } = useGlobalContext();

  return (
    <View
      style={tw`bg-primary flex-1 justify-center items-center justify-evenly px-5 py-15`}
    >
      <Text>find-cargo-by-location</Text>
    </View>
  );
};

export default FindCargoByLocation;
