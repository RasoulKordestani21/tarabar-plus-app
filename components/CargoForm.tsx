import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  Alert,
  Text,
  TouchableOpacity
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
import { FontAwesome, Ionicons } from "@expo/vector-icons";

const CargoForm = ({ initialValues, onSubmit, onClose }: any) => {
  // Create ref for ScrollView to control scrolling programmatically
  const scrollViewRef = React.useRef<ScrollView>(null);

  // IMPORTANT: Use local state instead of Formik for custom cargo type
  const [isCustomCargo, setIsCustomCargo] = useState(
    !!initialValues?.customCargoType
  );
  const [customCargoValue, setCustomCargoValue] = useState(
    initialValues?.customCargoType || ""
  );
  const [cargoTypeError, setCargoTypeError] = useState("");
  const [customCargoError, setCustomCargoError] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["listOfCities"],
    queryFn: () => getAllCities()
  });

  const formatFee = (value: string) => {
    if (!value) return "";
    // Remove commas first, then only keep numbers
    const number = value.replace(/[^0-9]/g, "");
    // Add commas for thousands separators
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleSubmit = async (values: any) => {
    try {
      console.log("Submit values:", values);
      console.log(
        "Custom state: isCustomCargo=",
        isCustomCargo,
        "customCargoValue=",
        customCargoValue
      );

      // Validate before submit
      let hasError = false;

      if (isCustomCargo) {
        if (!customCargoValue.trim()) {
          setCustomCargoError("نوع بار سفارشی الزامی است");
          hasError = true;
        }
      } else {
        if (!values.cargoType) {
          setCargoTypeError("نوع بار الزامی است");
          hasError = true;
        }
      }

      if (hasError) {
        Alert.alert("خطا", "لطفا تمام فیلدهای الزامی را پر کنید");
        return;
      }

      let cargoData = {
        originId: Number(values.origin),
        destinationId: Number(values.destination),
        truckTypeId: Number(values.truckType),
        cargoTypeId: isCustomCargo ? 0 : Number(values.cargoType),
        // Remove commas before sending to server
        carriageFee: values.fee.replace(/[^0-9]/g, ""),
        description: values.description,
        transportType: values.transportType
      };

      if (values.transportType === "3") {
        cargoData.cargoWeight = values.cargoWeight;
      } else {
        cargoData.cargoWeight = null;
      }

      // Add custom cargo type if using custom input
      if (isCustomCargo && customCargoValue.trim()) {
        cargoData.customCargoType = customCargoValue.trim();
      }

      // Debug log before sending to API
      console.log("Sending to API:", cargoData);

      const result = await editCargo({
        id: initialValues.id,
        ...cargoData
      });

      console.log("Cargo updated successfully:", result);
      Alert.alert("موفق", "بار با موفقیت بروز رسانی شد");
      if (onClose) onClose();
    } catch (error) {
      console.error("Error updating cargo:", error);
      Alert.alert("خطا", "بروز رسانی ناموفق بود. لطفا دوباره تلاش کنید.");
    }
  };

  // Handle the toggle between regular cargo and custom cargo
  const handleCustomCargoToggle = () => {
    console.log(
      "Toggle custom cargo from",
      isCustomCargo,
      "to",
      !isCustomCargo
    );

    // Simply toggle state
    setIsCustomCargo(!isCustomCargo);

    // Clear errors
    setCargoTypeError("");
    setCustomCargoError("");

    // Scroll to ensure button is visible
    setTimeout(() => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollToEnd({ animated: true });
      }
    }, 300);
  };

  // FIXED: All values in Formik - no separate state needed
  const preparedInitialValues = useMemo(() => {
    // Clean fee value properly - remove commas and non-numeric chars
    const cleanFee = initialValues?.fee
      ? initialValues.fee.toString().replace(/[^0-9]/g, "")
      : "";

    // Ensure transportType is a string
    const transportType = initialValues?.transportType
      ? String(initialValues.transportType)
      : "";

    const values = {
      origin: initialValues?.origin || "",
      destination: initialValues?.destination || "",
      truckType: initialValues?.truckType || "",
      cargoType: initialValues?.cargoType || "",
      fee: cleanFee,
      description: initialValues?.description || "",
      transportType: transportType,
      cargoWeight: initialValues?.cargoWeight || ""
    };

    return values;
  }, [initialValues]);

  // Helper functions to get display values for dropdowns
  const getSelectedCityLabel = (cityId: string) => {
    if (!data || !cityId) return "";
    const city = data.find(c => c.id.toString() === cityId);
    return city ? `${city.provinceName} / ${city.title}` : "";
  };

  const getSelectedTruckTypeLabel = (truckTypeValue: string) => {
    if (!truckTypeValue) return "";
    const truckType = truckTypes.find(
      t => t.value.toString() === truckTypeValue
    );
    return truckType ? truckType.label : "";
  };

  const getSelectedCargoTypeLabel = (cargoTypeValue: string) => {
    if (!cargoTypeValue || cargoTypeValue === "0") return "";
    const cargoType = cargoTypes.find(
      t => t.value.toString() === cargoTypeValue
    );
    return cargoType ? cargoType.label : "";
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={tw`flex-1`}
    >
      <View style={tw`items-center justify-center bg-black-50 w-full h-full `}>
        {isLoading ? (
          <Loader isLoading={isLoading} />
        ) : (
          <View
            style={tw`flex justify-center items-center bg-white w-full h-full`}
          >
            <ScrollView
              ref={scrollViewRef}
              style={tw`w-full`}
              contentContainerStyle={tw`p-4 pb-50`} // Increased bottom padding
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={true}
              nestedScrollEnabled={true} // Add this for better nested scroll handling
            >
              <Formik
                initialValues={preparedInitialValues}
                validationSchema={createCargoSchema}
                onSubmit={handleSubmit}
                enableReinitialize={true}
              >
                {({
                  handleChange,
                  handleSubmit,
                  values,
                  errors,
                  setFieldError,
                  setFieldValue
                }) => {
                  // Debug log for critical values
                  useEffect(() => {
                    console.log("Form values updated:", {
                      transportType: values.transportType,
                      isCustomCargo: isCustomCargo,
                      customCargoValue: customCargoValue,
                      cargoType: values.cargoType,
                      fee: values.fee
                    });
                  }, [
                    values.transportType,
                    isCustomCargo,
                    customCargoValue,
                    values.cargoType,
                    values.fee
                  ]);

                  useEffect(() => {
                    // Auto-scroll when transport type changes to show cargo weight field
                    if (values.transportType === "3") {
                      setTimeout(() => {
                        if (scrollViewRef.current) {
                          scrollViewRef.current.scrollToEnd({ animated: true });
                        }
                      }, 300);
                    }
                  }, [values.transportType]);

                  return (
                    <>
                      <View style={tw`flex-row flex-wrap justify-between`}>
                        <View style={tw`w-[48%]`}>
                          <DropdownInput
                            title="مقصد"
                            options={
                              data?.map(city => ({
                                label: `${city.provinceName} / ${city.title}`,
                                value: city.id.toString()
                              })) || []
                            }
                            name="destination"
                            formikError={errors.destination}
                            textStyle="text-right"
                            containerStyle="mt-3 w-full"
                            iconName="map-marker"
                            defaultValue={getSelectedCityLabel(
                              values.destination
                            )}
                            onSelect={() =>
                              setFieldError("destination", undefined)
                            }
                          />
                        </View>

                        <View style={tw`w-[48%]`}>
                          <DropdownInput
                            title="مبدا"
                            options={
                              data?.map(city => ({
                                label: `${city.provinceName} / ${city.title}`,
                                value: city.id.toString()
                              })) || []
                            }
                            name="origin"
                            formikError={errors.origin}
                            textStyle="text-right"
                            containerStyle="mt-3 w-full"
                            iconName="dot-circle-o"
                            defaultValue={getSelectedCityLabel(values.origin)}
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
                              اگر نوع بار مورد نظر خود را در لیست پیدا نکردید،
                              روی چک‌باکس کلیک کنید و آن را بنویسید
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
                            defaultValue={getSelectedTruckTypeLabel(
                              values.truckType
                            )}
                            onSelect={() =>
                              setFieldError("truckType", undefined)
                            }
                          />
                        </View>

                        <View style={tw`w-[48%]`}>
                          {!isCustomCargo ? (
                            <View>
                              <DropdownInput
                                title="نوع بار"
                                options={cargoTypes.map(type => ({
                                  ...type,
                                  value: type.value.toString()
                                }))}
                                name="cargoType"
                                formikError={cargoTypeError || errors.cargoType}
                                textStyle="text-right"
                                containerStyle="mt-3 w-full"
                                iconName="caret-down"
                                defaultValue={getSelectedCargoTypeLabel(
                                  values.cargoType
                                )}
                                onSelect={value => {
                                  console.log("Selected cargo type:", value);
                                  setFieldValue("cargoType", value);
                                  setCargoTypeError("");
                                }}
                              />
                            </View>
                          ) : (
                            <View style={tw`mt-3 w-full`}>
                              <FormField
                                title="نوع بار سفارشی"
                                handleChangeText={text => {
                                  setCustomCargoValue(text);
                                  if (text.trim()) {
                                    setCustomCargoError(null);
                                  }
                                }}
                                value={customCargoValue}
                                defaultValue={customCargoValue}
                                formikError={customCargoError}
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
                            style={tw`flex-row items-center justify-end mt-2`}
                            onPress={() => {
                              handleCustomCargoToggle();
                              // here we use isCustomCargo like this because of it first set field and then update itself
                              if (!isCustomCargo) {
                                setFieldValue("cargoType", "0");
                              } else {
                                setFieldValue("cargoType", "");
                              }
                            }}
                          >
                            <Text
                              style={tw`text-sm text-gray-600 font-vazir mr-2`}
                            >
                              نوع بار سفارشی
                            </Text>
                            <View
                              style={tw`w-5 h-5 border-2 rounded items-center justify-center ${
                                isCustomCargo
                                  ? "bg-background border-background"
                                  : "bg-white border-gray-400"
                              }`}
                            >
                              {isCustomCargo && (
                                <FontAwesome
                                  name="check"
                                  size={14}
                                  color="white"
                                />
                              )}
                            </View>
                          </TouchableOpacity>
                        </View>

                        {/* Transport Type Radio Input */}
                        <View style={tw`w-full mt-3`}>
                          <RadioInput
                            value={values.transportType}
                            handleChangeOption={value => {
                              console.log("Changing transportType to:", value);
                              setFieldValue("transportType", value);

                              // Clear cargoWeight if changing away from type 3
                              if (value !== "3" && values.cargoWeight) {
                                setFieldValue("cargoWeight", "");
                              }

                              // Auto-scroll after state change
                              setTimeout(() => {
                                if (scrollViewRef.current) {
                                  scrollViewRef.current.scrollToEnd({
                                    animated: true
                                  });
                                }
                              }, 300);
                            }}
                            formikError={errors.transportType}
                            defaultValue={values.transportType}
                          />
                        </View>

                        <View style={tw`w-full mt-5`}>
                          <FormField
                            title={
                              values.transportType === "3"
                                ? "کرایه هر تن (تومان)"
                                : "کرایه (تومان)"
                            }
                            handleChangeText={text => {
                              // Remove commas first
                              const numericValue = text.replace(/,/g, "");
                              console.log("Setting fee value:", numericValue);
                              setFieldValue("fee", numericValue);
                            }}
                            value={formatFee(values.fee)}
                            defaultValue={formatFee(values.fee)}
                            formikError={errors.fee}
                            isUsingFormik={true}
                            otherStyles="mb-1 w-full"
                            keyboardType={
                              Platform.OS === "ios"
                                ? "name-phone-pad"
                                : "number-pad"
                            }
                            color="background"
                          />
                          {/* Match the CreateCargo helper text behavior */}
                          {values.fee && (
                            <Text
                              style={tw`text-xs text-green-600 text-right font-vazir -mt-3 mr-2`}
                            >
                              {formatFee(values.fee)} تومان
                            </Text>
                          )}
                        </View>

                        {values.transportType === "3" && (
                          <View style={tw`w-full mt-3`}>
                            <FormField
                              title={"تناژ بار"}
                              handleChangeText={handleChange("cargoWeight")}
                              value={values.cargoWeight}
                              defaultValue={values.cargoWeight}
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
                        )}

                        {/* Description Field */}
                        <View style={tw`w-full mt-3`}>
                          <FormField
                            isMultiline={true}
                            title="توضیحات"
                            value={values.description}
                            defaultValue={values.description}
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
                        title="بروز رسانی بار"
                        handlePress={() => {
                          console.log("Submit button pressed");
                          console.log("Current form values:", values);
                          console.log(
                            "Custom state:",
                            isCustomCargo,
                            customCargoValue
                          );
                          handleSubmit();
                        }}
                        containerStyles="w-full bg-background mb-10" // Added bottom margin
                      />
                    </>
                  );
                }}
              </Formik>
            </ScrollView>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

export default CargoForm;
