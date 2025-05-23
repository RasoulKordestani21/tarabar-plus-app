import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import tw from "@/libs/twrnc";
import moment from "jalali-moment";
import { LinearGradient } from "expo-linear-gradient";

interface ArchivedCargoCardProps {
  originCity: string;
  originProvince: string;
  destinationCity: string;
  destinationProvince: string;
  distance: string;
  truckType: string;
  loadType: string;
  ownerPhone: string;
  date: string;
  description: string;
  price: string;
  status?: string;
  onViewDetails?: () => void;
  onRestore?: () => void;
  isExpanded?: boolean;
  onToggle?: () => void;
  cargoId: string;
}

const ArchivedCargoCard: React.FC<ArchivedCargoCardProps> = ({
  originCity,
  originProvince,
  destinationCity,
  destinationProvince,
  distance,
  truckType,
  loadType,
  ownerPhone,
  date,
  description,
  price,
  status = "completed",
  onViewDetails,
  onRestore,
  isExpanded = false,
  onToggle,
  cargoId
}) => {
  const [animatedHeight] = useState(new Animated.Value(isExpanded ? 1 : 0));
  const formattedDate = moment(date).locale("fa").format("YYYY/MM/DD");

  useEffect(() => {
    Animated.timing(animatedHeight, {
      toValue: isExpanded ? 1 : 0,
      duration: 300,
      useNativeDriver: false
    }).start();
  }, [isExpanded]);

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "completed":
        return {
          label: "تکمیل شده",
          color: "#4CAF50",
          icon: "check-circle"
        };
      case "cancelled":
        return {
          label: "لغو شده",
          color: "#F44336",
          icon: "times-circle"
        };
      case "expired":
        return {
          label: "منقضی شده",
          color: "#FF9800",
          icon: "clock-o"
        };
      default:
        return {
          label: "آرشیو شده",
          color: "#757575",
          icon: "archive"
        };
    }
  };

  const statusInfo = getStatusInfo(status);

  const animatedStyle = {
    maxHeight: animatedHeight.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 400]
    }),
    opacity: animatedHeight.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1]
    })
  };

  // Use a darker gradient for archived items
  const gradientColors = ["#374151", "#374151"];

  return (
    <View style={[tw`m-3 rounded-lg overflow-hidden`, styles.cardShadow]}>
      <LinearGradient colors={gradientColors} style={tw`relative`}>
        {/* Status indicator */}
        <View
          style={[
            tw`absolute top-0 left-0 z-10 py-1 px-3 rounded-bl-lg rounded-tr-lg`,
            { backgroundColor: statusInfo.color }
          ]}
        >
          <Text style={tw`text-white text-xs font-vazir-bold`}>
            {statusInfo.label}
          </Text>
        </View>

        {/* Expandable Header */}
        <TouchableOpacity onPress={onToggle} style={tw`p-3`}>
          <View style={tw`flex-row justify-between items-center mt-8`}>
            {/* Route display */}
            <View
              style={tw`flex-row justify-between items-center flex-1 p-1 rounded-3`}
            >
              <View style={tw`items-center`}>
                <Text style={tw`text-white font-vazir-bold text-base mb-1`}>
                  مقصد
                </Text>
                <Text style={tw`text-white text-right font-vazir-bold text-lg`}>
                  {destinationCity}
                </Text>
                <Text style={tw`text-white text-xs text-right font-vazir mt-1`}>
                  {destinationProvince}
                </Text>
              </View>

              {/* Animated route line */}
              <View
                style={tw`flex-1 mx-4 relative justify-center items-center`}
              >
                <View style={tw`h-[15px]`} />
                <View style={tw`relative`}>
                  <View
                    style={tw`w-3 h-3 absolute -top-[20px] -right-17 rounded-full bg-[#9CA3AF] ml-2`}
                  />
                  <View style={tw`absolute -top-[24px] -left-18 ml-2`}>
                    <FontAwesome name="map-marker" size={20} color="#9CA3AF" />
                  </View>
                  {/* Dotted line */}
                  {[...Array(6)].map((_, i) => (
                    <View
                      key={i}
                      style={[
                        tw`h-[2px] w-[10px] bg-secondary absolute -top-[8px]`,
                        { right: -48 + i * 16 }
                      ]}
                    />
                  ))}
                </View>
                {/* Distance indicator */}
                {distance && (
                  <View
                    style={tw`absolute bg-black-800 px-2 py-1 rounded-full -top-7`}
                  >
                    <Text style={tw`text-white text-xs font-vazir-bold`}>
                      {distance} کیلومتر
                    </Text>
                  </View>
                )}
              </View>

              <View style={tw`items-center`}>
                <Text style={tw`text-white font-vazir-bold text-base mb-1`}>
                  مبدا
                </Text>
                <Text style={tw`text-white text-right font-vazir-bold text-lg`}>
                  {originCity}
                </Text>
                <Text style={tw`text-white text-xs text-right font-vazir mt-1`}>
                  {originProvince}
                </Text>
              </View>
            </View>

            {/* Expand/Collapse Icon */}
            <View style={tw`ml-3`}>
              <FontAwesome
                name={isExpanded ? "chevron-up" : "chevron-down"}
                size={16}
                color="white"
              />
            </View>
          </View>

          {/* Quick Info Row */}
          <View style={tw`flex-row justify-between items-center mt-4 px-2`}>
            <Text style={tw`text-secondary font-vazir-bold text-base`}>
              {price}
            </Text>
            <Text style={tw`text-white text-xs font-vazir`}>
              {formattedDate}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Expandable Content */}
        <Animated.View style={[animatedStyle, tw`overflow-hidden`]}>
          <View style={tw`px-3 pb-3`}>
            {/* Details section */}
            <View style={tw`bg-gray-700 p-3 rounded-3 mb-3`}>
              <View style={tw`flex-row flex-wrap`}>
                <View style={tw`w-1/2 mb-3`}>
                  <Text
                    style={tw`text-secondary font-vazir text-right text-xs`}
                  >
                    نوع بار
                  </Text>
                  <View style={tw`flex-row items-center justify-end mt-1`}>
                    <Text
                      style={tw`text-white font-vazir-bold text-right mr-2`}
                    >
                      {loadType}
                    </Text>
                    <FontAwesome name="cubes" size={14} color="#9CA3AF" />
                  </View>
                </View>

                <View style={tw`w-1/2 mb-3`}>
                  <Text
                    style={tw`text-secondary font-vazir text-right text-xs`}
                  >
                    نوع ماشین
                  </Text>
                  <View style={tw`flex-row items-center justify-end mt-1`}>
                    <Text
                      style={tw`text-white font-vazir-bold text-right mr-2`}
                    >
                      {truckType || "نامشخص"}
                    </Text>
                    <FontAwesome name="truck" size={14} color="#9CA3AF" />
                  </View>
                </View>

                <View style={tw`w-full mb-3 `}>
                  <Text
                    style={tw`text-secondary  font-vazir text-right text-xs`}
                  >
                    وضعیت
                  </Text>
                  <View style={tw`flex-row items-center justify-end mt-1`}>
                    <Text
                      style={[
                        tw`font-vazir-bold text-right mr-2 text-text`
                        // { color: statusInfo.color }
                      ]}
                    >
                      {statusInfo.label}
                    </Text>
                    <FontAwesome name={"archive"} size={14} color={"#9CA3AF"} />
                  </View>
                </View>
              </View>
            </View>

            {/* Description */}
            {description && description !== "توضیحاتی وجود ندارد." && (
              <View
                style={tw`mb-3 p-3 bg-gray-100 rounded-lg border border-black-300`}
              >
                <View style={tw`flex-row items-center justify-end mb-2`}>
                  <Text
                    style={tw`text-black-100 font-vazir-bold text-right mr-2`}
                  >
                    توضیحات
                  </Text>
                  <FontAwesome name="info-circle" size={14} color="#ddd" />
                </View>
                <Text
                  style={tw`text-black-300 font-vazir text-right leading-5`}
                >
                  {description}
                </Text>
              </View>
            )}

            {/* Action buttons */}
            <View style={tw`flex-row justify-between mt-3`}>
              {onRestore && (
                <TouchableOpacity
                  onPress={onRestore}
                  style={tw`flex-1 bg-green-600 p-3 mr-1 rounded-lg flex-row justify-center items-center`}
                  activeOpacity={0.7}
                >
                  <FontAwesome
                    name="undo"
                    size={16}
                    color="white"
                    style={tw`mr-2`}
                  />
                  <Text style={tw`text-white text-center font-vazir-bold`}>
                    بازگردانی
                  </Text>
                </TouchableOpacity>
              )}

              {onViewDetails && (
                <TouchableOpacity
                  onPress={onViewDetails}
                  style={tw`flex-1 bg-gray-600 p-3 ml-1 rounded-lg flex-row justify-center items-center`}
                  activeOpacity={0.7}
                >
                  <FontAwesome
                    name="eye"
                    size={16}
                    color="white"
                    style={tw`mr-2`}
                  />
                  <Text style={tw`text-white text-center font-vazir-bold`}>
                    جزئیات
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </Animated.View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  cardShadow: {
    borderWidth: 1,
    borderColor: "#666",
    borderStyle: "solid"
  }
});

export default ArchivedCargoCard;
