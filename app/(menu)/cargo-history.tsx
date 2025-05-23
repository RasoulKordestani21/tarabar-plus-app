import React, { useState, useEffect, useCallback } from "react";
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Text,
  Modal,
  Alert,
  View,
  TouchableOpacity,
  RefreshControl,
  TextInput,
  FlatList
} from "react-native";
import CargoCard from "@/components/CargoCardForOwner";
import ArchivedCargoCard from "@/components/ArchivedCargoCard";
import CargoForm from "@/components/CargoForm";
import { deleteCargo } from "@/api/services/cargoServices";
import {
  getAllCargoes,
  archiveCargo,
  restoreCargo
} from "@/api/services/cargoOwnerServices";
import { cargoTypes, truckTypes } from "@/constants/BoxesList";
import { FontAwesome } from "@expo/vector-icons";
import tw from "@/libs/twrnc";
import { router } from "expo-router";
import { useGlobalContext } from "@/context/GlobalProvider";
import Loader from "@/components/Loader";

type CargoTab = "active" | "archived";

interface CargoData {
  _id: string;
  cargoId?: string;
  origin?: {
    title?: string;
    provinceName?: string;
    cityId?: number;
  };
  destination?: {
    title?: string;
    provinceName?: string;
    cityId?: number;
  };
  distance?: number;
  truckTypeId?: number;
  cargoTypeId?: number;
  customCargoType?: string;
  ownerPhone?: string;
  updatedAt?: string;
  createdAt?: string;
  description?: string;
  cargoWeight?: number;
  carriageFee?: string;
  status?: string;
  transportType?: string;
  insurancePercentage?: string;
}

