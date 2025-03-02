import React, { useState, useEffect, SetStateAction } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert
} from "react-native";
import tw from "@/libs/twrnc";
import { FontAwesome } from "@expo/vector-icons"; // For the "×" icon
import { getAllCities } from "@/api/services/cargoServices"; // Assume you have a service to fetch cities
import LocationSelectType from "./shared/LocationSelectType";
import CustomChipList from "./shared/CustomChipList";
import CustomButton from "../CustomButton";
import { City, FetchedCities, LocationSelectionProps } from "./types/types";
import FormField from "../Input/FormField";

const LocationSelection: React.FC<LocationSelectionProps> = ({
  visible,
  onClose,
  onSelect,
  selectedCities,
  removeSelectedCity,
  locationType,
  handleRemoveAll
}) => {
  const [cities, setCities] = useState([]);
  const [groupedCities, setGroupedCities] = useState<any>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedProvince, setExpandedProvince] = useState<string | null>(null); // Track the expanded province

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const result = await getAllCities();
        const formatedResult = await result.map((ele: FetchedCities) => {
          return {
            id: ele.id,
            title: ele.title,
            provinceId: ele.province_id,
            provinceName: ele.provinceName
          };
        });
        setCities(formatedResult);

        groupCitiesByProvince(formatedResult);
      } catch (error) {
        console.error("Failed to fetch cities:", error);
      }
    };

    fetchCities();
  }, []);

  useEffect(() => {
    // Reset selected cities and search query when modal is closed or cities change
    if (!visible) {
      setSearchQuery("");
    }
  }, [visible]);

  // Group cities by province
  const groupCitiesByProvince = (cities: City[]) => {
    const grouped = cities.reduce((acc: any, city) => {
      if (!acc[city.provinceId]) {
        acc[city.provinceId] = { provinceName: city.provinceName, cities: [] };
      }
      acc[city.provinceId].cities.push(city);
      return acc;
    }, {});
    setGroupedCities(grouped);
  };

  // Handle province selection to toggle expand/collapse
  const handleProvinceSelect = (provinceId: string) => {
    setExpandedProvince(prev => (prev === provinceId ? null : provinceId)); // Toggle visibility of cities
  };

  // Handle city selection
  const toggleCitySelection = (city: FetchedCities) => {
    const updatedSelectedCities = selectedCities
      ?.map(ele => ele.cityId)
      .includes(city.id)
      ? selectedCities.filter(item => item.cityName !== city.title)
      : [
          ...selectedCities,
          {
            cityId: city.id,
            cityName: city.title,
            provinceId: city.provinceId,
            provinceName: city.provinceName
          }
        ];

    // Pass the updated list back to the parent
    onSelect(updatedSelectedCities);
  };

  // Handle search query
  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
  };

  // // Handle city removal from selected cities
  // const removeSelectedCity = cityTitle => {
  //   const updatedSelectedCities = selectedCities.filter(
  //     item => item !== cityTitle
  //   );
  //   onSelect(updatedSelectedCities);
  // };

  // Handle confirming the selection
  const handleConfirmSelection = () => {
    if (selectedCities.length === 0) {
      Alert.alert("Error", "Please select at least one city.");
    } else {
      onSelect(selectedCities); // Pass the selected cities to parent
      onClose(); // Close the modal
    }
  };

  // Filter cities based on search query
  const filteredCities = cities.filter((city: { title: string }) =>
    city.title.includes(searchQuery)
  );

  const CityComponent = ({
    selectedItems,
    listOfFetchedCities
  }: {
    selectedItems: City[];
    listOfFetchedCities: FetchedCities[]; // List of cities passed down as prop
  }) => {
    return (
      <View
        style={tw`flex-row flex-wrap bg-card rounded-xl  items-center justify-center p-3 `}
      >
        {listOfFetchedCities?.map(city => (
          <TouchableOpacity
            key={city.id}
            onPress={() => toggleCitySelection(city)}
            style={[
              tw`flex-row items-center justify-between px-3 py-2 border-b-text border-b-[1px] border-b-background w-fit m-2 gap-2 rounded-1  ${
                selectedItems?.map(ele => ele.cityId).includes(city.id)
                  ? "bg-green-300"
                  : "bg-text"
              }`
            ]}
          >
            <FontAwesome
              name={
                selectedItems?.map(ele => ele.cityId).includes(city.id)
                  ? "check-square"
                  : "square"
              }
              size={20}
              color={
                selectedItems?.map(ele => ele.cityId).includes(city.id)
                  ? "#003366"
                  : "#003366"
              }
            />
            <Text
              style={tw`text-md text-background font-vazir text-right  ${
                selectedItems?.map(ele => ele.cityId).includes(city.id)
                  ? ""
                  : ""
              }`}
            >
              {city.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View
      style={tw`flex-1 justify-end items-center bg-black-50 bg-opacity-75 `}
    >
      {/* Modal Content */}
      <View style={tw`bg-white p-5 rounded-t-5 w-full max-w-md h-[90%] `}>
        {/* Close Button */}
        <TouchableOpacity onPress={onClose} style={tw`absolute top-3 left-3`}>
          <FontAwesome name="close" size={30} color="#003366" />
        </TouchableOpacity>

        <Text style={tw`text-xl font-vazir text-center mb-4`}>انتخاب شهر</Text>

        {selectedCities.length ? (
          <CustomChipList
            selectedItems={selectedCities.map(ele => {
              return { itemId: ele.cityId, itemName: ele.cityName };
            })}
            removeSelecteditems={removeSelectedCity}
            labelOfSelectedItems={
              locationType === "origin" ? "شهرهای مبدا" : "شهرهای مقصد"
            }
            itemType={locationType}
            handleRemoveAll={handleRemoveAll}
          />
        ) : (
          <View></View>
        )}

        {/* Search Bar */}
        <View
          style={tw`flex-row-reverse items-center border px-2 rounded-lg border-2 border-background  mb-4`}
        >
          <FontAwesome
            name="search"
            size={16}
            color="#003366"
            style={tw`flex-row-reverse`}
          />
          <TextInput
            style={tw`flex-1 text-sm font-vazir`}
            placeholder="جستجو در شهرها"
            value={searchQuery}
            onChangeText={handleSearchChange}
          />
        </View>
        {/* 
        <FormField
          title="شهر مورد نظر را وارد کنید "
          // placeholder="شماره موبایل خود را وارد کنید"
          // value={phoneNumber}
          handleChangeText={handleSearchChange}
          maxLength={11}
          // onValidationChange={(isValid: boolean) => setIsFormValid(isValid)} // Handle validation
          color="background"
          otherStyles="mt-7"
          // keyboardType={Platform.OS === "ios" ? "name-phone-pad" : "number-pad"}
          // defaultValue={phoneNumber}
        /> */}

        {searchQuery ? (
          <ScrollView style={tw`mb-4`}>
            <CityComponent
              listOfFetchedCities={filteredCities}
              selectedItems={selectedCities}
            />
          </ScrollView>
        ) : (
          <ScrollView style={tw`mb-4`}>
            {Object.keys(groupedCities).map((provinceId: string) => (
              <View key={provinceId}>
                {/* Province Title */}
                <TouchableOpacity
                  onPress={() => handleProvinceSelect(provinceId)}
                  style={tw`flex-row items-center justify-between px-3 py-2 border-b-text border-b-[1px] border-b-background bg-text`}
                >
                  <FontAwesome
                    name={
                      expandedProvince === provinceId
                        ? "chevron-up"
                        : "chevron-down"
                    }
                    size={14}
                    color="#0055AA"
                  />
                  <Text
                    style={tw`text-lg font-vazir text-right text-background`}
                  >
                    {groupedCities[provinceId]?.provinceName}
                  </Text>
                </TouchableOpacity>

                {/* Display Cities if Province is Expanded */}

                {expandedProvince === provinceId && (
                  <CityComponent
                    listOfFetchedCities={groupedCities[provinceId]?.cities}
                    selectedItems={selectedCities}
                  />
                )}
              </View>
            ))}
          </ScrollView>
        )}

        {/* Confirm and Cancel Buttons */}
        <View style={tw`flex-row justify-between mt-5`}>
          <CustomButton
            title="تایید موارد"
            handlePress={onClose}
            containerStyles="bg-background  w-full"
          />
        </View>
      </View>
    </View>
  );
};

export default LocationSelection;
