import { useState } from "react";
import {
  TextInputProps,
  KeyboardTypeOptions,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import Icons from "@/constants/Icons";
import tw from "@/libs/twrnc";

type Props = TextInputProps & {
  title: string;
  otherStyles: string;
  handleChangeText: (param: string) => void;
  color?: string;
};

const FormField = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  keyboardType,
  color,
  ...props
}: Props) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={tw`flex-1 `} //Important: Wrap everything in this view
    >
      <View style={tw`w-full  ${otherStyles}`}>
        <Text
          style={tw`text-sm text-right font-vazir mb-2  text-${
            color ?? "text"
          }`}
        >
          {title}
        </Text>

        <View
          style={tw`w-full h-12 px-4  rounded-md border-2 border-${
            color ?? "text"
          } focus:border-secondary flex flex-row items-center`}
        >
          <TextInput
            style={tw`flex-1  font-vazir text-sm text-right text-${
              color ?? "text"
            }`}
            onChangeText={handleChangeText}
            secureTextEntry={title === "Password" && !showPassword}
            keyboardType={keyboardType}
            {...props}
          />

          {title === "Password" && (
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Image
                source={!showPassword ? Icons.eye : Icons.eyeHide}
                style={tw`w-6 h-6`}
                resizeMode="contain"
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default FormField;
