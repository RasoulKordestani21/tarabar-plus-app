import tw from "@/libs/twrnc";
import { FontAwesome } from "@expo/vector-icons";
import { FormikErrors } from "formik";
import { useState, useEffect } from "react";
import { Pressable, Text, View } from "react-native";

const options = [
  { title: "سرویسی", id: "2" },
  { title: "تناژی", id: "3" }
];

const RadioInput = ({
  value,
  formikError,
  handleChangeOption,
  // ADDED: defaultValue prop for initial selection
  defaultValue
}: {
  value: string;
  formikError?:
    | string
    | FormikErrors<any>
    | string[]
    | FormikErrors<any>[]
    | undefined;
  handleChangeOption: (selectedItem: string) => void;
  // ADDED: Optional defaultValue prop
  defaultValue?: string;
}) => {
  // ADDED: Handle initial value setting
  useEffect(() => {
    // If there's a defaultValue and no current value, set it
    if (defaultValue && !value && handleChangeOption) {
      handleChangeOption(defaultValue);
    }
  }, [defaultValue, value, handleChangeOption]);

  return (
    <View
      style={tw`flex-col mt-3 mb-0 w-full ${formikError ? "bg-red-100" : ""}`}
    >
      <Text style={tw`text-background text-right font-vazir`}>نوع حمل</Text>
      <View style={tw`w-full flex-row-reverse`}>
        <View style={tw`flex-row gap-5 mt-2`}>
          {options.map(ele => {
            const isSelected = (value || defaultValue) === ele.id;

            return (
              <Pressable
                key={ele.id}
                style={tw`font-vazir flex-row items-center gap-1`}
                onPress={() => {
                  handleChangeOption(ele.id);
                }}
              >
                <Text style={tw`font-vazir text-background mb-2`}>
                  {ele.title}
                </Text>
                <FontAwesome
                  size={24}
                  name={isSelected ? "dot-circle-o" : "circle"}
                  style={tw`text-background`}
                />
              </Pressable>
            );
          })}
        </View>
      </View>
      {formikError && (
        <Text style={tw`text-xs text-red-500 mt-1 font-vazir text-right`}>
          {typeof formikError === "string" ? formikError : ""}
        </Text>
      )}
    </View>
  );
};

export default RadioInput;
