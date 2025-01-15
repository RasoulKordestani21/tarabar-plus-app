import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Modal,
  SafeAreaView,
  Image,
  TouchableWithoutFeedback
} from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import tw from "@/libs/twrnc"; // Ensure you configure tailwind-rn or use a similar library
import FormField from "@/components/FormField";
import DropdownInput from "@/components/DropdownInput";
import CustomButton from "@/components/CustomButton";
import { router } from "expo-router";
import FeeRangeDrawer from "@/components/RangeDrawer";

type MaterialIconNames =
  | "flash-on"
  | "people"
  | "support-agent"
  | "account-circle"
  | "account-balance-wallet";

const trucks = [
  { label: "100,000 تومان", value: "1" },
  { label: "200,000 تومان", value: "2" },
  { label: "300,000 تومان", value: "3" },
  { label: "400,000 تومان ", value: "4" }
];

const plans = [
  {
    id: "copper",
    name: "اشتراک یک ماهه",
    price: "100,000 تومان",
    color: "bg-yellow-500"
  },
  {
    id: "silver",
    name: "اشتراک دو ماهه",
    price: "180,000 تومان",
    color: "bg-black-400"
  },
  {
    id: "gold",
    name: "اشتراک سه ماهه",
    price: "240,000 تومان",
    color: "bg-yellow-300"
  }
];
const WalletAndPlans = () => {
  const [form, setForm] = useState({
    fullname: "",
    nationalId: "",
    truckType: ""
  });

  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);

  return (
    <ScrollView style={tw` m-4`}>
      <View style={tw` min-h-[700px]`}>
        <Modal
          visible={paymentModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => {
            setPaymentModalVisible(false);
          }}
        >
          <SafeAreaView
            style={tw`flex-1 items-center justify-center bg-black-50 `}
          >
            <TouchableWithoutFeedback
              onPress={() => {
                setPaymentModalVisible(false);
              }}
              style={tw`flex-1 absolute top-0 left-0 w-full h-full bg-transparent z-0`}
            >
              <View
                style={tw`flex-1 absolute top-0 left-0 w-full h-full bg-black-50  z-0`}
              ></View>
            </TouchableWithoutFeedback>
            <View
              style={tw` min-h-[600px] w-9/10 bg-white p-3 mx-3 rounded-xl justify-between`}
            >
              <View>
                <Image
                  source={require("@/assets/images/increase-account-credit-icon.png")}
                  style={tw`w-40 h-40  mx-auto`}
                  resizeMode="contain"
                />
                <DropdownInput
                  title="مبلغ شارژ"
                  options={trucks}
                  placeholder="یکی از مبالغ زیر را انتخاب کنید "
                  onSelect={value => setForm({ ...form, truckType: value })}
                  textStyle="text-right"
                  containerStyle="mt-5"
                  iconName="caret-down"
                  disableSearch={true} // Disable search for select-like behavior
                />
              </View>
              <CustomButton
                title="شارژ کیف پول"
                handlePress={() => {
                  setPaymentModalVisible(true);
                }}
                containerStyles=" w-full   "
              />
            </View>
          </SafeAreaView>
        </Modal>
        <View>
          <Text style={tw`text-sm text-right font-vazir mb-2  `}>موجودی</Text>
          <View style={tw`bg-yellow-500 rounded-xl py-5 px-3`}>
            <View style={tw`flex flex-row-reverse justify-between w-full  `}>
              <Text style={tw`text-background text-base font-vazir`}>
                موجودی کیف پول
              </Text>
              <Text style={tw`text-green-700 text-base font-vazir`}>
                45,888,333
              </Text>
            </View>
            <CustomButton
              title="شارژ کیف پول"
              handlePress={() => {
                setPaymentModalVisible(true);
              }}
              containerStyles="m-auto w-50 mt-7  mb-5"
            />
          </View>
        </View>

        <View style={tw`w-full h-[2px] mt-10 bg-black-300`}></View>

        <View style={tw`mt-8`}>
          <Text style={tw`text-sm text-right font-vazir mb-2  `}>
            اشتراک ها
          </Text>
          {plans.map(plan => (
            <Pressable
              key={plan.id}
              style={[
                tw`w-full flex-row justify-between items-center p-4 mb-4 rounded-lg`,
                tw`${plan.color}`,
                selectedPlan === plan.id ? tw`border-4 border-blue-500` : ""
              ]}
              onPress={() => setSelectedPlan(plan.id)} // Set selected plan on press
            >
              <View>
                <Text style={tw`text-white text-lg font-vazir`}>
                  {plan.name}
                </Text>
                <Text style={tw`text-white text-sm font-vazir`}>
                  {plan.price}
                </Text>
              </View>
              <MaterialIcons
                name={
                  selectedPlan === plan.id
                    ? "radio-button-checked"
                    : "radio-button-unchecked"
                }
                size={24}
                color="white"
              />
            </Pressable>
          ))}
        </View>
        <CustomButton
          title="خرید اشتراک"
          handlePress={() => {
            router.back();
          }}
          containerStyles="w-full mt-7 bg-background mb-5"
        />
      </View>
    </ScrollView>
  );
};

export default WalletAndPlans;
