import React from "react";
import { View, Text, Modal, TouchableOpacity, Alert } from "react-native";
import tw from "@/libs/twrnc";
import { FontAwesome } from "@expo/vector-icons";
import * as Location from "expo-location"; // Import Location for checking location status
import { router } from "expo-router"; // To navigate to the show-cargoes page
import { useGlobalContext } from "@/context/GlobalProvider";
import Loader from "./Loader";
import LocationSelection from "./LocationSelection";

type DrawerModalProps = {
  visible: boolean;
  onClose: () => void;
  onOptionSelect: (option: string) => void;
  openLocationModal: () => void; // New prop to open the LocationModal
};

const DrawerModal = ({
  visible,
  onClose,
  onOptionSelect,
  openLocationModal
}: DrawerModalProps) => {
  const { setLoading } = useGlobalContext();
  const handleLocationClick = async () => {
    try {
      // Check if location services are enabled
      //   const hasLocationServiceEnabled =
      //     await Location.hasServicesEnabledAsync();
      //   if (!hasLocationServiceEnabled) {
      openLocationModal();
      onClose();
      //   }

      //   // Check for location permissions
      //   const { status } = await Location.requestForegroundPermissionsAsync();
      //   if (status !== "granted") {
      //     openLocationModal();
      //   }

      // Get the current location coordinates
      //   onClose();
      //   setLoading(true);
      //   const location = await Location.getCurrentPositionAsync({});
      //   const { latitude, longitude } = location.coords;

      // Navigate to show-cargoes page with the latitude and longitude
      //   router.push(`/show-cargoes?latitude=${latitude}&longitude=${longitude}`);
    } catch (error) {
      console.error("Error fetching location:", error);
      Alert.alert("Error", "There was an issue fetching your location.");
    }
  };

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={tw`flex-1 justify-end items-center bg-black  bg-black-50 `}>
        {/* Modal Content */}
        <View
          style={tw`bg-white p-5 rounded-t-[14px] w-full h-2/3 items-center`}
        >
          {/* Close Icon */}
          <TouchableOpacity onPress={onClose} style={tw`absolute top-3 left-3`}>
            <FontAwesome name="close" size={30} color="#003366" />
          </TouchableOpacity>

          <Text style={tw`text-xl font-vazir text-center mb-4 font-vazir`}>
            جستجو بار
          </Text>

          <View style={tw`w-full h-[1px] bg-text mb-5 mt-3`} />

          {/* Options */}
          <TouchableOpacity
            onPress={handleLocationClick} // Handle the location search
            style={tw`p-3 mb-3 bg-[#003366] rounded-lg w-full`}
          >
            <Text style={tw`text-lg text-center text-white font-vazir`}>
              جستجو با موقعیت فعلی
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onOptionSelect("originDestination")}
            style={tw`p-3 mb-3 bg-[#003366] rounded-lg w-full`}
          >
            <Text style={tw`text-lg text-center text-white font-vazir`}>
              جستجو با مبدا و مقصد
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default DrawerModal;
