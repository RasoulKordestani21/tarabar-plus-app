import React, { useContext, useEffect, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  TouchableOpacity,
  SafeAreaView
} from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import tw from "@/libs/twrnc"; // Ensure you configure tailwind-rn or use a similar library
import { router } from "expo-router";
import { getUser } from "@/api/services/userServices";
import { useQuery } from "@tanstack/react-query";
import { useGlobalContext } from "@/context/GlobalProvider";
import Loader from "@/components/Loader";
import { ActivityIndicator } from "react-native";
import { getDriverUser } from "@/api/services/driverServices";
import { useToast } from "@/context/ToastContext";
import { QUERY_KEYS } from "@/constants/QueryKeys";

type MaterialIconNames =
  | "flash-on"
  | "people"
  | "support-agent"
  | "account-circle"
  | "account-balance-wallet";

const formatFee = (value: string) => {
  if (!value) return "";
  const number = value.toString().replace(/,/g, "");
  return number.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const AccountScreen = () => {
  const { phoneNumber, role } = useGlobalContext();
  const { showToast } = useToast();
  const { data, error, isLoading, isFetched, refetch } = useQuery({
    queryKey: [QUERY_KEYS.DRIVER_INFO, phoneNumber],
    queryFn: () => getDriverUser({ phoneNumber })
  });

  const rejectionNotified = useRef(false);

  useEffect(() => {
    if (data) {
      if (
        data?.user?.verification?.status === "rejected" &&
        !rejectionNotified.current
      ) {
        showToast(
          `عدم تایید حساب کابری : \n دلایل : \n ${data?.user?.verification?.rejectionReason}`,
          "error"
        );
        rejectionNotified.current = true;
      }
    }
  }, [data]);

  if (isLoading) {
    return (
      <SafeAreaView>
        <ActivityIndicator style={tw`mt-10`} size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }
  return (
    <View style={tw`flex-1 bg-text`}>
      {/* User Card */}
      <View
        style={tw`${
          data?.user?.isVerified ? "bg-green-500" : "bg-orange-500"
        }   p-4 m-4 rounded-lg shadow-lg justify-center items-center`}
      >
        <View style={tw`flex-row justify-between w-full items-center`}>
          <FontAwesome
            name="user-circle"
            size={40}
            color="white"
            style={tw`mt-2`}
          />
          <Text
            style={tw`${
              data?.user?.isVerified ? "bg-green-700" : "bg-orange-700"
            } text-white font-vazir px-4 py-1 mt-2 rounded-full `}
          >
            {data?.user?.isVerified ? "احراز هویت شده" : " احراز هویت نشده"}
          </Text>
          <Text style={tw`text-white text-lg font-vazir-bold mt-2 `}>
            {data?.user?.userName || "----"}
          </Text>
        </View>
        <View style={tw`mt-4`}>
          <View style={tw`flex flex-row-reverse justify-between w-full `}>
            <Text style={tw`text-background text-base font-vazir`}>
              موجودی کیف پول
            </Text>
            <Text style={tw`text-white text-base font-vazir`}>
              {formatFee(data?.user?.balance) || 0} تومان
            </Text>
          </View>

          <View style={tw`flex flex-row-reverse justify-between w-full `}>
            <Text style={tw`text-background text-base font-vazir`}>
              شماره تماس
            </Text>
            <Text style={tw`text-white text-base font-vazir`}>
              {phoneNumber}
            </Text>
          </View>

          <View style={tw`flex flex-row-reverse justify-between w-full `}>
            <Text style={tw`text-background text-base font-vazir`}>
              سطح کاربر
            </Text>
            <Text style={tw`text-white text-base font-vazir`}>
              {role === "1" ? "راننده" : "صاحب بار"}
            </Text>
          </View>
        </View>
      </View>

      {/* Options */}
      <ScrollView style={tw`flex-1 px-4`}>
        {[
          {
            title: "مدیریت حساب کاربری",
            description:
              "اطلاعات حساب خود را مشاهده کنید و تنظیمات مورد نظر را انجام دهید.",
            icon: "account-circle" as MaterialIconNames,
            route: "/driver-account-setting"
          },
          {
            title: "مدیریت کیف پول و اشتراک",
            description: "موجودی کیف پول خود را مدیریت کنید.",
            icon: "account-balance-wallet" as MaterialIconNames,
            route: "/driver-wallet-plans"
          },
          // {
          //   title: "خرید اشتراک",
          //   description: "اشتراک ویژه را خریداری کنید.",
          //   icon: "flash-on" as MaterialIconNames,
          //   route: ""
          // },
          {
            title: "درباره ترابرپلاس",
            description: "اطلاعات مربوط به قراردادها و کاربران.",
            icon: "people" as MaterialIconNames,
            route: "/about-us"
          },
          {
            title: "پشتیبانی",
            description: "سوالات یا مشکلات خود را با ما در میان بگذارید.",
            icon: "support-agent" as MaterialIconNames,
            route: "support-faq"
          }
        ].map((item, index) => (
          <TouchableOpacity
            key={index}
            style={tw`flex-row-reverse bg-text border-2 border-background px-4 py-4 mb-3 rounded-lg items-center`}
            onPress={() => {
              router.push(item.route);
            }}
          >
            <MaterialIcons
              name={item.icon}
              size={24}
              //   color="background"
              style={tw`ml-3 text-background`}
            />
            <View style={tw`flex-1`}>
              <Text
                style={tw`text-background font-vazir-bold text-base text-right`}
              >
                {item.title}
              </Text>
              {/* <View style={tw`bg-background w-full h-[1px] m-1`}></View> */}
              {/* <Text
                             style={tw`text-background text-sm mt-1 text-right font-vazir`}
                           >
                             {item.description}
                           </Text> */}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default AccountScreen;
