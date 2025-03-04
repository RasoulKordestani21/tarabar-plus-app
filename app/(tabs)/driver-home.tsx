import React, { useEffect, useState } from "react";
import { View, ScrollView, TouchableOpacity, Text } from "react-native";
import tw from "@/libs/twrnc";
import { router, useFocusEffect } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

import BoxButton from "@/components/BoxButton";
import LocationModal from "@/components/findLocationByGPS/LocationModal";
import { driverHomeBoxes } from "@/constants/BoxesList";
import DefineOriginDestination from "@/components/findLocationByOriginAndDestination/DefineOriginDestination";
import { useGlobalContext } from "@/context/GlobalProvider";
import DrawerModal from "@/components/DrawerModal";
import Loader from "@/components/Loader";
import { Image } from "react-native";

export default function HomeScreen() {
  const [enableLocationModal, setEnableLocationModal] = useState(false);
  const [originDestinationModal, setOriginDestinationModal] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [coordination, setCoordination] = useState();

  const { role, loading, setLoading, token } = useGlobalContext();

  useFocusEffect(
    React.useCallback(() => {
      // Reset the state when returning to the screen
      setEnableLocationModal(false);
      setOriginDestinationModal(false);
      setDrawerVisible(false);
      setLoading(false);
    }, [])
  );

  const handleEnableLocationModal = () => {
    setEnableLocationModal(true);
  };

  const closeEnableLocationModal = () => {
    setEnableLocationModal(false);
  };

  const handleOriginDestinationModal = () => {
    setOriginDestinationModal(true);
  };

  const closeOriginDestinationModal = () => {
    setOriginDestinationModal(false);
  };

  const handleOpenDrawer = () => {
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
  };

  const handleOptionSelect = (option: string) => {
    closeDrawer();
    if (option === "location") {
      handleEnableLocationModal();
    } else if (option === "originDestination") {
      handleOriginDestinationModal();
    }
  };

  return (
    <>
      <Loader isLoading={loading} />

      {/* Parent container with relative positioning to house the floating button */}
      <View style={tw`flex-1 relative `}>
        <ScrollView style={tw`flex-1`} contentContainerStyle={tw`p-4 `}>
          <View style={tw`flex-wrap flex-row-reverse justify-between `}>
            {driverHomeBoxes.map(box => (
              <BoxButton
                key={box.id}
                id={box.id}
                source={box.source}
                text={box.text}
                route={box.route}
                onPress={() => {
                  if (box.route === "/find-cargo-by-location") {
                    handleOpenDrawer();
                  } else {
                    router.push(box.route);
                  }
                }}
              />
            ))}
          </View>

          <LocationModal
            visible={enableLocationModal}
            onClose={closeEnableLocationModal}
            setCoordination={setCoordination}
          />

          <DefineOriginDestination
            visible={originDestinationModal}
            onClose={closeOriginDestinationModal}
          />

          <DrawerModal
            visible={drawerVisible}
            onClose={closeDrawer}
            onOptionSelect={handleOptionSelect}
            openLocationModal={handleEnableLocationModal}
          />
        </ScrollView>

        {/* Floating Circle Button for Support/FAQ */}
        <TouchableOpacity
          style={tw`absolute bottom-6 right-6 w-15 h-15 bg-secondary rounded-full items-center justify-center shadow-lg`}
          onPress={() => router.push("/support-faq")}
        >
          <Image
            source={require("@/assets/images/support-icon.png")}
            style={tw`h-12 w-12`}
            resizeMode="contain"
          />
          <Text style={tw`font-vazir text-[8px] mt-[-8px]`}>پشتیبانی</Text>
          {/* <FontAwesome name="contact-support" size={33} color="#fff" /> */}
        </TouchableOpacity>
      </View>
    </>
  );
}
