import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  Pressable
} from "react-native";
import tw from "@/libs/twrnc";
import { router, Route } from "expo-router";

type Box = {
  id: number;
  source: any;
  text: string;
  route: Route;
};

export default function HomeScreen() {
  const [modalVisible, setModalVisible] = useState(false);

  const handleCargoByLocationPress = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const boxes: Box[] = [
    {
      id: 1,
      source: require("@/assets/images/find-cargo-by-origin-destination-icon.png"),
      text: "باریابی با مبدا و مقصد",
      route: "/find-cargo-by-origin-destination"
    },
    {
      id: 2,
      source: require("@/assets/images/find-cargo-by-location-icon.png"),
      text: "باریابی با موقعیت جغرافیایی",
      route: "/find-cargo-by-location"
    },
    {
      id: 3,
      source: require("@/assets/images/tools-icon.png"),
      text: "ابزار",
      route: "/tools"
    },
    {
      id: 4,
      source: require("@/assets/images/account-icon.png"),
      text: "حساب کاربری",
      route: "/account"
    },
    {
      id: 5,
      source: require("@/assets/images/support-icon.png"),
      text: "پشتیبانی",
      route: "/support"
    },
    {
      id: 6,
      source: require("@/assets/images/inquiries-icon.png"),
      text: "استعلام ها",
      route: "/inquiries"
    }
  ];

  return (
    <ScrollView style={tw`flex-1  `} contentContainerStyle={tw`p-4`}>
      <View style={tw`flex-wrap flex-row justify-between`}>
        {boxes.map(box => (
          <TouchableOpacity
            key={box.id}
            onPress={() => {
              if (box.route === "/find-cargo-by-location") {
                handleCargoByLocationPress();
              } else {
                router.push(box.route);
              }
            }}
            style={tw`w-[48%] mb-4  bg-sky rounded-lg items-center p-4`}
          >
            <Image
              source={box.source}
              style={tw`h-20 w-20`}
              resizeMode="contain"
            />
            <View style={tw`w-full h-[1px] bg-text mb-5 mt-3`}></View>
            <Text style={tw`text-center font-vazir text-text`}>{box.text}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={tw`flex-1 justify-center items-center bg-black/50`}>
          <View style={tw`bg-white m-5 rounded-lg p-5 w-[90%] max-w-md`}>
            <Text style={tw`text-center font-bold mb-4 text-xl`}>
              جستجو با موقعیت مکانی
            </Text>
            <View style={tw`w-full h-[1px] bg-text mb-5 mt-3`}></View>
            <View style={tw`items-center`}>
              <Image
                source={require("@/assets/images/map-location.png")}
                style={tw`h-40 w-40`}
                resizeMode="contain"
              />
            </View>
            <Text style={tw`text-center text-gray-600 px-6 mb-4`}>
              توجه : {"\n"}
              برای استفاده از این گزینه برنامه نیازمند موقعیت فعلی شما میباشد
              لذا با فعال سازی موقعیت مکانی می توانید بارهای موجود در اطراف خود
              را مشاهده نمایید
            </Text>
            <Pressable
              style={tw`bg-green-500 rounded-lg p-3 items-center mt-2 shadow-sm`}
              onPress={closeModal}
            >
              <Text style={tw`text-white font-bold text-center`}>
                فعال سازی GPS
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
