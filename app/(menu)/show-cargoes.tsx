import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity
} from "react-native";
import tw from "@/libs/twrnc";
import { router, useLocalSearchParams } from "expo-router";
import {
  getCargoesByLocation,
  getCargoesByOriginDestination,
  getAvailableCargosForDriver,
  registerDriverToCargo
} from "@/api/services/cargoServices";
import CargoCard from "@/components/CargoCard";
import AnouncementsCargoCard from "@/components/AnouncementsCargoCard";
import { cargoTypes, truckTypes } from "@/constants/BoxesList";
import * as Location from "expo-location";
import { useGlobalContext } from "@/context/GlobalProvider";

export default function ShowCargoes() {
  // Use useLocalSearchParams to get query parameters
  const { latitude, longitude, origin, destination } = useLocalSearchParams();

  const [cargoes, setCargoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("regular"); // "regular" or "announcements"
  const [currentLocation, setCurrentLocation] = useState({
    latitude: latitude ? parseFloat(latitude) : null,
    longitude: longitude ? parseFloat(longitude) : null
  });

  const { phoneNumber } = useGlobalContext();
  
  // Function to get current location
  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setError("Permission to access location was denied");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });

      return location.coords;
    } catch (err) {
      console.error("Error getting location:", err);
      setError("Could not get your current location");
      return null;
    }
  };

  // Fetch regular cargoes based on the query params (location or origin/destination)
  const fetchRegularCargoes = async () => {
    try {
      setLoading(true);
      setError(null);

      let filteredCargoes;
      if (latitude && longitude) {
        // Fetch cargoes based on the location (latitude and longitude)
        filteredCargoes = await getCargoesByLocation(
          parseFloat(latitude),
          parseFloat(longitude)
        );
      } else if (origin && destination) {
        // Fetch cargoes based on the selected origin and destination
        const params = {
          originIds: JSON.parse(origin).split(",").join(","),
          destinationIds: JSON.parse(destination).split(",").join(",")
        };
        filteredCargoes = await getCargoesByOriginDestination({
          ...params
        });
      } else {
        throw new Error("No valid filters provided");
      }

      setCargoes(filteredCargoes);
    } catch (err) {
      setError("Failed to fetch cargoes");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch available cargoes for driver (announcements)
  const fetchAvailableCargoes = async () => {
    try {
      setLoading(true);
      setError(null);

      // If we don't have location, try to get it
      let coords = currentLocation;
      if (!coords.latitude || !coords.longitude) {
        const locationResult = await getCurrentLocation();
        if (!locationResult) {
          throw new Error("Could not get location for available cargoes");
        }
        coords = locationResult;
      }

      // Fetch the available cargoes for driver
      const availableCargoes = await getAvailableCargosForDriver(
        coords.latitude,
        coords.longitude,
        50 // Default radius of 50km
      );

      setCargoes(availableCargoes);
    } catch (err) {
      setError("Failed to fetch available cargoes");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle tab switching
  const handleTabSwitch = tab => {
    if (tab === activeTab) return; // Don't refetch if already on this tab

    setActiveTab(tab);
    if (tab === "regular") {
      fetchRegularCargoes();
    } else {
      fetchAvailableCargoes();
    }
  };

  // Handle cargo registration for announcements
  const handleRegisterCargo = (cargoId) => {
    try {
      registerDriverToCargo(cargoId, {
        driverId: "67c6e7178480c18a66fa1e2b", // This should ideally come from authentication context
        vehicle: ""
      });
      // Could add a success message or update the UI after successful registration
      alert("درخواست حمل با موفقیت ثبت شد");
    } catch (error) {
      console.error("Error registering for cargo:", error);
      alert("خطا در ثبت درخواست حمل");
    }
  };

  // Initial fetch based on params
  useEffect(() => {
    if (activeTab === "regular") {
      fetchRegularCargoes();
    } else {
      fetchAvailableCargoes();
    }
  }, [latitude, longitude, origin, destination, activeTab]);

  return (
    <ScrollView style={tw`flex-1`} contentContainerStyle={tw`p-4`}>
      <View style={tw`mb-4`}>
        <Text style={tw`text-xl font-vazir text-center mb-4`}>
          مشاهده تمامی بارها
        </Text>
        <View style={tw`h-[2px] w-full bg-background mb-2`}></View>

        {/* Tab buttons for switching between regular and driver cargoes */}
        <View style={tw`w-full flex-row justify-between mb-4`}>
          <TouchableOpacity
            style={tw`${
              activeTab === "regular" ? "bg-primary" : "bg-gray-300"
            } w-[48%] p-2 rounded-md`}
            onPress={() => handleTabSwitch("regular")}
          >
            <Text
              style={tw`${
                activeTab === "regular" ? "text-white" : "text-gray-700"
              } text-center font-vazir`}
            >
              عمومی
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={tw`${
              activeTab === "announcements" ? "bg-primary" : "bg-gray-300"
            } w-[48%] p-2 rounded-md`}
            onPress={() => handleTabSwitch("announcements")}
          >
            <Text
              style={tw`${
                activeTab === "announcements" ? "text-white" : "text-gray-700"
              } text-center font-vazir`}
            >
              اعلام بارها
            </Text>
          </TouchableOpacity>
        </View>

        {loading && (
          <View style={tw`py-10`}>
            <ActivityIndicator size="large" color="#003366" />
          </View>
        )}

        {error && (
          <View style={tw`py-4`}>
            <Text style={tw`text-red-500 text-center font-vazir`}>{error}</Text>
          </View>
        )}

        {!loading && !error && cargoes.length === 0 && (
          <View style={tw`py-10`}>
            <Text style={tw`text-center text-lg font-vazir text-gray-500`}>
              {activeTab === "regular"
                ? "هیچ باری با فیلتر های انتخاب شده یافت نشد"
                : "هیچ بار در دسترسی یافت نشد"}
            </Text>
          </View>
        )}

        {cargoes.length > 0 && (
          <View>
            <Text style={tw`text-center mb-2 font-vazir text-gray-600`}>
              {`${cargoes.length} بار یافت شد`}
            </Text>

            {/* Render appropriate card based on active tab */}
            {cargoes.map(cargo => (
              <View key={cargo._id}>
                {activeTab === "regular" ? (
                  // Regular cargo card
                  <CargoCard
                    originCity={
                      cargo?.origin?.title || cargo?.origin?.cityName || "N/A"
                    }
                    originProvince={cargo?.origin?.provinceName || "N/A"}
                    destinationCity={
                      cargo?.destination?.title ||
                      cargo?.destination?.cityName ||
                      "N/A"
                    }
                    destinationProvince={
                      cargo?.destination?.provinceName || "N/A"
                    }
                    distance={cargo?.distance || "N/A"}
                    truckType={
                      truckTypes.find(
                        ele => Number(ele.value) === cargo.truckTypeId
                      )?.label || "N/A"
                    }
                    loadType={
                      cargoTypes.find(
                        ele => Number(ele.value) === cargo.cargoTypeId
                      )?.label ||
                      cargo.cargoType ||
                      "N/A"
                    }
                    ownerPhone={cargo?.ownerPhone || "N/A"}
                    date={cargo?.updatedAt || cargo?.readyDate || "N/A"}
                    description={cargo.description || "No description provided."}
                    price={cargo.carriageFee || "N/A"}
                    onRemove={() => {
                      /* Handle remove action */
                    }}
                    onEdit={() => {
                      /* Handle edit action */
                    }}
                  />
                ) : (
                  // Announcements cargo card
                  <AnouncementsCargoCard 
                    cargo={cargo} 
                    onRegister={handleRegisterCargo}
                  />
                )}
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Floating back button */}
      <TouchableOpacity
        style={tw`absolute bottom-4 right-4 bg-primary w-12 h-12 rounded-full justify-center items-center shadow-md`}
        onPress={() => router.back()}
      >
        <Text style={tw`text-white font-bold text-xl`}>←</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}