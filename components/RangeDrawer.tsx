import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Modal,
  TouchableWithoutFeedback,
  SafeAreaView,
  TouchableOpacity
} from "react-native";
import tw from "@/libs/twrnc";
import { FontAwesome } from "@expo/vector-icons";

interface FeeRangeDrawerProps {
  isVisible?: boolean;
  onClose: () => void;
  minFee: number;
  maxFee: number;
  currency?: string;
  description?: string;
}

const FeeRangeDrawer: React.FC<FeeRangeDrawerProps> = ({
  isVisible,
  onClose,
  minFee,
  maxFee,
  currency = "تومان",
  description
}) => {
  const formatNumber = (num: number) => {
    return num.toLocaleString("fa");
  };
  console.log(minFee, maxFee);
  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <SafeAreaView style={tw`flex-1 justify-end bg-black/60`}>
        <TouchableWithoutFeedback
          onPress={onClose}
          style={tw`flex-1 absolute top-0 left-0 w-full h-full bg-transparent z-0`}
        >
          <View
            style={tw`flex-1 absolute top-0 left-0 w-full h-full bg-transparent z-0`}
          ></View>
        </TouchableWithoutFeedback>

        <View style={tw`bg-text rounded-t-3xl  p-4 z-50  h-[90%]`}>
          <TouchableOpacity
            onPress={onClose}
            style={tw`absolute top-2 left-2 z-10`}
          >
            <FontAwesome name={"close"} size={24} color="#888" />
          </TouchableOpacity>
          <View style={tw`items-center`}>
            <Image
              source={require("@/assets/images/driver-calculator-icon.png")}
              style={tw`w-40 h-40 mb-4`}
              resizeMode="contain"
            />

            <View style={tw`px-4`}>
              <Text style={tw`text-background text-sm font-vazir text-center`}>
                مطابق محاسبات انجام شده نرخ کرایه تخمین زده شده
                <Text style={tw`text-green-500 `}>{formatNumber(minFee)}</Text>
                <Text style={tw`text-background`}> تومان تا </Text>
                <Text style={tw`text-red-500`}> {formatNumber(maxFee)} </Text>
                <Text style={tw`text-background`}> تومان است. </Text>
              </Text>
            </View>

            {description && (
              <Text
                style={tw`text-sm font-vazir text-gray-600 text-center mt-3`}
              >
                {description}
              </Text>
            )}

            <View style={tw`flex-row items-center mt-4 w-full px-5`}>
              <View style={tw`bg-green-100 rounded-md `}>
                <Text style={tw`text-xs font-vazir text-green-500 p-2`}>
                  {formatNumber(minFee)} {currency}
                </Text>
              </View>
              <View style={styles.gradientContainer}>
                <View style={styles.gradientLineGreen} />
                <View style={styles.gradientLineRed} />
              </View>
              <View style={tw` bg-red-100 rounded-md`}>
                <Text style={tw`text-xs font-vazir text-red-500 p-2`}>
                  {formatNumber(maxFee)} {currency}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
    height: 4,
    borderRadius: 4,
    overflow: "hidden",
    flexDirection: "row"
  },
  gradientLineGreen: {
    flex: 0.5,
    backgroundColor: "#22c55e",
    height: 4
  },
  gradientLineRed: {
    flex: 0.5,
    backgroundColor: "#dc2626",
    height: 4
  }
});
export default FeeRangeDrawer;
