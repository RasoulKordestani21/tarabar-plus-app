import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  Text,
  Alert,
  TouchableOpacity
} from "react-native";
import tw from "@/libs/twrnc";
import { getAllCities, addCargo } from "@/api/services/cargoServices";
import { FontAwesome, Ionicons } from "@expo/vector-icons"; // For checkbox icon

import DropdownInput from "@/components/Input/DropdownInput";
import { cargoTypes, truckTypes } from "@/constants/BoxesList";
import FormField from "@/components/Input/FormField";
import CustomButton from "@/components/CustomButton";
import { useGlobalContext } from "@/context/GlobalProvider";
import { Formik } from "formik";
import { useQuery } from "@tanstack/react-query";
import {
  createCargoInitialValues,
  createCargoSchema
} from "@/constants/FormikValidation";
import Loader from "@/components/Loader";
import RadioInput from "@/components/Input/RadioInput";
import { CargoSubmitProps, CargoValuesProps, FetchedCity } from "./types";
import { router } from "expo-router";

const CreateCargo = () => {
  const { phoneNumber } = useGlobalContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customCargoType, setCustomCargoType] = useState("");
  const [showCustomCargoInput, setShowCustomCargoInput] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["listOfCities"],
    queryFn: () => getAllCities()
  });

  const handleSubmit = async (values: CargoValuesProps) => {
    try {
      setIsSubmitting(true);
      let cargoData: CargoSubmitProps = {
        originId: Number(values.origin),
        destinationId: Number(values.destination),
        truckTypeId: Number(values.truckType),
        cargoTypeId: showCustomCargoInput ? 0 : Number(values.cargoType), // Set to 0 if using custom
        carriageFee: values.fee,
        description: values.description,
        ownerPhone: phoneNumber,
        transportType: values.transportType
      };

      if (values.transportType === "3") {
        cargoData = { ...cargoData, cargoWeight: values.cargoWeight };
      }

      // If custom cargo type is provided, add it
      if (showCustomCargoInput && customCargoType.trim()) {
        cargoData.customCargoType = customCargoType.trim();
      }

      const result = await addCargo(cargoData);
      if (result) {
        Alert.alert("عملیات موفق", "بار با موفقیت اضافه شد.", [
          { text: "بستن", style: "cancel" }
        ]);
        router.push("/cargo-owner-home");
      }
    } catch (error: any) {
      console.error("Error submitting cargo:", error);
      Alert.alert("خطا", "عملیات با خطا مواجه شد.", [
        { text: "بستن", style: "cancel" }
      ]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatFee = (value: string) => {
    if (!value) return "";
    const number = value.replace(/,/g, "");
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleCustomCargoToggle = (setFieldValue: any, setFieldError: any) => {
    const newShowCustom = !showCustomCargoInput;
    setShowCustomCargoInput(newShowCustom);

    if (newShowCustom) {
      // When switching to custom, set cargoType to "0" to satisfy validation
      setFieldValue("cargoType", "0");
      setFieldError("cargoType", undefined);
    } else {
      // When switching back to dropdown, clear both custom input and cargoType
      setCustomCargoType("");
      setFieldValue("cargoType", "");
    }
  };

  // Create dynamic validation schema based on showCustomCargoInput
  const getDynamicValidationSchema = () => {
    if (showCustomCargoInput) {
      // Return schema without cargoType requirement when using custom
      return createCargoSchema.omit(["cargoType"]);
    }
    return createCargoSchema;
  };

  // Custom validation function
  const validateForm = (values: any) => {
    const errors: any = {};

    // If using custom cargo input, validate it
    if (showCustomCargoInput) {
      if (!customCargoType.trim()) {
        errors.customCargoType = "نوع بار الزامی است";
      }
    } else {
      // If using dropdown, validate cargoType
      if (!values.cargoType) {
        errors.cargoType = "نوع بار الزامی است";
      }
    }

    return errors;
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={tw`flex-1`}
    >
      {isLoading ? (
        <Loader isLoading={isLoading} />
      ) : (
        <ScrollView
          style={tw`bg-white`}
          contentContainerStyle={tw`flex-grow justify-between p-4`}
          keyboardShouldPersistTaps="handled"
        >
          <Formik
            initialValues={{
              ...createCargoInitialValues({}),
              id: "new"
            }}
            validationSchema={getDynamicValidationSchema()}
            validate={validateForm}
            onSubmit={handleSubmit}
          >
            {({
              handleChange,
              handleSubmit,
              values,
              errors,
              setFieldError,
              setFieldValue
            }) => (
              <>
                <View style={tw`flex-row flex-wrap justify-between`}>
                  <View style={tw`w-[48%]`}>
                    <DropdownInput
                      title="مقصد"
                      options={data?.map((city: FetchedCity) => ({
                        label: `${city.provinceName} / ${city.title}`,
                        value: city.id.toString()
                      }))}
                      name="destination"
                      formikError={errors.destination}
                      textStyle="text-right"
                      containerStyle="mt-3 w-full"
                      iconName="map-marker"
                      onSelect={() => setFieldError("destination", undefined)}
                    />
                  </View>
                  <View style={tw`w-[48%]`}>
                    <DropdownInput
                      title="مبدا"
                      options={data?.map((city: FetchedCity) => ({
                        label: `${city.provinceName} / ${city.title}`,
                        value: city.id.toString()
                      }))}
                      name="origin"
                      formikError={errors.origin}
                      textStyle="text-right"
                      containerStyle="mt-3 w-full"
                      iconName="dot-circle-o"
                      onSelect={() => setFieldError("origin", undefined)}
                    />
                  </View>

                  {/* Caution Message */}
                  <View style={tw`w-full mt-5 mb-3`}>
                    <View
                      style={tw`bg-yellow-50 border border-yellow-200 rounded-lg p-3`}
                    >
                      <Text
                        style={tw`text-yellow-800 text-sm text-right font-vazir`}
                      >
                        اگر نوع بار مورد نظر خود را در لیست پیدا نکردید، روی
                        سایر بارها کلیک کنید و آن را بنویسید
                      </Text>
                    </View>
                  </View>

                  <View style={tw`w-[48%]`}>
                    <DropdownInput
                      title="نوع کشنده"
                      options={truckTypes.map(type => ({
                        ...type,
                        value: type.value.toString()
                      }))}
                      name="truckType"
                      formikError={errors.truckType}
                      textStyle="text-right"
                      containerStyle="mt-3 w-full"
                      iconName="caret-down"
                      disableSearch={true}
                      onSelect={() => setFieldError("truckType", undefined)}
                    />
                  </View>

                  <View style={tw`w-[48%]`}>
                    {!showCustomCargoInput ? (
                      <DropdownInput
                        title="نوع بار"
                        options={cargoTypes.map(type => ({
                          ...type,
                          value: type.value.toString()
                        }))}
                        name="cargoType"
                        formikError={errors.cargoType}
                        textStyle="text-right"
                        containerStyle="mt-3 w-full"
                        iconName="caret-down"
                        onSelect={() => setFieldError("cargoType", undefined)}
                      />
                    ) : (
                      <View style={tw`mt-3 w-full`}>
                        <FormField
                          title="نوع بار (سایر)"
                          handleChangeText={text => {
                            setCustomCargoType(text);
                            // Clear custom cargo error when user types
                            if (errors.customCargoType && text.trim()) {
                              setFieldError("customCargoType", undefined);
                            }
                          }}
                          value={customCargoType}
                          formikError={errors.customCargoType}
                          isUsingFormik={true}
                          otherStyles="w-full"
                          keyboardType="default"
                          color="background"
                          placeholder="نوع بار خود را وارد کنید"
                        />
                      </View>
                    )}

                    {/* Custom Cargo Checkbox */}
                    <TouchableOpacity
                      style={tw`flex-row items-center justify-end ${
                        !showCustomCargoInput ? "mt-2" : ""
                      }`}
                      onPress={() =>
                        handleCustomCargoToggle(setFieldValue, setFieldError)
                      }
                    >
                      <Text style={tw`text-sm text-gray-600 font-vazir mr-2`}>
                        سایر بارها
                      </Text>
                      <View
                        style={tw`w-5 h-5 border-2 border-gray-400 rounded items-center justify-center ${
                          showCustomCargoInput
                            ? "bg-background border-blue-500"
                            : "bg-white"
                        }`}
                      >
                        {showCustomCargoInput && (
                          <FontAwesome name="check" size={14} color="white" />
                        )}
                      </View>
                    </TouchableOpacity>
                  </View>

                  <RadioInput
                    value={values.transportType}
                    handleChangeOption={handleChange("transportType")}
                    formikError={errors.transportType}
                  />

                  {values.transportType === "3" ? (
                    <View style={tw`w-full mt-3 `}>
                      <FormField
                        title={"تناژ بار"}
                        handleChangeText={handleChange("cargoWeight")}
                        value={values.cargoWeight}
                        formikError={errors.cargoWeight}
                        isUsingFormik={true}
                        otherStyles="-mb-3 w-full"
                        keyboardType={
                          Platform.OS === "ios"
                            ? "name-phone-pad"
                            : "number-pad"
                        }
                        color="background"
                      />
                    </View>
                  ) : (
                    <></>
                  )}

                  <View style={tw`w-full mt-5 `}>
                    <FormField
                      title={
                        values.transportType === "3"
                          ? " کرایه هر تن ( تومان)"
                          : "کرایه (تومان)"
                      }
                      handleChangeText={text => {
                        const numericValue = text.replace(/,/g, "");
                        setFieldValue("fee", numericValue);
                      }}
                      value={formatFee(values.fee)}
                      formikError={errors.fee}
                      isUsingFormik={true}
                      otherStyles="mb-1 w-full"
                      keyboardType={
                        Platform.OS === "ios" ? "name-phone-pad" : "number-pad"
                      }
                      color="background"
                    />
                    {values.fee && (
                      <Text
                        style={tw`text-xs text-green-600  text-right font-vazir -mt-3 mr-2 absolute bg-card text-white p-3 rounded-3`}
                      >
                        {formatFee(values.fee)} تومان
                      </Text>
                    )}
                  </View>

                  {/* Add Description Field */}
                  <View style={tw`w-full`}>
                    <FormField
                      isMultiline={true}
                      title="توضیحات"
                      value={values.description}
                      handleChangeText={handleChange("description")}
                      formikError={errors.description}
                      isUsingFormik={true}
                      otherStyles="mb-7"
                      keyboardType="default"
                      color="background"
                    />
                  </View>
                </View>
                <CustomButton
                  title="ثبت بار جدید"
                  handlePress={() => handleSubmit()}
                  containerStyles="w-full bg-background"
                  isLoading={isSubmitting}
                />
              </>
            )}
          </Formik>
        </ScrollView>
      )}
    </KeyboardAvoidingView>
  );
};

export default CreateCargo;
