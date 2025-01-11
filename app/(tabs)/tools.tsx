import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal // Import Modal from react-native
} from "react-native";
import React, { useState } from "react";

import { FontAwesome } from "@expo/vector-icons";
import tw from "@/libs/twrnc";
import EstimateFareDrawer from "@/components/EstimateFareDrawer";

export default function ToolsScreen() {
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <ScrollView style={tw`flex-1 p-4`}>
      <View style={tw`flex-wrap flex-row justify-between`}>
        <TouchableOpacity
          style={tw`bg-green-50 rounded-lg mb-5 w-full`}
          onPress={toggleModal}
        >
          <View style={tw`flex-row items-center p-4`}>
            <FontAwesome
              name="caret-left"
              size={28}
              style={tw`text-white mr-2`}
            />
            <View style={tw`flex-1 mr-4 ml-2`}>
              <Text
                style={tw`text-background text-lg  mb-1 text-right font-vazir-bold`}
              >
                تخمین کرایه۰۹۳
              </Text>
              <View style={tw`w-full h-[1px] bg-text mb-5 mt-1`}></View>
              <Text style={tw`text-white text-sm text-right font-vazir`}>
                در قسمت تخمین کرایه شما می توانید با تعیین مبدا، مقصد و هموسين
                نوع بار کرایه بار خود را محاسبه کنید
              </Text>
            </View>
            <FontAwesome
              name="calculator"
              size={24}
              style={tw`text-background`}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={tw`bg-green-50 rounded-lg mb-5 w-full`}>
          <View style={tw`flex-row items-center p-4`}>
            <FontAwesome
              name="caret-left"
              size={28}
              style={tw`text-white mr-2 rotate-180`}
            />
            <View style={tw`flex-1 mr-4 ml-2`}>
              <Text
                style={tw`text-background text-lg  mb-1 text-right font-vazir-bold`}
              >
                تخمین کمیسیون
              </Text>
              <View style={tw`w-full h-[1px] bg-text mb-5 mt-3`}></View>
              <Text style={tw`text-white text-sm text-right font-vazir`}>
                با استفاده از تخمین کمیسیون ، شما می توانید کمیسیون بار خود را
                تخمین زده و به صورت بارهای این را مشاهده کنید
              </Text>
            </View>
            <FontAwesome name="desktop" size={24} style={tw`text-background`} />
          </View>
        </TouchableOpacity>
      </View>

      <Modal
        visible={isModalVisible}
        transparent={true}
        onRequestClose={toggleModal}
      >
        <View style={tw`flex-1`}>
          <EstimateFareDrawer onClose={toggleModal} />
        </View>
      </Modal>
    </ScrollView>
  );
}
