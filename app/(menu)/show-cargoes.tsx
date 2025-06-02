import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl
} from "react-native";
import tw from "@/libs/twrnc";
import { router, useLocalSearchParams } from "expo-router";
import {
  getCargoesByLocation,
  getCargoesByOriginDestination
} from "@/api/services/cargoServices";
import CargoCard from "@/components/CargoCard";
import { cargoTypes, truckTypes } from "@/constants/BoxesList";
import { FontAwesome } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useGlobalContext } from "@/context/GlobalProvider";

export default function ShowCargoes() {
  const { phoneNumber } = useGlobalContext();
  const { latitude, longitude, origin, destination } = useLocalSearchParams();
  const [filterVisible, setFilterVisible] = useState<boolean>(false);

  // Fetch cargoes based on the query params
  const fetchCargoes = async () => {
    let filteredCargoes;

    if (latitude && longitude) {
      console.log(latitude, longitude);
      filteredCargoes = await getCargoesByLocation(
        phoneNumber,
        parseFloat(latitude as string),
        parseFloat(longitude as string)
      );
    } else if (origin && destination) {
      const params = {
        phoneNumber,
        originIds: JSON.parse(origin as string)
          .split(",")
          .join(","),
        destinationIds: JSON.parse(destination as string)
          .split(",")
          .join(",")
      };
      filteredCargoes = await getCargoesByOriginDestination({
        ...params
      });
    } else {
      throw new Error("No valid filters provided");
    }
    // console.log(filteredCargoes?.cargos);
    return filteredCargoes?.cargos;
  };

  const {
    data: cargoes = [],
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ["cargoes", latitude, longitude, origin, destination],
    queryFn: fetchCargoes,
    enabled: Boolean(latitude && longitude) || Boolean(origin && destination),
    refetchOnWindowFocus: false
  });

  // Handle pull-to-refresh
  const handlePullRefresh = async () => {
    await refetch();
  };

  // Handle back button
  const handleBack = () => {
    router.back();
  };
  const formatPrice = (priceStr: string) => {
    if (priceStr === "توافقی") return priceStr;

    try {
      // If price is a number, format it with commas
      const priceNum = parseInt(priceStr.replace(/[^0-9]/g, ""), 10);
      if (!isNaN(priceNum)) {
        return priceNum.toLocaleString("fa-IR") + " تومان";
      }
      return priceStr;
    } catch {
      return priceStr;
    }
  };
  return (
    <View style={tw`flex-1 bg-gray-100`}>
      {/* Filter options - shown conditionally */}
      {filterVisible && (
        <View style={tw`bg-white p-4 shadow-sm`}>
          <Text style={tw`text-sm font-vazir mb-2`}>فیلترها</Text>
          {/* Filter options would go here */}
          <View style={tw`h-[1px] w-full bg-gray-200 my-2`}></View>
        </View>
      )}

      <ScrollView
        style={tw`flex-1`}
        contentContainerStyle={tw`p-2`}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handlePullRefresh}
            tintColor="#003366"
            colors={["#003366"]}
          />
        }
      >
        {isLoading && (
          <View style={tw`flex-1 justify-center items-center py-8`}>
            <ActivityIndicator size="large" color="#003366" />
          </View>
        )}

        {isError && error && (
          <View style={tw`bg-red-100 p-4 rounded-lg my-4`}>
            <Text style={tw`text-red-500 text-center font-vazir`}>
              {error.message || "Failed to fetch cargoes"}
            </Text>
          </View>
        )}

        {!isLoading && cargoes.length === 0 && !isError && (
          <View style={tw`bg-yellow-100 p-4 rounded-lg my-4`}>
            <Text style={tw`text-yellow-700 text-center font-vazir`}>
              هیچ باری یافت نشد. لطفاً معیارهای جستجو را تغییر دهید.
            </Text>
          </View>
        )}

        {cargoes.length > 0 && (
          <View>
            <Text style={tw`text-gray-700 font-vazir p-2`}>
              {cargoes.length} بار یافت شد
            </Text>

            {cargoes.map(cargo => (
              <CargoCard
                key={cargo._id}
                originCity={cargo?.origin?.title || "نامشخص"}
                originProvince={cargo?.origin?.provinceName || "نامشخص"}
                destinationCity={cargo?.destination?.title || "نامشخص"}
                destinationProvince={
                  cargo?.destination?.provinceName || "نامشخص"
                }
                distance={cargo?.distance ? `${cargo.distance}` : "نامشخص"}
                truckType={
                  truckTypes.find(
                    ele => Number(ele.value) === cargo.truckTypeId
                  )?.label || "نامشخص"
                }
                loadType={
                  cargo?.customCargoType
                    ? `${
                        cargoTypes.find(
                          ele => Number(ele.value) === cargo.cargoTypeId
                        )?.label || "*"
                      } (${cargo.customCargoType})`
                    : cargoTypes.find(
                        ele => Number(ele.value) === cargo.cargoTypeId
                      )?.label || "نامشخص"
                }
                ownerPhone={cargo?.ownerPhone || "نامشخص"}
                date={cargo?.updatedAt || new Date().toISOString()}
                description={cargo.description || "توضیحاتی وجود ندارد."}
                price={
                  cargo?.cargoWeight
                    ? `${cargo.cargoWeight} تن -  هرتن ${formatPrice(
                        cargo.carriageFee
                      )}`
                    : formatPrice(cargo?.carriageFee) || "توافقی"
                }
                showActions={false}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
