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
  error?: string;
  handleChangeText: (text: string) => void;
};

const LicensePlateInput = ({
  value,
  error,
  handleChangeText
}: LicensePlateInputProps) => {
  const [plateParts, setPlateParts] = useState({
    part1: "",
    part2: "",
    part3: ""
  });

  // Refs for each part of the license plate to manage focus
  const part1Ref = useRef<TextInput>(null);
  const part2Ref = useRef<TextInput>(null);
  const part3Ref = useRef<TextInput>(null);

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

  // useEffect(() => {
  //   console.log(plateParts.part1.length, " this is plateParts");
  // }, [plateParts]);

  const handleInputChange = (part: string, text: string) => {
    const newPlateParts = { ...plateParts, [part]: text };
    console.log(newPlateParts, part, text);
    if (part === "part1") {
      if (text.length === 2) {
        handleNextFocus(part2Ref);
      } else if (text.length === 0) {
      }
    }

    if (part === "part2") {
      if (text.length === 3) {
        handleNextFocus(part3Ref);
      } else if (text.length === 0) {
        handleBackFocus(part1Ref);
      }
    }

    if (part === "part3") {
      if (text.length === 2) {
      } else if (text.length === 0) {
        handleBackFocus(part2Ref);
      }
    }

    setPlateParts(newPlateParts);
    // handleNextFocus(part2Ref);
    handleChangeText(
      `${newPlateParts.part1}-${newPlateParts.part2}-${newPlateParts.part3}`
    );
  };

  // Focus next field
  const handleNextFocus = (nextRef: React.RefObject<TextInput>) => {
    if (nextRef.current) {
      nextRef.current.focus();
    }
  };

  // Focus previous field
  const handleBackFocus = (prevRef: React.RefObject<TextInput>) => {
    if (prevRef.current) {
      prevRef.current.focus();
    }
  };

  return (
    <View style={tw`flex-col mb-3 `}>
      <Text style={tw`text-right text-background font-vazir mb-1`}>
        شماره پلاک خودرو
      </Text>
      <View
        style={tw`flex-row  items-center justify-center max-w-fit ${
          error ? "border-2 border-red-500 " : ""
        }`}
      >
        <View style={tw`flex-col items-center bg-background   px-2 py-1`}>
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
        <View style={tw`flex-row items-center `}>
          <TextInput
            style={tw`w-14 h-14 text-center text-sm border-2 border-secondary   bg-secondary font-vazir`}
            value={plateParts.part1}
            onChangeText={text => handleInputChange("part1", text)}
            onSubmitEditing={() => {
              console.log("salam");
              handleNextFocus(part2Ref);
            }}
            placeholder="_ _"
            maxLength={2}
            keyboardType={
              Platform.OS === "ios" ? "name-phone-pad" : "number-pad"
            }
            ref={part1Ref}
          />

          <TextInput
            style={tw`w-14 h-14 text-center text-sm border-2 border-secondary   bg-secondary font-vazir `}
            value={"ع"}
            editable={false}
          />

          <TextInput
            style={tw`w-18 h-14 text-center text-sm border-2 border-secondary   bg-secondary font-vazir`}
            value={plateParts.part2}
            onChangeText={text => handleInputChange("part2", text)}
            placeholder="_ _ _"
            maxLength={3}
            keyboardType={
              Platform.OS === "ios" ? "name-phone-pad" : "number-pad"
            }
            ref={part2Ref}
          />

          <View style={tw`relative`}>
            <TextInput
              style={tw`w-16 h-14 text-center text-sm border-2 border-secondary   bg-secondary font-vazir`}
              value={plateParts.part3}
              onChangeText={text => handleInputChange("part3", text)}
              placeholder="_ _"
              maxLength={2}
              keyboardType={
                Platform.OS === "ios" ? "name-phone-pad" : "number-pad"
              }
              ref={part3Ref}
            />
            <Text
              style={tw`absolute top-0 left-5 text-xs text-background font-vazir`}
            >
              ایران
            </Text>
          </View>
        </View>
      </View>

      {error && (
        <Text style={tw`text-xs text-red-500 mt-1 font-vazir text-right`}>
          {error}
        </Text>
      )}
    </View>
  );
};

export default LicensePlateInput;
