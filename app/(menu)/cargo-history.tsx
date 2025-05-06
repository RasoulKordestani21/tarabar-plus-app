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
  RefreshControl
} from "react-native";
import CargoCard from "@/components/CargoCard";
import CargoForm from "@/components/CargoForm";
import {
  deleteCargo,
  getAllCargoes,
  updateCargo
} from "@/api/services/cargoServices";
import { cargoTypes, truckTypes } from "@/constants/BoxesList";
import { FontAwesome } from "@expo/vector-icons";
import tw from "@/libs/twrnc";
import { router } from "expo-router";
import { useGlobalContext } from "@/context/GlobalProvider";

const CargoHistory = () => {
  const [cargoes, setCargoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingCargo, setEditingCargo] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { phoneNumber } = useGlobalContext();

  const fetchCargoes = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllCargoes(phoneNumber);
      setCargoes(data || []);
      console.log(data);
      setError("");
    } catch (err) {
      setError("Failed to fetch cargo history.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCargoes();
  }, [fetchCargoes]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchCargoes();
    } finally {
      setRefreshing(false);
    }
  }, [fetchCargoes]);

  // Handle Edit
  const handleEdit = cargo => {
    setEditingCargo({
      id: cargo?._id,
      origin: cargo?.origin || "",
      destination: cargo?.destination || "",
      truckType:
        truckTypes.find(ele => Number(ele.value) === cargo.truckTypeId)
          ?.label || "",
      cargoType:
        cargoTypes.find(ele => Number(ele.value) === cargo.cargoTypeId)
          ?.label || "",
      fee: cargo?.carriageFee || "",
      description: cargo?.description || "",
      transportType: cargo?.transportType || "",
      insurancePercentage: cargo?.insurancePercentage || "",
      cargoWeight: cargo?.cargoWeight || ""
    });
    setModalVisible(true);
  };

  // Handle Remove
  const handleRemove = cargoId => {
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
              // Update local state after successful delete
              setCargoes(prevCargoes =>
                prevCargoes.filter(cargo => cargo._id !== cargoId)
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

  // Handle Modal Close
  const handleCloseModal = () => {
    setModalVisible(false);
    setEditingCargo(null);
  };

  // Handle Update
  const handleUpdate = async updatedCargo => {
    try {
      if (!editingCargo || !editingCargo.id) {
        throw new Error("Missing cargo ID");
      }

      // Here you would call your updateCargo API
      // const response = await updateCargo(editingCargo.id, updatedCargo);

      // Update the cargo list locally
      setCargoes(prevCargoes =>
        prevCargoes.map(cargo =>
          cargo._id === editingCargo.id ? { ...cargo, ...updatedCargo } : cargo
        )
      );

      Alert.alert("موفقیت", "بار با موفقیت به‌روزرسانی شد");
      handleCloseModal();
    } catch (error) {
      console.error("Error updating cargo:", error);
      Alert.alert(
        "خطا",
        "به‌روزرسانی بار با خطا مواجه شد. لطفا مجددا تلاش کنید."
      );
    }
  };

  // Handle navigation
  const handleBack = () => {
    router.back();
  };

  const handleAddNew = () => {
    router.push("/create-cargo");
  };

  const formatPrice = (priceStr: string) => {
    if (priceStr === "توافقی") return priceStr;

    try {
      // If price is a number, format it with commas
      const priceNum = parseInt(priceStr.replace(/[^0-9]/g, ""), 10);
      if (!isNaN(priceNum)) {
        return priceNum.toLocaleString("fa-IR") + " تومان";
      }
      return priceStr;
    } catch {
      return priceStr;
    }
  };

  const renderContent = () => {
    if (loading && !refreshing) {
      return (
        <View style={tw`flex-1 justify-center items-center p-8`}>
          <ActivityIndicator size="large" color="#0066cc" />
          <Text style={tw`mt-4 text-gray-600 font-vazir`}>
            در حال بارگذاری...
          </Text>
        </View>
      );
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

    if (cargoes.length === 0) {
      return (
        <View style={tw`flex-1 justify-center items-center p-8 mt-8`}>
          <FontAwesome
            name="inbox"
            size={40}
            color="#a0aec0"
            style={tw`mb-3`}
          />
          <Text style={tw`text-gray-600 font-vazir text-lg text-center mb-4`}>
            شما هنوز هیچ باری ثبت نکرده‌اید
          </Text>
          {/* <TouchableOpacity
            onPress={handleAddNew}
            style={tw`bg-primary p-3 px-6 rounded-lg flex-row items-center`}
          >
            <FontAwesome name="plus" size={16} color="white" style={tw`mr-2`} />
            <Text style={tw`text-white font-vazir`}>ثبت بار جدید</Text>
          </TouchableOpacity> */}
        </View>
      );
    }

    return (
      <ScrollView
        contentContainerStyle={tw`pb-4`}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={tw`p-4 flex-row justify-between items-center`}>
          <Text style={tw`text-gray-700 font-vazir`}>
            {cargoes.length} بار یافت شد
          </Text>
          {/* <TouchableOpacity
            onPress={handleAddNew}
            style={tw`bg-primary p-2 px-3 rounded-md flex-row items-center`}
          >
            <FontAwesome name="plus" size={12} color="white" style={tw`mr-1`} />
            <Text style={tw`text-white font-vazir text-sm`}>بار جدید</Text>
          </TouchableOpacity> */}
        </View>

        {cargoes.map(cargo => (
          <CargoCard
            key={cargo._id}
            originCity={cargo?.origin?.title || "نامشخص"}
            originProvince={cargo?.origin?.provinceName || "نامشخص"}
            destinationCity={cargo?.destination?.title || "نامشخص"}
            destinationProvince={cargo?.destination?.provinceName || "نامشخص"}
            distance={cargo?.distance ? `${cargo.distance}` : "نامشخص"}
            truckType={
              truckTypes.find(ele => Number(ele.value) === cargo.truckTypeId)
                ?.label || "نامشخص"
            }
            loadType={
              cargo?.customCargoType
                ? `${
                    cargoTypes.find(
                      ele => Number(ele.value) === cargo.cargoTypeId
                    )?.label || "نامشخص"
                  } (${cargo.customCargoType})`
                : cargoTypes.find(
                    ele => Number(ele.value) === cargo.cargoTypeId
                  )?.label || "نامشخص"
            }
            ownerPhone={cargo?.ownerPhone || "نامشخص"}
            date={cargo?.updatedAt || new Date().toISOString()}
            description={cargo.description || "توضیحاتی وجود ندارد."}
            price={
              cargo?.cargoWeight
                ? `${cargo.cargoWeight} تن - هر تن ${formatPrice(
                    cargo.carriageFee
                  )}`
                : formatPrice(cargo?.carriageFee) || "توافقی"
            }
            onEdit={() => handleEdit(cargo)}
            onRemove={() => handleRemove(cargo._id)}
            showActions={true}
          />
        ))}
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderContent()}

      {/* Modal for Editing */}
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
    backgroundColor: "#f5f5f5"
  }
});

export default CargoHistory;
