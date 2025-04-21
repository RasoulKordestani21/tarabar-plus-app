import React from "react";
import { View, Text, TouchableOpacity, Linking } from "react-native";
import tw from "@/libs/twrnc";
import { FontAwesome } from "@expo/vector-icons";
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
  ownerPhone: string;
  onRemove: () => void;
  onEdit: () => void;
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
  onRemove,
  onEdit
}) => {
  const formattedDate = moment(date)
    .locale("fa")
    .format("YYYY/MM/DD");

  const { role } = useGlobalContext();
  
  const handleCallOwner = () => {
    Linking.openURL(`tel:${ownerPhone}`);
  };

  return (
    <View style={tw`bg-white m-3 rounded-lg overflow-hidden shadow-md`}>
      {/* Header with origin/destination */}
      <View style={tw`p-4`}>
        <View style={tw`flex-row justify-between mb-1`}>
          {/* Origin with green dot */}
          <View style={tw`flex-row items-center`}>
            <View style={tw`w-2 h-2 rounded-full bg-green-500 mr-1`} />
            <Text style={tw`text-black-800 font-vazir-bold`}>مبدا</Text>
          </View>
          
          {/* Destination with green dot */}
          <View style={tw`flex-row items-center`}>
            <View style={tw`w-2 h-2 rounded-full bg-green-500 mr-1`} />
            <Text style={tw`text-black-800 font-vazir-bold`}>مقصد</Text>
          </View>
        </View>
        
        <View style={tw`flex-row justify-between items-center`}>
          {/* Origin city/province */}
          <View>
            <Text style={tw`text-primary text-right font-vazir-bold`}>{originCity}</Text>
            <Text style={tw`text-black-500 text-xs text-right font-vazir`}>{originProvince}</Text>
          </View>
          
          {/* Route line */}
          <View style={tw`flex-1 mx-4 h-[1px] border-t-2 border-dashed border-primary`} />
          
          {/* Destination city/province */}
          <View>
            <Text style={tw`text-primary text-right font-vazir-bold`}>{destinationCity}</Text>
            <Text style={tw`text-black-500 text-xs text-right font-vazir`}>{destinationProvince}</Text>
          </View>
        </View>
      </View>
      
      {/* Divider */}
      <View style={tw`h-[1px] bg-gray-200 w-full`} />
      
      {/* Details section */}
      <View style={tw`p-4`}>
        <View style={tw`flex-row justify-between mb-2`}>
          <Text style={tw`text-black-800 font-vazir`}>{loadType}</Text>
          <Text style={tw`text-black-500 font-vazir`}>نوع بار</Text>
        </View>
        
        <View style={tw`flex-row justify-between mb-2`}>
          <Text style={tw`text-black-800 font-vazir`}>{`${price} تومان`}</Text>
          <Text style={tw`text-black-500 font-vazir`}>کرایه / قیمت</Text>
        </View>
        
        <View style={tw`flex-row justify-between`}>
          <Text style={tw`text-black-800 font-vazir`}>{formattedDate}</Text>
          <Text style={tw`text-black-500 font-vazir`}>تاریخ</Text>
        </View>
      </View>
      
      {/* Call button */}
      <TouchableOpacity 
        onPress={handleCallOwner}
        style={tw`bg-primary p-3 w-full`}
      >
        <Text style={tw`text-white text-center font-vazir-bold`}>تماس با صاحب بار</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CargoCard;
