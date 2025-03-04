import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Text,
  Modal,
  Alert,
  View
} from "react-native";
import CargoCard from "@/components/CargoCard";
import CargoForm from "@/components/CargoForm";
import {
  deleteCargo,
  getAllCargoes,
  getUserHistoryCargoes
} from "@/api/services/cargoServices";
import { cargoTypes, truckTypes } from "@/constants/BoxesList";
import { useQuery } from "@tanstack/react-query";
import {
  CargoInitialEditProps,
  CargoStatesEditProps,
  CargoSubmitProps,
  CargoValuesProps
} from "./types";
import { useGlobalContext } from "@/context/GlobalProvider";

const CargoHistory = () => {
  const { phoneNumber, role } = useGlobalContext();

  const [editingCargo, setEditingCargo] =
    useState<CargoInitialEditProps | null>(null); // Current cargo being edited
  const [isModalVisible, setModalVisible] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["wholeCargoes"],
    queryFn: () => getUserHistoryCargoes(phoneNumber)
  });

  // Handle Edit
  const handleEdit = (cargo: CargoStatesEditProps) => {
    setEditingCargo({
      id: cargo?._id,
      origin: cargo?.origin || "",
      destination: cargo?.destination || "",
      truckType:
        truckTypes.find(ele => Number(ele.value) === cargo?.truckTypeId)
          ?.label || "",
      cargoType:
        cargoTypes.find(ele => Number(ele.value) === cargo?.cargoTypeId)
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
  const handleRemove = (cargoId: number) => {
    Alert.alert(
      "حذف بار",
      `آیا مطمئن هستید که می‌خواهید این بار را حذف کنید؟`,
      [
        { text: "لغو", style: "cancel" },
        {
          text: "حذف",
          style: "destructive",
          onPress: async () => {
            try {
              const result = await deleteCargo(cargoId);
              console.log("Cargo re successfully:", result);
              alert("Cargo added successfully!");
            } catch (error) {
              console.error("Error submitting cargo:", error);
              alert("Failed to add cargo. Please try again.");
            }
          }
        }
      ]
    );
  };

  // Handle Modal Close
  const handleCloseModal = () => {
    setModalVisible(false);
    setEditingCargo(null); // Clear editing cargo
  };

  console.log(role);
  // Handle Update
  const handleUpdate = (updatedCargo: any) => {
    // Update the cargo list
    // setCargoes(prevCargoes =>
    //   prevCargoes.map(cargo =>
    //     cargo.id === editingCargo.id ? { ...cargo, ...updatedCargo } : cargo
    //   )
    // );
    // handleCloseModal();
  };

  if (isLoading) {
    console.log(isLoading);
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>{"خطا در دریافت اطلاعات"}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {data?.map(cargo => (
          <CargoCard
            key={cargo._id}
            originCity={cargo?.origin?.title || "N/A"}
            originProvince={cargo?.origin?.provinceName || "N/A"}
            destinationCity={cargo?.destination?.title || "N/A"}
            destinationProvince={cargo?.destination?.provinceName || "N/A"}
            distance={cargo?.distance || "N/A"}
            ownerPhone={phoneNumber}
            truckType={
              truckTypes.find(ele => Number(ele.value) === cargo.truckTypeId)
                ?.label
            }
            loadType={
              cargoTypes.find(ele => Number(ele.value) === cargo.cargoTypeId)
                ?.label
            }
            date={cargo?.updatedAt || "N/A"}
            description={cargo.description || "No description provided."}
            price={cargo.carriageFee || "N/A"}
            onEdit={() => handleEdit(cargo)} // Pass cargo to edit handler
            onRemove={() => handleRemove(cargo._id)} // Pass cargo ID to remove handler
          />
        ))}
      </ScrollView>

      {/* Modal for Editing */}
      <Modal visible={isModalVisible} animationType="slide" transparent>
        <CargoForm
          initialValues={editingCargo}
          onSubmit={handleUpdate} // Update the cargo
          onClose={handleCloseModal} // Close the modal
        />
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5"
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 20
  }
});

export default CargoHistory;
