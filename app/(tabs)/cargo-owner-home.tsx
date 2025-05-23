import React, { useEffect, useState } from "react";
import { View, ScrollView, TouchableOpacity, Text, Alert } from "react-native";
import tw from "@/libs/twrnc";
import { router, useFocusEffect } from "expo-router";
import BoxButton from "@/components/BoxButton";
import { useGlobalContext } from "@/context/GlobalProvider";
import Loader from "@/components/Loader";
import VerificationModal from "@/components/VerificationModal";
import { getCargoOwner } from "@/api/services/cargoOwnerServices";
import {
  MaterialCommunityIcons,
  Ionicons,
  FontAwesome5
} from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/QueryKeys";

// Updated cargo owner home boxes with vector icons
const cargoOwnerHomeBoxes = [
  {
    id: 1,
    iconType: "materialCommunity",
    iconName: "plus-box",
    text: "ایجاد بار جدید",
    route: "/create-cargo"
  },
  {
    id: 2,
    iconType: "materialCommunity",
    iconName: "history",
    text: "تاریخچه بارها",
    route: "/cargo-history"
  },
  {
    id: 3,
    iconType: "fontAwesome",
    iconName: "user-alt",
    text: "حساب کاربری",
    route: "/cargo-owner-account"
  },
  {
    id: 4,
    iconType: "materialCommunity",
    iconName: "toolbox",
    text: "ابزار",
    route: "/cargo-owner-tools"
  }
];

export default function CargoOwnerHomeScreen() {
  const [verificationModalVisible, setVerificationModalVisible] =
    useState(false);
  const { phoneNumber, setLoading, user, setUser } = useGlobalContext();

  const {
    data: userData,
    error,
    isLoading: loading,
    isFetched
  } = useQuery({
    queryKey: [QUERY_KEYS.CARGO_OWNER_INFO, phoneNumber],
    queryFn: () => getCargoOwner({ phoneNumber })
  });

  useFocusEffect(
    React.useCallback(() => {
      // Reset loading state when returning to the screen
      setLoading(false);
    }, [])
  );

  useEffect(() => {
    if (userData) {
      setUser(userData?.user);
      if (!userData?.user?.isVerified && !userData?.user?.userName) {
        setVerificationModalVisible(true);
      }
    }
  }, [userData]);

  // Handle navigation to boxes
  const handleBoxPress = route => {
    if (user?.balance <= 0 && route === "/create-cargo") {
      Alert.alert(
        "تلاش ناموفق",
        "اعتبار حساب شما برای این عملیات کافی نمی‌باشد ."
      );
    } else {
      router.push(route);
    }
  };

  return (
    <>
      <Loader isLoading={loading} />

      {/* Verification Modal */}
      <VerificationModal
        visible={verificationModalVisible}
        onClose={() => setVerificationModalVisible(false)}
        route="/cargo-owner-account-setting"
      />

      {/* Parent container with relative positioning to house the floating button */}
      <View style={tw`flex-1 relative bg-gray-50`}>
        <ScrollView style={tw`flex-1`} contentContainerStyle={tw`p-4`}>
          {/* Header section */}
          <View style={tw`mb-6  p-4 rounded-lg `}>
            <Text
              style={tw`text-background text-lg font-vazir-bold text-right`}
            >
              پنل صاحب بار
            </Text>
            <View style={tw`h-[1px] w-full bg-card rounded-lg mt-2`} />
            {/* Added new view for styling */}
          </View>

          <View style={tw`flex-wrap flex-row-reverse justify-between`}>
            {cargoOwnerHomeBoxes.map(box => (
              <BoxButton
                key={box.id}
                id={box.id}
                iconType={box.iconType}
                iconName={box.iconName}
                text={box.text}
                route={box.route}
                onPress={() => handleBoxPress(box.route)}
                iconColor="#003366"
              />
            ))}
          </View>
        </ScrollView>

        {/* Floating Circle Button for Support/FAQ */}
        <TouchableOpacity
          style={tw`absolute bottom-6 right-6 w-15 h-15 bg-secondary rounded-full items-center justify-center shadow-lg`}
          onPress={() => router.push("/support-faq")}
        >
          <MaterialCommunityIcons name="headset" size={28} color="#fff" />
          <Text style={tw`font-vazir text-xs mt-1 text-white`}>پشتیبانی</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
