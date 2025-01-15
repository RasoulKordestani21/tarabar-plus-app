import React, { useState } from "react";
import { View, ScrollView } from "react-native";
import tw from "@/libs/twrnc";
import { router } from "expo-router";
import BoxButton from "@/components/BoxButton";
import LocationModal from "@/components/LocationModal";
import { homeBoxes } from "@/constants/BoxesList";
import DefineOriginDestination from "@/components/DefineOriginDestination";

export default function HomeScreen() {
  const [enableLocationModal, setEnableLocationModal] = useState(false);
  const [originDestinationModal, setOriginDestinationModal] = useState(false);

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

  return (
    <ScrollView style={tw`flex-1  `} contentContainerStyle={tw`p-4`}>
      <View style={tw`flex-wrap flex-row justify-between`}>
        {homeBoxes.map(box => (
          <BoxButton
            key={box.id}
            id={box.id}
            source={box.source}
            text={box.text}
            route={box.route}
            onPress={() => {
              if (box.route === "/find-cargo-by-location") {
                handleEnableLocationModal();
              } else if (box.id === 1) {
                handleOriginDestinationModal();
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
      />
      <DefineOriginDestination
        visible={originDestinationModal}
        onClose={closeOriginDestinationModal}
      />
    </ScrollView>
  );
}
