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
  RefreshControl
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import tw from "@/libs/twrnc";
import CustomButton from "@/components/CustomButton";
import { useGlobalContext } from "@/context/GlobalProvider";
import Toast from "react-native-toast-message";
import { getCargoOwner } from "@/api/services/cargoOwnerServices";
import apiClient from "@/api/apiClient";
import { usePaymentService } from "@/hooks/usePaymentService";
import { QUERY_KEYS } from "@/constants/QueryKeys";
import { useQuery } from "@tanstack/react-query";
import moment from "jalali-moment";
import { getWalletConfig } from "@/api/services/otpServices";
import Loader from "@/components/Loader";

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

const chargeAmounts = [
  { label: "100,000 تومان", value: "100000" },
  { label: "200,000 تومان", value: "200000" },
  { label: "500,000 تومان", value: "500000" }
];

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
  const [form, setForm] = useState({
    selectedAmount: ""
  });
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const [chargeModalVisible, setChargeModalVisible] = useState(false);
  const [planModalVisible, setPlanModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [cargoOwnerData, setCargoOwnerData] = useState<CargoOwnerData | null>(
    null
  );

  // Modal for showing the result of plan selection
  const [resultModalVisible, setResultModalVisible] = useState(false);
  const [selectionResult, setSelectionResult] = useState({
    success: false,
    message: "",
    planName: "",
    neededAmount: 0
  });

  const { data, isLoading, refetch } = useQuery({
    queryKey: [QUERY_KEYS.CARGO_OWNER_INFO, phoneNumber],
    queryFn: () => getCargoOwner({ phoneNumber })
  });

  const {
    data: walletPlans,
    isLoading: isLoadingWallePlans,
    refetch: refetchWalletPlans
  } = useQuery({
    queryKey: [phoneNumber],
    queryFn: () => getWalletConfig()
  });

  // Use the new payment service
  const { initiatePayment, isProcessing } = usePaymentService({
    userType: "cargoOwner",
    phoneNumber,
    onPaymentVerified: () => {
      // Refresh cargo owner data after successful payment
      refetch();
      fetchTransactions();
      // Reset selections
      setForm({ selectedAmount: "" });
      setSelectedPlan(null);
    },
    onPaymentCancelled: () => {
      // Reset selections on payment cancellation
      setForm({ selectedAmount: "" });
      setSelectedPlan(null);
    },
    onPaymentError: () => {
      // Reset selections on payment error
      setForm({ selectedAmount: "" });
      setSelectedPlan(null);
      Toast.show({
        type: "error",
        text1: "خطا",
        text2: "خطا در فرآیند پرداخت. لطفاً دوباره تلاش کنید"
      });
    }
  });

  const formatNumber = (num: number) => {
    return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  useEffect(() => {
    if (data) {
      setCargoOwnerData(data?.user);
    }
  }, [data]);

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

  const fetchTransactions = async () => {
    try {
      const response = await apiClient.get(`/api/cargo-owner/transactions`, {
        params: { phoneNumber },
        headers: { Authorization: `Bearer ${token}` }
      });

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

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  // Updated to use the new payment service
  const handleChargeWallet = async () => {
    if (!form.selectedAmount) return;

    const amount = parseInt(form.selectedAmount);
    const description = `شارژ کیف پول - ${formatNumber(amount)} تومان`;

    setChargeModalVisible(false);

    // Use the payment service to handle payment
    await initiatePayment(amount, description);
  };

  // Plan selection logic remains mostly the same
  const handleSelectPlan = async () => {
    if (!selectedPlan) return;

    const plan = (walletPlans?.subscriptionPlans ?? subscriptionPlans).find(p => p.id === selectedPlan);
    if (!plan) return;

    setPlanModalVisible(false);

    // Check if user has enough balance to select the plan
    if (cargoOwnerData && cargoOwnerData.balance >= plan.price) {
      try {
        const processing = true;
        // Use direct API endpoint for purchasing plan with wallet balance
        const response = await apiClient.post(
          "api/cargo-owner/subscription-plan",
          {
            planId: plan.id,
            phoneNumber
          }
        );

        if (response.data.success) {
          // Show success result
          setSelectionResult({
            success: true,
            message: `اشتراک ${plan.name} با موفقیت فعال شد`,
            planName: plan.name,
            neededAmount: 0
          });

          // Refresh data to show new active plan and updated balance
          await refetch();
        } else {
          // Show error result
          setSelectionResult({
            success: false,
            message: response.data.message || "خطا در انتخاب اشتراک",
            planName: plan.name,
            neededAmount: 0
          });
        }
      } catch (error) {
        console.error("Error selecting plan:", error);
        // Show error result
        setSelectionResult({
          success: false,
          message: "خطا در انتخاب اشتراک",
          planName: plan.name,
          neededAmount: 0
        });
      } finally {
        setResultModalVisible(true);
      }
    } else {
      // Not enough balance - show failure result and prompt to charge
      const neededAmount = plan.price - (cargoOwnerData?.balance || 0);

      setSelectionResult({
        success: false,
        message: "موجودی ناکافی",
        planName: plan.name,
        neededAmount: neededAmount
      });

      setResultModalVisible(true);
    }
  };

  if (isLoading || isLoadingWallePlans) {
    return <Loader isLoading={isLoading || isLoadingWallePlans} />;
  }

  return (
    <ScrollView
      style={tw`m-4`}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={tw`min-h-[600px]`}>
        {/* Charge Wallet Modal */}
        <Modal
          visible={chargeModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => {
            setChargeModalVisible(false);
          }}
        >
          <SafeAreaView
            style={tw`flex-1 items-center justify-center bg-black-50`}
          >
            <TouchableWithoutFeedback
              onPress={() => {
                setChargeModalVisible(false);
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
                  شارژ کیف پول
                </Text>
                <Text style={tw`text-sm text-right font-vazir mb-3`}>
                  مبلغ شارژ
                </Text>

                {(walletPlans.chargeAmounts ?? chargeAmounts).map(charge => (
                  <Pressable
                    key={charge.value}
                    style={[
                      tw`p-4 mb-3 rounded-lg border-2 flex-row-reverse items-center justify-between`,
                      form.selectedAmount === charge.value
                        ? tw`border-green-600 bg-green-100`
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
                  handlePress={() => setChargeModalVisible(false)}
                  containerStyles="w-full bg-gray-500"
                  textStyles="text-white"
                />
              </View>
            </View>
          </SafeAreaView>
        </Modal>

        {/* Purchase Plan Modal */}
        <Modal
          visible={planModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => {
            setPlanModalVisible(false);
          }}
        >
          <SafeAreaView
            style={tw`flex-1 items-center justify-center bg-black-50`}
          >
            <TouchableWithoutFeedback
              onPress={() => {
                setPlanModalVisible(false);
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
                  انتخاب اشتراک
                </Text>

                {/* Current balance display */}
                <View style={tw`bg-gray-100 p-3 rounded-lg mb-4`}>
                  <Text style={tw`text-center font-vazir text-gray-700`}>
                    موجودی فعلی:{" "}
                    <Text style={tw`text-blue-600 font-bold`}>
                      {formatNumber(cargoOwnerData?.balance || 0)} تومان
                    </Text>
                  </Text>
                </View>

                <Text style={tw`text-sm text-right font-vazir mb-3`}>
                  انتخاب طرح اشتراکی
                </Text>
                {(walletPlans?.subscriptionPlans ?? subscriptionPlans).map(
                  plan => {
                    const hasEnoughBalance =
                      cargoOwnerData && cargoOwnerData.balance >= plan.price;

                    return (
                      <Pressable
                        key={plan.id}
                        style={[
                          tw`p-4 mb-3 rounded-lg border-2 flex-row-reverse items-center justify-between`,
                          selectedPlan === plan.id
                            ? tw`border-green-400 bg-green-200`
                            : tw`border-gray-300 bg-white`
                        ]}
                        onPress={() => setSelectedPlan(plan.id)}
                      >
                        <View style={tw`flex-1`}>
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

                          {/* Balance status */}
                          <View style={tw`flex-row-reverse mt-2 items-center`}>
                            <View
                              style={[
                                tw`w-2 h-2 rounded-full mr-1`,
                                hasEnoughBalance
                                  ? tw`bg-green-500`
                                  : tw`bg-red-500`
                              ]}
                            />
                            <Text
                              style={[
                                tw`text-xs font-vazir`,
                                hasEnoughBalance
                                  ? tw`text-green-600`
                                  : tw`text-red-600`
                              ]}
                            >
                              {hasEnoughBalance
                                ? "قابل انتخاب با موجودی فعلی"
                                : "نیاز به شارژ بیشتر"}
                            </Text>
                          </View>
                        </View>
                        <View
                          style={tw`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            selectedPlan === plan.id
                              ? "border-blue-600"
                              : "border-gray-300"
                          }`}
                        >
                          {selectedPlan === plan.id && (
                            <View
                              style={tw`w-3 h-3 rounded-full bg-green-600`}
                            />
                          )}
                        </View>
                      </Pressable>
                    );
                  }
                )}
              </View>
              <View>
                <CustomButton
                  title="انتخاب اشتراک"
                  handlePress={handleSelectPlan}
                  containerStyles="w-full mb-4"
                  isLoading={isProcessing}
                  disabled={!selectedPlan || isProcessing}
                />
                <CustomButton
                  title="لغو"
                  handlePress={() => setPlanModalVisible(false)}
                  containerStyles="w-full bg-gray-500"
                  textStyles="text-white"
                />
              </View>
            </View>
          </SafeAreaView>
        </Modal>

        {/* Plan Selection Result Modal */}
        <Modal
          visible={resultModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => {
            setResultModalVisible(false);
          }}
        >
          <SafeAreaView
            style={tw`flex-1 items-center justify-center bg-black-50`}
          >
            <TouchableWithoutFeedback
              onPress={() => {
                setResultModalVisible(false);
              }}
              style={tw`flex-1 absolute top-0 left-0 w-full h-full bg-transparent z-0`}
            >
              <View
                style={tw`flex-1 absolute top-0 left-0 w-full h-full bg-black-50 z-0`}
              ></View>
            </TouchableWithoutFeedback>
            <View
              style={tw`min-h-[300px] w-9/10 bg-white p-4 mx-3 rounded-xl justify-between`}
            >
              <View style={tw`items-center`}>
                {selectionResult.success ? (
                  <>
                    <View
                      style={tw`w-16 h-16 bg-green-100 rounded-full items-center justify-center mb-4`}
                    >
                      <MaterialIcons name="check" size={40} color="#059669" />
                    </View>
                    <Text
                      style={tw`text-center text-lg font-vazir text-green-600 font-bold mb-2`}
                    >
                      موفقیت آمیز
                    </Text>
                    <Text style={tw`text-center text-base font-vazir mb-4`}>
                      {selectionResult.message}
                    </Text>
                  </>
                ) : (
                  <>
                    <View
                      style={tw`w-16 h-16 bg-red-100 rounded-full items-center justify-center mb-4`}
                    >
                      <MaterialIcons name="close" size={40} color="#DC2626" />
                    </View>
                    <Text
                      style={tw`text-center text-lg font-vazir text-red-600 font-bold mb-2`}
                    >
                      خطا
                    </Text>
                    <Text style={tw`text-center text-base font-vazir mb-2`}>
                      {selectionResult.message}
                    </Text>
                    {selectionResult.neededAmount > 0 && (
                      <Text
                        style={tw`text-center text-sm font-vazir text-gray-600 mb-4`}
                      >
                        برای انتخاب اشتراک {selectionResult.planName} به{" "}
                        {formatNumber(selectionResult.neededAmount)} تومان
                        موجودی بیشتر نیاز دارید
                      </Text>
                    )}
                  </>
                )}
              </View>
              <View>
                {!selectionResult.success &&
                  selectionResult.neededAmount > 0 && (
                    <CustomButton
                      title="شارژ کیف پول"
                      handlePress={() => {
                        setResultModalVisible(false);
                        setTimeout(() => {
                          setChargeModalVisible(true);
                        }, 300);
                      }}
                      containerStyles="w-full mb-4"
                    />
                  )}
                <CustomButton
                  title="متوجه شدم"
                  handlePress={() => setResultModalVisible(false)}
                  containerStyles={`w-full ${
                    selectionResult.success
                      ? "bg-green-600"
                      : !selectionResult.success &&
                        selectionResult.neededAmount > 0
                      ? "bg-gray-500"
                      : "bg-red-600"
                  }`}
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
            <View style={tw`bg-blue-600 rounded-xl py-5 px-3  bg-secondary`}>
              <View style={tw`flex flex-row-reverse justify-between w-full`}>
                <Text style={tw`text-white text-base font-vazir`}>
                  {cargoOwnerData.activePlan.name}
                </Text>
                <Text style={tw`text-background text-base font-vazir`}>
                  {cargoOwnerData.activePlan.remainingCargos
                    ? `${cargoOwnerData.activePlan.remainingCargos} بار باقیمانده`
                    : "نامحدود"}
                </Text>
              </View>
              <Text style={tw`text-white text-sm font-vazir mt-2 text-center`}>
                تاریخ انقضا:
                {moment(cargoOwnerData.activePlan.expiresAt)
                  .locale("fa")
                  .format("YYYY/MM/DD")}
              </Text>
            </View>
          </View>
        )}

        {/* Wallet Balance Section */}
        <View style={tw`mb-6 `}>
          <Text style={tw`text-sm text-right font-vazir mb-2 text-black`}>
            موجودی
          </Text>
          <View
            style={tw`bg-blue-600 rounded-xl py-5 px-3 bg-green-600 rounded-xl `}
          >
            <View style={tw`flex flex-row-reverse justify-between w-full`}>
              <Text style={tw`text-white text-base font-vazir`}>
                موجودی کیف پول
              </Text>
              <Text style={tw`text-yellow-400 text-base font-vazir`}>
                {cargoOwnerData ? formatNumber(cargoOwnerData?.balance) : "0"}{" "}
                تومان
              </Text>
            </View>
            <CustomButton
              title="شارژ کیف پول"
              handlePress={() => {
                setChargeModalVisible(true);
              }}
              containerStyles="m-auto w-50 mt-7 mb-5"
            />
          </View>
        </View>

        {/* Subscription Plans Section */}
        <View style={tw`mb-6`}>
          <Text style={tw`text-sm text-right font-vazir mb-3`}>
            طرح‌های اشتراکی
          </Text>
          <View style={tw`bg-white rounded-lg shadow-sm p-4`}>
            {(walletPlans?.subscriptionPlans ?? subscriptionPlans).map(plan => {
              // Check if user has sufficient balance
              const hasEnoughBalance =
                cargoOwnerData && cargoOwnerData.balance >= plan.price;

              return (
                <View
                  key={plan.id}
                  style={[
                    tw`mb-4 p-3 border rounded-lg`,
                    hasEnoughBalance
                      ? tw`border-green-200`
                      : tw`border-gray-200`
                  ]}
                >
                  <View
                    style={tw`flex-row-reverse justify-between items-center`}
                  >
                    <Text style={tw`text-lg font-vazir text-blue-600`}>
                      {plan.name}
                    </Text>
                    <Text style={tw`text-base font-vazir text-gray-700`}>
                      {formatNumber(plan.price)} تومان
                    </Text>
                  </View>
                  <Text
                    style={tw`text-sm font-vazir text-gray-600 my-2 text-right`}
                  >
                    {plan.description}
                  </Text>
                  <Text
                    style={tw`text-sm font-vazir text-gray-500 mb-3 text-right`}
                  >
                    مدت اعتبار: {plan.duration} • {plan.details}
                  </Text>

                  {/* Balance indicator */}
                  {cargoOwnerData && (
                    <View style={tw`mt-2 flex-row-reverse items-center`}>
                      <View
                        style={[
                          tw`w-3 h-3 rounded-full mr-1`,
                          hasEnoughBalance ? tw`bg-green-500` : tw`bg-red-500`
                        ]}
                      />
                      <Text
                        style={[
                          tw`text-xs font-vazir`,
                          hasEnoughBalance
                            ? tw`text-green-600`
                            : tw`text-red-600`
                        ]}
                      >
                        {hasEnoughBalance
                          ? "موجودی کافی برای انتخاب"
                          : `نیاز به ${formatNumber(
                              plan.price - cargoOwnerData.balance
                            )} تومان شارژ بیشتر`}
                      </Text>
                    </View>
                  )}
                </View>
              );
            })}

            <CustomButton
              title="انتخاب اشتراک"
              handlePress={() => setPlanModalVisible(true)}
              containerStyles="w-full mt-4"
              disabled={
                cargoOwnerData?.activePlan?.remainingCargos &&
                cargoOwnerData?.activePlan?.remainingCargos > 0
              }
            />
          </View>
        </View>

        <View style={tw`w-full h-[2px] mt-5 mb-5 bg-black-300`}></View>
      </View>
    </ScrollView>
  );
};

export default CargoOwnerWalletPlan;
