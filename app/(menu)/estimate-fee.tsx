// screens/EstimateFareDrawer.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Platform,
  Pressable,
  ScrollView,
  SafeAreaView,
  Alert
} from "react-native";
import DropdownInput from "@/components/Input/DropdownInput";
import tw from "@/libs/twrnc";
import FormField from "@/components/Input/FormField";
import FeeRangeDrawer from "@/components/RangeDrawer";
import CustomButton from "@/components/CustomButton";
import { getAllCities } from "@/api/services/cargoServices";
import { estimateCommissionAndFare } from "@/api/services/toolsServices"; // Importing the new service

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

  const [cities, setCities] = useState<any[]>([]);
  const [estimatedFare, setEstimatedFare] = useState<number | null>(null);
  const [estimatedCommission, setEstimatedCommission] = useState<number | null>(
    null
  );

  const handleCloseDrawer = () => {
    setFeeRangeOpened(false);
  };

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const result = await getAllCities();
        setCities(result);
      } catch (error) {
        console.error("Failed to fetch cities:", error);
      }
    };

    fetchCities();
  }, []);

  const handleEstimateFare = async () => {
    if (
      !form.origin ||
      !form.destination ||
      !form.truckType ||
      !form.cargoType
    ) {
      Alert.alert("Please fill all the fields before estimating the fare.");
      return;
    }

    try {
      const response = await estimateCommissionAndFare(
        form.origin,
        form.destination,
        form.cargoType,
        form.truckType,
        form.insurancePercentage || "0"
      );
      setEstimatedFare(response.estimation.estimatedFare);
      setEstimatedCommission(response.estimation.estimatedCommission);
      console.log(response);
      setFeeRangeOpened(true); // Open the fee range drawer
    } catch (error) {
      Alert.alert("Error estimating fare:", error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={tw`  p-5 pb-8`}>
      <View style={tw`flex-1`}>
        <DropdownInput
          title="مبدا"
          options={cities.map(city => ({
            label: city.title,
            value: city.id
          }))}
          placeholder="یکی از گزینه های زیر را انتخاب کنید."
          onSelect={value => setForm({ ...form, origin: value })}
          textStyle="text-right"
          containerStyle="mb-6"
          iconName={"dot-circle-o"}
        />

        <DropdownInput
          title="مقصد"
          options={cities.map(city => ({
            label: city.title,
            value: city.id
          }))}
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
          pattern={{
            type: /^([0-9]|[1-9][0-9]|100)$/,
            message: "عدد باید بین صفر تا صد باشد."
          }}
          maxLength={3}
          otherStyles="mb-7"
          keyboardType={Platform.OS === "ios" ? "name-phone-pad" : "number-pad"}
          color="background"
        />
      </View>

      <FeeRangeDrawer
        isVisible={feeRangeOpened}
        onClose={handleCloseDrawer}
        minFee={Number(estimatedFare) || 0}
        maxFee={estimatedFare ? Number(estimatedFare) * 2 : 0}
        currency={"تومان"}
      />

      <CustomButton
        title="تخمین کرایه"
        handlePress={handleEstimateFare} // Trigger estimate fare
        containerStyles="w-full  bg-background"
      />
    </ScrollView>
  );
};

export default EstimateFareDrawer;