const CargoHistory = () => {
  const [activeCargoes, setActiveCargoes] = useState<CargoData[]>([]);
  const [archivedCargoes, setArchivedCargoes] = useState<CargoData[]>([]);
  const [filteredCargoes, setFilteredCargoes] = useState<CargoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingCargo, setEditingCargo] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<CargoTab>("active");
  const [searchText, setSearchText] = useState("");
  const [expandedCargoId, setExpandedCargoId] = useState<string | null>(null);
  const [balanceAndSubscription, setBalanceAndSubscription] = useState({
    balance: null,
    subscriptionPlan: null
  });

  // State for search and header expansion
  const [isSearchExpanded, setIsSearchExpanded] = useState(true);
  const [isResultsHeaderExpanded, setIsResultsHeaderExpanded] = useState(true);

  const { phoneNumber } = useGlobalContext();

  const fetchCargoes = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAllCargoes(phoneNumber);

      const activeCargoes = response.activeCargoes || [];
      const archivedCargoes = response.archivedCargoes || [];

      setActiveCargoes(activeCargoes);
      setArchivedCargoes(archivedCargoes);
      setBalanceAndSubscription({
        balance: response.balance,
        subscriptionPlan: response.subscriptionPlan
      });

      setFilteredCargoes(
        activeTab === "active" ? activeCargoes : archivedCargoes
      );

      setError("");
    } catch (err) {
      setError("Failed to fetch cargo history.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [phoneNumber, activeTab]);

  useEffect(() => {
    fetchCargoes();
  }, [fetchCargoes]);

  // Filter cargoes based on search text and active tab
  useEffect(() => {
    const currentCargoes =
      activeTab === "active" ? activeCargoes : archivedCargoes;

    if (!searchText.trim()) {
      setFilteredCargoes(currentCargoes);
      return;
    }

    const filtered = currentCargoes.filter(cargo => {
      const searchLower = searchText.toLowerCase();
      const originCity = cargo.origin?.title?.toLowerCase() || "";
      const destinationCity = cargo.destination?.title?.toLowerCase() || "";
      const description = cargo.description?.toLowerCase() || "";
      const ownerPhone = cargo.ownerPhone?.toLowerCase() || "";

      return (
        originCity.includes(searchLower) ||
        destinationCity.includes(searchLower) ||
        description.includes(searchLower) ||
        ownerPhone.includes(searchLower)
      );
    });

    setFilteredCargoes(filtered);
  }, [searchText, activeCargoes, archivedCargoes, activeTab]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchCargoes();
    } finally {
      setRefreshing(false);
    }
  }, [fetchCargoes]);

  const handleTabChange = (tab: CargoTab) => {
    setActiveTab(tab);
    setSearchText("");
    setExpandedCargoId(null);
    const newCargoes = tab === "active" ? activeCargoes : archivedCargoes;
    setFilteredCargoes(newCargoes);
  };

  const handleCardToggle = (cargoId: string) => {
    setExpandedCargoId(expandedCargoId === cargoId ? null : cargoId);
  };

  const toggleSearchExpansion = () => {
    setIsSearchExpanded(!isSearchExpanded);
  };

  const toggleResultsHeaderExpansion = () => {
    setIsResultsHeaderExpanded(!isResultsHeaderExpanded);
  };

  const handleEdit = (cargo: CargoData) => {
    console.log("🔍 CARGO EDIT - Original cargo data:", cargo);

    const truckTypeValue =
      truckTypes
        .find(ele => Number(ele.value) === cargo.truckTypeId)
        ?.value?.toString() || "";
    const cargoTypeValue =
      cargoTypes
        .find(ele => Number(ele.value) === cargo.cargoTypeId)
        ?.value?.toString() || "";

    let transportType = "";
    if (cargo?.transportType) {
      transportType = String(cargo.transportType);
    } else if (cargo?.transport_type) {
      transportType = String(cargo.transport_type);
    } else if (cargo?.typeOfTransport) {
      transportType = String(cargo.typeOfTransport);
    } else {
      transportType = cargo?.cargoWeight ? "3" : "2";
    }

    const editData = {
      id: cargo?.cargoId || cargo?._id,
      origin: cargo?.origin?.cityId?.toString() || "",
      destination: cargo?.destination?.cityId?.toString() || "",
      truckType: truckTypeValue,
      cargoType: cargo?.customCargoType ? "0" : cargoTypeValue,
      fee: cargo?.carriageFee?.toString().replace(/[^0-9]/g, "") || "",
      description: cargo?.description || "",
      transportType: transportType,
      insurancePercentage: cargo?.insurancePercentage || "",
      cargoWeight: cargo?.cargoWeight?.toString() || "",
      customCargoType: cargo?.customCargoType || ""
    };

    console.log("🔍 CARGO EDIT - Final edit data:", editData);
    setEditingCargo(editData);
    setModalVisible(true);
  };

  const handleRemove = (cargoId: string) => {
    Alert.alert(
      "حذف بار",
      "آیا مطمئن هستید که می‌خواهید این بار را حذف کنید؟",
      [
        { text: "لغو", style: "cancel" },
        {
          text: "حذف",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteCargo(cargoId);
              setActiveCargoes(prevCargoes =>
                prevCargoes.filter(
                  cargo => (cargo._id || cargo.cargoId) !== cargoId
                )
              );
              Alert.alert("موفقیت", "بار با موفقیت حذف شد");
            } catch (error) {
              console.error("Error deleting cargo:", error);
              Alert.alert(
                "خطا",
                "حذف بار با خطا مواجه شد. لطفا مجددا تلاش کنید."
              );
            }
          }
        }
      ]
    );
  };

  const handleArchive = async (cargoId: string) => {
    Alert.alert(
      "لغو بار",
      "با لغو کردن ، بار شما به رانندگان نمایش داده نمی‌شود و پس از آن می‌توانید با مراجعه به قسمت بار های آرشیو شده آن را فعال کنید. لازم به ذکر است برای فعال سازی دوباره آن باید اشتراک یا کیف پول شما شارژ حذاقل ۲۵،۰۰۰ داشته باشید .  \n آیا می‌خواهید این بار را به آرشیو منتقل کنید؟",
      [
        { text: "لغو", style: "cancel" },
        {
          text: "اعمال کردن",
          onPress: async () => {
            try {
              await archiveCargo(phoneNumber, cargoId);

              const cargoToArchive = activeCargoes.find(
                c => (c._id || c.cargoId) === cargoId
              );
              if (cargoToArchive) {
                setActiveCargoes(prev =>
                  prev.filter(c => (c._id || c.cargoId) !== cargoId)
                );
                setArchivedCargoes(prev => [
                  ...prev,
                  { ...cargoToArchive, status: "archived" }
                ]);
              }

              Alert.alert("موفقیت", "بار با موفقیت آرشیو شد");
            } catch (error) {
              console.error("Error archiving cargo:", error);
              Alert.alert("خطا", "آرشیو بار با خطا مواجه شد.");
            }
          }
        }
      ]
    );
  };

  const handleRestore = async (cargoId: string) => {
    Alert.alert(
      "بازگردانی بار",
      `توجه داشته باشید برای بارگردانی اگر اشتراک شما فعال باشد ۱ بار از تعداد مجموع کم می‌شود .اگر هم اشتراک نداشته باشید مبلغ ۲۵,۰۰۰ از حساب شما کم می‌شود . \nحساب شما: ${
        balanceAndSubscription.subscriptionPlan?.isActive
          ? `فعال \n تعداد بار های باقیمانده: ${balanceAndSubscription.subscriptionPlan?.remainingCargos}`
          : "غیرفعال"
      } \nموجودی کیف پول شما ${
        balanceAndSubscription?.balance
      } \n می‌خواهید این بار را به لیست بارهای فعال بازگردانید؟`,
      [
        { text: "لغو", style: "cancel" },
        {
          text: "بازگردانی",
          onPress: async () => {
            try {
              await restoreCargo(phoneNumber, cargoId);

              const cargoToRestore = archivedCargoes.find(
                c => (c._id || c.cargoId) === cargoId
              );
              if (cargoToRestore) {
                setArchivedCargoes(prev =>
                  prev.filter(c => (c._id || c.cargoId) !== cargoId)
                );
                setActiveCargoes(prev => [
                  ...prev,
                  { ...cargoToRestore, status: "active" }
                ]);
              }

              Alert.alert("موفقیت", "بار با موفقیت بازگردانی شد");
              fetchCargoes();
            } catch (error) {
              console.error("Error restoring cargo:", error);
              Alert.alert("خطا", "بازگردانی بار با خطا مواجه شد.");
            }
          }
        }
      ]
    );
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setEditingCargo(null);
  };

  const handleUpdate = async (updatedCargo: any) => {
    try {
      await fetchCargoes();
      handleCloseModal();
    } catch (error) {
      console.error("Error in update handler:", error);
    }
  };

  const handleAddNew = () => {
    router.push("/create-cargo");
  };

  const formatPrice = (priceStr: string) => {
    if (priceStr === "توافقی") return priceStr;

    try {
      const priceNum = parseInt(priceStr.replace(/[^0-9]/g, ""), 10);
      if (!isNaN(priceNum)) {
        return priceNum.toLocaleString("fa-IR") + " تومان";
      }
      return priceStr;
    } catch {
      return priceStr;
    }
  };

  const renderTabButton = (tab: CargoTab, label: string, count: number) => (
    <TouchableOpacity
      style={[
        tw`flex-1 p-3 rounded-lg mx-1`,
        activeTab === tab ? tw`bg-primary` : tw`bg-gray-200`
      ]}
      onPress={() => handleTabChange(tab)}
    >
      <Text
        style={[
          tw`text-center font-vazir`,
          activeTab === tab ? tw`text-white` : tw`text-gray-700`
        ]}
      >
        {label} ({count})
      </Text>
    </TouchableOpacity>
  );

  const renderSearchBar = () => (
    <View style={tw`bg-white`}>
      <TouchableOpacity
        onPress={toggleSearchExpansion}
        style={tw`py-3 px-4 flex-row justify-between items-center border-b border-gray-200`}
      >
        <Text style={tw`font-vazir text-gray-700`}>جستجو در بارها</Text>
        <FontAwesome
          name={isSearchExpanded ? "chevron-up" : "chevron-down"}
          size={14}
          color="#6B7280"
        />
      </TouchableOpacity>

      {isSearchExpanded && (
        <View style={tw`py-3 px-4 `}>
          <View
            style={tw`flex-row items-center border-2 border-background rounded-lg px-2`}
          >
            <FontAwesome
              name="search"
              size={16}
              color="#9CA3AF"
              style={tw`mr-2`}
            />
            <TextInput
              style={tw`flex-1 font-vazir text-right`}
              placeholder=" جستجو با نام شهر مبدا و مقصد ..."
              placeholderTextColor="#9CA3AF"
              value={searchText}
              onChangeText={setSearchText}
              textAlign="right"
            />
            {searchText.length > 0 && (
              <TouchableOpacity onPress={() => setSearchText("")}>
                <FontAwesome name="times" size={16} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
    </View>
  );

  const renderResultsHeader = () => (
    <View style={tw`bg-white`}>
      <TouchableOpacity
        onPress={toggleResultsHeaderExpansion}
        style={tw`py-3 px-4 flex-row justify-between items-center border-b border-gray-200`}
      >
        <Text style={tw`font-vazir text-gray-700`}>نتایج</Text>
        <FontAwesome
          name={isResultsHeaderExpanded ? "chevron-up" : "chevron-down"}
          size={14}
          color="#6B7280"
        />
      </TouchableOpacity>

      {isResultsHeaderExpanded && (
        <View style={tw`p-4 flex-row justify-between items-center`}>
          <Text style={tw`text-gray-700 font-vazir`}>
            {searchText
              ? `${filteredCargoes.length} نتیجه برای "${searchText}"`
              : `${filteredCargoes.length} بار یافت شد`}
          </Text>
          {activeTab === "active" && (
            <TouchableOpacity
              onPress={handleAddNew}
              style={tw`bg-primary p-2 px-3 rounded-md flex-row items-center`}
            >
              <FontAwesome
                name="plus"
                size={12}
                color="white"
                style={tw`mr-1`}
              />
              <Text style={tw`text-white font-vazir text-sm`}>بار جدید</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );

  const renderCargoItem = ({
    item,
    index
  }: {
    item: CargoData;
    index: number;
  }) => {
    const cargoId = item._id || item.cargoId || `${index}`;
    const isExpanded = expandedCargoId === cargoId;

    if (activeTab === "archived") {
      return (
        <ArchivedCargoCard
          key={cargoId}
          cargoId={cargoId}
          originCity={item?.origin?.title || "نامشخص"}
          originProvince={item?.origin?.provinceName || "نامشخص"}
          destinationCity={item?.destination?.title || "نامشخص"}
          destinationProvince={item?.destination?.provinceName || "نامشخص"}
          distance={item?.distance ? `${item.distance}` : "نامشخص"}
          truckType={
            truckTypes.find(ele => Number(ele.value) === item.truckTypeId)
              ?.label || "نامشخص"
          }
          loadType={
            item?.customCargoType
              ? `${
                  cargoTypes.find(ele => Number(ele.value) === item.cargoTypeId)
                    ?.label || "*"
                } (${item.customCargoType})`
              : cargoTypes.find(ele => Number(ele.value) === item.cargoTypeId)
                  ?.label || "نامشخص"
          }
          ownerPhone={item?.ownerPhone || "نامشخص"}
          date={item?.updatedAt || item?.createdAt || new Date().toISOString()}
          description={item.description || "توضیحاتی وجود ندارد."}
          price={
            item?.cargoWeight
              ? `${item.cargoWeight} تن - هر تن ${formatPrice(
                  item.carriageFee
                )}`
              : formatPrice(item?.carriageFee) || "توافقی"
          }
          status={item?.status || "completed"}
          onRestore={() => handleRestore(cargoId)}
          isExpanded={isExpanded}
          onToggle={() => handleCardToggle(cargoId)}
        />
      );
    }

    return (
      <CargoCard
        key={cargoId}
        cargoId={cargoId}
        originCity={item?.origin?.title || "نامشخص"}
        originProvince={item?.origin?.provinceName || "نامشخص"}
        destinationCity={item?.destination?.title || "نامشخص"}
        destinationProvince={item?.destination?.provinceName || "نامشخص"}
        distance={item?.distance ? `${item.distance}` : "نامشخص"}
        truckType={
          truckTypes.find(ele => Number(ele.value) === item.truckTypeId)
            ?.label || "نامشخص"
        }
        loadType={
          item?.customCargoType
            ? `${
                cargoTypes.find(ele => Number(ele.value) === item.cargoTypeId)
                  ?.label || "*"
              } (${item.customCargoType})`
            : cargoTypes.find(ele => Number(ele.value) === item.cargoTypeId)
                ?.label || "نامشخص"
        }
        ownerPhone={item?.ownerPhone || "نامشخص"}
        date={item?.updatedAt || item?.createdAt || new Date().toISOString()}
        description={item.description || "توضیحاتی وجود ندارد."}
        price={
          item?.cargoWeight
            ? `${item.cargoWeight} تن - هر تن ${formatPrice(item.carriageFee)}`
            : formatPrice(item?.carriageFee) || "توافقی"
        }
        onEdit={() => handleEdit(item)}
        // onRemove={() => handleRemove(item._id)}
        onArchive={() => handleArchive(cargoId)}
        showActions={true}
        isExpanded={isExpanded}
        onToggle={() => handleCardToggle(cargoId)}
      />
    );
  };

  // MAIN CHANGE: Updated renderContent with improved empty states
  const renderContent = () => {
    if (loading && !refreshing) {
      return <Loader isLoading={loading && !refreshing} />;
    }

    if (error) {
      return (
        <View style={tw`flex-1 justify-center items-center p-8`}>
          <FontAwesome
            name="exclamation-triangle"
            size={40}
            color="#ff6b6b"
            style={tw`mb-3`}
          />
          <Text style={tw`text-red-500 text-center font-vazir text-lg mb-4`}>
            {error}
          </Text>
          <TouchableOpacity
            onPress={fetchCargoes}
            style={tw`bg-primary p-3 px-6 rounded-lg`}
          >
            <Text style={tw`text-white font-vazir`}>تلاش مجدد</Text>
          </TouchableOpacity>
        </View>
      );
    }

    // Check if current tab has any cargos (not filtered, but actual data)
    const currentTabCargos =
      activeTab === "active" ? activeCargoes : archivedCargoes;
    const hasAnyCargos = currentTabCargos.length > 0;
    const hasFilteredResults = filteredCargoes.length > 0;

    return (
      <View style={tw`flex-1`}>
        {/* Tabs - Always show */}
        <View style={tw`p-4 bg-white flex-row`}>
          {renderTabButton("active", "بارهای فعال", activeCargoes.length)}
          {renderTabButton(
            "archived",
            "بارهای آرشیو شده",
            archivedCargoes.length
          )}
        </View>

        {/* Only show search and results headers if current tab has cargos */}
        {hasAnyCargos && (
          <>
            {renderSearchBar()}
            {/* {renderResultsHeader()} */}
          </>
        )}

        {/* Empty state - No cargos in current tab at all */}
        {!hasAnyCargos ? (
          <View style={tw`flex-1 justify-center items-center p-8 mt-8`}>
            <FontAwesome
              name={activeTab === "active" ? "truck" : "archive"}
              size={50}
              color="#a0aec0"
              style={tw`mb-4`}
            />
            <Text
              style={tw`text-gray-600 font-vazir text-xl text-center mb-2 font-bold`}
            >
              {activeTab === "active"
                ? "هنوز هیچ بار فعالی ندارید"
                : "هنوز هیچ بار آرشیو شده‌ای ندارید"}
            </Text>
            <Text
              style={tw`text-gray-500 font-vazir text-center mb-6 leading-6`}
            >
              {activeTab === "active"
                ? "برای شروع، اولین بار خود را ثبت کنید و آن را با رانندگان به اشتراک بگذارید"
                : "بارهایی که آرشیو کنید در اینجا نمایش داده می‌شوند"}
            </Text>
            {activeTab === "active" && (
              <TouchableOpacity
                onPress={handleAddNew}
                style={tw`bg-primary p-4 px-8 rounded-lg flex-row items-center shadow-md`}
              >
                <FontAwesome
                  name="plus"
                  size={18}
                  color="white"
                  style={tw`mr-3`}
                />
                <Text style={tw`text-white font-vazir text-lg font-bold`}>
                  ثبت اولین بار
                </Text>
              </TouchableOpacity>
            )}
          </View>
        ) : !hasFilteredResults && searchText ? (
          /* Search result empty state */
          <View style={tw`flex-1 justify-center items-center p-8 mt-8`}>
            <FontAwesome
              name="search"
              size={50}
              color="#a0aec0"
              style={tw`mb-4`}
            />
            <Text
              style={tw`text-gray-600 font-vazir text-xl text-center mb-2 font-bold`}
            >
              نتیجه‌ای یافت نشد
            </Text>
            <Text
              style={tw`text-gray-500 font-vazir text-center mb-6 leading-6`}
            >
              برای "{searchText}" هیچ باری پیدا نشد. کلمات دیگری را امتحان کنید
            </Text>
            <TouchableOpacity
              onPress={() => setSearchText("")}
              style={tw`bg-gray-100 p-3 px-6 rounded-lg flex-row items-center`}
            >
              <FontAwesome
                name="times"
                size={16}
                color="#6B7280"
                style={tw`mr-2`}
              />
              <Text style={tw`text-gray-700 font-vazir`}>پاک کردن جستجو</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* Cargo List */
          <FlatList
            data={filteredCargoes}
            renderItem={renderCargoItem}
            keyExtractor={(item, index) =>
              item._id || item.cargoId || `${index}`
            }
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            contentContainerStyle={tw`pb-4`}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderContent()}

      {/* Modal for Editing (only for active cargoes) */}
      <Modal visible={isModalVisible} animationType="slide" transparent>
        <View
          style={tw`flex-1 justify-center items-center bg-black-50 bg-opacity-50`}
        >
          <View
            style={tw`bg-white w-11/12 rounded-lg overflow-hidden max-h-5/6`}
          >
            <View
              style={tw`bg-secondary p-3 flex-row justify-between items-center`}
            >
              <TouchableOpacity onPress={handleCloseModal}>
                <FontAwesome name="times" size={20} color="white" />
              </TouchableOpacity>
              <Text style={tw`text-lg font-vazir-bold text-white`}>
                ویرایش بار
              </Text>
              <View style={tw`w-6`} />
            </View>
            <ScrollView style={tw``}>
              <CargoForm
                initialValues={editingCargo}
                onSubmit={handleUpdate}
                onClose={handleCloseModal}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#9ca3af"
  }
});

export default CargoHistory;
