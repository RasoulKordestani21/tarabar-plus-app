// components/VerificationModal.tsx
import React from "react";
import { Modal, Text, View, TouchableOpacity, Image } from "react-native";
import { router } from "expo-router";
import tw from "@/libs/twrnc";
import { FontAwesome } from "@expo/vector-icons";

type VerificationModalProps = {
  visible: boolean;
  onClose: () => void;
  route: String;
};

const VerificationModal = ({
  visible,
  onClose,
  route
}: VerificationModalProps) => {
  const handleCompleteProfile = () => {
    onClose();
    router.push(route);
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View
        style={tw`flex-1 justify-center items-center bg-black-50 bg-opacity-50`}
      >
        <View style={tw`bg-white rounded-2xl p-5 w-[85%] max-w-md`}>
          <View style={tw`items-center mb-3`}>
            <FontAwesome
              name="user"
              size={40}
              color="#FFAA00"
              style={tw`mt-2`}
            />
            <Text style={tw`text-lg  font-vazir-bold text-center`}>
              تکمیل اطلاعات کاربری
            </Text>
          </View>

          <Text style={tw`text-base mb-4 text-right font-vazir`}>
            اطلاعات کاربری شما تکمیل نشده است با تکمیل اطلاعات خود میتوانید از
            100,000 شارژ اولیه برخوردار شوید.
          </Text>

          <View style={tw`flex-row-reverse justify-between`}>
            <TouchableOpacity
              style={tw`bg-secondary py-3 px-5 rounded-lg`}
              onPress={handleCompleteProfile}
            >
              <Text style={tw`text-white font-vazir text-center`}>
                تکمیل اطلاعات
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={tw`bg-gray-300 py-3 px-5 rounded-lg`}
              onPress={onClose}
            >
              <Text style={tw`font-vazir text-center`}>بعداً</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default VerificationModal;
