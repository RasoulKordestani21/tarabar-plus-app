import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  Alert,
  Modal,
  ScrollView,
  ImageBackground
} from "react-native";
import tw from "@/libs/twrnc";
import { Feather, FontAwesome } from "@expo/vector-icons";
import CustomButton from "../CustomButton";
import LocationSelection from "./LocationSelection"; // Import the LocationSelection component
import { router } from "expo-router";
import LocationSelectType from "./shared/LocationSelectType";
import { DefineOriginDestinationProps, FormState } from "./types/types";

const DefineOriginDestination: React.FC<DefineOriginDestinationProps> = ({
  visible,
  onClose
}) => {
  const [form, setForm] = useState<FormState>({
    origin: [],
    destination: []
  });

  const [showLocationModal, setShowLocationModal] = useState(false); // State to show the LocationSelection modal
  const [locationType, setLocationType] = useState<
    "origin" | "destination" | null
  >(null); // Track whether it's origin or destination

  const handleFindCargo = () => {
    if (form.origin.length || form.destination.length) {
      const originCityIds = form.origin.map(city => city.cityId).join(",");
      const originProvinceIds = form.origin
        .map(city => city.provinceId)
        .join(",");
      const destinationCityIds = form.destination
        .map(city => city.cityId)
        .join(",");
      const destinationProvinceIds = form.destination
        .map(city => city.provinceId)
        .join(",");

      const originNames = form.origin.map(city => city.cityName).join(", ");

      console.log(encodeURIComponent(JSON.stringify(originCityIds)));
      const destinationNames = form.destination
        .map(city => city.cityName)
        .join(", ");

      router.push(
        `/show-cargoes?origin=${encodeURIComponent(
          JSON.stringify(originCityIds)
        )}&destination=${encodeURIComponent(
          JSON.stringify(destinationCityIds)
        )}`
      );
    } else {
      Alert.alert(
        "Invalid Selection",
        "Please select both origin and destination",
        [{ text: "بستن", style: "cancel" }]
      );
    }
  };

  const handleLocationSelect = (
    type: "origin" | "destination" | null,
    selectedCities: {
      cityId: number;
      cityName: string;
      provinceId: number;
      provinceName: string;
    }[]
  ) => {
    if (type) {
      setForm(prev => ({ ...prev, [type]: selectedCities }));
    }
  };

  const handleRemoveAll = (type: string | null) => {
    if (type) {
      setForm(prev => ({ ...prev, [type]: [] }));
    }
  };

  // Handle city removal from selected cities
  const removeSelectedCity = (
    item: {
      itemId: number;
    },
    itemType: "origin" | "destination" | null
  ) => {
    // const selectedInputName = type === 1 ? "origin" : "destination";
    if (itemType) {
      setForm(prev => ({
        ...prev,
        [itemType]: form[itemType].filter(
          (ele: { cityId: number }) => ele.cityId !== item.itemId
        )
      }));
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose} // Close modal when back button pressed
      style={tw`bg-secondary `}
    >
      {/* <ImageBackground
        source={require("@/assets/images/define-origin-destination1.webp")} // You can use a local image or URL
        style={tw`flex-1 align-center justify-center w-full h-full  `}
        resizeMode="contain"
      > */}
      <View style={tw`flex-1 justify-center items-center  bg-[#000]   `}>
        <View
          style={tw`flex justify-between bg-text   mx-5 rounded-lg p-5 w-[90%]  h-[90%]`}
        >
          <View>
            <View style={tw`flex`}>
              {/* Close Icon */}
              <Pressable onPress={onClose} style={tw`absolute   left-2 `}>
                <Feather name="x" size={28} style={tw`text-background`} />
              </Pressable>
              <Text style={tw`text-center font-vazir  text-xl text-background`}>
                جستجو با مبدا و مقصد
              </Text>
            </View>
            <View style={tw`w-full h-[1px] bg-card mb-5 mt-3`} />
            <View style={tw`items-center`}>
              <Image
                source={require("@/assets/images/define-origin-destination1.webp")}
                style={tw` top-0 w-50 h-50   mb-3 rounded-10  `}
                resizeMode="stretch"
              />
            </View>
            {/* Origin Button */}
            <LocationSelectType
              setLocationType={setLocationType}
              setShowLocationModal={setShowLocationModal}
              selectedItems={form.origin.map(ele => {
                return { itemId: ele.cityId, itemName: ele.cityName };
              })}
              removeSelectedCity={removeSelectedCity}
              labelOfSelectedItems={"مبدا های انتخاب شده"}
              locationType={"origin"}
              buttonTitle={"انتخاب مبدا"}
              handleRemoveAll={handleRemoveAll}
            />
            <LocationSelectType
              setLocationType={setLocationType}
              setShowLocationModal={setShowLocationModal}
              selectedItems={form.destination.map(ele => {
                return { itemId: ele.cityId, itemName: ele.cityName };
              })}
              removeSelectedCity={removeSelectedCity}
              labelOfSelectedItems={"مقصد های انتخاب شده"}
              locationType={"destination"}
              buttonTitle={"انتخاب مقصد"}
              handleRemoveAll={handleRemoveAll}
            />
          </View>
          {/* Find Cargo Button */}
          <View style={tw`flex-row justify-between `}>
            <CustomButton
              title="یافتن بار"
              handlePress={handleFindCargo}
              containerStyles="bg-background  w-[48%]"
            />
            <CustomButton
              title="بستن"
              handlePress={onClose}
              containerStyles="bg-background bg-text border-background border-2 p-0  w-[48%]"
              textStyles="text-background "
            />
          </View>
        </View>

        {/* LocationSelection Modal */}
        <Modal
          visible={showLocationModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowLocationModal(false)} // Close modal on back button press
        >
          <LocationSelection
            visible={showLocationModal}
            onClose={() => setShowLocationModal(false)}
            onSelect={selectedCity =>
              handleLocationSelect(locationType, selectedCity)
            }
            selectedCities={
              locationType === "origin" ? form.origin : form.destination
            } // Pass selected cities to the modal
            removeSelectedCity={removeSelectedCity}
            locationType={locationType}
            handleRemoveAll={handleRemoveAll}
          />
        </Modal>
      </View>
      {/* </ScrollView> */}
      {/* </ImageBackground> */}
    </Modal>
  );
};

export default DefineOriginDestination;
