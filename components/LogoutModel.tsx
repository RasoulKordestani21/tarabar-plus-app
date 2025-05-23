// components/LogoutModal.tsx
import React from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import tw from "@/libs/twrnc";
import { FontAwesome } from "@expo/vector-icons";

type LogoutModalProps = {
  visible: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

const LogoutModal: React.FC<LogoutModalProps> = ({
  visible,
  onConfirm,
  onClose
}) => {
  return (
    <Modal transparent={true} visible={visible} onRequestClose={onClose}>
      <View
        style={tw`flex-1 justify-center items-center bg-black-50 bg-opacity-50`}
      >
        <View style={tw`bg-white rounded-2xl p-5 w-[85%] max-w-md`}>
          <View style={tw`items-center mb-3`}>
            <FontAwesome name="sign-out" size={24} color="#003366" />
          </View>

          <Text style={tw`text-base mb-4 text-right font-vazir`}>
            آیا مطمئن هستید که می‌خواهید از حساب کاربری خارج شوید ؟
          </Text>

          <View style={tw`flex-row-reverse justify-between`}>
            <TouchableOpacity
              style={tw`bg-secondary py-3 px-10 rounded-lg`}
              onPress={onConfirm}
            >
              <Text style={tw`text-white font-vazir text-center`}>بله</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={tw`bg-black-100 py-3 px-10 rounded-lg border-2 border-background`}
              onPress={onClose}
            >
              <Text style={tw`font-vazir text-center text-background`}>
                خیر
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default LogoutModal;
