import { View, Text, TouchableOpacity } from "react-native";
import SearchableInput from "./SearchableInput";
import tw from "@/libs/twrnc";
import { useState, useRef } from "react";

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

interface Props {
  onClose: () => void;
}

const EstimateFareDrawer: React.FC<Props> = ({ onClose }) => {
  const [selectedOriginValue, setSelectedOriginValue] = useState("");
  const [selectedDestinationValue, setSelectedDestinationValue] = useState("");

  const [isOriginDropdownVisible, setOriginDropdownVisible] = useState(false);
  const [isDestinationDropdownVisible, setDestinationDropdownVisible] =
    useState(false);
  const originDropdownRef = useRef<View>(null);
  const destinationDropdownRef = useRef<View>(null);

  return (
    <View style={tw`flex-1 bg-white rounded-t-3xl p-4 mt-8`}>
      <SearchableInput
        title="مبدا"
        options={fakeData}
        placeholder="یکی از گزینه های زیر را انتخاب کنید."
        onSelect={value => setSelectedOriginValue(value)}
        textStyle="text-gray-600 text-right"
        containerStyle="mb-6"
        isDropdownVisible={isOriginDropdownVisible}
        onDropdownVisibilityChange={setOriginDropdownVisible}
        zIndex={isOriginDropdownVisible ? 2 : 1}
        dropdownRef={originDropdownRef}
      />
      {isOriginDropdownVisible && (
        <View style={{ zIndex: 1 }} ref={originDropdownRef}></View>
      )}
      <SearchableInput
        title="مقصد"
        options={fakeData}
        placeholder="یکی از گزینه های زیر را انتخاب کنید."
        onSelect={value => setSelectedDestinationValue(value)}
        textStyle="text-gray-600 text-right"
        containerStyle="mb-6"
        isDropdownVisible={isDestinationDropdownVisible}
        onDropdownVisibilityChange={setDestinationDropdownVisible}
        zIndex={isDestinationDropdownVisible ? 2 : 1}
        dropdownRef={destinationDropdownRef}
      />
      {isDestinationDropdownVisible && (
        <View style={{ zIndex: 1 }} ref={destinationDropdownRef}></View>
      )}
      <TouchableOpacity
        onPress={onClose}
        style={tw`rounded-lg bg-gray-300 py-2 items-center mt-5 `}
      >
        <Text style={tw`text-gray-700 font-bold `}>بستن</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EstimateFareDrawer;
