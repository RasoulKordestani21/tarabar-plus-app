import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Alert,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator
} from "react-native";
import tw from "@/libs/twrnc";
import FormField from "@/components/Input/FormField";
import CustomButton from "@/components/CustomButton";
import LicensePlateInput from "@/components/LicensePlateInput";
import { useGlobalContext } from "@/context/GlobalProvider";
import FileInput from "@/components/Input/FileInput"; // Use your improved FileInput
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
import { getUser } from "@/api/services/userServices";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getDriverUser,
  updateDriverProfile
} from "@/api/services/driverServices";
import { QUERY_KEYS } from "@/constants/QueryKeys";
import { useToast } from "@/context/ToastContext";

const AccountScreen = () => {
  const { phoneNumber, role } = useGlobalContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const submitHandler = async values => {
    try {
      setIsSubmitting(true);

      // Create a copy of values to avoid mutating original
      const formValues = { ...values };

      // Check if nationalCard is a file object (not a string/URL)
      if (
        formValues.nationalCard &&
        typeof formValues.nationalCard === "object"
      ) {
        try {
          console.log(
            "File object before upload:",
            JSON.stringify(formValues.nationalCard)
          );
          const uploadResult = await uploadFile(
            formValues.nationalCard,
            "national-card",
            role,
            phoneNumber
          );

          console.log("Upload result:", JSON.stringify(uploadResult));
          // If upload successful, replace with the file path
          if (uploadResult?.file?.path) {
            formValues.nationalCard = uploadResult.file.path;
          } else if (uploadResult?.file?.storageUrl) {
            // If using Liara, use the storage URL
            formValues.nationalCard = uploadResult.file.storageUrl;
          }
        } catch (uploadError) {
          console.log(uploadError, "this is error ");
          setIsSubmitting(false);
          Alert.alert("خطا", "بارگذاری تصویر کارت ملی با مشکل مواجه شد");
          return;
        }
      }

      const result = await updateDriverProfile({
        ...formValues,
        phoneNumber
      });

      setIsSubmitting(false);

      if (result) {
        refetch();
        showToast(
          "اطلاعات شما با موفقیت به روز شد. نتیجه ثبت نام شما از طریق پیامک برای شما ارسال خواهد شد .",
          "success"
        );
        queryClient.invalidateQueries([QUERY_KEYS.DRIVER_INFO, phoneNumber]);
      } else {
        Alert.alert("خطا", "به روزرسانی اطلاعات با مشکل مواجه شد.");
      }
    } catch (err) {
      setIsSubmitting(false);

      Alert.alert(
        "خطا",
        err?.message?.split("/")[1] || "خطای غیرمنتظره‌ای رخ داده است."
      );
    }
  };

  // Fetch user data
  const { data, error, isLoading, isFetched, refetch } = useQuery({
    queryKey: [QUERY_KEYS.DRIVER_INFO, phoneNumber],
    queryFn: () => getDriverUser({ phoneNumber })
  });
  const rejectionNotified = useRef(false);

  useEffect(() => {
    // Only proceed if data exists, status is rejected, and we haven't shown the notification yet
    if (
      data?.user?.verification?.status === "rejected" &&
      !rejectionNotified.current
    ) {
      showToast(
        `عدم تایید حساب کابری : \n دلایل : \n ${data?.user?.verification?.rejectionReason}`,
        "error"
      );
      // Mark that we've shown the notification
      rejectionNotified.current = true;
    }
  }, [data]);

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
            {({ handleChange, handleSubmit, values, errors, isValid }) => (
              <ScrollView keyboardShouldPersistTaps="handled" style={tw``}>
                <View style={tw`min-h-full p-5`}>
                  <View style={tw`flex-1 p-1 rounded-2`}>
                    <Text style={tw`text-lg text-right font-vazir-bold`}>
                      اطلاعات کاربر
                    </Text>
                    <View
                      style={tw`w-full h-[2px] bg-card mb-3 mt-1 rounded-xl`}
                    ></View>

                    {/* Form Fields Section */}
                    <View style={tw`flex-row flex-wrap justify-between`}>
                      {driverAccountSettingTextInput.map(ele => (
                        <View key={ele.name} style={tw`w-[48%]`}>
                          <FormField
                            disabled={data?.user?.isVerified}
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
                        onSelect={handleChange("truckNavigationId")}
                        disableSearch={true}
                        disabled={data?.user?.isVerified}
                      />
                      <FileInput
                        name="nationalCard"
                        formikError={errors.nationalCard}
                        defaultValue={data?.user?.nationalCardUrl}
                        label="تصویر کارت ملی"
                        acceptedTypes={["jpg", "jpeg", "png", "heic"]}
                        disabled={data?.user?.isVerified}
                      />
                    </View>

                    <LicensePlateInput
                      error={errors.licensePlate}
                      value={values.licensePlate}
                      handleChangeText={handleChange("licensePlate")}
                      disabled={data?.user?.isVerified}
                    />
                  </View>

                  {/* Submit Button with Loading State */}
                  <CustomButton
                    title={isSubmitting ? "در حال ذخیره..." : "ذخیره تغییرات"}
                    handlePress={handleSubmit}
                    containerStyles={`w-full mt-7 ${
                      isSubmitting ? "bg-gray-400" : "bg-background"
                    } mb-5`}
                    disabled={isSubmitting || !isValid}
                    icon={
                      isSubmitting ? (
                        <ActivityIndicator size="small" color="white" />
                      ) : null
                    }
                  />

                  {/* Form Status Message */}
                  {isSubmitting && (
                    <Text style={tw`text-center text-gray-600 mb-5`}>
                      در حال بارگذاری اطلاعات، لطفا صبر کنید...
                    </Text>
                  )}
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
