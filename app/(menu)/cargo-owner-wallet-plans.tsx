import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Modal,
  SafeAreaView,
  Image,
  TouchableWithoutFeedback,
  ActivityIndicator,
  RefreshControl,
  Linking
} from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import tw from "@/libs/twrnc";
import FormField from "@/components/Input/FormField";
import DropdownInput from "@/components/Input/DropdownInput";
import CustomButton from "@/components/CustomButton";
import { router } from "expo-router";
import axios from "axios";
import { useGlobalContext } from "@/context/GlobalProvider";
import Toast from "react-native-toast-message";
import { getCargoOwner } from "@/api/services/cargoOwnerServices";
import apiClient from "@/api/apiClient";
import { usePaymentDeepLink } from "@/hooks/usePaymentDeepLinking";

interface Transaction {
  _id: string;
  type: "charge" | "deduct";
  amount: number;
  description: string;
  paymentRefId: string | null;
  createdAt: string;
}

interface CargoOwnerData {
  balance: number;
  transactions: Transaction[];
  activePlan?: {
    name: string;
    expiresAt: string;
    remainingCargos?: number;
  };
}

const subscriptionPlans = [
  {
    id: "daily",
    name: "روزانه",
    price: 25000,
    details: "نامحدود",
    duration: "1 روزه",
    description: "دسترسی نامحدود به ثبت بار به مدت یک روز"
  },
  {
    id: "weekly",
    name: "هفتگی",
    price: 75000,
    details: "30 عدد بار",
    duration: "7 روزه",
    description: "امکان ثبت 30 بار در مدت یک هفته"
  },
  {
    id: "monthly",
    name: "ماهانه",
    price: 135000,
    details: "60 عدد بار",
    duration: "30 روزه",
    description: "امکان ثبت 60 بار در مدت یک ماه"
  }
];

