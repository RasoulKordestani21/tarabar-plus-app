import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Pressable
} from "react-native";
import tw from "@/libs/twrnc";
import { Route } from "expo-router";
import CustomButton from "../../CustomButton";
import { FontAwesome } from "@expo/vector-icons";
import CustomChipList from "./CustomChipList";

type LocationSelectTypeProps = {
  setLocationType: (type: "origin" | "destination" | null) => void;
  setShowLocationModal: (flag: boolean) => void;
  selectedItems: {
    itemId: number;
    itemName: string;
  }[];
  removeSelectedCity: (
    item: {
      itemId: number;
    },
    itemType: "origin" | "destination" | null
  ) => void;
  labelOfSelectedItems: string;
  locationType: "origin" | "destination";
  buttonTitle: string;
  handleRemoveAll: (type: string) => void;
};

const LocationSelectType: React.FC<LocationSelectTypeProps> = ({
  setLocationType,
  setShowLocationModal,
  selectedItems,
  removeSelectedCity,
  labelOfSelectedItems,
  locationType,
  buttonTitle,
  handleRemoveAll
}) => {
  return (
    <View style={tw`mb-5`}>
      <CustomButton
        title={buttonTitle}
        handlePress={() => {
          setLocationType(locationType); //origin
          setShowLocationModal(true);
        }}
        containerStyles="w-full bg-secondary"
      />

      {selectedItems.length ? (
        <CustomChipList
          selectedItems={selectedItems}
          removeSelecteditems={removeSelectedCity}
          labelOfSelectedItems={labelOfSelectedItems}
          itemType={locationType}
          handleRemoveAll={handleRemoveAll}
        />
      ) : (
        <View></View>
      )}
    </View>
  );
};

export default LocationSelectType;
