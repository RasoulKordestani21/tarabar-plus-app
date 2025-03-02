import React, { useEffect, useState } from "react";
import { View, ScrollView, Platform, KeyboardAvoidingView } from "react-native";
import tw from "@/libs/twrnc";
import DropdownInput from "@/components/Input/DropdownInput";
import { cargoTypes, truckTypes } from "@/constants/BoxesList";
import FormField from "@/components/Input/FormField";
import CustomButton from "@/components/CustomButton";
import { editCargo, getAllCities } from "@/api/services/cargoServices";

const CargoForm = ({ initialValues, onSubmit, onClose }: any) => {
const [cities, setCities] = useState<any[]>([]);
const [form, setForm] = useState({
  origin: initialValues?.origin?.title || "",
  destination: initialValues?.destination?.title || "",
  truckType: initialValues?.truckType || "",
  cargoType: initialValues?.cargoType || "",
  fee: initialValues?.fee || "",
  description: initialValues?.description || ""
});
const [updatedParams, setUpdatedParams] = useState<any>({
  id: initialValues?.id
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
  console.log(initialValues.origin.cityId, {
    ...{
      originId: initialValues.origin.cityId,
      destinationId: initialValues.destination.cityId
    },
    ...updatedParams
  });
  try {
    const result = await editCargo({
      ...{
        originId: initialValues.origin.cityId,
        destinationId: initialValues.destination.cityId
      },
      ...updatedParams
    });
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
    style={tw`flex-1 bg-black-50`}
  >
    <ScrollView
      style={tw`bg-transparent flex-1`}
      contentContainerStyle={tw`flex-grow p-4`}
      keyboardShouldPersistTaps="handled"
    >
      <View style={tw`bg-white p-5 rounded-lg shadow-md`}>
        <DropdownInput
          title="مبدا"
          options={cities.map(city => ({
            label: city.title,
            value: city.id
          }))}
          placeholder="یکی از گزینه های زیر را انتخاب کنید."
          onSelect={value => {
            setUpdatedParams({ ...updatedParams, originId: Number(value) });
            setForm({ ...form, origin: value });
          }}
          textStyle="text-right"
          containerStyle="mb-6"
          iconName={"dot-circle-o"}
          defaultValue={form.origin}
        />

        <DropdownInput
          title="مقصد"
          options={cities.map(city => ({
            label: city.title,
            value: city.id
          }))}
          placeholder="یکی از گزینه های زیر را انتخاب کنید."
          onSelect={value => {
            setUpdatedParams({
              ...updatedParams,
              destinationId: Number(value)
            });
            setForm({ ...form, destination: value });
          }}
          textStyle="text-right"
          containerStyle="mb-6"
          iconName={"dot-circle-o"}
          defaultValue={form.destination}
        />

        <DropdownInput
          title="نوع کشنده"
          options={truckTypes}
          placeholder="انتخاب نوع کشنده"
          onSelect={value => {
            setUpdatedParams({
              ...updatedParams,
              truckTypeId: Number(value)
            });
            setForm({ ...form, truckType: value });
          }}
          textStyle="text-right"
          containerStyle="mb-6"
          iconName="caret-down"
          disableSearch={true}
          defaultValue={form.truckType}
        />

        <DropdownInput
          title="نوع بار"
          options={cargoTypes}
          placeholder="انتخاب نوع بار"
          onSelect={value => {
            setUpdatedParams({
              ...updatedParams,
              cargoTypeId: Number(value)
            });
            setForm({ ...form, cargoType: value });
          }}
          textStyle="text-right"
          containerStyle="mb-6"
          iconName="caret-down"
          disableSearch={true}
          defaultValue={form.cargoType}
        />

        <FormField
          title="کرایه ( تومان )"
          placeholder="شماره موبایل خودرا وارد کنید"
          value={form.fee}
          handleChangeText={(e: string) => {
            setUpdatedParams({ ...updatedParams, carriageFee: e });
            setForm({ ...form, fee: e });
          }}
          otherStyles="mb-7"
          keyboardType={
            Platform.OS === "ios" ? "name-phone-pad" : "number-pad"
          }
          color="background"
          minLength={4}
          defaultValue={initialValues?.fee}
        />

        {/* Add Description Field */}
        <FormField
          isMultiline={true}
          title="توضیحات"
          placeholder="توضیحات خود را وارد کنید"
          value={form.description}
          handleChangeText={(e: string) => {
            setUpdatedParams({ ...updatedParams, description: e });
            setForm({ ...form, description: e });
          }}
          otherStyles="mb-7"
          keyboardType="default"
          color="background"
          defaultValue={initialValues?.description}
        />

        <View style={tw`flex-row justify-between mt-10`}>
          <CustomButton
            title="ذخیره تغییرات"
            handlePress={handleSubmit}
            containerStyles="w-[48%] bg-background"
          />
          <CustomButton
            title="لغو"
            handlePress={onClose}
            containerStyles="w-[48%] bg-red-500"
          />
        </View>
      </View>
    </ScrollView>
  </KeyboardAvoidingView>
);
};

export default CargoForm;
