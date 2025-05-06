import React, { useEffect, useState } from "react";
import { View, ScrollView, TouchableOpacity, Text } from "react-native";
import tw from "@/libs/twrnc";
import { router, useFocusEffect } from "expo-router";
import BoxButton from "@/components/BoxButton";
import LocationModal from "@/components/findLocationByGPS/LocationModal";
import DefineOriginDestination from "@/components/findLocationByOriginAndDestination/DefineOriginDestination";
import { useGlobalContext } from "@/context/GlobalProvider";
import DrawerModal from "@/components/DrawerModal";
import Loader from "@/components/Loader";
import VerificationModal from "@/components/VerificationModal";
import { getDriverUser } from "@/api/services/driverServices";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";

const driverHomeBoxes = [
  {
    id: 1,
    iconType: "materialCommunity",
    iconName: "map-search",
    text: "باریابی",
    route: "/find-cargo-by-location"
  },
  {
    id: 2,
    iconType: "materialCommunity",
    iconName: "truck-delivery",
    text: "سالن اعلام بار",
    route: "/announcement-cargos"
  },
  {
    id: 3,
    iconType: "fontAwesome",
    iconName: "user-alt",
    text: "حساب کاربری",
    route: "/driver-account"
  },
  {
    id: 4,
    iconType: "materialCommunity",
    iconName: "toolbox",
    text: "ابزار",
    route: "/driver-tools"
  }
];

export default function DriverHomeScreen() {
  const [locationModal, setLocationModal] = useState({
    visible: false,
    route: "/show-cargoes"
  });
  const [originDestinationModalVisible, setOriginDestinationModalVisible] =
    useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [verificationModalVisible, setVerificationModalVisible] =
    useState(false);

  const { phoneNumber, setLoading, setUserId, userId } = useGlobalContext();

  const {
    data: userData,
    isLoading: loading,
    refetch
  } = useQuery({
    queryKey: ["userInformation", phoneNumber],
    queryFn: () => getDriverUser({ phoneNumber }),
    enabled: Boolean(phoneNumber)
  });

  useFocusEffect(
    React.useCallback(() => {
      setLocationModal({ visible: false, route: "/show-cargoes" });
      setOriginDestinationModalVisible(false);
      setDrawerVisible(false);
      setLoading(false);
    }, [])
  );

  useEffect(() => {
    if (userData && !userData?.user?.isVerified) {
      setVerificationModalVisible(true);
    }
    if (userId !== userData?.user?._id) {
      console.log(userData?.user?.userId, "883", userId, "@@@@@@@@@");
      setUserId(userData?.user?.userId);
    }
  }, [userData]);

  const handleLocationSelect = location => {
    setLocationModal({ visible: false, route: "/show-cargoes" });
    router.push(
      `${locationModal.route}?latitude=${location.coords.latitude}&longitude=${location.coords.longitude}`
    );
  };

  const handleOptionSelect = option => {
    setDrawerVisible(false);
    if (option === "location") {
      setLocationModal({ visible: true, route: "/show-cargoes" });
    } else if (option === "originDestination") {
      setOriginDestinationModalVisible(true);
    }
  };

  const handleBoxPress = box => {
    if (box.route === "/find-cargo-by-location") {
      setDrawerVisible(true);
    } else if (box.route === "/announcement-cargos") {
      // Open location modal for announcement cargos
      setLocationModal({ visible: true, route: "/announcement-cargos" });
    } else {
      router.push(box.route);
    }
  };

  return (
    <>
      <Loader isLoading={loading} />

      <VerificationModal
        visible={verificationModalVisible}
        onClose={() => setVerificationModalVisible(false)}
        route="/driver-account-setting"
      />

      <View style={tw`flex-1 relative`}>
        <ScrollView style={tw`flex-1`} contentContainerStyle={tw`p-4`}>
          <View style={tw`mb-6 p-4 rounded-lg`}>
            <Text
              style={tw`text-background text-lg font-vazir-bold text-right`}
            >
              پنل راننده
            </Text>
            <View style={tw`h-[1px] w-full bg-card rounded-lg mt-2`} />
          </View>

          <View style={tw`flex-wrap flex-row-reverse justify-between`}>
            {driverHomeBoxes.map(box => (
              <BoxButton
                key={box.id}
                id={box.id}
                iconType={box.iconType}
                iconName={box.iconName}
                text={box.text}
                route={box.route}
                onPress={() => handleBoxPress(box)}
                iconColor="#003366"
              />
            ))}
          </View>

          <LocationModal
            visible={locationModal.visible}
            onClose={() =>
              setLocationModal({ visible: false, route: "/show-cargoes" })
            }
            setCoordination={handleLocationSelect}
            route={locationModal.route}
          />

          <DefineOriginDestination
            visible={originDestinationModalVisible}
            onClose={() => setOriginDestinationModalVisible(false)}
          />

          <DrawerModal
            visible={drawerVisible}
            onClose={() => setDrawerVisible(false)}
            onOptionSelect={handleOptionSelect}
            openLocationModal={() =>
              setLocationModal({ visible: true, route: "/show-cargoes" })
            }
          />
        </ScrollView>

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
