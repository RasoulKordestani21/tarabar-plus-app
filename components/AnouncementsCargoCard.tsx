// AnouncementsCargoCard.jsx - Improved component
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator
} from "react-native";
import tw from "@/libs/twrnc";
import { FontAwesome } from "@expo/vector-icons";
import moment from "jalali-moment";
import { LinearGradient } from "expo-linear-gradient";
import { useGlobalContext } from "@/context/GlobalProvider";

const AnouncementsCargoCard = ({ cargo, onRegister }) => {
  const { userId } = useGlobalContext();
  const [loading, setLoading] = useState(false);

  // Check if this driver has already registered for this cargo
  const hasRegistered = cargo.driverRegistrations?.some(
    registration => registration.driver.toString() === userId
  );

  // Calculate remaining cargo count and check if it's already filled
  const remainingCount = cargo.cargoCount || 0;
  const isFilled = remainingCount <= 0;

  // Get driver registration status if already registered
  const driverRegistration = cargo.driverRegistrations?.find(
    reg => reg.driver.toString() === userId
  );

  const registrationStatus = driverRegistration?.status || "pending";

  // Format date to Persian calendar
  const formatDate = date => {
    if (!date) return "نامشخص";
    return moment(date).locale("fa").format("YYYY/MM/DD HH:mm");
  };

  // Format price for better readability
  const formatPrice = price => {
    if (!price && price !== 0) return "توافقی";
    return price.toLocaleString("fa-IR") + " تومان";
  };

  // Format weight
  const formatWeight = weight => {
    if (!weight) return "نامشخص";
    return weight.toLocaleString("fa-IR") + " کیلوگرم";
  };

  // Handle registration with confirmation
  const handleRegisterPress = async () => {
    if (hasRegistered) {
      Alert.alert(
        "درخواست قبلاً ثبت شده",
        `وضعیت درخواست شما: ${
          registrationStatus === "pending"
            ? "در انتظار تایید"
            : registrationStatus === "accepted"
            ? "تایید شده"
            : "رد شده"
        }`
      );
      return;
    }

    if (isFilled) {
      Alert.alert("ظرفیت تکمیل", "ظرفیت این بار تکمیل شده است");
      return;
    }

    Alert.alert(
      "تایید ثبت درخواست",
      `آیا از ثبت درخواست برای حمل ${cargo.cargoType || "بار"} از ${
        cargo.origin.cityName
      } به ${cargo.destination.cityName} اطمینان دارید؟`,
      [
        {
          text: "انصراف",
          style: "cancel"
        },
        {
          text: "تایید",
          onPress: async () => {
            setLoading(true);
            try {
              await onRegister();
            } catch (error) {
              Alert.alert(
                "خطا",
                "مشکلی در ثبت درخواست رخ داد. لطفا دوباره تلاش کنید."
              );
              console.error(error);
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  // Get status color
  const getStatusColor = status => {
    switch (status) {
      case "accepted":
        return "bg-green-600";
      case "rejected":
        return "bg-red-500";
      default:
        return "bg-yellow-500";
    }
  };

  // Format fee type
  const getFeeText = () => {
    if (cargo.feeType === 1 && cargo.feeOnTonage) {
      return `${formatPrice(cargo.feeOnTonage)} (تناژی)`;
    } else if (cargo.feeType === 2 && cargo.cargoFee) {
      return `${formatPrice(cargo.cargoFee)} (دربستی)`;
    }
    return "توافقی";
  };

  return (
    <View style={[tw`mb-4 rounded-lg overflow-hidden`, styles.cardShadow]}>
      <LinearGradient colors={["#003366", "#004488"]} style={tw`p-4 relative`}>
        {/* Status tag for already registered cargos */}
        {hasRegistered && (
          <View
            style={tw`absolute top-0 left-0 z-10 py-1 px-3 ${getStatusColor(
              registrationStatus
            )} rounded-br-lg`}
          >
            <Text style={tw`text-white text-xs font-vazir-bold`}>
              {registrationStatus === "pending"
                ? "در انتظار تایید"
                : registrationStatus === "accepted"
                ? "تایید شده"
                : "رد شده"}
            </Text>
          </View>
        )}

        {/* Priority indicator */}
        {cargo.priority && (
          <View
            style={tw`absolute top-0 right-0 z-10 py-1 px-3 ${
              cargo.priority === "high"
                ? "bg-red-600"
                : cargo.priority === "medium"
                ? "bg-orange-500"
                : "bg-green-600"
            } rounded-bl-lg`}
          >
            <Text style={tw`text-white text-xs font-vazir-bold`}>
              {cargo.priority === "high"
                ? "فوری"
                : cargo.priority === "medium"
                ? "متوسط"
                : "عادی"}
            </Text>
          </View>
        )}

        {/* Header with cargo type and date */}
        <View
          style={tw`flex-row-reverse justify-between items-center mb-4 mt-4`}
        >
          <Text style={tw`font-vazir-bold text-lg text-white text-right`}>
            {cargo.cargoType}
            {cargo.customCargoType ? ` (${cargo.customCargoType})` : ""}
          </Text>
          <View style={tw`flex items-center`}>
            <Text style={tw`font-vazir text-xs text-white`}>
              تاریخ بارگیری:
            </Text>
            <Text style={tw`font-vazir-bold text-xs text-white mt-1`}>
              {formatDate(cargo.readyDate)}
            </Text>
          </View>
        </View>

        {/* Route display */}
        <View
          style={tw`flex-row justify-between items-center p-3 rounded-lg bg-black-50 mb-4`}
        >
          <View style={tw`items-center`}>
            <View style={tw`flex-row items-center mb-1`}>
              <Text style={tw`text-white font-vazir-bold text-xs`}>مقصد</Text>
              <View style={tw`w-2 h-2 rounded-full bg-green-500 ml-1`} />
            </View>
            <Text style={tw`text-white font-vazir-bold text-base`}>
              {cargo.destination.cityName}
            </Text>
            <Text style={tw`text-white text-xs font-vazir`}>
              {cargo.destination.provinceName}
            </Text>
          </View>

          {/* Route line */}
          <View style={tw`flex-1 mx-2 relative justify-center items-center`}>
            <View style={tw`h-[1px] w-full bg-white`} />
            {cargo.distance && (
              <View
                style={tw`absolute bg-secondary px-2 py-1 rounded-full -top-3`}
              >
                <Text style={tw`text-white text-xs font-vazir-bold`}>
                  {Math.round(cargo.distance)} کیلومتر
                </Text>
              </View>
            )}
          </View>

          <View style={tw`items-center`}>
            <View style={tw`flex-row items-center mb-1`}>
              <View style={tw`w-2 h-2 rounded-full bg-secondary mr-1`} />
              <Text style={tw`text-white font-vazir-bold text-xs`}>مبدا</Text>
            </View>
            <Text style={tw`text-white font-vazir-bold text-base`}>
              {cargo.origin.cityName}
            </Text>
            <Text style={tw`text-white text-xs font-vazir`}>
              {cargo.origin.provinceName}
            </Text>
          </View>
        </View>

        {/* Cargo details */}
        <View style={tw`flex-row flex-wrap -mx-1 mb-3`}>
          <View style={tw`w-1/2 px-1 mb-2`}>
            <View style={tw`bg-black-50 p-2 rounded-lg`}>
              <Text style={tw`text-white text-xs font-vazir text-right`}>
                وزن:
              </Text>
              <View style={tw`flex-row justify-end items-center mt-1`}>
                <Text style={tw`text-white font-vazir-bold text-right`}>
                  {formatWeight(cargo.weight)}
                </Text>
                <FontAwesome
                  name="balance-scale"
                  size={14}
                  color="#FFAA00"
                  style={tw`ml-1`}
                />
              </View>
            </View>
          </View>

          <View style={tw`w-1/2 px-1 mb-2`}>
            <View style={tw`bg-black-50 p-2 rounded-lg`}>
              <Text style={tw`text-white text-xs font-vazir text-right`}>
                تعداد باقیمانده:
              </Text>
              <View style={tw`flex-row justify-end items-center mt-1`}>
                <Text
                  style={tw`text-${
                    remainingCount > 0 ? "green-400" : "red-400"
                  } font-vazir-bold text-right`}
                >
                  {remainingCount} واحد
                </Text>
                <FontAwesome
                  name="cubes"
                  size={14}
                  color="#FFAA00"
                  style={tw`ml-1`}
                />
              </View>
            </View>
          </View>

          <View style={tw`w-1/2 px-1 mb-2`}>
            <View style={tw`bg-black-50 p-2 rounded-lg`}>
              <Text style={tw`text-white text-xs font-vazir text-right`}>
                نوع بسته‌بندی:
              </Text>
              <View style={tw`flex-row justify-end items-center mt-1`}>
                <Text style={tw`text-white font-vazir-bold text-right`}>
                  {cargo.packagingType || "نامشخص"}
                </Text>
                <FontAwesome
                  name="box"
                  size={14}
                  color="#FFAA00"
                  style={tw`ml-1`}
                />
              </View>
            </View>
          </View>

          <View style={tw`w-1/2 px-1 mb-2`}>
            <View style={tw`bg-black-50 p-2 rounded-lg`}>
              <Text style={tw`text-white text-xs font-vazir text-right`}>
                قیمت:
              </Text>
              <View style={tw`flex-row justify-end items-center mt-1`}>
                <Text style={tw`text-green-400 font-vazir-bold text-right`}>
                  {getFeeText()}
                </Text>
                <FontAwesome
                  name="money"
                  size={14}
                  color="#FFAA00"
                  style={tw`ml-1`}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Special conditions */}
        {cargo.specialConditions && cargo.specialConditions.length > 0 && (
          <View style={tw`bg-black-50 p-2 rounded-lg mb-3`}>
            <Text style={tw`text-white text-xs font-vazir text-right mb-1`}>
              شرایط ویژه:
            </Text>
            <View style={tw`flex-row flex-wrap justify-end`}>
              {cargo.specialConditions.map((condition, index) => (
                <View
                  key={index}
                  style={tw`bg-secondary px-2 py-1 rounded-full m-1`}
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
        {cargo.notes && cargo.notes.length > 0 && (
          <View style={tw`bg-black-50 p-2 rounded-lg mb-3`}>
            <Text style={tw`text-white text-xs font-vazir text-right mb-1`}>
              توضیحات:
            </Text>
            <Text style={tw`text-white font-vazir text-right`}>
              {cargo.notes}
            </Text>
          </View>
        )}

        {/* Address details */}
        <View style={tw`bg-black-50 p-2 rounded-lg mb-3`}>
          <View style={tw`flex-row justify-between mb-1`}>
            <View style={tw`flex-1 mr-1`}>
              <Text style={tw`text-white text-xs font-vazir text-right`}>
                آدرس مقصد:
              </Text>
              <Text style={tw`text-white text-xs font-vazir text-right mt-1`}>
                {cargo.destination.address || "نامشخص"}
              </Text>
            </View>
            <View style={tw`w-px bg-gray-500 mx-2`} />
            <View style={tw`flex-1 ml-1`}>
              <Text style={tw`text-white text-xs font-vazir text-right`}>
                آدرس مبدا:
              </Text>
              <Text style={tw`text-white text-xs font-vazir text-right mt-1`}>
                {cargo.origin.address || "نامشخص"}
              </Text>
            </View>
          </View>
        </View>

        {/* Registration button */}
        <TouchableOpacity
          style={tw`${
            hasRegistered
              ? registrationStatus === "accepted"
                ? "bg-green-600"
                : registrationStatus === "rejected"
                ? "bg-red-500"
                : "bg-yellow-500"
              : isFilled
              ? "bg-gray-600"
              : "bg-primary"
          } p-3 rounded-lg mt-2`}
          onPress={handleRegisterPress}
          disabled={
            loading || (hasRegistered && registrationStatus !== "rejected")
          }
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={tw`text-white text-center font-vazir-bold`}>
              {hasRegistered
                ? registrationStatus === "pending"
                  ? "در انتظار تایید"
                  : registrationStatus === "accepted"
                  ? "درخواست تایید شده"
                  : "درخواست مجدد"
                : isFilled
                ? "ظرفیت تکمیل شده"
                : "ثبت درخواست حمل"}
            </Text>
          )}
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
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

const styles = StyleSheet.create({
  cardShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  }
});

export default AnouncementsCargoCard;
