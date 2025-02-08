import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  Image,
  Platform
} from "react-native";
import tw from "@/libs/twrnc";
import { Ionicons } from "@expo/vector-icons";

type LicensePlateInputProps = {
  value: string;
  handleChangeText: (text: string) => void;
};

const LicensePlateInput = ({
  value,
  handleChangeText
}: LicensePlateInputProps) => {
  const [plateParts, setPlateParts] = useState({
    part1: "",
    part2: "",
    part3: ""
  });

  useEffect(() => {
    // Initialize plateParts from value, handle empty value
    if (value) {
      const parts = value.split("-");
      if (parts.length === 3) {
        setPlateParts({
          part1: parts[0] || "",
          part2: parts[1] || "",
          part3: parts[2] || ""
        });
      }
    }
  }, [value]);

  const handleInputChange = (part: string, text: string) => {
    const newPlateParts = { ...plateParts, [part]: text };
    setPlateParts(newPlateParts);
    handleChangeText(
      `${newPlateParts.part1}-${newPlateParts.part2}-${newPlateParts.part3}`
    );
  };

  return (
    <View style={tw`flex-col `}>
      <Text style={tw`text-right text-background font-vazir mb-1`}>
        شماره پلاک خودرو
      </Text>
      <View style={tw`flex-row gap-3 items-center`}>
        <View
          style={tw`flex-col items-center bg-background  rounded-md px-2 py-1`}
        >
          <View style={tw` justify-center items-center`}>
            <Image
              source={require("@/assets/images/iran-flag-icon.png")}
              style={tw`w-5 h-5`}
            />
          </View>
          <View style={tw`flex-col justify-center `}>
            <Text style={tw`text-[10px] text-white`}>IR</Text>
            <Text style={tw`text-[10px] text-white`}>IRAN</Text>
          </View>
        </View>
        <View style={tw`flex-row items-center gap-3`}>
          <TextInput
            style={tw`w-14 h-12 text-center text-sm border-2 border-background  rounded-md bg-secondary font-vazir`}
            value={plateParts.part1}
            onChangeText={text => handleInputChange("part1", text)}
            placeholder="_ _"
            maxLength={2}
            keyboardType={
              Platform.OS === "ios" ? "name-phone-pad" : "number-pad"
            }
          />

          <TextInput
            style={tw`w-14 h-12 text-center text-sm border-2 border-background  rounded-md bg-secondary font-vazir `}
            value={"ع"}
            editable={false}
          />

          <TextInput
            style={tw`w-18 h-12 text-center text-sm border-2 border-background  rounded-md bg-secondary font-vazir`}
            value={plateParts.part2}
            onChangeText={text => handleInputChange("part2", text)}
            placeholder="_ _ _"
            maxLength={3}
            keyboardType={
              Platform.OS === "ios" ? "name-phone-pad" : "number-pad"
            }
          />

          <View style={tw`relative`}>
            <TextInput
              style={tw`w-16 h-12 text-center text-sm border-2 border-background  rounded-md bg-secondary font-vazir`}
              value={plateParts.part3}
              onChangeText={text => handleInputChange("part3", text)}
              placeholder="_ _"
              maxLength={2}
              keyboardType={
                Platform.OS === "ios" ? "name-phone-pad" : "number-pad"
              }
            />
            <Text
              style={tw`absolute top-0 left-5 text-xs text-background font-vazir`}
            >
              ایران
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default LicensePlateInput;
