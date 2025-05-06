// screens/AccountScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Alert,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";
import tw from "@/libs/twrnc"; // Ensure you configure tailwind-rn or use a similar library
import FormField from "@/components/Input/FormField";
import CustomButton from "@/components/CustomButton";
import LicensePlateInput from "@/components/LicensePlateInput";
import { useGlobalContext } from "@/context/GlobalProvider";
import FileInput from "@/components/Input/FileInput";
import { uploadFile } from "@/api/services/fileServices";
import Loader from "@/components/Loader";
import { Formik } from "formik";

import {
  driverConfirmationInitialValues,
  driverConfirmValidationSchema
} from "@/constants/FormikValidation";

import DropdownInput from "@/components/Input/DropdownInput";
import {
  driverAccountSettingTextInput,
  truckTypes
} from "@/constants/BoxesList";
import { getUser, updateVerificationData } from "@/api/services/userServices";
import { useQuery } from "@tanstack/react-query";
import { updateDriverProfile } from "@/api/services/driverServices";

const AccountScreen = () => {
  const { phoneNumber, role } = useGlobalContext();

  const fileUploader = async (values: any) => {
    try {
      const formData = new FormData();

      values.nationalCard = {
        type: values.nationalCard.mimeType,
        ...values.nationalCard
      };
      formData.append("file", values.nationalCard);
      formData.append("fieldName", "national-card");
      formData.append("phoneNumber", phoneNumber);
      formData.append("clientEnvironment", "mobile-app");
      formData.append("role", role);

      console.log(formData?._parts, " this is values.nationalId");

      const uploadResult = await uploadFile(
        "upload/driver/national-card-image",
        formData
      );
      return uploadResult?.data;
    } catch (err) {
      Alert.alert("Error", "Failed to pick document");
    }
  };

  const submitHandler = async (values: any) => {
    // setLoading(true);
    try {
      if (typeof values.nationalCard !== "string") {
        const uploadedFile = await fileUploader(values);
        // console.log(uploadedFile, " this is uploadedFile");
        values.nationalCard = await uploadedFile?.file?.path;
      }

      const result = await updateDriverProfile({ ...values, phoneNumber });
      console.log(result);
      refetch();
      if (result) {
        // If OTP verification is successful, show success message
        Alert.alert("موفق", "عملیات تکمیل ثبت نام با موفقیت انجام شد..");
      } else {
        Alert.alert(
          "خطا",
          err?.message?.split("/")[1] || "خطای غیرمنتظره‌ای رخ داده است."
        );
      }

      // setLoading(false);
    } catch (err) {
      Alert.alert("Error", "Failed to pick document");
    }
  };

  const { data, error, isLoading, isFetched, refetch } = useQuery({
    queryKey: ["userInformation", phoneNumber],
    queryFn: () => getUser(phoneNumber, role)
  });

  return (
    <KeyboardAvoidingView
      style={tw`flex-1 bg-white`}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        {isLoading ? (
          <Loader isLoading={isLoading} />
        ) : (
          <Formik
            initialValues={driverConfirmationInitialValues(data)}
            validationSchema={driverConfirmValidationSchema}
            onSubmit={submitHandler}
          >
            {({ handleChange, handleSubmit, values, errors }) => (
              <ScrollView keyboardShouldPersistTaps="handled" style={tw``}>
                <View style={tw`min-h-full p-5 `}>
                  <View style={tw`flex-1 p-1 rounded-2 `}>
                    <Text style={tw`text-lg  text-right font-vazir-bold`}>
                      اطلاعات کاربر
                    </Text>
                    <View
                      style={tw`w-full h-[2px] bg-card mb-3 mt-1 rounded-xl`}
                    ></View>
                    <View style={tw`flex-row flex-wrap  justify-between `}>
                      {driverAccountSettingTextInput.map(ele => (
                        <View key={ele.name} style={tw`w-[48%] `}>
                          <FormField
                            title={ele.title}
                            handleChangeText={handleChange(ele.name)}
                            value={values[ele.name]}
                            formikError={errors[ele.name]}
                            isUsingFormik={true}
                            defaultValue={data?.user[ele.name]}
                            otherStyles="mb-1"
                            keyboardType={ele.keyboardType}
                            color="background"
                          />
                        </View>
                      ))}
                    </View>

                    <View
                      style={tw`flex-row-reverse flex-wrap justify-between items-start mb-10`}
                    >
                      <DropdownInput
                        title="نوع کشنده"
                        options={truckTypes}
                        name={"truckNavigationId"}
                        formikError={errors.truckNavigationId}
                        textStyle="text-right"
                        containerStyle="mt-3 w-[49%]"
                        iconName="caret-down"
                        defaultValue={
                          truckTypes.find(
                            ele => ele.value === data?.user?.truckNavigationId
                          )?.label
                        }
                      />
                      <FileInput
                        name={"nationalCard"}
                        formikError={errors.nationalCard}
                        defaultValue={data?.user?.nationalCard}
                        label="تصویر کارت ملی"
                      />
                    </View>

                    <LicensePlateInput
                      error={errors.licensePlate}
                      value={values.licensePlate}
                      handleChangeText={handleChange("licensePlate")}
                    />
                  </View>
                  <CustomButton
                    title="ذخیره تغییرات"
                    handlePress={handleSubmit}
                    containerStyles="w-full mt-7 bg-background mb-5 "
                  />
                </View>
              </ScrollView>
            )}
          </Formik>
        )}
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default AccountScreen;
