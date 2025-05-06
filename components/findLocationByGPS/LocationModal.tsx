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
  route?: string;
  onLocationSelect?: (location: any) => void;
};

const LocationModal: React.FC<LocationModalProps> = ({
  visible,
  onClose,
  setCoordination,
  route = "/show-cargoes",
  onLocationSelect
}) => {
  const { loading, setLoading } = useGlobalContext();
  const [locationPermission, setLocationPermission] =
    useState<Location.PermissionStatus | null>(null);

  const [locationServiceEnabled, setLocationServiceEnabled] = useState<
    boolean | null
  >(null);

  // Error messages in Persian
  const errorMessages = {
    permissionError: "خطا در دریافت مجوز موقعیت مکانی",
    serviceError: "خطا در بررسی وضعیت سرویس موقعیت مکانی",
    generalError: "خطایی رخ داد. لطفاً دوباره تلاش کنید",
    locationFetchError: "امکان دریافت موقعیت فعلی وجود ندارد"
  };

  useEffect(() => {
    if (!visible) return;

    const initializeLocation = async () => {
      setLoading(true);
      try {
        await checkPermissions();
        await checkLocationService();

        if (locationServiceEnabled && locationPermission === "granted") {
          await getCurrentLocationAndNavigate();
        }
      } catch (error) {
        console.error("Initialization error:", error);
        Alert.alert("خطا", errorMessages.generalError);
      } finally {
        setLoading(false);
      }
    };

    initializeLocation();
  }, [visible]);

  const checkPermissions = async () => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      setLocationPermission(status);
      console.log("Initial foreground Location Permission:", status);
    } catch (error) {
      console.error("Error checking initial location permission:", error);
      Alert.alert("خطا", errorMessages.permissionError);
      onClose();
    }
  };

  const checkLocationService = async () => {
    try {
      const enabled = await Location.hasServicesEnabledAsync();
      setLocationServiceEnabled(enabled);
      console.log("Initial Location Service Enabled:", enabled);
    } catch (error) {
      console.error("Error checking initial location service:", error);
      Alert.alert("خطا", errorMessages.serviceError);
    }
  };

  const getCurrentLocationAndNavigate = async () => {
    try {
      setLoading(true);
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced
      });

      console.log("Current location:", currentLocation);
      setCoordination(currentLocation);
      onClose();

      // Use custom onLocationSelect callback if provided, otherwise use default navigation
      if (onLocationSelect) {
        onLocationSelect(currentLocation);
      } else {
        router.push(
          `${route}?latitude=${currentLocation.coords.latitude}&longitude=${currentLocation.coords.longitude}`
        );
      }
    } catch (error) {
      console.error("Error fetching location:", error);
      Alert.alert("خطا", errorMessages.locationFetchError);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationServiceChoice = async (choice: "enable" | "deny") => {
    if (choice === "deny") {
      onClose();
      return;
    }

    try {
      setLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status);

      if (status === "granted") {
        await getCurrentLocationAndNavigate();
      } else {
        // Enhanced permission dialog
        Alert.alert(
          "نیاز به مجوز موقعیت مکانی",
          "برای استفاده از این ویژگی، باید به تنظیمات بروید و موقعیت مکانی را فعال کنید.",
          [
            {
              text: "رفتن به تنظیمات",
              onPress: () => {
                Linking.openSettings();
                onClose();
              }
            },
            {
              text: "انصراف",
              style: "cancel",
              onPress: () => onClose()
            }
          ]
        );
      }
    } catch (error) {
      console.error("Error handling location service choice:", error);
      Alert.alert("خطا", "خطایی در فرآیند دریافت مجوز رخ داد");
    } finally {
      setLoading(false);
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
              style={tw`text-center font-vazir-bold mb-4 text-xl text-background`}
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
