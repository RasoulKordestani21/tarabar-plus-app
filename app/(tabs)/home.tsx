import React, { useState } from "react";
import { View, ScrollView } from "react-native";
import tw from "@/libs/twrnc";
import { router } from "expo-router";
import BoxButton from "@/components/BoxButton";
import LocationModal from "@/components/LocationModal";
import { homeBoxes } from "@/constants/BoxesList";

export default function HomeScreen() {
  const [modalVisible, setModalVisible] = useState(false);

  const handleCargoByLocationPress = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
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
                handleCargoByLocationPress();
              } else {
                router.push(box.route);
              }
            }}
          />
        ))}
      </View>
      <LocationModal visible={modalVisible} onClose={closeModal} />
    </ScrollView>
  );
}
