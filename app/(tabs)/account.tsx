import React, { useContext } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  TouchableOpacity
} from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import tw from "@/libs/twrnc"; // Ensure you configure tailwind-rn or use a similar library
import { router } from "expo-router";
import { getUser } from "@/api/services/userServices";
import { useQuery } from "@tanstack/react-query";
import { useGlobalContext } from "@/context/GlobalProvider";
import Loader from "@/components/Loader";

type MaterialIconNames =
  | "flash-on"
  | "people"
  | "support-agent"
  | "account-circle"
  | "account-balance-wallet";

const AccountScreen = () => {
  const { phoneNumber, role } = useGlobalContext();
  const { data, error, isLoading, isFetched, refetch } = useQuery({
    queryKey: ["userInformation", phoneNumber],
    queryFn: () => getUser(phoneNumber)
  });
  console.log(data);
  return (
    <>
      {isLoading ? (
        <Loader isLoading={isLoading} />
      ) : (
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
                style={tw`bg-green-700 text-white font-vazir px-4 py-1 mt-2 rounded-full `}
              >
                احراز هویت شده
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
                  45,888,333
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
                route: "/account-setting"
              },
              {
                title: "مدیریت کیف پول و اشتراک",
                description: "موجودی کیف پول خود را مدیریت کنید.",
                icon: "account-balance-wallet" as MaterialIconNames,
                route: "/wallet-plans"
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
                style={tw`flex-row-reverse bg-primary px-4 py-4 mb-3 rounded-lg items-center`}
                onPress={() => {
                  router.push(item.route);
                }}
              >
                <MaterialIcons
                  name={item.icon}
                  size={24}
                  color="white"
                  style={tw`ml-3`}
                />
                <View style={tw`flex-1`}>
                  <Text
                    style={tw`text-white font-vazir-bold text-base text-right`}
                  >
                    {item.title}
                  </Text>
                  <View style={tw`bg-text w-full h-[1px] m-1`}></View>
                  <Text
                    style={tw`text-white text-sm mt-1 text-right font-vazir`}
                  >
                    {item.description}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </>
  );
};

export default AccountScreen;
