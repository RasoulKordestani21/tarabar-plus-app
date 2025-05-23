import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Alert
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import tw from "@/libs/twrnc";
import moment from "jalali-moment";
import { LinearGradient } from "expo-linear-gradient";

interface CargoCardProps {
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
  onEdit?: () => void;
  onRemove?: () => void;
  onArchive?: () => void;
  showActions?: boolean;
  isExpanded?: boolean;
  onToggle?: () => void;
  cargoId: string;
}

const CargoCard: React.FC<CargoCardProps> = ({
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
  onEdit,
  onRemove,
  onArchive,
  showActions = false,
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

  const handleMoreOptions = () => {
    const options = [];

    if (onEdit) {
      options.push({
        text: "ویرایش",
        icon: "edit",
        onPress: onEdit,
        color: "#2563EB"
      });
    }

    if (onArchive) {
      options.push({
        text: "لغو بار",
        icon: "archive",
        onPress: onArchive,
        color: "#7C3AED"
      });
    }

    if (onRemove) {
      options.push({
        text: "حذف",
        icon: "trash",
        onPress: onRemove,
        color: "#DC2626"
      });
    }

    options.push({ text: "لغو", style: "cancel" });

    Alert.alert("عملیات", "یکی از گزینه‌های زیر را انتخاب کنید:", options);
  };

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

  return (
    <View style={[tw`m-3 rounded-lg overflow-hidden`, styles.cardShadow]}>
      <LinearGradient colors={["#003366", "#003366"]} style={tw`relative`}>
        {/* Status indicator */}
        <View
          style={tw`absolute top-0 left-0 z-10 py-1 px-3 rounded-bl-lg rounded-tr-lg bg-green-600`}
        >
          <Text style={tw`text-white text-xs font-vazir-bold`}>فعال</Text>
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
                    style={tw`w-3 h-3 absolute -top-[18px] -right-17 rounded-full bg-white ml-2`}
                  />
                  <View style={tw`absolute -top-[24px] -left-18 ml-2`}>
                    <FontAwesome name="map-marker" size={20} color="white" />
                  </View>
                  {/* Dotted line */}
                  {[...Array(6)].map((_, i) => (
                    <View
                      key={i}
                      style={tw`h-[2px] w-[10px] bg-white absolute -top-[8px]`}
                      style={[
                        tw`h-[2px] w-[10px] bg-white absolute -top-[8px]`,
                        { right: -48 + i * 16 }
                      ]}
                    />
                  ))}
                </View>
                {/* Distance indicator */}
                {distance && (
                  <View
                    style={tw`absolute bg-secondary px-2 py-1 rounded-full -top-7`}
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
            <Text style={tw`text-green-400 font-vazir-bold text-base`}>
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
            <View style={tw`bg-background p-3 rounded-3 mb-3`}>
              <View style={tw`flex-row flex-wrap`}>
                <View style={tw`w-1/2 mb-3`}>
                  <Text style={tw`text-white font-vazir text-right text-xs`}>
                    نوع بار
                  </Text>
                  <View style={tw`flex-row items-center justify-end mt-1`}>
                    <Text
                      style={tw`text-white font-vazir-bold text-right mr-2`}
                    >
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
                    <Text
                      style={tw`text-white font-vazir-bold text-right mr-2`}
                    >
                      {truckType || "نامشخص"}
                    </Text>
                    <FontAwesome name="truck" size={14} color="#FFAA00" />
                  </View>
                </View>

                <View style={tw`w-full mb-3`}>
                  <Text style={tw`text-white font-vazir text-right text-xs`}>
                    وضعیت
                  </Text>
                  <View style={tw`flex-row items-center justify-end mt-1`}>
                    <Text
                      style={tw`text-green-400 font-vazir-bold text-right mr-2`}
                    >
                      فعال
                    </Text>
                    <FontAwesome name="circle" size={14} color="#10B981" />
                  </View>
                </View>
              </View>
            </View>

            {/* Description */}
            {description && description !== "توضیحاتی وجود ندارد." && (
              <View style={tw`mb-3 p-3  rounded-lg border border-black-300`}>
                <View style={tw`flex-row items-center justify-end mb-2`}>
                  <Text style={tw`text-white font-vazir-bold text-right mr-2`}>
                    توضیحات
                  </Text>
                  <FontAwesome name="info-circle" size={14} color="#fff" />
                </View>
                <Text style={tw`text-white font-vazir text-right leading-5`}>
                  {description}
                </Text>
              </View>
            )}

            {/* Action buttons */}
            {showActions && (
              <View style={tw`flex-row justify-between mt-3`}>
                {onEdit && (
                  <TouchableOpacity
                    onPress={onEdit}
                    style={tw`flex-1 bg-black-500 p-3 mr-1 rounded-lg flex-row justify-center items-center`}
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
                )}

                {onArchive && (
                  <TouchableOpacity
                    onPress={onArchive}
                    style={tw`flex-1 bg-orange-600 p-3 mx-1 rounded-lg flex-row justify-center items-center`}
                    activeOpacity={0.7}
                  >
                    <FontAwesome
                      name="archive"
                      size={16}
                      color="white"
                      style={tw`mr-2`}
                    />
                    <Text style={tw`text-white text-center font-vazir-bold`}>
                      لغو بار
                    </Text>
                  </TouchableOpacity>
                )}

                {onRemove && (
                  <TouchableOpacity
                    onPress={onRemove}
                    style={tw`flex-1 bg-red-500 p-3 ml-1 rounded-lg flex-row justify-center items-center`}
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
                )}
              </View>
            )}
          </View>
        </Animated.View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  cardShadow: {
    borderWidth: 1,
    borderColor: "#000",
    borderStyle: "solid"
  }
});

export default CargoCard;