const CargoOwnerWalletPlan = () => {
  const { token, phoneNumber } = useGlobalContext();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const [planModalVisible, setplanModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [cargoOwnerData, setCargoOwnerData] = useState<CargoOwnerData | null>(
    null
  );
  const [isProcessing, setIsProcessing] = useState(false);

  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const fetchCargoOwnerData = async () => {
    try {
      setLoading(true);
      const response = await getCargoOwner({ phoneNumber });
      setCargoOwnerData(response?.data?.user);
    } catch (error) {
      console.error("Error fetching cargo owner data:", error);
      Toast.show({
        type: "error",
        text1: "خطا",
        text2: "خطا در دریافت اطلاعات کیف پول"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_API_URL}/api/cargo-owner/transactions`,
        {
          params: { phoneNumber },
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (cargoOwnerData) {
        setCargoOwnerData({
          ...cargoOwnerData,
          transactions: response.data.transactions
        });
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      Toast.show({
        type: "error",
        text1: "خطا",
        text2: "خطا در دریافت تراکنش‌ها"
      });
    }
  };

  // Deep link handling for payment return
  usePaymentDeepLink({
    onPaymentVerified: () => {
      // Refresh cargo owner data after successful payment
      fetchCargoOwnerData();
      fetchTransactions();
      // Reset selection
      setSelectedPlan(null);
    },
    onPaymentCancelled: () => {
      // Reset selection on payment cancellation
      setSelectedPlan(null);
    }
  });

  useEffect(() => {
    fetchCargoOwnerData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCargoOwnerData();
    setRefreshing(false);
  };

  const handlePurchasePlan = async () => {
    if (!selectedPlan) return;

    const plan = subscriptionPlans.find(p => p.id === selectedPlan);
    if (!plan) return;

    try {
      setIsProcessing(true);
      const response = await apiClient.post("api/payment/create", {
        amount: plan.price,
        description: `خرید اشتراک ${plan.name} - ${formatNumber(
          plan.price
        )} تومان`,
        userType: "cargoOwner",
        planId: plan.id,
        email: "" // Add email if you collect it
      });

      if (response.data.success) {
        // Open Zarinpal payment URL in browser
        const paymentUrl = response.data.paymentUrl;
        console.log("Opening payment URL:", paymentUrl);

        const supported = await Linking.canOpenURL(paymentUrl);
        if (supported) {
          await Linking.openURL(paymentUrl);

          // Show toast that payment is in progress
          Toast.show({
            type: "info",
            text1: "در حال پرداخت",
            text2: "شما به درگاه بانکی منتقل می‌شوید",
            autoHide: false
          });
        } else {
          Toast.show({
            type: "error",
            text1: "خطا",
            text2: "امکان باز کردن درگاه پرداخت وجود ندارد"
          });
        }
      }
    } catch (error) {
      console.error("Error creating payment:", error);
      Toast.show({
        type: "error",
        text1: "خطا",
        text2: "خطا در ایجاد پرداخت"
      });
    } finally {
      setIsProcessing(false);
      setplanModalVisible(false);
    }
  };

  if (loading) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color="#059669" />
      </View>
    );
  }

  return (
    <ScrollView
      style={tw`m-4`}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={tw`min-h-[600px]`}>
        <Modal
          visible={planModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => {
            setplanModalVisible(false);
          }}
        >
          <SafeAreaView
            style={tw`flex-1 items-center justify-center bg-black-50`}
          >
            <TouchableWithoutFeedback
              onPress={() => {
                setplanModalVisible(false);
              }}
              style={tw`flex-1 absolute top-0 left-0 w-full h-full bg-transparent z-0`}
            >
              <View
                style={tw`flex-1 absolute top-0 left-0 w-full h-full bg-black-50 z-0`}
              ></View>
            </TouchableWithoutFeedback>
            <View
              style={tw`min-h-[500px] w-9/10 bg-white p-3 mx-3 rounded-xl justify-between`}
            >
              <View>
                <Image
                  source={require("@/assets/images/increase-account-credit-icon.png")}
                  style={tw`w-40 h-40 mx-auto`}
                  resizeMode="contain"
                />
                <Text style={tw`text-center text-lg font-vazir mt-4 mb-6`}>
                  خرید اشتراک
                </Text>
                <Text style={tw`text-sm text-right font-vazir mb-3`}>
                  انتخاب طرح اشتراکی
                </Text>
                {subscriptionPlans.map(plan => (
                  <Pressable
                    key={plan.id}
                    style={[
                      tw`p-4 mb-3 rounded-lg border-2 flex-row-reverse items-center justify-between`,
                      selectedPlan === plan.id
                        ? tw`border-blue-600 bg-blue-50`
                        : tw`border-gray-300 bg-white`
                    ]}
                    onPress={() => setSelectedPlan(plan.id)}
                  >
                    <View>
                      <Text
                        style={tw`text-right font-vazir text-base ${
                          selectedPlan === plan.id
                            ? "text-blue-600"
                            : "text-gray-700"
                        }`}
                      >
                        {plan.name} ({plan.duration})
                      </Text>
                      <Text
                        style={tw`text-right font-vazir text-sm text-gray-500`}
                      >
                        {plan.details} - {formatNumber(plan.price)} تومان
                      </Text>
                    </View>
                    <View
                      style={tw`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedPlan === plan.id
                          ? "border-blue-600"
                          : "border-gray-300"
                      }`}
                    >
                      {selectedPlan === plan.id && (
                        <View style={tw`w-3 h-3 rounded-full bg-blue-600`} />
                      )}
                    </View>
                  </Pressable>
                ))}
              </View>
              <View>
                <CustomButton
                  title="پرداخت و خرید اشتراک"
                  handlePress={handlePurchasePlan}
                  containerStyles="w-full mb-4"
                  isLoading={isProcessing}
                  disabled={!selectedPlan || isProcessing}
                />
                <CustomButton
                  title="لغو"
                  handlePress={() => setplanModalVisible(false)}
                  containerStyles="w-full bg-gray-500"
                  textStyles="text-white"
                />
              </View>
            </View>
          </SafeAreaView>
        </Modal>

        {/* Active Plan Section */}
        {cargoOwnerData?.activePlan && (
          <View style={tw`mb-6`}>
            <Text style={tw`text-sm text-right font-vazir mb-2`}>
              اشتراک فعلی
            </Text>
            <View style={tw`bg-blue-600 rounded-xl py-5 px-3`}>
              <View style={tw`flex flex-row-reverse justify-between w-full`}>
                <Text style={tw`text-white text-base font-vazir`}>
                  {cargoOwnerData.activePlan.name}
                </Text>
                <Text style={tw`text-yellow-400 text-base font-vazir`}>
                  {cargoOwnerData.activePlan.remainingCargos
                    ? `${cargoOwnerData.activePlan.remainingCargos} بار باقیمانده`
                    : "نامحدود"}
                </Text>
              </View>
              <Text style={tw`text-white text-sm font-vazir mt-2 text-center`}>
                تاریخ انقضا: {formatDate(cargoOwnerData.activePlan.expiresAt)}
              </Text>
            </View>
          </View>
        )}

        {/* Wallet Balance Section */}
        <View style={tw`mb-6`}>
          <Text style={tw`text-sm text-right font-vazir mb-2`}>موجودی</Text>
          <View style={tw`bg-blue-600 rounded-xl py-5 px-3`}>
            <View style={tw`flex flex-row-reverse justify-between w-full`}>
              <Text style={tw`text-white text-base font-vazir`}>
                موجودی کیف پول
              </Text>
              <Text style={tw`text-yellow-400 text-base font-vazir`}>
                {cargoOwnerData ? formatNumber(cargoOwnerData.balance) : "0"}{" "}
                تومان
              </Text>
            </View>
          </View>
        </View>

        {/* Subscription Plans Section */}
        <View style={tw`mb-6`}>
          <Text style={tw`text-sm text-right font-vazir mb-3`}>
            طرح‌های اشتراکی
          </Text>
          <View style={tw`flex-row justify-between`}>
            <Pressable
              style={tw`w-[31%] bg-white rounded-lg shadow-sm p-3 border border-gray-200`}
              onPress={() => {
                setplanModalVisible(true);
              }}
            >
              <Text
                style={tw`text-center font-vazir text-blue-600 text-lg mb-2`}
              >
                انتخاب و خرید
              </Text>
            </Pressable>
          </View>
        </View>

        <View style={tw`w-full h-[2px] mt-5 mb-5 bg-black-300`}></View>

        {/* Transaction History Section */}
        <View style={tw`mt-8`}>
          <View style={tw`flex-row-reverse justify-between items-center mb-4`}>
            <Text style={tw`text-sm text-right font-vazir`}>
              تاریخچه تراکنش‌ها
            </Text>
            <Pressable onPress={fetchTransactions}>
              <MaterialIcons name="refresh" size={24} color="#374151" />
            </Pressable>
          </View>
          <View style={tw`bg-white rounded-lg shadow-sm p-4`}>
            {cargoOwnerData?.transactions &&
            cargoOwnerData.transactions.length > 0 ? (
              cargoOwnerData.transactions.map((transaction, index) => (
                <View
                  key={transaction._id}
                  style={[
                    tw`flex-row-reverse justify-between items-center py-3`,
                    index !== cargoOwnerData.transactions.length - 1 &&
                      tw`border-b border-gray-200`
                  ]}
                >
                  <View>
                    <Text style={tw`text-right font-vazir text-base`}>
                      {transaction.description}
                    </Text>
                    <Text
                      style={tw`text-right font-vazir text-sm text-gray-500`}
                    >
                      {formatDate(transaction.createdAt)}
                    </Text>
                    {transaction.paymentRefId && (
                      <Text
                        style={tw`text-right font-vazir text-xs text-gray-400`}
                      >
                        کد پیگیری: {transaction.paymentRefId}
                      </Text>
                    )}
                  </View>
                  <Text
                    style={[
                      tw`font-vazir text-base`,
                      transaction.type === "charge"
                        ? tw`text-green-600`
                        : tw`text-red-600`
                    ]}
                  >
                    {transaction.type === "charge" ? "+ " : "- "}
                    {formatNumber(transaction.amount)} تومان
                  </Text>
                </View>
              ))
            ) : (
              <Text style={tw`text-center text-gray-500 font-vazir py-4`}>
                هیچ تراکنشی وجود ندارد
              </Text>
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default CargoOwnerWalletPlan;
