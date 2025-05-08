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
import { getDriverUser } from "@/api/services/driverServices";
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

interface DriverData {
  balance: number;
  transactions: Transaction[];
}

const chargeAmounts = [
  { label: "100,000 تومان", value: "100000" },
  { label: "200,000 تومان", value: "200000" }
];

const DriverWalletPlan = () => {
  const { token, phoneNumber } = useGlobalContext();
  const [form, setForm] = useState({
    selectedAmount: ""
  });

  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [driverData, setDriverData] = useState<DriverData | null>(null);
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

  const fetchDriverData = async () => {
    try {
      setLoading(true);
      const response = await getDriverUser({ phoneNumber });
      setDriverData(response?.data?.user);
    } catch (error) {
      console.error("Error fetching driver data:", error);
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
      const response = await apiClient.get(`api/driver/transactions`, {
        params: { phoneNumber },
        headers: { Authorization: `Bearer ${token}` }
      });

      if (driverData) {
        setDriverData({
          ...driverData,
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
      // Refresh driver data after successful payment
      fetchDriverData();
      fetchTransactions();
      // Reset form
      setForm({ selectedAmount: "" });
    },
    onPaymentCancelled: () => {
      // Reset form on payment cancellation
      setForm({ selectedAmount: "" });
    }
  });

  useEffect(() => {
    fetchDriverData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDriverData();
    setRefreshing(false);
  };

  const handleChargeWallet = async () => {
    if (!form.selectedAmount) return;

    try {
      setIsProcessing(true);
      const response = await apiClient.post("api/payment/create", {
        amount: parseInt(form.selectedAmount),
        description: `شارژ کیف پول - ${formatNumber(
          parseInt(form.selectedAmount)
        )} تومان`,
        userType: "driver",
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
      setPaymentModalVisible(false);
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
          visible={paymentModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => {
            setPaymentModalVisible(false);
          }}
        >
          <SafeAreaView
            style={tw`flex-1 items-center justify-center bg-black-50`}
          >
            <TouchableWithoutFeedback
              onPress={() => {
                setPaymentModalVisible(false);
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
                  شارژ کیف پول راننده
                </Text>
                <Text style={tw`text-sm text-right font-vazir mb-3`}>
                  مبلغ شارژ
                </Text>
                {chargeAmounts.map(charge => (
                  <Pressable
                    key={charge.value}
                    style={[
                      tw`p-4 mb-3 rounded-lg border-2 flex-row-reverse items-center justify-between`,
                      form.selectedAmount === charge.value
                        ? tw`border-green-600 bg-green-50`
                        : tw`border-gray-300 bg-white`
                    ]}
                    onPress={() =>
                      setForm({ ...form, selectedAmount: charge.value })
                    }
                  >
                    <Text
                      style={tw`text-right font-vazir text-base ${
                        form.selectedAmount === charge.value
                          ? "text-green-600"
                          : "text-gray-700"
                      }`}
                    >
                      {charge.label}
                    </Text>
                    <View
                      style={tw`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        form.selectedAmount === charge.value
                          ? "border-green-600"
                          : "border-gray-300"
                      }`}
                    >
                      {form.selectedAmount === charge.value && (
                        <View style={tw`w-3 h-3 rounded-full bg-green-600`} />
                      )}
                    </View>
                  </Pressable>
                ))}
              </View>
              <View>
                <CustomButton
                  title="شارژ کیف پول"
                  handlePress={handleChargeWallet}
                  containerStyles="w-full mb-4"
                  isLoading={isProcessing}
                  disabled={!form.selectedAmount || isProcessing}
                />
                <CustomButton
                  title="لغو"
                  handlePress={() => setPaymentModalVisible(false)}
                  containerStyles="w-full bg-gray-500"
                  textStyles="text-white"
                />
              </View>
            </View>
          </SafeAreaView>
        </Modal>

        {/* Wallet Balance Section */}
        <View>
          <Text style={tw`text-sm text-right font-vazir mb-2`}>موجودی</Text>
          <View style={tw`bg-green-600 rounded-xl py-5 px-3`}>
            <View style={tw`flex flex-row-reverse justify-between w-full`}>
              <Text style={tw`text-background text-base font-vazir`}>
                موجودی کیف پول
              </Text>
              <Text style={tw`text-yellow-400 text-base font-vazir`}>
                {driverData ? formatNumber(driverData.balance) : "0"} تومان
              </Text>
            </View>
            <CustomButton
              title="شارژ کیف پول"
              handlePress={() => {
                setPaymentModalVisible(true);
              }}
              containerStyles="m-auto w-50 mt-7 mb-5"
            />
          </View>
        </View>

        <View style={tw`w-full h-[2px] mt-10 bg-black-300`}></View>

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
            {driverData?.transactions && driverData.transactions.length > 0 ? (
              driverData.transactions.map((transaction, index) => (
                <View
                  key={transaction._id}
                  style={[
                    tw`flex-row-reverse justify-between items-center py-3`,
                    index !== driverData.transactions.length - 1 &&
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

export default DriverWalletPlan;
