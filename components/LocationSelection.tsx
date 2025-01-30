import React, { useState, useEffect } from "react";
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

const LocationSelection = ({ visible, onClose, onSelect, selectedCities }) => {
  const [cities, setCities] = useState([]);
  const [groupedCities, setGroupedCities] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedProvince, setExpandedProvince] = useState(null); // Track the expanded province

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const result = await getAllCities();
        setCities(result);
        groupCitiesByProvince(result);
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
  const groupCitiesByProvince = cities => {
    const grouped = cities.reduce((acc, city) => {
      if (!acc[city.province_id]) {
        acc[city.province_id] = { provinceName: city.provinceName, cities: [] };
      }
      acc[city.province_id].cities.push(city);
      return acc;
    }, {});
    setGroupedCities(grouped);
  };

  // Handle province selection to toggle expand/collapse
  const handleProvinceSelect = provinceId => {
    setExpandedProvince(prev => (prev === provinceId ? null : provinceId)); // Toggle visibility of cities
  };

  // Handle city selection
  const toggleCitySelection = city => {
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
  const handleSearchChange = text => {
    setSearchQuery(text);
  };

  // Handle city removal from selected cities
  const removeSelectedCity = cityTitle => {
    const updatedSelectedCities = selectedCities.filter(
      item => item !== cityTitle
    );
    onSelect(updatedSelectedCities);
  };

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
  const filteredCities = cities.filter(city =>
    city.title.includes(searchQuery)
  );

  return (
    <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}>
      {/* Modal Content */}
      <View style={tw`bg-white p-5 rounded-lg w-4/5 max-w-md h-full`}>
        {/* Close Button */}
        <TouchableOpacity onPress={onClose} style={tw`absolute top-3 left-3`}>
          <FontAwesome name="close" size={30} color="#003366" />
        </TouchableOpacity>

        <Text style={tw`text-xl font-vazir text-center mb-4`}>انتخاب شهر</Text>

        {/* Search Bar */}
        <TextInput
          style={tw`border p-3 rounded-lg mb-4`}
          placeholder="جستجو در شهرها"
          value={searchQuery}
          onChangeText={handleSearchChange}
        />

        {/* Selected Cities */}
        <ScrollView>
          <View style={tw`flex-row flex-wrap mb-4 h-[200px] overflow-y`}>
            {selectedCities.map((city, index) => (
              <View
                key={index}
                style={tw`bg-yellow-100 px-4 py-2 rounded-lg mr-2 mb-2 flex-row items-center `}
              >
                <Text style={tw`text-sm text-right`}>{city.cityName}</Text>
                <FontAwesome
                  name={"close"}
                  size={14}
                  color="#0055AA"
                  onPress={() => removeSelectedCity(city)}
                  style={tw`ml-2`}
                />
              </View>
            ))}
          </View>
        </ScrollView>

        {searchQuery ? (
          <ScrollView style={tw`mb-4`}>
            {filteredCities.map(city => (
              <TouchableOpacity
                key={city.id}
                onPress={() => toggleCitySelection(city)}
                style={[
                  tw`flex-row items-center justify-between px-3 py-2 border-b-text border-b-[1px] border-b-background bg-text`
                ]}
              >
                <FontAwesome
                  name={
                    selectedCities?.map(ele => ele.cityId).includes(city.id)
                      ? "check-square"
                      : "square"
                  }
                  size={14}
                  color={
                    selectedCities?.map(ele => ele.cityId).includes(city.id)
                      ? "green"
                      : "blue"
                  }
                />
                <Text
                  style={tw`text-md text-primary font-vazir text-right ${
                    selectedCities?.map(ele => ele.cityId).includes(city.id)
                      ? "text-success"
                      : ""
                  }`}
                >
                  {city.title}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <ScrollView style={tw`mb-4`}>
            {Object.keys(groupedCities).map(provinceId => (
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
                  <View style={tw`pr-4`}>
                    {groupedCities[provinceId]?.cities?.map(city => (
                      <TouchableOpacity
                        key={city.id}
                        onPress={() => toggleCitySelection(city)}
                        style={[
                          tw`flex-row items-center justify-between px-3 py-2 border-b-text border-b-[1px] border-b-background bg-text`
                        ]}
                      >
                        <FontAwesome
                          name={
                            selectedCities
                              ?.map(ele => ele.cityId)
                              .includes(city.id)
                              ? "check-square"
                              : "square"
                          }
                          size={14}
                          color={
                            selectedCities
                              ?.map(ele => ele.cityId)
                              .includes(city.id)
                              ? "green"
                              : "blue"
                          }
                        />
                        <Text
                          style={tw`text-md text-primary font-vazir text-right ${
                            selectedCities
                              ?.map(ele => ele.cityId)
                              .includes(city.id)
                              ? "text-success"
                              : ""
                          }`}
                        >
                          {city.title}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </ScrollView>
        )}

        {/* Confirm and Cancel Buttons */}
        <View style={tw`flex-row justify-between mt-5`}>
          <TouchableOpacity
            onPress={onClose}
            style={tw`bg-white border-2 p-3 rounded-lg flex-1 mx-1`}
          >
            <Text style={tw`text-center text-red-500`}>انصراف</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleConfirmSelection}
            style={tw`bg-blue-500 p-3 rounded-lg flex-1 mx-1 bg-customCard p-3`}
          >
            <Text style={tw`text-center  text-white`}>تایید</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default LocationSelection;
