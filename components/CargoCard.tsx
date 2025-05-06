import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  StyleSheet
} from "react-native";
import tw from "@/libs/twrnc";
import { FontAwesome } from "@expo/vector-icons";
import moment from "jalali-moment";
import { useGlobalContext } from "@/context/GlobalProvider";
import { LinearGradient } from "expo-linear-gradient";

interface LoadDetails {
  originCity: string;
  originProvince: string;
  destinationCity: string;
  destinationProvince: string;
  truckType?: string;
  loadType?: string;
  date: string;
  description: string;
  price: string;
  distance?: string;
  ownerPhone: string;
  status?: "pending" | "in-progress" | "completed" | "cancelled";
  onRemove?: () => void;
  onEdit?: () => void;
  showActions?: boolean;
}

const CargoCard: React.FC<LoadDetails> = ({
  originCity,
  originProvince,
  destinationCity,
  destinationProvince,
  truckType,
  loadType,
  date,
  description,
  distance,
  price,
  ownerPhone,
  status = "pending",
  onRemove,
  onEdit,
  showActions = false
}) => {
  const formattedDate = moment(date).locale("fa").format("YYYY/MM/DD");
  const { role } = useGlobalContext();

  const handleCallOwner = () => {
    Linking.openURL(`tel:${ownerPhone}`);
  };

  // Status color mapping
  const getStatusColor = () => {
    switch (status) {
      case "in-progress":
        return "#FF9800";
      case "completed":
        return "#4CAF50";
      case "cancelled":
        return "#F44336";
      default:
        return "#2196F3"; // pending
    }
  };

  return (
    <View style={[tw`m-3 rounded-lg overflow-hidden `, styles.cardShadow]}>
      <LinearGradient colors={["#003366", "#003366"]} style={tw`p-3`}>
        {/* Status indicator */}
        <View
          style={[
            tw`absolute top-0 left-0 z-10 py-1 px-3 rounded-bl-lg rounded-tr-lg bg-green-100`,
            { backgroundColor: getStatusColor() }
          ]}
        >
          <Text style={tw`text-white text-xs font-vazir-bold`}>
            {status === "pending"
              ? "در انتظار"
              : status === "in-progress"
              ? "در حال انجام"
              : status === "completed"
              ? "تکمیل شده"
              : "لغو شده"}
          </Text>
        </View>

        {/* Header with origin/destination */}

        <View
          style={tw`flex-row justify-between items-center mb-2 mt-2  mt-8  `}
        ></View>

        <View style={tw`flex-row justify-between items-center  p-1 rounded-3`}>
          <View style={tw`items-center`}>
            <View style={tw`flex-row items-center mb-3  `}>
              <Text style={tw`text-white font-vazir-bold text-base`}>مقصد</Text>
            </View>
            <Text style={tw`text-white text-right font-vazir-bold text-lg`}>
              {destinationCity}
            </Text>
            <Text style={tw`text-white text-xs text-right font-vazir mt-1`}>
              {destinationProvince}
            </Text>
          </View>

          {/* Animated route line */}
          <View style={tw`flex-1 mx-4 relative justify-center items-center`}>
            <View style={tw`h-[15px]`} />
            <View style={tw`relative`}>
              <View
                style={tw`w-3 h-3 absolute -top-[18px] -right-17 rounded-full bg-white ml-2`}
              />
              <View style={tw`absolute -top-[24px] -left-18 ml-2`}>
                <FontAwesome name="map-marker" size={20} color="white" />
              </View>
              <View
                style={tw`h-[2px] w-[10px] bg-white absolute -top-[8px] -right-12`}
              />
              <View
                style={tw`h-[2px] w-[10px] bg-white absolute -top-[8px] -right-8`}
              />
              <View
                style={tw`h-[2px] w-[10px] bg-white absolute -top-[8px] -right-4`}
              />
              <View
                style={tw`h-[2px] w-[10px] bg-white absolute -top-[8px] -left-4`}
              />
              <View
                style={tw`h-[2px] w-[10px] bg-white absolute -top-[8px] -left-8`}
              />
              <View
                style={tw`h-[2px] w-[10px] bg-white absolute -top-[8px] -left-12`}
              />
            </View>
            {/* Distance indicator */}
            {distance && (
              <View
                style={tw`absolute  bg-secondary px-2 py-1 rounded-full -top-7`}
              >
                <Text style={tw`text-white text-xs font-vazir-bold`}>
                  {distance} کیلومتر
                </Text>
              </View>
            )}
          </View>

          <View style={tw`items-center `}>
            <View style={tw`flex-row items-center mb-3`}>
              <Text style={tw`text-white font-vazir-bold text-base`}>مبدا</Text>
            </View>
            <Text style={tw`text-white text-right font-vazir-bold text-lg`}>
              {originCity}
            </Text>
            <Text style={tw`text-white text-xs text-right font-vazir mt-1`}>
              {originProvince}
            </Text>
          </View>
        </View>

        {/* Details section */}
        <View style={tw`my-5 `}>
          <View style={tw`flex-row flex-wrap bg-background p-3 rounded-3`}>
            <View style={tw`w-1/2 mb-3 `}>
              <Text style={tw`text-white font-vazir text-right text-xs`}>
                نوع بار
              </Text>
              <View style={tw`flex-row items-center justify-end mt-1`}>
                <Text style={tw`text-white font-vazir-bold text-right mr-2`}>
                  {loadType}
                </Text>
                <FontAwesome name="cubes" size={14} color="#FFAA00" />
              </View>
            </View>

            <View style={tw`w-1/2 mb-3`}>
              <Text style={tw`text-white font-vazir text-right text-xs`}>
                نوع ماشین
              </Text>
              <View style={tw`flex-row items-center justify-end mt-1`}>
                <Text style={tw`text-white font-vazir-bold text-right mr-2`}>
                  {truckType || "نامشخص"}
                </Text>
                <FontAwesome name="truck" size={14} color="#FFAA00" />
              </View>
            </View>

            <View style={tw`w-1/2 mb-3`}>
              <Text style={tw`text-white font-vazir text-right text-xs`}>
                کرایه
              </Text>
              <View style={tw`flex-row items-center justify-end mt-1`}>
                <Text
                  style={tw`text-green-400 font-vazir-bold text-right mr-2 text-4`}
                >
                  {price}
                </Text>
                <FontAwesome name="money" size={14} color="#FFAA00" />
              </View>
            </View>

            <View style={tw`w-1/2 mb-3`}>
              <Text style={tw`text-white font-vazir text-right text-xs`}>
                تاریخ
              </Text>
              <View style={tw`flex-row items-center justify-end mt-1`}>
                <Text style={tw`text-white font-vazir-bold text-right mr-2`}>
                  {formattedDate}
                </Text>
                <FontAwesome name="calendar" size={14} color="#FFAA00" />
              </View>
            </View>
          </View>

          {description && (
            <View
              style={tw`mt-3 p-3 bg-gray-50 rounded-lg border border-gray-100`}
            >
              <View style={tw`flex-row items-center justify-end mb-2`}>
                <Text style={tw`text-white font-vazir-bold text-right mr-2`}>
                  توضیحات
                </Text>
                <FontAwesome name="info-circle" size={14} color="#FFAA00" />
              </View>
              <Text style={tw`text-white font-vazir text-right leading-5`}>
                {description}
              </Text>
            </View>
          )}
        </View>

        {/* Action buttons */}
        {showActions && onEdit && onRemove ? (
          <View style={tw`flex-row p-3 bg-gray-50 border-t border-gray-100`}>
            <TouchableOpacity
              onPress={onEdit}
              style={tw`flex-1 bg-primary p-3 mr-2 rounded-lg flex-row justify-center items-center`}
              activeOpacity={0.7}
            >
              <FontAwesome
                name="edit"
                size={16}
                color="white"
                style={tw`mr-2`}
              />
              <Text style={tw`text-white text-center font-vazir-bold`}>
                ویرایش
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onRemove}
              style={tw`flex-1 bg-red-500 p-3 rounded-lg flex-row justify-center items-center`}
              activeOpacity={0.7}
            >
              <FontAwesome
                name="trash"
                size={16}
                color="white"
                style={tw`mr-2`}
              />
              <Text style={tw`text-white text-center font-vazir-bold`}>
                حذف
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            onPress={handleCallOwner}
            style={tw`bg-secondary p-4 w-full flex-row justify-center items-center`}
            activeOpacity={0.8}
          >
            <FontAwesome
              name="phone"
              size={16}
              color="white"
              style={tw`mr-2`}
            />
            <Text style={tw`text-white text-center font-vazir-bold`}>
              تماس با صاحب بار
            </Text>
          </TouchableOpacity>
        )}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  cardShadow: {
    borderWidth: 1,
    borderColor: "#000",
    borderStyle: "solid"
    // backgroundColor: "transparent"
  }
});

export default CargoCard;
