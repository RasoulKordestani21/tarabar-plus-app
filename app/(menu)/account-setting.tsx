import React, { useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import tw from "@/libs/twrnc"; // Ensure you configure tailwind-rn or use a similar library
import FormField from "@/components/FormField";
import DropdownInput from "@/components/DropdownInput";
import CustomButton from "@/components/CustomButton";
import { router } from "expo-router";

type MaterialIconNames =
  | "flash-on"
  | "people"
  | "support-agent"
  | "account-circle"
  | "account-balance-wallet";

const trucks = [
  { label: "ده چرخ", value: "1" },
  { label: "شش چرخ", value: "2" },
  { label: "تخت", value: "3" },
  { label: "یخچالی", value: "4" },
  { label: "تانکر", value: "5" },
  { label: "کفی", value: "6" },
  { label: "کمپرسی", value: "7" },
  { label: "لبه دار", value: "8" },
  { label: "بغل بازشو", value: "9" },
  { label: "مسقف", value: "10" },
  { label: "حمل خودرو", value: "11" },
  { label: "چادری", value: "12" },
  { label: "وانت", value: "13" },
  { label: "تریلی معمولی", value: "14" }
];
const AccountScreen = () => {
  const [form, setForm] = useState({
    fullname: "",
    nationalId: "",
    truckType: ""
  });

  return (
    <ScrollView style={tw` m-4`}>
      <View style={tw` min-h-[700px]`}>
        <View style={tw`flex-1 `}>
          <View style={tw`p-4 m-4 rounded-lg justify-center items-center`}>
            <FontAwesome
              name="user-circle"
              size={50}
              style={tw`mt-2 text-background`}
            />

            <Text
              style={tw`text-background font-vazir px-4 py-1 mt-2 rounded-full `}
            >
              افزودن تصویر کاربری
            </Text>
          </View>
          <FormField
            title="نام و نام خانوادگی"
            placeholder="شماره موبایل خودرا وارد کدنید"
            value={form.fullname}
            handleChangeText={(e: string) => {
              setForm({ ...form, fullname: e });
            }}
            color="background"
          />

          <FormField
            title="کدملی"
            placeholder="کدملی خودرا وارد کدنید"
            value={form.fullname}
            handleChangeText={(e: string) => {
              setForm({ ...form, fullname: e });
            }}
            color="background"
          />

          <DropdownInput
            title="نوع بار"
            options={trucks}
            placeholder="انتخاب نوع بار"
            onSelect={value => setForm({ ...form, truckType: value })}
            textStyle="text-right"
            containerStyle="mb-6"
            iconName="caret-down"
            disableSearch={true} // Disable search for select-like behavior
          />
        </View>
        <CustomButton
          title="ذخیره تغییرات"
          handlePress={() => {
            router.back();
          }}
          containerStyles="w-full mt-7 bg-background mb-5"
        />
      </View>
    </ScrollView>
  );
};

export default AccountScreen;
