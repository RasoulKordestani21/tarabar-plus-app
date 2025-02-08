import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import tw from "@/libs/twrnc";
import { router, useLocalSearchParams } from "expo-router"; // Import the useSearchParams hook
import {
  getCargoesByLocation,
  getCargoesByOriginDestination
} from "@/api/services/cargoServices"; // Updated service import
import CargoCard from "@/components/CargoCard"; // Import your CargoCard component
import { cargoTypes, truckTypes } from "@/constants/BoxesList";

export default function ShowCargoes() {
  // Use useSearchParams to get query parameters
  const { latitude, longitude, origin, destination } = useLocalSearchParams();
  console.log(origin, destination, "is origin");
  const [cargoes, setCargoes] = useState<any[]>([]); // This will hold the filtered cargos
  const [loading, setLoading] = useState<boolean>(true); // To handle loading state
  const [error, setError] = useState<string | null>(null);

  // Fetch cargoes based on the query params (location or origin/destination)
  useEffect(() => {
    const fetchCargoes = async () => {
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
          console.log(filteredCargoes);
        } else {
          throw new Error("No valid filters provided");
        }
        console.log(parseFloat(latitude), parseFloat(longitude));
        setCargoes(filteredCargoes);
      } catch (err) {
        // if (err.response.status === 401) {
        //   router.replace("/otp-sender");
        // }
        setError("Failed to fetch cargoes");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCargoes();
  }, [latitude, longitude, origin, destination]);

  return (
    <ScrollView style={tw`flex-1`} contentContainerStyle={tw`p-4`}>
      <View style={tw`mb-4`}>
        <Text style={tw`text-xl font-vazir text-center mb-4`}>
          مشاهده تمامی بارها
        </Text>
        <View style={tw`h-[2px] w-full bg-background mb-2 `}></View>

        {loading && <ActivityIndicator size="large" color="#003366" />}

        {error && <Text style={tw`text-red-500 text-center`}>{error}</Text>}

        {cargoes.length > 0 ? (
          cargoes.map((cargo, index) => (
            <CargoCard
              key={cargo._id}
              originCity={cargo?.origin?.title || "N/A"}
              originProvince={cargo?.origin?.provinceName || "N/A"}
              destinationCity={cargo?.destination?.title || "N/A"}
              destinationProvince={cargo?.destination?.provinceName || "N/A"}
              distance={cargo?.distance || "N/A"}
              truckType={
                truckTypes.find(ele => Number(ele.value) === cargo.truckTypeId)
                  ?.label
              }
              loadType={
                cargoTypes.find(ele => Number(ele.value) === cargo.cargoTypeId)
                  ?.label
              }
              ownerPhone={cargo?.ownerPhone || "N/A"}
              date={cargo?.updatedAt || "N/A"}
              description={cargo.description || "No description provided."}
              price={cargo.carriageFee || "N/A"}
              onRemove={() => {
                /* Handle remove action */
              }}
              onEdit={() => {
                /* Handle edit action */
              }}
            />
          ))
        ) : (
          <Text style={tw`text-center text-lg font-vazir`}>
            No cargoes found
          </Text>
        )}
      </View>
    </ScrollView>
  );
}
