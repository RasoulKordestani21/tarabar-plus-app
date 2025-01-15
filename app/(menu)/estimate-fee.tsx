import React, { useState } from "react";
import {
  View,
  Text,
  Platform,
  Pressable,
  ScrollView,
  SafeAreaView
} from "react-native";
import DropdownInput from "@/components/DropdownInput";
import tw from "@/libs/twrnc";
import FormField from "@/components/FormField";
import FeeRangeDrawer from "@/components/RangeDrawer";
import CustomButton from "@/components/CustomButton";

interface Option {
  label: string;
  value: string;
}

const fakeData: Option[] = [
  { label: "تهران", value: "tehran" },
  { label: "مشهد", value: "mashhad" },
  { label: "اصفهان", value: "esfahan" },
  { label: "تبریز", value: "tabriz" },
  { label: "آستانه اشرفیه / گیلان", value: "astaneh-ashrafieh" },
  { label: "تربت جام / خراسان رضوی", value: "torbat-jam" },
  { label: "تربت ی", value: "sfjdk" }
];

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
const cargoType = [
  { label: "پالت", value: "1" },
  { label: "کارتن", value: "2" },
  { label: "بشکه", value: "3" },
  { label: "جامبو بگ", value: "4" },
  { label: "رول", value: "5" },
  { label: "گونی", value: "6" },
  { label: "کیسه", value: "7" },
  { label: "تانکر", value: "8" },
  { label: "مایعات فله", value: "9" },
  { label: "گاز فله", value: "10" },
  { label: "محموله حجیم", value: "11" },
  { label: "محموله ترافیکی", value: "12" },
  { label: "دستگاه", value: "13" },
  { label: "لوله", value: "14" },
  { label: "میلگرد", value: "15" },
  { label: "خودرو", value: "16" },
  { label: "دام", value: "17" },
  { label: "مصالح ساختمانی", value: "18" },
  { label: "اثاثیه منزل", value: "19" }
];

interface Props {
  onClose: () => void;
}

const EstimateFareDrawer: React.FC<Props> = ({ onClose }) => {
  const [form, setForm] = useState<{
    origin: string | null;
    destination: string | null;
    truckType: string | null;
    cargoType: string | null;
    insurancePercentage?: string;
  }>({
    origin: null,
    destination: null,
    truckType: null,
    cargoType: null,
    insurancePercentage: undefined
  });
  const [feeRangeOpened, setFeeRangeOpened] = useState(false);

  const handleCloseDrawer = () => {
    setFeeRangeOpened(false);
  };

  return (
    <ScrollView contentContainerStyle={tw`  p-5 pb-8`}>
      <View style={tw`flex-1`}>
        <DropdownInput
          title="مبدا"
          options={fakeData}
          placeholder="یکی از گزینه های زیر را انتخاب کنید."
          onSelect={value => setForm({ ...form, origin: value })}
          textStyle="text-right"
          containerStyle="mb-6"
          iconName={"dot-circle-o"}
        />

        <DropdownInput
          title="مقصد"
          options={fakeData}
          placeholder="یکی از گزینه های زیر را انتخاب کنید."
          onSelect={value => setForm({ ...form, destination: value })}
          textStyle="text-right"
          containerStyle="mb-6"
          iconName={"location-arrow"}
        />

        <DropdownInput
          title="نوع کشنده"
          options={trucks}
          placeholder="انتخاب نوع کشنده"
          onSelect={value => setForm({ ...form, truckType: value })}
          textStyle="text-right"
          containerStyle="mb-6"
          iconName="caret-down"
          disableSearch={true} // Disable search for select-like behavior
        />

        <DropdownInput
          title="نوع بار"
          options={cargoType}
          placeholder="انتخاب نوع بار"
          onSelect={value => setForm({ ...form, cargoType: value })}
          textStyle="text-right"
          containerStyle="mb-6"
          iconName="caret-down"
          disableSearch={true} // Disable search for select-like behavior
        />

        <FormField
          title="درصد بیمه"
          placeholder="شماره موبایل خودرا وارد کدنید"
          value={form.insurancePercentage}
          handleChangeText={(e: string) => {
            setForm({ ...form, insurancePercentage: e });
          }}
          otherStyles="mb-7"
          keyboardType={Platform.OS === "ios" ? "name-phone-pad" : "number-pad"}
          color="background"
        />
      </View>
      <FeeRangeDrawer
        isVisible={feeRangeOpened}
        onClose={handleCloseDrawer}
        minFee={10000000}
        maxFee={20000000}
        currency={"تومان"}
        // Replace with your image
      />
      <CustomButton
        title="ورود به عنوان صاحب بار "
        handlePress={() => null}
        containerStyles="w-full  bg-background"
      />
    </ScrollView>
  );
};

export default EstimateFareDrawer;
