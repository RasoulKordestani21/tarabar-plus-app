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
import { Formik } from "formik";
import { cargoTypes, truckTypes } from "@/constants/BoxesList";
import {
  driverConfirmationInitialValues,
  estimateFeeAndCommisionInitialValues,
  estimateFeeAndCommisionSchema
} from "@/constants/FormikValidation";
import { useQuery } from "@tanstack/react-query";
import Loader from "@/components/Loader";

interface Option {
  label: string;
  value: string;
}

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

  const [estimatedFare, setEstimatedFare] = useState<number | null>(null);
  const [estimatedCommission, setEstimatedCommission] = useState<number | null>(
    null
  );

  const handleCloseDrawer = () => {
    setFeeRangeOpened(false);
  };

  const { data, isLoading } = useQuery({
    queryKey: ["listOfCities"],
    queryFn: () => getAllCities()
  });

  const handleEstimateFare = async values => {
    try {
      const response = await estimateCommissionAndFare(
        values.origin,
        values.destination,
        values.cargoType,
        values.truckType,
        values.insurancePercentage || "0"
      );
      setEstimatedFare(response.estimation.estimatedFare);
      setEstimatedCommission(response.estimation.estimatedCommission);
      console.log(response);
      setFeeRangeOpened(true); // Open the fee range drawer
    } catch (error) {
      Alert.alert("Error estimating fare:", error.message);
    }
  };

  const handleSubmit = values => {
    console.log(values);
    handleEstimateFare(values);
  };

  return (
    <>
      {isLoading ? (
        <Loader isLoading={isLoading} />
      ) : (
        <ScrollView contentContainerStyle={tw`  p-5 pb-8`}>
          <Formik
            initialValues={estimateFeeAndCommisionInitialValues()}
            validationSchema={estimateFeeAndCommisionSchema}
            onSubmit={handleSubmit}
          >
            {({ handleChange, handleSubmit, values, errors }) => (
              <View style={tw`flex-row flex-wrap  justify-between `}>
                <View style={tw`w-[48%] `}>
                  <DropdownInput
                    title="مقصد"
                    options={data.map(city => ({
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
                    options={data.map(city => ({
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
                   
                  />
                </View>
                <View style={tw`w-full  mt-5`}>
                  <FormField
                    title={"درصد بیمه"}
                    handleChangeText={handleChange("insurancePercentage")}
                    value={values.insurancePercentage}
                    formikError={errors.insurancePercentage}
                    isUsingFormik={true}
                    otherStyles="mb-1 w-full"
                    keyboardType={
                      Platform.OS === "ios" ? "name-phone-pad" : "number-pad"
                    }
                    color="background"
                  />
                </View>

                <CustomButton
                  title="تخمین کرایه"
                  handlePress={handleSubmit} // Trigger estimate fare
                  containerStyles="w-full  bg-background"
                />
              </View>
            )}
          </Formik>
          <FeeRangeDrawer
            isVisible={feeRangeOpened}
            onClose={handleCloseDrawer}
            minFee={Number(estimatedFare) || 0}
            maxFee={estimatedFare ? Number(estimatedFare) * 2 : 0}
            currency={"تومان"}
          />
        </ScrollView>
      )}
    </>
  );
};

export default EstimateFareDrawer;
