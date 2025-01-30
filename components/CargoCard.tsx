import React from "react";
import { View, Text } from "react-native";
import tw from "@/libs/twrnc";
import { FontAwesome } from "@expo/vector-icons";
import CustomButton from "./CustomButton";
import moment from "jalali-moment";
import { useGlobalContext } from "@/context/GlobalProvider";

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
  distance: string;
  onRemove: () => void; // Function to handle remove
  onEdit: () => void; // Function to handle edit
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
  onRemove,
  onEdit
}) => {
  const formattedDate = moment(date)
    .locale("fa")
    .format("HH:mm - DD / MMMM / YYYY ");

  const { role } = useGlobalContext();
  return (
    <View style={tw`bg-black-300 m-3 rounded-lg p-4`}>
      {/* Header Section */}
      <View style={tw`flex-row justify-between items-center`}>
        <Text style={tw`text-background text-sm text-right font-vazir`}>
          مقصد: {destinationCity} ({destinationProvince})
        </Text>
        <Text style={tw`text-background text-sm text-right font-vazir`}>
          مبدا: {originCity} ({originProvince})
        </Text>
      </View>
      <Text style={tw`text-background text-sm text-right font-vazir`}>
        فاصله: {distance} km
      </Text>

      {/* Details Section */}
      <View style={tw`mt-2`}>
        <Text style={tw`text-background text-sm text-right font-vazir`}>
          نوع بار: {loadType}
        </Text>
        <Text style={tw`text-background text-sm text-right font-vazir`}>
          نوع کشنده: {truckType}
        </Text>
        <Text style={tw`text-background text-sm text-right font-vazir`}>
          تاریخ: {formattedDate}
        </Text>
        <Text style={tw`text-background text-sm text-right font-vazir`}>
          توضیحات: {description}
        </Text>
        <Text style={tw`text-background text-xl text-center mt-2 font-vazir`}>
          کرایه: {price}
        </Text>
      </View>

      {/* Actions */}
      {role === "1" ? (
        <View style={tw`flex-row justify-between mt-2`}>
          <CustomButton
            title="تماس با صاحب بار "
            handlePress={onRemove}
            containerStyles="w-full bg-secondary"
          />
        </View>
      ) : (
        <View style={tw`flex-row justify-between mt-2`}>
          <CustomButton
            title="حذف"
            handlePress={onRemove}
            containerStyles="w-[48%] bg-red-500"
          />
          <CustomButton
            title="ویرایش"
            handlePress={onEdit}
            containerStyles="w-[48%] bg-yellow-500"
          />
        </View>
      )}
    </View>
  );
};

export default CargoCard;
