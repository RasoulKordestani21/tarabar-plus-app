import { useState } from "react";
import { Modal, Text, View, TouchableOpacity } from "react-native";
import tw from "@/libs/twrnc"; // Importing Tailwind classes

type CustomToastTypes = {
  visible: boolean;
  message: string;
  onClose: () => void;
  type: string;
};

const CustomToast = ({ visible, message, onClose, type }: CustomToastTypes) => {
  // Set styles based on the `type` (success, pending, or error)
  let toastStyles = {};
  let toastTextStyles = {};
  let closeButtonStyles = {};

  switch (type) {
    case "success":
      toastStyles = tw`bg-green-500`; // Tailwind green for success
      toastTextStyles = tw`text-white`;
      closeButtonStyles = tw`text-white`;
      break;
    case "pending":
      toastStyles = tw`bg-yellow-500`; // Tailwind yellow for pending
      toastTextStyles = tw`text-white`;
      closeButtonStyles = tw`text-white`;
      break;
    case "error":
      toastStyles = tw`bg-red-500`; // Tailwind red for error
      toastTextStyles = tw`text-white`;
      closeButtonStyles = tw`text-white`;
      break;
    default:
      toastStyles = tw`bg-gray-500`; // Default gray if no type is specified
      toastTextStyles = tw`text-white`;
      closeButtonStyles = tw`text-white`;
  }

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View
        style={tw`flex-1  justify-start items-center bg-black bg-opacity-50`} // Align items to the top
      >
        <View
          style={[
            tw`p-4 rounded-lg min-w-[300px]  `,
            toastStyles,
            { position: "absolute", top: 50 }
          ]}
        >
          <Text
            style={[tw`text-lg mb-3 text-right font-vazir`, toastTextStyles]}
          >
            {message}
          </Text>
          <TouchableOpacity onPress={onClose}>
            <Text
              style={[tw`text-sm underline font-vazir `, closeButtonStyles]}
            >
              بستن
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CustomToast;
