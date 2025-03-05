import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  Pressable,
  Text
} from "react-native";
import tw from "@/libs/twrnc";
import DropdownInput from "@/components/Input/DropdownInput";
import { cargoTypes, truckTypes } from "@/constants/BoxesList";
import FormField from "@/components/Input/FormField";
import CustomButton from "@/components/CustomButton";
import { editCargo, getAllCities } from "@/api/services/cargoServices";
import { useQuery } from "@tanstack/react-query";
import Loader from "./Loader";
import { Formik } from "formik";
import {
  createCargoInitialValues,
  createCargoSchema
} from "@/constants/FormikValidation";
import RadioInput from "./Input/RadioInput";
import { Feather, FontAwesome } from "@expo/vector-icons";

const CargoForm = ({ initialValues, onSubmit, onClose }: any) => {
  const { data, isLoading } = useQuery({
    queryKey: ["listOfCities"],
    queryFn: () => getAllCities()
  });

  const handleSubmit = async (values: any) => {
    try {
      const result = await editCargo({
        id: initialValues.id,
        ...{
          originId: values?.origin ?? initialValues.origin.cityId,
          destinationId: values?.destination ?? initialValues.destination.cityId
        },
        ...values
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
      style={tw`flex-1  `}
    >
      <View
        style={tw`m-auto items-center justify-center bg-black-50 w-full h-full `}
      >
        {isLoading ? (
          <Loader isLoading={isLoading} />
        ) : (
          <View
            style={tw` flex jusify-center items-center m-auto bg-white p-4 rounded-xl w-[95%] h-[90%]  `}
          >
            <ScrollView
              style={tw` `}
              contentContainerStyle={tw`flex-grow     `}
              keyboardShouldPersistTaps="handled"
            >
              <View style={tw`flex`}>
                {/* Close Icon */}
                <Pressable
                  onPress={() => {
                    console.log("pressed");
                    onClose();
                  }}
                  style={tw`absolute   top-0  p-4 `}
                >
                  <FontAwesome name="close" size={24} />
                </Pressable>
                <Text
                  style={tw`text-center font-vazir  text-xl text-background`}
                >
                  ویرایش بار
                </Text>
              </View>
              <View style={tw`w-full h-[1px] bg-card mb-5 mt-3`} />
              <Formik
                initialValues={createCargoInitialValues(initialValues)}
                validationSchema={createCargoSchema}
                onSubmit={handleSubmit}
              >
                {({ handleChange, handleSubmit, values, errors }) => (
                  <>
                    <View style={tw`flex-row flex-wrap  justify-between`}>
                      <View style={tw`w-[48%] `}>
                        <DropdownInput
                          title="مقصد"
                          options={data.map(city => ({
                            label: `${city.title}`,
                            value: city.id
                          }))}
                          name="destination"
                          formikError={errors.destination}
                          defaultValue={
                            data.find(ele => {
                              return (
                                ele.id === initialValues?.destination?.cityId
                              );
                            })?.title
                          }
                          textStyle="text-right"
                          containerStyle="mt-3 w-full"
                          iconName={"dot-circle-o"}
                        />
                      </View>
                      <View style={tw`w-[48%] `}>
                        <DropdownInput
                          title="مبدا"
                          options={data.map(city => ({
                            label: city.title,
                            value: city.id
                          }))}
                          name="origin"
                          formikError={errors.origin}
                          defaultValue={
                            data.find(ele => {
                              return ele.id === initialValues?.origin?.cityId;
                            })?.title
                          }
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
                          defaultValue={initialValues?.truckType}
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
                          defaultValue={initialValues?.cargoType}
                          textStyle="text-right"
                          containerStyle="mt-3 w-full"
                          iconName="caret-down"
                          // disableSearch={true} // Disable search for select-like behavior
                        />
                      </View>
                      <View style={tw`w-[48%]  mt-5 `}>
                        <FormField
                          title={"درصد بیمه"}
                          handleChangeText={handleChange("insurancePercentage")}
                          value={values.insurancePercentage}
                          formikError={errors.insurancePercentage}
                          isUsingFormik={true}
                          defaultValue={initialValues?.insurancePercentage}
                          otherStyles="mb- w-full"
                          keyboardType={
                            Platform.OS === "ios"
                              ? "name-phone-pad"
                              : "number-pad"
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
                          defaultValue={initialValues?.fee}
                          otherStyles="mb-1 w-full"
                          keyboardType={
                            Platform.OS === "ios"
                              ? "name-phone-pad"
                              : "number-pad"
                          }
                          color="background"
                        />
                      </View>

                      <RadioInput
                        value={
                          values.transportType ?? initialValues.transportType
                        }
                        handleChangeOption={handleChange("transportType")}
                        formikError={errors.transportType}
                        // defaultValue={}
                      />

                      {values.transportType === "3" ? (
                        <View style={tw`w-full mt-3 `}>
                          <FormField
                            title={"تناژ بار"}
                            handleChangeText={handleChange("cargoWeight")}
                            value={values.cargoWeight}
                            formikError={errors.cargoWeight}
                            defaultValue={initialValues?.cargoWeight}
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
                      handlePress={handleSubmit}
                      containerStyles="w-full bg-background"
                    />
                  </>
                )}
              </Formik>
            </ScrollView>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

export default CargoForm;
