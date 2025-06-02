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
import { QUERY_KEYS } from "@/constants/QueryKeys";
import { getDriverUser } from "@/api/services/driverServices";

export default function AnnouncementCargos() {
  const { latitude, longitude } = useLocalSearchParams();
  const [isBlocked, setIsBlocked] = useState(false);
  const [nextAvailableTime, setNextAvailableTime] = useState(null);
  const [lastAnnouncement, setLastAnnouncement] = useState(null);
  const [activeTab, setActiveTab] = useState("available"); // New state for tabs

  const { phoneNumber, userId } = useGlobalContext();

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
      Alert.alert("خطا", "خطا در دریافت بارها", [
        { text: "بستن", style: "cancel" }
      ]);
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

  const {
    data: userData,
    error,
    isLoading: loading,
    isFetched,
    refetch: refetchDriver
  } = useQuery({
    queryKey: [QUERY_KEYS.DRIVER_INFO, phoneNumber],
    queryFn: () => getDriverUser({ phoneNumber, cargoOnly: true })
  });

  // Format fee text
  const getFeeText = cargo => {
    if (cargo.feeType === 1 && cargo.feeOnTonage) {
      return `${formatPrice(cargo.feeOnTonage)} هرتن`;
    } else if (cargo.feeType === 2 && cargo.cargoFee) {
      return `${formatPrice(cargo.cargoFee)} (دربستی)`;
    } else if (cargo.feeOnTonage) {
      return `${formatPrice(cargo.feeOnTonage)} هرتن`;
    } else if (cargo.cargoFee) {
      return `${formatPrice(cargo.cargoFee)}`;
    }
    return "توافقی";
  };

  // Format price for better readability
  const formatPrice = price => {
    if (!price && price !== 0) return "توافقی";
    return price.toLocaleString("fa-IR") + " تومان";
  };

  // Format weight
  const formatWeight = weight => {
    if (!weight) return "نامشخص";
    return weight.toLocaleString("fa-IR") + " تن";
  };

  // Helper function to translate condition codes to readable Persian text
  const getConditionLabel = condition => {
    const conditions = {
      temperature: "دمای کنترل شده",
      fragile: "شکننده",
      perishable: "فاسدشدنی",
      flammable: "قابل اشتعال",
      livestockAnimals: "حیوانات زنده",
      hazardousMaterials: "مواد خطرناک",
      oversizedCargo: "بار بزرگ",
      urgentDelivery: "تحویل فوری",
      valueProtection: "ارزش بالا"
    };

    return conditions[condition] || condition;
  };

  const handleRegisterCargo = async cargoId => {
    try {
      await registerDriverToCargo(cargoId, {
        driverId: userId,
        vehicle: ""
      });

      Alert.alert("موفقیت", "درخواست حمل با موفقیت ثبت شد", [
        { text: "بستن", style: "cancel" }
      ]);
      refetch();
      refetchDriver();
    } catch (error) {
      console.error("Error registering for cargo:", error);
      Alert.alert("خطا", "خطا در ثبت درخواست حمل", [
        { text: "بستن", style: "cancel" }
      ]);
    }
  };

  const formatTime = date => {
    if (!date) return "";
    return moment(date).locale("fa").format("YYYY/MM/DD HH:mm");
  };

  const handlePullRefresh = async () => {
    if (activeTab === "available") {
      await refetch();
    } else {
      await refetchDriver();
    }
  };

  const getCargoTypeLabel = cargoTypeId => {
    const cargoType = cargoTypes.find(ele => Number(ele.value) === cargoTypeId);
    return cargoType?.label || "نوع بار نامشخص";
  };

  const getStatusText = status => {
    const statusMap = {
      pending: "در انتظار",
      accepted: "پذیرفته شده",
      in_progress: "در حال انجام",
      completed: "تکمیل شده",
      cancelled: "لغو شده"
    };
    return statusMap[status] || status;
  };

  const getStatusColor = status => {
    const colorMap = {
      pending: "bg-yellow-100 text-yellow-800",
      accepted: "bg-green-100 text-green-800",
      in_progress: "bg-blue-100 text-blue-800",
      completed: "bg-gray-100 text-gray-800",
      cancelled: "bg-red-100 text-red-800"
    };
    return colorMap[status] || "bg-gray-100 text-gray-800";
  };

  // History cargo card component
  const HistoryCargoCard = ({ cargo }) => {
    const details = cargo.details;

    // Format fee text for history (same logic as announcement card)
    const getHistoryFeeText = () => {
      if (details?.feeType === 1 && details?.feeOnTonage) {
        return `${formatPrice(details.feeOnTonage)} / هرتن`;
      } else if (details?.feeType === 2 && details?.cargoFee) {
        return `${formatPrice(details.cargoFee)} (دربستی)`;
      } else if (details?.feeOnTonage) {
        return `${formatPrice(details.feeOnTonage)}/ هرتن`;
      } else if (details?.cargoFee) {
        return `${formatPrice(details.cargoFee)}`;
      }
      return "توافقی";
    };

    // Format price for better readability
    const formatPrice = price => {
      if (!price && price !== 0) return "توافقی";
      return price.toLocaleString("fa-IR") + " تومان";
    };

    return (
      <View
        style={tw`${
          details.status === "pending" ? "bg-yellow-800" : "bg-[#374151]"
        } rounded-lg shadow-sm p-4 mb-4 border border-gray-200`}
      >
        {/* Header with cargo type and status */}
        <View style={tw`flex-row-reverse justify-between items-center mb-3`}>
          <View style={tw`flex-1`}>
            <Text style={tw`font-vazir-bold text-text text-base text-right`}>
              {details.customCargoType || getCargoTypeLabel(details.cargoType)}
            </Text>
            {/* Carrier company info */}
            {details?.carrierDetails && (
              <Text
                style={tw`font-vazir text-xs text-secondary text-right mt-1`}
              >
                شرکت حمل و نقل: {details.carrierDetails.companyName}
              </Text>
            )}
          </View>
          <View
            style={tw`px-3 py-1 rounded-full ${getStatusColor(
              details?.status
            )}`}
          >
            <Text style={tw`font-vazir text-xs`}>
              {getStatusText(details?.status)}
            </Text>
          </View>
        </View>

        {/* Carrier contact info */}
        {details?.carrierDetails && (
          <View style={tw`bg-black-50 p-3 rounded-lg mb-3`}>
            <Text style={tw`text-secondary text-xs font-vazir text-right mb-2`}>
              اطلاعات تماس:
            </Text>
            <Text style={tw`text-yellow-400 font-vazir-bold text-right mb-1`}>
              شماره تماس: {details.carrierDetails.phoneNumber}
            </Text>
            {details.carrierDetails.address && (
              <Text style={tw`text-text font-vazir text-right text-xs`}>
                آدرس: {details.carrierDetails.address}
              </Text>
            )}
          </View>
        )}

        {/* Basic info in grid format */}
        <View style={tw`flex-row flex-wrap -mx-1 mb-3`}>
          <View style={tw`w-1/2 px-1 mb-2`}>
            <View style={tw`bg-black-50 p-2 rounded-lg`}>
              <Text style={tw`font-vazir text-secondary text-sm text-right`}>
                وزن:
              </Text>
              <Text style={tw`font-vazir-bold text-text text-right mt-1`}>
                {details?.weight || "نامشخص"} تن
              </Text>
            </View>
          </View>

          <View style={tw`w-1/2 px-1 mb-2`}>
            <View style={tw`bg-black-50 p-2 rounded-lg`}>
              <Text style={tw`font-vazir text-secondary text-sm text-right`}>
                کرایه:
              </Text>
              <Text style={tw`font-vazir-bold text-green-400 text-right mt-1`}>
                {getHistoryFeeText()}
              </Text>
            </View>
          </View>

          <View style={tw`w-1/2 px-1 mb-2`}>
            <View style={tw`bg-black-50 p-2 rounded-lg`}>
              <Text style={tw`font-vazir text-secondary text-sm text-right`}>
                تاریخ بارگیری:
              </Text>
              <Text style={tw`font-vazir-bold text-text text-right mt-1`}>
                {formatTime(details?.readyDate)}
              </Text>
            </View>
          </View>

          {details?.distance && (
            <View style={tw`w-1/2 px-1 mb-2`}>
              <View style={tw`bg-black-50 p-2 rounded-lg`}>
                <Text style={tw`font-vazir text-secondary text-sm text-right`}>
                  مسافت:
                </Text>
                <Text style={tw`font-vazir-bold text-text text-right mt-1`}>
                  {Math.floor(details.distance)} کیلومتر
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Origin and Destination */}
        <View style={tw`flex-row-reverse justify-between mb-2`}>
          <Text style={tw`font-vazir text-secondary text-sm`}>مبدا:</Text>
          <Text style={tw`font-vazir-bold text-text text-left flex-1 ml-2`}>
            {details?.origin?.address ||
              `${details?.origin?.cityName}, ${details?.origin?.provinceName}` ||
              "نامشخص"}
          </Text>
        </View>

        <View style={tw`flex-row-reverse justify-between mb-2`}>
          <Text style={tw`font-vazir text-secondary text-sm`}>مقصد:</Text>
          <Text style={tw`font-vazir-bold text-text text-left flex-1 ml-2`}>
            {details?.destination?.address ||
              `${details?.destination?.cityName}, ${details?.destination?.provinceName}` ||
              "نامشخص"}
          </Text>
        </View>

        {/* Additional details if available */}
        {details?.packagingType && (
          <View style={tw`flex-row-reverse justify-between mb-2`}>
            <Text style={tw`font-vazir text-secondary text-sm`}>
              نوع بسته‌بندی:
            </Text>
            <Text style={tw`font-vazir-bold text-text`}>
              {details.packagingType}
            </Text>
          </View>
        )}

        {/* Dimensions if available */}
        {(details?.dimensions?.length ||
          details?.dimensions?.width ||
          details?.dimensions?.height) && (
          <View style={tw`bg-black-50 p-3 rounded-lg mb-3`}>
            <Text style={tw`text-secondary text-xs font-vazir text-right mb-2`}>
              ابعاد (سانتی‌متر):
            </Text>
            <Text style={tw`text-text font-vazir-bold text-right`}>
              {details.dimensions.length
                ? `طول: ${details.dimensions.length}`
                : ""}
              {details.dimensions.width
                ? ` | عرض: ${details.dimensions.width}`
                : ""}
              {details.dimensions.height
                ? ` | ارتفاع: ${details.dimensions.height}`
                : ""}
            </Text>
          </View>
        )}

        {/* Working hours if available */}
        {(details?.openTime || details?.closeTime) && (
          <View style={tw`bg-black-50 p-3 rounded-lg mb-3`}>
            <Text style={tw`text-secondary text-xs font-vazir text-right mb-2`}>
              ساعات کاری:
            </Text>
            <Text style={tw`text-text font-vazir-bold text-right`}>
              {details.openTime || "نامشخص"} - {details.closeTime || "نامشخص"}
            </Text>
          </View>
        )}

        {/* Special conditions */}
        {details?.specialConditions && details.specialConditions.length > 0 && (
          <View style={tw`bg-black-50 p-3 rounded-lg mb-3`}>
            <Text style={tw`text-secondary text-xs font-vazir text-right mb-2`}>
              شرایط ویژه:
            </Text>
            <View style={tw`flex-row flex-wrap justify-end`}>
              {details.specialConditions.map((condition, index) => (
                <View
                  key={index}
                  style={tw`bg-yellow-600 px-2 py-1 rounded-full m-1`}
                >
                  <Text style={tw`text-white text-xs font-vazir`}>
                    {getConditionLabel(condition)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Notes if available */}
        {details?.notes && details.notes.length > 0 && (
          <View style={tw`bg-black-50 p-3 rounded-lg mb-3`}>
            <Text style={tw`text-secondary text-xs font-vazir text-right mb-2`}>
              توضیحات:
            </Text>
            <Text style={tw`text-text font-vazir text-right`}>
              {details.notes}
            </Text>
          </View>
        )}

        {/* Footer with timestamp */}
        <View
          style={tw` flex flex-row justify-between mt-3 pt-3 border-t border-gray-100`}
        >
          <Text style={tw`text-left font-vazir text-black-200 text-xs`}>
            {formatTime(cargo.createdAt)}
          </Text>
          <Text style={tw`text-left font-vazir text-black-200 text-xs`}>
            تاریخ ثبت درخواست :
          </Text>
        </View>
      </View>
    );
  };

  // Improved blocked state card
  const BlockedStateCard = () => (
    <View style={tw`mb-6`}>
      <View
        style={tw`bg-orange-50 border-l-4 border-secondary p-4 rounded-lg mb-4`}
      >
        <View style={tw`flex-row-reverse items-center mb-3`}>
          <Text
            style={tw`font-vazir-bold text-orange-800 text-lg flex-1 text-right`}
          >
            محدودیت زمانی فعال
          </Text>
          <View
            style={tw`bg-secondary rounded-full w-8 h-8 items-center justify-center ml-3`}
          >
            <Text style={tw`text-white font-vazir-bold text-lg`}>!</Text>
          </View>
        </View>

        <Text
          style={tw`font-vazir text-orange-700 text-base mb-3 leading-6 text-right`}
        >
          شما می‌توانید بعد از {formatTime(nextAvailableTime)} بار جدید ثبت کنید
        </Text>

        <Text style={tw`font-vazir text-orange-600 text-sm text-right`}>
          برای مشاهده بارهای جدید بعد از زمان مشخص شده صفحه را رفرش کنید
        </Text>
      </View>

      {lastAnnouncement && (
        <View>
          <Text style={tw`font-vazir-bold text-text mb-3 text-right`}>
            آخرین بار ثبت شده:
          </Text>
          <HistoryCargoCard
            cargo={{
              details: {
                cargoType:
                  lastAnnouncement.details?.cargoType ||
                  lastAnnouncement.cargoTypeId,
                customCargoType:
                  lastAnnouncement.details?.customCargoType ||
                  lastAnnouncement.customCargoType,
                weight:
                  lastAnnouncement.details?.weight ||
                  lastAnnouncement.cargoWeight,
                origin:
                  lastAnnouncement.details?.origin || lastAnnouncement.origin,
                destination:
                  lastAnnouncement.details?.destination ||
                  lastAnnouncement.destination,
                readyDate:
                  lastAnnouncement.details?.readyDate ||
                  lastAnnouncement.readyDate,
                distance:
                  lastAnnouncement.details?.distance ||
                  lastAnnouncement.distance,
                carrierDetails:
                  lastAnnouncement.details?.carrierDetails ||
                  lastAnnouncement.carrierDetails,
                feeType:
                  lastAnnouncement.details?.feeType || lastAnnouncement.feeType,
                feeOnTonage:
                  lastAnnouncement.details?.feeOnTonage ||
                  lastAnnouncement.feeOnTonage,
                cargoFee:
                  lastAnnouncement.details?.cargoFee ||
                  lastAnnouncement.cargoFee,
                packagingType:
                  lastAnnouncement.details?.packagingType ||
                  lastAnnouncement.packagingType,
                dimensions:
                  lastAnnouncement.details?.dimensions ||
                  lastAnnouncement.dimensions,
                openTime:
                  lastAnnouncement.details?.openTime ||
                  lastAnnouncement.openTime,
                closeTime:
                  lastAnnouncement.details?.closeTime ||
                  lastAnnouncement.closeTime,
                specialConditions:
                  lastAnnouncement.details?.specialConditions ||
                  lastAnnouncement.specialConditions,
                notes:
                  lastAnnouncement.details?.notes || lastAnnouncement.notes,
                priority:
                  lastAnnouncement.details?.priority ||
                  lastAnnouncement.priority,
                status: "pending"
              },
              createdAt: lastAnnouncement.createdAt
            }}
          />
        </View>
      )}
    </View>
  );

  // Tab content renderers
  const renderAvailableTab = () => (
    <>
      {isError && (
        <View style={tw`bg-red-100 p-4 rounded-lg mb-4`}>
          <Text style={tw`text-red-500 text-center font-vazir`}>
            خطا در بارگذاری اطلاعات
          </Text>
        </View>
      )}

      {isBlocked ? (
        <BlockedStateCard />
      ) : (
        <>
          {!isLoading && cargoData?.cargos?.length === 0 && (
            <View style={tw`bg-yellow-100 p-4 rounded-lg mb-4`}>
              <Text style={tw`text-yellow-700 text-center font-vazir`}>
                هیچ بار در دسترسی یافت نشد
              </Text>
            </View>
          )}

          {cargoData?.cargos?.length > 0 && (
            <View>
              <Text style={tw`text-background font-vazir mb-4 text-right`}>
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
        </>
      )}
    </>
  );

  const renderHistoryTab = () => {
    const historyCargos = userData?.user?.cargos || [];

    return (
      <>
        {loading && (
          <View style={tw`justify-center items-center py-8`}>
            <ActivityIndicator size="large" color={tw.color("primary")} />
          </View>
        )}

        {!loading && historyCargos.length === 0 && (
          <View style={tw`bg-card p-4 rounded-lg mb-4`}>
            <Text style={tw`text-text text-center font-vazir`}>
              هیچ سابقه باری یافت نشد
            </Text>
          </View>
        )}

        {historyCargos.length > 0 && (
          <View>
            <Text style={tw`text-background font-vazir mb-4 text-right`}>
              {historyCargos.length} بار در سابقه
            </Text>
            {historyCargos.map((cargo, index) => (
              <HistoryCargoCard key={cargo._id || index} cargo={cargo} />
            ))}
          </View>
        )}
      </>
    );
  };

  return (
    <View style={tw`flex-1 bg-gray-100`}>
      {/* Tab Headers */}
      <View style={tw`flex-row bg-white shadow-sm  p-3`}>
        <TouchableOpacity
          style={tw`flex-1 py-4 px-6 rounded-3${
            activeTab === "available"
              ? "border-b-2 border-primary text-white bg-primary"
              : ""
          }`}
          onPress={() => setActiveTab("available")}
        >
          <Text
            style={tw`text-center font-vazir-bold ${
              activeTab === "available" ? "text-white" : "text-primary"
            }`}
          >
            بارهای موجود
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={tw`flex-1 py-4 px-6 rounded-3${
            activeTab === "history"
              ? "border-b-2 border-primary bg-black-50"
              : ""
          }`}
          onPress={() => setActiveTab("history")}
        >
          <Text
            style={tw`text-center font-vazir-bold ${
              activeTab === "history" ? "text-white" : "text-black-50"
            }`}
          >
            سابقه بارها
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      <ScrollView
        style={tw`flex-1 `}
        contentContainerStyle={tw`p-4`}
        refreshControl={
          <RefreshControl
            refreshing={activeTab === "available" ? isLoading : loading}
            onRefresh={handlePullRefresh}
            tintColor={tw.color("primary")}
            colors={[tw.color("primary")]}
          />
        }
      >
        <View style={tw`mb-4`}>
          <Text
            style={tw`text-xl font-vazir-bold text-center mb-4 text-background`}
          >
            {activeTab === "available"
              ? isBlocked
                ? "آخرین بار ثبت شده"
                : "اعلام بارها"
              : "سابقه بارهای شما"}
          </Text>
          <View style={tw`h-[1px] w-full bg-background mb-4`}></View>

          {activeTab === "available"
            ? renderAvailableTab()
            : renderHistoryTab()}
        </View>
      </ScrollView>
    </View>
  );
}
