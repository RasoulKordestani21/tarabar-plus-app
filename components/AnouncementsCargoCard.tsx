import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import tw from "@/libs/twrnc";
// import { format } from "date-fns-jalali";
import moment from "jalali-moment";

const AnouncementsCargoCard = ({ cargo, onRegister }) => {
  // Format the date to Persian (Jalali) date format
  const formatDate = dateString => {
    if (!dateString) return "نامشخص";
    try {
      const date = new Date(dateString);
      return moment(date).locale("fa").format("YYYY/MM/DD");
    } catch (error) {
      return "نامشخص";
    }
  };

  // Format price with thousands separator
  const formatPrice = price => {
    if (!price) return "توافقی";
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " تومان";
  };

  // Format distance
  const formatDistance = distance => {
    if (!distance && distance !== 0) return "نامشخص";
    return `${Math.round(distance)} کیلومتر`;
  };

  return (
    <View
      style={tw`bg-white rounded-xl shadow-md mb-4 overflow-hidden border border-gray-200`}
    >
      {/* Header - Origin to Destination */}
      <View style={tw`bg-primary p-3 flex-row justify-between items-center`}>
        <View style={tw`flex-1`}>
          <Text style={tw`text-white font-vazirBold text-base text-right`}>
            {cargo.origin.cityId ? `شهر ${cargo.origin.cityId}` : "مبدأ"}
          </Text>
          <Text style={tw`text-white text-xs text-right`}>
            {cargo.origin.provinceId
              ? `استان ${cargo.origin.provinceId}`
              : "استان نامشخص"}
          </Text>
        </View>

        <View style={tw`flex-row items-center px-2`}>
          <View style={tw`w-6 h-[1px] bg-white mx-1`} />
          <View style={tw`w-2 h-2 bg-white rounded-full`} />
          <View style={tw`w-6 h-[1px] bg-white mx-1`} />
        </View>

        <View style={tw`flex-1`}>
          <Text style={tw`text-white font-vazirBold text-base`}>
            {cargo.destination.cityId
              ? `شهر ${cargo.destination.cityId}`
              : "مقصد"}
          </Text>
          <Text style={tw`text-white text-xs`}>
            {cargo.destination.provinceId
              ? `استان ${cargo.destination.provinceId}`
              : "استان نامشخص"}
          </Text>
        </View>
      </View>

      {/* Distance Badge */}
      {cargo.originDistance !== undefined && (
        <View
          style={tw`absolute top-0 left-0 bg-yellow-500 rounded-br-lg rounded-tl-lg px-2 py-1 shadow`}
        >
          <Text style={tw`text-white font-vazirBold text-xs`}>
            {formatDistance(cargo.originDistance)}
          </Text>
        </View>
      )}

      {/* Cargo Details */}
      <View style={tw`p-4`}>
        {/* Row 1 */}
        <View style={tw`flex-row justify-between mb-3`}>
          <View style={tw`flex-1 items-start`}>
            <Text style={tw`text-gray-500 text-xs text-right mb-1`}>
              نوع بار
            </Text>
            <Text style={tw`font-vazirBold text-sm text-right`}>
              {cargo.cargoType}
            </Text>
          </View>

          <View style={tw`flex-1 items-center`}>
            <Text style={tw`text-gray-500 text-xs text-right mb-1`}>
              وزن (کیلوگرم)
            </Text>
            <Text style={tw`font-vazirBold text-sm text-right`}>
              {cargo.weight}
            </Text>
          </View>

          <View style={tw`flex-1 items-end`}>
            <Text style={tw`text-gray-500 text-xs text-right mb-1`}>
              نوع بسته‌بندی
            </Text>
            <Text style={tw`font-vazirBold text-sm text-right`}>
              {cargo.packagingType}
            </Text>
          </View>
        </View>

        {/* Row 2 */}
        <View style={tw`flex-row justify-between mb-3`}>
          <View style={tw`flex-1 items-start`}>
            <Text style={tw`text-gray-500 text-xs text-right mb-1`}>
              تاریخ آماده بودن بار
            </Text>
            <Text style={tw`font-vazirBold text-sm text-right`}>
              {formatDate(cargo.readyDate)}
            </Text>
          </View>

          <View style={tw`flex-1 items-end`}>
            <Text style={tw`text-gray-500 text-xs text-right mb-1`}>
              کرایه پیشنهادی
            </Text>
            <Text style={tw`font-vazirBold text-sm text-green-600 text-right`}>
              {formatPrice(cargo.cargoFee)}
            </Text>
          </View>
        </View>

        {/* Divider */}
        <View style={tw`h-[1px] w-full bg-gray-200 my-2`}></View>

        {/* Special Conditions */}
        {cargo.specialConditions && cargo.specialConditions.length > 0 && (
          <View style={tw`mb-3`}>
            <Text style={tw`text-gray-500 text-xs text-right mb-1`}>
              شرایط ویژه
            </Text>
            <View style={tw`flex-row flex-wrap justify-end`}>
              {cargo.specialConditions.map((condition, index) => (
                <View
                  key={index}
                  style={tw`bg-blue-100 rounded-full px-2 py-1 ml-2 mb-1`}
                >
                  <Text style={tw`text-blue-800 text-xs`}>{condition}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Notes */}
        {cargo.notes && cargo.notes.trim() !== "" && (
          <View style={tw`mb-3`}>
            <Text style={tw`text-gray-500 text-xs text-right mb-1`}>
              توضیحات
            </Text>
            <Text style={tw`text-gray-700 text-sm text-right`}>
              {cargo.notes}
            </Text>
          </View>
        )}
      </View>

      {/* Footer Actions */}
      <View
        style={tw`bg-gray-50 p-3 flex-row justify-between border-t border-gray-200`}
      >
        <TouchableOpacity
          style={tw`flex-1 bg-primary py-2 rounded-lg mr-2 items-center`}
          onPress={() => onRegister(cargo._id)}
        >
          <Text style={tw`text-white font-vazirBold text-sm`}>
            ثبت درخواست حمل
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={tw`flex-1 bg-white border border-primary py-2 rounded-lg ml-2 items-center`}
        >
          <Text style={tw`text-primary font-vazirBold text-sm`}>
            جزئیات بیشتر
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AnouncementsCargoCard;
