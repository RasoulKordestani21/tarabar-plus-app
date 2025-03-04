import React from "react";
import { View, ScrollView, Platform, KeyboardAvoidingView } from "react-native";
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

const CreateCargo = () => {
  const { phoneNumber } = useGlobalContext();

  const { data, isLoading } = useQuery({
    queryKey: ["listOfCities"],
    queryFn: () => getAllCities()
  });

  const handleSubmit = async (values: CargoValuesProps) => {
    try {
      let cargoData: CargoSubmitProps = {
        originId: Number(values.origin),
        destinationId: Number(values.destination),
        truckTypeId: Number(values.truckType),
        cargoTypeId: Number(values.cargoType),
        carriageFee: values.fee,
        description: values.description,
        ownerPhone: phoneNumber,
        transportType: values.transportType,
        insurancePercentage: values.insurancePercentage
      };

      if (values.transportType === "3") {
        cargoData = { ...cargoData, cargoWeight: values.cargoWeight };
      }

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
      {isLoading ? (
        <Loader isLoading={isLoading} />
      ) : (
        <ScrollView
          style={tw`bg-white`}
          contentContainerStyle={tw`flex-grow justify-between p-4`}
          keyboardShouldPersistTaps="handled"
        >
          <Formik
            initialValues={createCargoInitialValues({})}
            validationSchema={createCargoSchema}
            onSubmit={handleSubmit}
          >
            {({ handleChange, handleSubmit, values, errors }) => (
              <>
                <View style={tw`flex-row flex-wrap  justify-between`}>
                  <View style={tw`w-[48%] `}>
                    <DropdownInput
                      title="مقصد"
                      options={data.map((city: FetchedCity) => ({
                        label: `${city.title}`,
                        value: city.id
                      }))}
                      name="destination"
                      formikError={errors.destination}
                      textStyle="text-right"
                      containerStyle="mt-3 w-full"
                      iconName={"dot-circle-o"}
                    />
                  </View>
                  <View style={tw`w-[48%] `}>
                    <DropdownInput
                      title="مبدا"
                      options={data.map((city: FetchedCity) => ({
                        label: city.title,
                        value: city.id
                      }))}
                      name="origin"
                      formikError={errors.origin}
                      textStyle="text-right"
                      containerStyle="mt-3 w-full"
                      iconName={"dot-circle-o"}
                    />
                  </View>

                  <View style={tw`w-[48%] `}>
                    <DropdownInput
                      title="نوع کشنده"
                      options={truckTypes}
                      name={"truckType"}
                      formikError={errors.truckType}
                      textStyle="text-right"
                      containerStyle="mt-3 w-full"
                      iconName="caret-down"
                    />
                  </View>
                  <View style={tw`w-[48%] `}>
                    <DropdownInput
                      title="نوع بار"
                      options={cargoTypes}
                      name={"cargoType"}
                      formikError={errors.cargoType}
                      textStyle="text-right"
                      containerStyle="mt-3 w-full"
                      iconName="caret-down"
                      disableSearch={true} // Disable search for select-like behavior
                    />
                  </View>
                  <View style={tw`w-[48%]  mt-5 `}>
                    <FormField
                      title={"درصد بیمه"}
                      handleChangeText={handleChange("insurancePercentage")}
                      value={values.insurancePercentage}
                      formikError={errors.insurancePercentage}
                      isUsingFormik={true}
                      otherStyles="mb- w-full"
                      keyboardType={
                        Platform.OS === "ios" ? "name-phone-pad" : "number-pad"
                      }
                      color="background"
                    />
                  </View>

                  <View style={tw`w-[48%] mt-5 `}>
                    <FormField
                      title={"کرایه (تومان)"}
                      handleChangeText={handleChange("fee")}
                      value={values.fee}
                      formikError={errors.fee}
                      isUsingFormik={true}
                      otherStyles="mb-1 w-full"
                      keyboardType={
                        Platform.OS === "ios" ? "name-phone-pad" : "number-pad"
                      }
                      color="background"
                    />
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
