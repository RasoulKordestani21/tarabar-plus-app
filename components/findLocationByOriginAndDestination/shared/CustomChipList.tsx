import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Pressable
} from "react-native";
import tw from "@/libs/twrnc";
import { Route } from "expo-router";
import CustomButton from "../../CustomButton";
import { FontAwesome } from "@expo/vector-icons";

type CustomChipListProps = {
  selectedItems: {
    itemId: number;
    itemName: string;
  }[];
  removeSelecteditems: (
    item: {
      itemId: number;
    },
    itemType: "origin" | "destination" | null
  ) => void;
  labelOfSelectedItems: string;
  itemType: "origin" | "destination" | null;
  handleRemoveAll: (type: string) => void;
};

const CustomChipList: React.FC<CustomChipListProps> = ({
  selectedItems,
  removeSelecteditems,
  labelOfSelectedItems,
  itemType,
  handleRemoveAll
}) => {
  return (
    <View style={tw`flex-col items-end mt-1 `}>
      <View style={tw`flex-row-reverse justify-between w-full`}>
        <Text style={tw`text-right font-vazir text-sm mt-1`}>
          {labelOfSelectedItems}
        </Text>
        <CustomButton
          title=" x حذف همه"
          handlePress={() => {
            if (itemType) {
              handleRemoveAll(itemType);
            }
          }}
          containerStyles="bg-card p-0 px-1"
          textStyles="text-sm"
        />
      </View>
      <ScrollView
        showsHorizontalScrollIndicator
        horizontal
        contentContainerStyle={tw`flex-row-reverse`} // Reverse the content direction
      >
        <View style={tw`flex-row-reverse   my-2 p-1 rounded-3`}>
          {selectedItems.map((item, index) => (
            <Pressable
              key={index}
              style={tw` px-2 py-1 rounded-lg mr-2 mb-2 flex-row items-center border-2 border-primary gap-3 bg-text`}
              onPress={() => removeSelecteditems(item, itemType)}
            >
              <FontAwesome name={"close"} size={14} style={tw`text-primary`} />
              <Text
                style={tw`text-[12px] text-right font-vazir text-background`}
              >{`${item.itemName}`}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default CustomChipList;
