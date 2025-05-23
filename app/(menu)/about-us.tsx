import React, { useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import tw from "@/libs/twrnc"; // Ensure you configure tailwind-rn or use a similar library
import FormField from "@/components/Input/FormField";
import DropdownInput from "@/components/Input/DropdownInput";
import CustomButton from "@/components/CustomButton";
import { router } from "expo-router";
import { Image } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { getAboutContent } from "@/api/services/otpServices";
import Loader from "@/components/Loader";

const AccountScreen = () => {
  const { data: aboutContent, isLoading } = useQuery({
    queryKey: ["support-data"],
    queryFn: () => getAboutContent()
  });
  console.log(aboutContent);
  if (isLoading) {
    return <Loader isLoading={isLoading} />;
  }
  return (
    <ScrollView style={tw` m-4`}>
      <View style={tw`   rounded-xl`}>
        <Image
          source={require("@/assets/images/icon.png")}
          style={tw`w-40 h-40 mb-4 mx-auto rounded-4`}
          resizeMode="contain"
        />

        {aboutContent?.description ? (
          <Text
            style={tw`font-vazir text-right p-3 text-background mb-5 text-justify-right `}
          >
            {aboutContent?.description}
          </Text>
        ) : (
          <Text
            style={tw`font-vazir text-right p-3 text-background mb-5 text-justify-right `}
          >
            ما در ترابرپلاس با هدف ساده‌تر کردن فرآیند حمل‌ونقل و ایجاد ارتباطی
            سریع و مطمئن میان رانندگان و صاحبان بار فعالیت می‌کنیم. هدف ما ارائه
            خدماتی هوشمندانه، قابل اعتماد و باکیفیت در صنعت حمل‌ونقل است. چرا
            ترابر پلاس ؟ {"\n"} سرعت و سهولت: اپلیکیشن ما به شما امکان می‌دهد تا
            تنها با چند کلیک بار خود را ثبت کنید یا برای حمل بار درخواست دهید.
            {"\n"}
            {"\n"}
            امنیت و اطمینان: تمامی رانندگان و باربری‌ها در سیستم ما تأیید صلاحیت
            شده‌اند تا خیال شما از امنیت بار و خدمات آسوده باشد.{"\n"} {"\n"}
            شفافیت و انعطاف: شما می‌توانید هزینه‌ها، وضعیت بار و زمان تحویل را
            به‌صورت شفاف و لحظه‌ای مشاهده کنید.{"\n"} {"\n"} ما در ترابرپلاس به
            دنبال ایجاد تحولی در صنعت حمل‌ونقل هستیم و همواره تلاش می‌کنیم تا با
            بهره‌گیری از تکنولوژی‌های نوین و ارائه خدمات برتر، تجربه‌ای متفاوت
            را برای شما فراهم کنیم. ماموریت ما: ارائه بهترین خدمات حمل‌ونقل با
            تمرکز بر کیفیت، صرفه‌جویی در زمان و هزینه، و ایجاد ارتباطی مطمئن بین
            کاربران. ......
          </Text>
        )}

        <CustomButton
          title="بازگشت"
          handlePress={() => {
            router.back();
          }}
          textStyles="text-background"
          containerStyles="bg-white mx-3 border-2 border-background  mt-7  mb-5"
        />
      </View>
    </ScrollView>
  );
};

export default AccountScreen;
