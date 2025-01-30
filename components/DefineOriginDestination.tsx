import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  Alert,
  Modal,
  ScrollView
} from "react-native";
import tw from "@/libs/twrnc";
import { Feather, FontAwesome } from "@expo/vector-icons";
import CustomButton from "./CustomButton";
import LocationSelection from "./LocationSelection"; // Import the LocationSelection component
import { router } from "expo-router";

type DefineOriginDestinationProps = {
  visible: boolean;
  onClose: () => void;
};

const DefineOriginDestination: React.FC<DefineOriginDestinationProps> = ({
  visible,
  onClose
}) => {
  const [form, setForm] = useState<{
    origin: {
      cityId: number;
      cityName: string;
      provinceId: number;
      provinceName: string;
    }[]; // Stores city and province details
    destination: {
      cityId: number;
      cityName: string;
      provinceId: number;
      provinceName: string;
    }[]; // Same for destination
  }>({
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
        "Please select both origin and destination"
      );
    }
  };

  const handleLocationSelect = (
    type: "origin" | "destination",
    selectedCities: {
      cityId: number;
      cityName: string;
      provinceId: number;
      provinceName: string;
    }[]
  ) => {
    setForm(prev => ({ ...prev, [type]: selectedCities }));
  };

  // Handle city removal from selected cities
  const removeSelectedCity = (
    city: {
      cityId: number;
      cityName: string;
      provinceId: number;
      provinceName: string;
    }[],
    type: number
  ) => {
    console.log(city);
    const selectedInputName = type === 1 ? "origin" : "destination";
    setForm(prev => ({
      ...prev,
      [selectedInputName]: form[selectedInputName].filter(
        ele => ele.cityId !== city.cityId
      )
    }));
    // const updatedSelectedCities = selectedCities.filter(
    //   item => item !== cityTitle
    // );
    // onSelect(updatedSelectedCities);
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose} // Close modal when back button pressed
    >
      <ScrollView>
        <View
          style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}
        >
          <View style={tw`bg-white m-5 rounded-lg p-5 w-[90%] max-w-md`}>
            {/* Close Icon */}
            <Pressable onPress={onClose} style={tw`absolute top-5 left-2 z-10`}>
              <Feather name="x" size={28} style={tw`text-background`} />
            </Pressable>

            <Text
              style={tw`text-center font-vazir-bold mb-4 text-xl text-background`}
            >
              جستجو با مبدا و مقصد
            </Text>
            <View style={tw`w-full h-[1px] bg-text mb-5 mt-3`} />

            <View style={tw`items-center`}>
              <Image
                source={require("@/assets/images/define-origin-destination.png")}
                style={tw`h-40 w-40`}
                resizeMode="contain"
              />
            </View>

            {/* Origin Button */}
            <Text style={tw`text-sm text-right`}>مبدا</Text>
            <Pressable
              style={tw`bg-background bg-white border-background border-2 mt-3 p-2 rounded-xl h-[52px]`}
              onPress={() => {
                setLocationType("origin");
                setShowLocationModal(true);
              }}
            >
              <ScrollView>
                <View style={tw`flex-row flex-wrap`}>
                  {form.origin.map((city, index) => (
                    <View
                      key={index}
                      style={tw`bg-gray-300 px-4 py-2 rounded-lg mr-2 mb-2 flex-row items-center bg-green-300`}
                    >
                      <FontAwesome
                        name={"close"}
                        size={14}
                        color="#0055AA"
                        onPress={() => removeSelectedCity(city, 1)}
                        style={tw`ml-2`}
                      />
                      <Text
                        style={tw`text-sm text-right`}
                      >{`${city.cityName}`}</Text>
                    </View>
                  ))}
                </View>
              </ScrollView>
            </Pressable>

            {/* Destination Button */}
            <Text style={tw`text-sm text-right`}>مقصد</Text>
            <Pressable
              style={tw`bg-background bg-white border-background border-2 mt-3 p-2 rounded-xl h-[68px]`}
              onPress={() => {
                setLocationType("destination");
                setShowLocationModal(true);
              }}
            >
              <View style={tw`flex-row flex-wrap`}>
                {form.destination.map((city, index) => (
                  <View
                    key={index}
                    style={tw`bg-gray-300 px-4 py-2 rounded-lg mr-2 mb-2 flex-row items-center bg-green-300 flex-row align-center`}
                  >
                    <FontAwesome
                      name={"close"}
                      size={14}
                      color="#0055AA"
                      onPress={() => removeSelectedCity(city, 2)}
                      style={tw`ml-2`}
                    />
                    <Text
                      style={tw`text-sm text-right`}
                    >{`${city.cityName}`}</Text>
                  </View>
                ))}
              </View>
            </Pressable>

            {/* Find Cargo Button */}
            <CustomButton
              title="یافتن بار"
              handlePress={handleFindCargo}
              containerStyles="bg-background mt-10"
            />

            <CustomButton
              title="بستن"
              handlePress={onClose}
              containerStyles="bg-background bg-white border-background border-2 mt-3"
              textStyles="text-background"
            />
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
            />
          </Modal>
        </View>
      </ScrollView>
    </Modal>
  );
};

export default DefineOriginDestination;
