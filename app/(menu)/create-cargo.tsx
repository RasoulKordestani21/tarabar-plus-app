import React, { useEffect, useState } from "react";
import { View, ScrollView, Platform, KeyboardAvoidingView } from "react-native";
import tw from "@/libs/twrnc";
import { getAllCities, addCargo } from "@/api/services/cargoServices";

import DropdownInput from "@/components/DropdownInput";
import { cargoTypes, truckTypes } from "@/constants/BoxesList";
import FormField from "@/components/FormField";
import CustomButton from "@/components/CustomButton";
import { useGlobalContext } from "@/context/GlobalProvider";

const CreateCargo = () => {
  const { phoneNumber } = useGlobalContext();

  const [cities, setCities] = useState<any[]>([]);
  const [form, setForm] = useState({
    origin: "",
    destination: "",
    truckType: "",
    cargoType: "",
    fee: "",
    description: "" // Add description field to state
  });

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

  const handleSubmit = async () => {
    try {
      const cargoData = {
        originId: Number(form.origin),
        destinationId: Number(form.destination),
        truckTypeId: Number(form.truckType),
        cargoTypeId: Number(form.cargoType),
        carriageFee: form.fee,
        description: form.description,
        ownerPhone: phoneNumber
      };

      const result = await addCargo(cargoData);
      console.log("Cargo added successfully:", result);
      alert("Cargo added successfully!");
    } catch (error) {
      console.error("Error submitting cargo:", error);
      alert("Failed to add cargo. Please try again.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={tw`flex-1`}
    >
      <ScrollView
        style={tw`bg-white`}
        contentContainerStyle={tw`flex-grow justify-between p-4`}
        keyboardShouldPersistTaps="handled"
      >
        <View style={tw`mb-10`}>
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
            iconName={"dot-circle-o"}
          />

          <DropdownInput
            title="نوع کشنده"
            options={truckTypes}
            placeholder="انتخاب نوع کشنده"
            onSelect={value => setForm({ ...form, truckType: value })}
            textStyle="text-right"
            containerStyle="mb-6"
            iconName="caret-down"
            disableSearch={true}
          />

          <DropdownInput
            title="نوع بار"
            options={cargoTypes}
            placeholder="انتخاب نوع بار"
            onSelect={value => setForm({ ...form, cargoType: value })}
            textStyle="text-right"
            containerStyle="mb-6"
            iconName="caret-down"
            disableSearch={true}
          />

          <FormField
            title="کرایه ( تومان )"
            placeholder="شماره موبایل خودرا وارد کنید"
            value={form.fee}
            handleChangeText={(e: string) => {
              setForm({ ...form, fee: e });
            }}
            otherStyles="mb-7"
            keyboardType={
              Platform.OS === "ios" ? "name-phone-pad" : "number-pad"
            }
            color="background"
            minLength={4}
          />

          {/* Add Description Field */}
          <FormField
            isMultiline={true}
            title="توضیحات"
            placeholder="توضیحات خود را وارد کنید"
            value={form.description}
            handleChangeText={(e: string) => {
              setForm({ ...form, description: e });
            }}
            otherStyles="mb-7"
            keyboardType="default"
            color="background"
          />
        </View>
        <CustomButton
          title="ورود به عنوان صاحب بار"
          handlePress={handleSubmit}
          containerStyles="w-full bg-background"
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CreateCargo;
