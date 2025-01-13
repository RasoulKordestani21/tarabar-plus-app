import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  Modal,
  Pressable,
  Platform,
  Alert,
  Linking
} from "react-native";
import tw from "@/libs/twrnc";
import { Feather } from "@expo/vector-icons";
import * as Location from "expo-location";

type LocationModalProps = {
  visible: boolean;
  onClose: () => void;
};

const LocationModal: React.FC<LocationModalProps> = ({ visible, onClose }) => {
  const [locationPermission, setLocationPermission] =
    useState<Location.PermissionStatus | null>(null);
  const [backgroundLocationPermission, setBackgroundLocationPermission] =
    useState<Location.PermissionStatus | null>(null);
  const [locationServiceEnabled, setLocationServiceEnabled] = useState<
    boolean | null
  >(null);
  const [showCustomPermissionModal, setShowCustomPermissionModal] =
    useState(false);
  const [showLocationServiceModal, setShowLocationServiceModal] =
    useState(false);

  useEffect(() => {
    const checkPermissions = async () => {
      try {
        // Check for foreground permissions
        const { status } = await Location.getForegroundPermissionsAsync();
        setLocationPermission(status);
        console.log("Initial foreground Location Permission:", status);
        // Check for background permissions
        const { status: backgroundStatus } =
          await Location.getBackgroundPermissionsAsync();
        setBackgroundLocationPermission(backgroundStatus);
        console.log(
          "Initial Background Location Permission:",
          backgroundStatus
        );
      } catch (error) {
        console.error("Error checking initial location permission:", error);
      }
    };
    const checkLocationService = async () => {
      try {
        const enabled = await Location.hasServicesEnabledAsync();
        setLocationServiceEnabled(enabled);
        console.log("Initial Location Service Enabled:", enabled);
      } catch (error) {
        console.error("Error checking initial location service:", error);
      }
    };

    checkPermissions();
    checkLocationService();
  }, []);

  // when mobile trigged  gps button
  const handleLocationServiceChoice = async (choice: "enable" | "deny") => {
    try {
      // wait to response 3 buttons question
      if (choice === "enable") {
        const { status } = await Location.requestForegroundPermissionsAsync();
        setLocationPermission(status);
        console.log("new permission state ", status);
        if (status === "granted") {
          let currentLocation = await Location.getCurrentPositionAsync({});
          onClose();
          console.log(currentLocation);

          setShowLocationServiceModal(false);
        } else {
          ////----------------guidline to  guide user to go to setting and give permission of location ---------------------->
          const settingsURL = Platform.select({
            ios: "app-settings:",
            android: "android.settings.LOCATION_SOURCE_SETTINGS"
          });

          if (settingsURL) {
            Alert.alert(
              "عدم دسترسی به موقعیت مکانی",
              "لطفا دسترسی به موقعیت مکانی را در تنظیمات> برنامه ها> برنامه > اجازه مکانیابی به برنامه  فعال نمایید",
              [
                {
                  text: "رفتن به تنظیمات",
                  onPress: () => {
                    Linking.openSettings();
                  }
                },
                {
                  text: "بستن",
                  onPress: () => {}
                }
              ]
            );
            // await
          }

          setShowLocationServiceModal(false);
        }
      } else {
        setLocationServiceEnabled(false);
        setShowLocationServiceModal(false);
        Alert.alert(
          "عدم دسترسی به موقعیت مکانی",
          "لطفا دسترسی به موقعیت مکانی را در تنظیمات فعال نمایید",
          [{ text: "باشه", onPress: () => console.log("OK Pressed") }]
        );
      }
    } catch (error) {
      console.error("Error handling location permission choice:", error);
      Alert.alert("خطا", "مشکلی در فعالسازی موقعیت مکانی رخ داد", [
        { text: "باشه", onPress: () => console.log("OK Pressed") }
      ]);
    }
  };

  const handlePermissionChoice = async (
    choice: "foreground" | "background" | "deny"
  ) => {
    try {
      let newStatus = locationPermission;
      let newBackgroundStatus = backgroundLocationPermission;
      if (choice === "foreground") {
        const { status } = await Location.requestForegroundPermissionsAsync();
        newStatus = status;
        setLocationPermission(status);
        console.log("New foreground Location Permission:", status);
        if (newStatus === "granted") {
          onClose();
          Alert.alert(
            "موقعیت مکانی فعال شد",
            "اکنون می توانید از جستجو با موقعیت مکانی استفاده کنید",
            [{ text: "باشه", onPress: () => console.log("OK Pressed") }]
          );
        }

        setShowCustomPermissionModal(false);
      } else if (choice === "background") {
        const { status: backgroundStatus } =
          await Location.requestBackgroundPermissionsAsync();
        newBackgroundStatus = backgroundStatus;
        setBackgroundLocationPermission(backgroundStatus);
        console.log("New background Location Permission:", backgroundStatus);
        if (newBackgroundStatus === "granted" && newStatus === "granted") {
          onClose();
          Alert.alert(
            "موقعیت مکانی فعال شد",
            "اکنون می توانید از جستجو با موقعیت مکانی استفاده کنید",
            [{ text: "باشه", onPress: () => console.log("OK Pressed") }]
          );
        }
        setShowCustomPermissionModal(false);
      } else {
        setLocationPermission(Location.PermissionStatus.DENIED);
        setBackgroundLocationPermission(Location.PermissionStatus.DENIED);
        setShowCustomPermissionModal(false);
        Alert.alert(
          "عدم دسترسی به موقعیت مکانی",
          "لطفا دسترسی به موقعیت مکانی را در تنظیمات فعال نمایید",
          [{ text: "باشه", onPress: () => console.log("OK Pressed") }]
        );
      }
    } catch (error) {
      console.error("Error handling location permission choice:", error);
      Alert.alert("خطا", "مشکلی در فعالسازی موقعیت مکانی رخ داد", [
        { text: "باشه", onPress: () => console.log("OK Pressed") }
      ]);
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={tw`flex-1 justify-center items-center bg-black-500`}>
        <View style={tw`bg-white m-5 rounded-lg p-5 w-[90%] max-w-md`}>
          {/* Close Icon Added Here */}
          <Pressable onPress={onClose} style={tw`absolute top-5 left-2 z-10`}>
            <Feather name="x" size={28} style={tw`text-background`} />
          </Pressable>
          <Text
            style={tw`text-center font-vazir-bold  mb-4 text-xl text-background`}
          >
            جستجو با موقعیت مکانی
          </Text>
          <View style={tw`w-full h-[1px] bg-text mb-5 mt-3`}></View>
          <View style={tw`items-center`}>
            <Image
              source={require("@/assets/images/map-location.png")}
              style={tw`h-40 w-40`}
              resizeMode="contain"
            />
          </View>
          <Text style={tw`text-right font-vazir text-secondary px-6 mb-4`}>
            توجه : {"\n"}
            برای استفاده از این گزینه برنامه نیازمند موقعیت فعلی شما میباشد لذا
            با فعال سازی موقعیت مکانی می توانید بارهای موجود در اطراف خود را
            مشاهده نمایید
          </Text>
          <Pressable
            style={tw`bg-customCard rounded-lg px-3 py-4 items-center mt-2 shadow-sm`}
            onPress={() => {
              Platform.OS === "web"
                ? setShowCustomPermissionModal(true)
                : handleLocationServiceChoice("enable");
            }}
          >
            <Text style={tw`text-white font-vazir-bold text-center`}>
              فعال سازی GPS
            </Text>
          </Pressable>
          <Pressable
            style={tw`bg-white rounded-lg border-customCard border-2 p-3 items-center mt-2 shadow-sm`}
            onPress={onClose}
          >
            <Text style={tw`text-customCard font-vazir-bold text-center`}>
              بستن
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Custom Permission Modal web*/}
      <Modal
        transparent={true}
        visible={showCustomPermissionModal}
        animationType="fade"
      >
        <View style={tw`flex-1 justify-center items-center bg-black-500`}>
          <View style={tw`bg-white rounded-lg p-5 w-[80%] max-w-sm`}>
            <Text style={tw`text-xl font-bold mb-4 text-center`}>
              اجازه دسترسی به موقعیت مکانی
            </Text>
            <Pressable
              style={tw` p-3 rounded-md mb-2`}
              onPress={() => handlePermissionChoice("foreground")}
            >
              <Text style={tw`text-center`}>هنگام استفاده از برنامه</Text>
            </Pressable>
            <Pressable
              style={tw` p-3 rounded-md mb-2`}
              onPress={() => handlePermissionChoice("background")}
            >
              <Text style={tw`text-center`}>فقط این بار</Text>
            </Pressable>
            <Pressable
              style={tw` p-3 rounded-md`}
              onPress={() => handlePermissionChoice("deny")}
            >
              <Text style={tw`text-center`}>عدم دسترسی</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </Modal>
  );
};

export default LocationModal;
