import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  Modal,
  Pressable,
  Platform,
  Alert,
  Linking
} from "react-native";
import tw from "@/libs/twrnc";
import { Feather } from "@expo/vector-icons";
import * as Location from "expo-location";
import DropdownInput from "./DropdownInput";
import CustomButton from "./CustomButton";

type DefineOriginDestinationProps = {
  visible: boolean;
  onClose: () => void;
};

interface Option {
  label: string;
  value: string;
}

const fakeData: Option[] = [
  { label: "تهران", value: "tehran" },
  { label: "مشهد", value: "mashhad" },
  { label: "اصفهان", value: "esfahan" },
  { label: "تبریز", value: "tabriz" },
  { label: "آستانه اشرفیه / گیلان", value: "astaneh-ashrafieh" },
  { label: "تربت جام / خراسان رضوی", value: "torbat-jam" },
  { label: "تربت ی", value: "sfjdk" }
];

const DefineOriginDestination: React.FC<DefineOriginDestinationProps> = ({
  visible,
  onClose
}) => {
  const [form, setForm] = useState<{
    origin: string | null;
    destination: string | null;
  }>({ origin: null, destination: null });

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={tw`flex-1 justify-center items-center bg-black-500`}>
        <View style={tw`bg-white m-5 rounded-lg p-5 w-[90%] max-w-md`}>
          {/* Close Icon Added Here */}
          <Pressable onPress={onClose} style={tw`absolute top-5 left-2 z-10`}>
            <Feather name="x" size={28} style={tw`text-background`} />
          </Pressable>
          <Text
            style={tw`text-center font-vazir-bold  mb-4 text-xl text-background`}
          >
            جستجو با مبدا و
          </Text>
          <View style={tw`w-full h-[1px] bg-text mb-5 mt-3`}></View>
          <View style={tw`items-center`}>
            <Image
              source={require("@/assets/images/define-origin-destination.png")}
              style={tw`h-40 w-40`}
              resizeMode="contain"
            />
          </View>

          <DropdownInput
            title="مبدا"
            options={fakeData}
            placeholder="یکی از گزینه های زیر را انتخاب کنید."
            onSelect={value => setForm({ ...form, origin: value })}
            textStyle="text-right"
            containerStyle="mb-6 "
            iconName={"dot-circle-o"}
          />

          <DropdownInput
            title="مقصد"
            options={fakeData}
            placeholder="یکی از گزینه های زیر را انتخاب کنید."
            onSelect={value => setForm({ ...form, destination: value })}
            textStyle="text-right"
            containerStyle="mb-6"
            iconName={"location-arrow"}
          />

          <CustomButton
            title="یافتن بار"
            handlePress={() => {}}
            containerStyles="bg-background mt-10"
          />
          <CustomButton
            title="بستن"
            handlePress={() => {}}
            containerStyles="bg-background bg-white border-background border-2 mt-3"
            textStyles="text-background"
          />
        </View>
      </View>
    </Modal>
  );
};

export default DefineOriginDestination;
