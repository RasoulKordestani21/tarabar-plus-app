import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  Text
} from "react-native";
import tw from "@/libs/twrnc";
import { getAllCities, addCargo } from "@/api/services/cargoServices";

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
import { showToast } from "@/utils/toast";

const CreateCargo = () => {
  const { phoneNumber } = useGlobalContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        cargoTypeId: Number(values.cargoType),
        carriageFee: values.fee,
        description: values.description,
        ownerPhone: phoneNumber,
        transportType: values.transportType
      };

      if (values.transportType === "3") {
        cargoData = { ...cargoData, cargoWeight: values.cargoWeight };
      }

      const result = await addCargo(cargoData);
      if (result) {
        showToast.success("بار با موفقیت ثبت شد");
      }
    } catch (error: any) {
      console.error("Error submitting cargo:", error);
      showToast.error(
        error.response?.data?.message || "خطا در ثبت بار. لطفا دوباره تلاش کنید"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatFee = (value: string) => {
    if (!value) return "";
    const number = value.replace(/,/g, "");
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
            validationSchema={createCargoSchema}
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
                        label: city.title,
                        value: city.id.toString()
                      }))}
                      name="destination"
                      formikError={errors.destination}
                      textStyle="text-right"
                      containerStyle="mt-3 w-full"
                      iconName="dot-circle-o"
                      onSelect={() => setFieldError("destination", undefined)}
                    />
                  </View>
                  <View style={tw`w-[48%]`}>
                    <DropdownInput
                      title="مبدا"
                      options={data?.map((city: FetchedCity) => ({
                        label: city.title,
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
                      disableSearch={true}
                      onSelect={() => setFieldError("cargoType", undefined)}
                    />
                  </View>

                  <View style={tw`w-[88%] mt-10`}>
                    <FormField
                      title="کرایه (تومان)"
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
                      <Text style={tw`text-xs text-gray-500  text-right font-vazir`}>
                        {formatFee(values.fee)} تومان
                      </Text>
                    )}
                  </View>
                  {/* {console.log(values)} */}
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
                        otherStyles="mb-1 w-full"
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