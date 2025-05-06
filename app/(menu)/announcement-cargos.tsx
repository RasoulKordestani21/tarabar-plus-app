import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  RefreshControl
} from "react-native";
import tw from "@/libs/twrnc";
import { router, useLocalSearchParams } from "expo-router";
import {
  getAvailableCargosForDriver,
  registerDriverToCargo
} from "@/api/services/cargoServices";
import { useGlobalContext } from "@/context/GlobalProvider";
import moment from "jalali-moment";
import AnouncementsCargoCard from "@/components/AnouncementsCargoCard";
import { useQuery } from "@tanstack/react-query";
import { cargoTypes } from "@/constants/BoxesList";

export default function AnnouncementCargos() {
  const { latitude, longitude } = useLocalSearchParams();
  const [isBlocked, setIsBlocked] = useState(false);
  const [nextAvailableTime, setNextAvailableTime] = useState(null);
  const [lastAnnouncement, setLastAnnouncement] = useState(null);

  const { phoneNumber, userId } = useGlobalContext();
  console.log(userId);
  console.log(latitude, longitude);
  const fetchAvailableCargoes = async () => {
    try {
      const response = await getAvailableCargosForDriver(
        parseFloat(latitude as string),
        parseFloat(longitude as string),
        200,
        phoneNumber
      );

      if (response.blocked) {
        setIsBlocked(true);
        setNextAvailableTime(response.nextAvailableTime);
        setLastAnnouncement(response.lastAnnouncement);
        return { cargos: [], blocked: true };
      } else {
        setIsBlocked(false);
        setNextAvailableTime(null);
        setLastAnnouncement(null);
        return { cargos: response.cargos, blocked: false };
      }
    } catch (err) {
      console.error("Error fetching available cargoes:", err);
      Alert.alert("خطا", "خطا در دریافت بارها");
      throw err;
    }
  };

  const {
    data: cargoData,
    isLoading,
    isError,
    refetch
  } = useQuery({
    queryKey: ["available-cargos", latitude, longitude, phoneNumber],
    queryFn: fetchAvailableCargoes,
    enabled: Boolean(phoneNumber && latitude && longitude),
    refetchOnWindowFocus: false
  });

  const handleRegisterCargo = async cargoId => {
    try {
      await registerDriverToCargo(cargoId, {
        driverId: userId,
        vehicle: ""
      });

      Alert.alert("موفقیت", "درخواست حمل با موفقیت ثبت شد");
      refetch();
    } catch (error) {
      console.error("Error registering for cargo:", error);
      Alert.alert("خطا", "خطا در ثبت درخواست حمل");
    }
  };

  const formatTime = date => {
    if (!date) return "";
    return moment(date).locale("fa").format("YYYY/MM/DD HH:mm");
  };

  const handlePullRefresh = async () => {
    await refetch();
  };

  const getCargoTypeLabel = cargoTypeId => {
    const cargoType = cargoTypes.find(ele => Number(ele.value) === cargoTypeId);
    return cargoType?.label || "نوع بار نامشخص";
  };

  return (
    <View style={tw`flex-1 bg-gray-100`}>
      <ScrollView
        style={tw`flex-1`}
        contentContainerStyle={tw`p-4`}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handlePullRefresh}
            tintColor="#003366"
            colors={["#003366"]}
          />
        }
      >
        <View style={tw`mb-4`}>
          <Text
            style={tw`text-xl font-vazir-bold text-center mb-4 text-gray-800`}
          >
            {isBlocked ? "آخرین بار ثبت شده" : "اعلام بارها"}
          </Text>
          <View style={tw`h-[1px] w-full bg-gray-200 mb-4`}></View>

          {isError && (
            <View style={tw`bg-red-100 p-4 rounded-lg mb-4`}>
              <Text style={tw`text-red-500 text-center font-vazir`}>
                خطا در بارگذاری اطلاعات
              </Text>
            </View>
          )}

          {isBlocked && lastAnnouncement && (
            <View style={tw`mb-6`}>
              <Text
                style={tw`text-center text-lg font-vazir-bold text-primary mb-4`}
              >
                {`شما می‌توانید بعد از ${formatTime(
                  nextAvailableTime
                )} بار جدید ثبت کنید`}
              </Text>

              {/* Custom Last Announcement Card */}
              <View
                style={tw`bg-secondary rounded-lg shadow-sm p-4 border border-gray-300`}
              >
                <View
                  style={tw`flex-row-reverse justify-between items-center mb-3`}
                >
                  <Text style={tw`font-vazir-bold text-white`}>
                    {lastAnnouncement.details?.cargoType ||
                      getCargoTypeLabel(lastAnnouncement.cargoTypeId)}
                  </Text>
                  <Text style={tw`font-vazir text-white text-xs`}>
                    {formatTime(lastAnnouncement.createdAt)}
                  </Text>
                </View>

                <View style={tw`flex-row-reverse justify-between mb-2`}>
                  <Text style={tw`font-vazir text-white text-sm`}>وزن:</Text>
                  <Text style={tw`font-vazir-bold text-primary`}>
                    {lastAnnouncement.details?.weight ||
                      lastAnnouncement.cargoWeight ||
                      "نامشخص"}{" "}
                    کیلوگرم
                  </Text>
                </View>

                <View style={tw`flex-row-reverse justify-between mb-2`}>
                  <Text style={tw`font-vazir text-white text-sm`}>مبدا:</Text>
                  <Text style={tw`font-vazir-bold text-primary text-left`}>
                    {lastAnnouncement.details?.origin?.address ||
                      `${lastAnnouncement.origin?.title}, ${lastAnnouncement.origin?.provinceName}` ||
                      "نامشخص"}
                  </Text>
                </View>

                <View style={tw`flex-row-reverse justify-between mb-2`}>
                  <Text style={tw`font-vazir text-white text-sm`}>مقصد:</Text>
                  <Text style={tw`font-vazir-bold text-primary text-left`}>
                    {lastAnnouncement.details?.destination?.address ||
                      `${lastAnnouncement.destination?.title}, ${lastAnnouncement.destination?.provinceName}` ||
                      "نامشخص"}
                  </Text>
                </View>

                <View style={tw`flex-row-reverse justify-between mb-2`}>
                  <Text style={tw`font-vazir text-white text-sm`}>
                    تاریخ بارگیری:
                  </Text>
                  <Text style={tw`font-vazir-bold text-primary`}>
                    {formatTime(
                      lastAnnouncement.details?.readyDate ||
                        lastAnnouncement.readyDate
                    )}
                  </Text>
                </View>

                {(lastAnnouncement.details?.distance ||
                  lastAnnouncement.distance) && (
                  <View style={tw`flex-row-reverse justify-between mb-2`}>
                    <Text style={tw`font-vazir text-white text-sm`}>
                      مسافت:
                    </Text>
                    <Text style={tw`font-vazir-bold text-primary`}>
                      {Math.floor(
                        lastAnnouncement.details?.distance ||
                          lastAnnouncement.distance
                      )}{" "}
                      کیلومتر
                    </Text>
                  </View>
                )}

                <View style={tw`mt-4 pt-3 border-t border-gray-100`}>
                  <Text
                    style={tw`text-center font-vazir text-gray-400 text-sm`}
                  >
                    این بار قبلاً ثبت شده است
                  </Text>
                </View>
              </View>

              <Text
                style={tw`text-center mt-4 font-vazir text-gray-500 text-sm`}
              >
                برای مشاهده بارهای جدید بعد از زمان مشخص شده صفحه را رفرش کنید
              </Text>
            </View>
          )}

          {!isBlocked && !isLoading && cargoData?.cargos?.length === 0 && (
            <View style={tw`bg-yellow-100 p-4 rounded-lg mb-4`}>
              <Text style={tw`text-yellow-700 text-center font-vazir`}>
                هیچ بار در دسترسی یافت نشد
              </Text>
            </View>
          )}

          {!isBlocked && cargoData?.cargos?.length > 0 && (
            <View>
              <Text style={tw`text-gray-700 font-vazir mb-2`}>
                {cargoData.cargos.length} بار یافت شد
              </Text>

              {cargoData.cargos.map(cargo => (
                <AnouncementsCargoCard
                  key={cargo._id}
                  cargo={cargo}
                  onRegister={() => handleRegisterCargo(cargo._id)}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
