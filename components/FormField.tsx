import { useState, useEffect } from "react";
import {
  TextInputProps,
  KeyboardAvoidingView,
  Platform,
  TextInput
} from "react-native";
import { View, Text, TouchableOpacity, Image } from "react-native";
import Icons from "@/constants/Icons";
import tw from "@/libs/twrnc";

type Props = TextInputProps & {
  title: string;
  otherStyles?: string;
  handleChangeText: (param: string) => void;
  onValidationChange?: (isValid: boolean) => void; // Add this prop
  color?: string;
  minLength?: number;
  maxLength?: number;
  minValue?: number;
  maxValue?: number;
  pattern?: { type: RegExp; message: string };
  successMessage?: string;
  errorMessage?: string;
  isMultiline?: boolean;
  defaultValue?: string;
};

const FormField = ({
  title,
  value,
  placeholder,
  handleChangeText,
  onValidationChange, // Destructure the new prop
  otherStyles,
  keyboardType,
  color,
  minLength,
  maxLength,
  minValue,
  maxValue,
  pattern,
  successMessage,
  errorMessage,
  isMultiline,
  defaultValue,
  ...props
}: Props) => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);

  const validateInput = (input: string) => {
    if (minLength && input.length < minLength) {
      setError(`کمترین تعداد ورودی ${minLength}`);
      onValidationChange?.(false);
      return;
    }

    if (maxLength && input.length > maxLength) {
      setError(`بیشترین تعداد ورودی ${maxLength}`);
      onValidationChange?.(false);
      return;
    }

    const numericValue = parseFloat(input);
    if (minValue && numericValue < minValue) {
      setError(`رقم باید بزرگتر از ${minValue} باشد.`);
      onValidationChange?.(false);
      return;
    }

    if (maxValue && numericValue > maxValue) {
      setError(`مقدار باید کوچکتر از ${maxValue} باشد.`);
      onValidationChange?.(false);
      return;
    }

    if (pattern?.type && !pattern.type.test(input)) {
      setError(errorMessage || pattern.message || "فرمت ورودی درست نمی‌باشد");
      onValidationChange?.(false);
      return;
    }

    setError(null);
    setSuccess(true);
    onValidationChange?.(true); // Input is valid
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (defaultValue) {
        handleChangeText(defaultValue);
      }
    }, 300); // Delay only for setting default value

    return () => clearTimeout(timeout);
  }, [defaultValue]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={tw`flex mb-5`}
    >
      <View style={tw`w-full ${otherStyles ?? ""}`}>
        <Text
          style={tw`text-sm text-right font-vazir mb-2 text-${color ?? "text"}`}
        >
          {title}
        </Text>

        <View
          style={tw.style(
            `w-full h-12 px-4 rounded-md border-2 flex flex-row items-center ${
              isMultiline ? "min-h-20" : ""
            }`,
            {
              borderColor: error
                ? tw.color("red-500")
                : success
                ? tw.color("green-500")
                : tw.color(color ?? "text")
            }
          )}
        >
          <TextInput
            multiline={isMultiline}
            style={tw`flex-1 font-vazir text-sm text-right text-${
              color ?? "text"
            }`}
            onChangeText={text => {
              handleChangeText(text);
              validateInput(text);
            }}
            selectionColor="#FFAA00"
            keyboardType={keyboardType}
            maxLength={maxLength}
            {...props}
          />
        </View>

        {error && (
          <Text style={tw`text-xs text-red-500 mt-1 font-vazir text-right`}>
            {error}
          </Text>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

export default FormField;
