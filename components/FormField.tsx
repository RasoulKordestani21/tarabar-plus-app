import { useState } from "react";
import { TextInputProps, KeyboardTypeOptions } from "react-native";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import Icons from "@/constants/Icons";
import tw from "@/libs/twrnc";

type Props = TextInputProps & {
  title: string;
  otherStyles: string;
  handleChangeText: (param: string) => void;
};

const FormField = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  keyboardType,
  ...props
}: Props) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={tw`w-full  ${otherStyles}`}>
      <Text style={tw`text-base text-text text-right font-vazir mb-2`}>
        {title}
      </Text>

      <View
        style={tw`w-full h-16 px-4  rounded-2xl border-2 border-text focus:border-secondary flex flex-row items-center`}
      >
        <TextInput
          style={tw`flex-1 text-text font-vazir text-base text-right`}
          // value={value}
          // placeholder={placeholder}
          // placeholderTextColor="#ffffff"
          // onChangeText={handleChangeText}
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
  );
};

export default FormField;
