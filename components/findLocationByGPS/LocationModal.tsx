import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  Modal,
  Pressable,
  Alert,
  Linking
} from "react-native";
import tw from "@/libs/twrnc";
import { Feather } from "@expo/vector-icons";
import * as Location from "expo-location";
import { router } from "expo-router";
import { useGlobalContext } from "@/context/GlobalProvider";
import Loader from "../Loader";

type LocationModalProps = {
  visible: boolean;
  onClose: () => void;
  setCoordination: (param: any) => void;
};

const LocationModal: React.FC<LocationModalProps> = ({
  visible,
  onClose,
  setCoordination
}) => {
  const { loading, setLoading } = useGlobalContext();
  const [locationPermission, setLocationPermission] =
    useState<Location.PermissionStatus | null>(null);

  const [locationServiceEnabled, setLocationServiceEnabled] = useState<
    boolean | null
  >(null);

  useEffect(() => {
    setLoading(true);
    const checkPermissions = async () => {
      try {
        // Check for foreground permissions

        const { status } = await Location.getForegroundPermissionsAsync();
        setLocationPermission(status);
        console.log("Initial foreground Location Permission:", status);
        // Check for background permissions
        // const { status: backgroundStatus } =
        //   await Location.getBackgroundPermissionsAsync();
        // setBackgroundLocationPermission(backgroundStatus);
      } catch (error) {
        onClose();
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

    const checkPushing = async () => {
      try {
        console.log(locationServiceEnabled, locationPermission);
        setLoading(true);
        onClose();
        let currentLocation = await Location.getCurrentPositionAsync({});

        console.log("_________");
        console.log(currentLocation);
        setCoordination(currentLocation);

        router.push(
          `/show-cargoes?latitude=${currentLocation.coords.latitude}&longitude=${currentLocation.coords.longitude}`
        );
      } catch (error) {}
    };

    checkPermissions();
    checkLocationService();
    console.log(locationServiceEnabled, locationPermission, "enable");
    setLoading(false);
    if (locationServiceEnabled && locationPermission === "granted")
      checkPushing();
  }, [visible]);

  const handleLocationServiceChoice = async (choice: "enable" | "deny") => {
    try {
      setLoading(true);
      if (choice === "enable") {
        const { status } = await Location.requestForegroundPermissionsAsync();
        setLocationPermission(status);

        if (status === "granted") {
          let currentLocation = await Location.getCurrentPositionAsync({});
          setCoordination(currentLocation);
          onClose();
          console.log(currentLocation);

          // هدایت به صفحه بارهای موجود بر اساس موقعیت مکانی
          router.push(
            `/show-cargoes?latitude=${currentLocation.coords.latitude}&longitude=${currentLocation.coords.longitude}`
          );
        } else {
          Alert.alert(
            "عدم دسترسی به مجوز های موقعیت یابی ",
            "بعد فشردن تنظیمات به قسمت مجوز ها رفته و موقعیت مکانی را فعال کنید .",
            [
              {
                text: "رفتن به تنظیمات",
                onPress: () => {
                  Linking.openSettings();
                }
              },
              {
                text: "لغو",
                onPress: () => console.log("User canceled")
              }
            ]
          );
        }
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error handling location service choice:", error);
      Alert.alert("Error", "An error occurred while fetching location");
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      {loading ? (
        <Loader isLoading={loading} />
      ) : (
        <View style={tw`flex-1 justify-center items-center bg-black-500`}>
          <View style={tw`bg-white m-5 rounded-lg p-5 w-[90%] max-w-md`}>
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
                source={require("@/assets/images/define-origin-destination.webp")}
                style={tw`h-40 w-40`}
                resizeMode="contain"
              />
            </View>
            <Text style={tw`text-right font-vazir text-secondary px-6 mb-4`}>
              توجه : {"\n"}
              برای استفاده از این گزینه برنامه نیازمند موقعیت فعلی شما میباشد
              لذا با فعال سازی موقعیت مکانی می توانید بارهای موجود در اطراف خود
              را مشاهده نمایید
            </Text>
            <Pressable
              style={tw`bg-customCard rounded-lg px-3 py-4 items-center mt-2 shadow-sm`}
              onPress={() => {
                handleLocationServiceChoice("enable");
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
      )}
    </Modal>
  );
};

export default LocationModal;
