import tw from "@/libs/twrnc";
import { FontAwesome } from "@expo/vector-icons";
import { FormikErrors } from "formik";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

const options = [
  { title: "دربستی", id: "1" },
  { title: "سرویسی", id: "2" },
  { title: "تناژی", id: "3" }
];
const RadioInput = ({
  value,
  formikError,
  handleChangeOption
}: {
  value: string;
  formikError?:
    | string
    | FormikErrors<any>
    | string[]
    | FormikErrors<any>[]
    | undefined;
  handleChangeOption: (selectedItem: string) => void;
}) => {
  const [transportType, setTransportType] = useState<number>();
  return (
    <View style={tw`flex-col  w-full ${formikError ? "bg-red-100" : ""}`}>
      <Text style={tw`text-background text-right font-vazir`}>نوع حمل</Text>
      <View style={tw`w-full flex-row-reverse`}>
        <View style={tw` flex-row gap-5 mt-2`}>
          {options.map(ele => (
            <Pressable
              key={ele.id}
              style={tw` font-vazir flex-row items-center  gap-1`}
              onPress={() => {
                console.log(typeof ele.id);
                handleChangeOption(`${ele.id}`);
              }}
            >
              <Text style={tw`font-vazir text-background  mb-2`}>
                {ele.title}
              </Text>
              <FontAwesome
                size={24}
                name={value === ele.id ? "dot-circle-o" : "circle"}
                style={tw`text-background`}
              />
            </Pressable>
          ))}
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
