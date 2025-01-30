import React, {
  useRef,
  useState,
  useCallback,
  useMemo,
  useEffect
} from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Pressable,
  Keyboard,
  Modal,
  TouchableWithoutFeedback,
  SafeAreaView
} from "react-native";
import tw from "@/libs/twrnc";
import { FontAwesome } from "@expo/vector-icons";

interface Option {
  label: string;
  value: string;
}

interface SearchableInputProps {
  options: Option[];
  placeholder?: string;
  onSelect: (value: string) => void;
  containerStyle?: string;
  textStyle?: string;
  title?: string;
  defaultValue?: string; // New defaultValue prop
  listContainerStyle?: string;
  iconName?: "search" | "dot-circle-o" | "location-arrow" | "caret-down";
  disableSearch?: boolean;
}

const DropdownInput: React.FC<SearchableInputProps> = ({
  options,
  placeholder = "Search...",
  onSelect,
  containerStyle,
  textStyle,
  title,
  defaultValue = "", // Default value for the input
  iconName,
  disableSearch = false
}) => {
  const [searchText, setSearchText] = useState(defaultValue); // Use defaultValue
  const [isModalVisible, setIsModalVisible] = useState(false);

  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    setSearchText(defaultValue); // Update input when defaultValue changes
  }, []);

  const handleOnSelect = (label: string, value: string) => {
    setSearchText(label); // Update the input with selected value
    onSelect(value); // Notify parent component
    setIsModalVisible(false); // Close modal
    Keyboard.dismiss(); // Dismiss keyboard
  };

  const handleOpenModal = useCallback(() => {
    setIsModalVisible(true); // Open modal on focus
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalVisible(false);
    Keyboard.dismiss();
    if (!searchText.length) {
      setSearchText("");
    }
  }, [searchText]);

  // Filter options based on search text
  const filteredOptions = useMemo(() => {
    if (!isModalVisible) return [];
    return disableSearch
      ? options // Show all options if search is disabled
      : options.filter(option =>
          option.label.toLowerCase().includes(searchText.toLowerCase())
        );
  }, [isModalVisible, options, searchText, disableSearch]);

  const Item = ({ item }: { item: Option }) => (
    <Pressable
      style={tw`mb-1 rounded-md p-3 bg-white`}
      onPress={() => handleOnSelect(item.label, item.value)}
    >
      <Text style={[styles.label, tw`text-background font-vazir`]}>
        {item.label}
      </Text>
    </Pressable>
  );

  const focusStyles = useMemo(() => {
    if (isModalVisible) {
      return tw`border-secondary`;
    } else {
      if (searchText) {
        return tw`border-success`;
      } else {
        return tw`border-background`;
      }
    }
  }, [isModalVisible, searchText]);

  return (
    <View style={[tw`${containerStyle ?? ""}`]}>
      {title && (
        <Text style={tw`text-right mb-2 font-vazir text-background text-sm`}>
          {title}
        </Text>
      )}
      <Pressable
        onPress={handleOpenModal}
        style={[
          tw`rounded px-3 flex-row justify-between items-center border-2`,
          focusStyles
        ]}
      >
        <View style={tw`flex-row items-center flex-1`}>
          {searchText ? (
            <Pressable onPress={() => setSearchText("")} style={tw`mr-1`}>
              <FontAwesome name={"close"} size={24} color="#888" />
            </Pressable>
          ) : (
            <View></View>
          )}
          <Text
            style={[
              tw`flex-1 text-right py-2.5 ${
                textStyle ?? ""
              } text-background font-vazir`,
              { opacity: searchText ? 1 : 0.5 }
            ]}
          >
            {searchText || placeholder}
          </Text>
        </View>
        <FontAwesome
          name={iconName}
          size={20}
          color="#888"
          style={disableSearch ? tw`ml-1` : ""}
        />
      </Pressable>

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseModal}
      >
        <SafeAreaView
          style={tw`flex-1 items-center justify-center bg-black/60`}
        >
          <TouchableWithoutFeedback
            onPress={handleCloseModal}
            style={tw`flex-1 absolute top-0 left-0 w-full h-full bg-transparent z-0`}
          >
            <View
              style={tw`flex-1 absolute top-0 left-0 w-full h-full bg-black-50  z-0`}
            ></View>
          </TouchableWithoutFeedback>

          <View style={tw`p-5 bg-text rounded-lg min-w-[250px] w-11/12 z-50`}>
            <View
              style={[
                tw`rounded px-3 flex-row justify-between items-center border-2 mb-3`,
                focusStyles
              ]}
            >
              {searchText ? (
                <Pressable onPress={() => setSearchText("")}>
                  <FontAwesome name={"close"} size={18} color="#888" />
                </Pressable>
              ) : (
                <View></View>
              )}
              {!disableSearch ? (
                <TextInput
                  placeholder={placeholder}
                  style={tw`flex-1 ${
                    textStyle ?? ""
                  } text-background font-vazir text-right text-sm`}
                  value={searchText}
                  autoFocus
                  onChangeText={text => {
                    setSearchText(text);
                  }}
                />
              ) : (
                <Text
                  style={[
                    tw`flex-1 text-right py-2.5 ${
                      textStyle ?? ""
                    } text-background font-vazir`,
                    { opacity: searchText ? 1 : 0.5 }
                  ]}
                >
                  {searchText || placeholder}
                </Text>
              )}
              <FontAwesome
                name={iconName}
                size={20}
                color="#888"
                style={disableSearch ? tw`ml-1` : ""}
              />
            </View>
            {filteredOptions.length ? (
              <FlatList
                style={tw`max-h-[80%] w-full rounded-xl bg-text`}
                data={filteredOptions}
                keyExtractor={item => item.value}
                renderItem={({ item }) => <Item item={item} />}
                nestedScrollEnabled
                keyboardShouldPersistTaps="handled" // Allow taps to work with open keyboard
              />
            ) : (
              <Text
                style={tw`h-10 w-full rounded-xl bg-white text-center text-secodary font-vazir pt-2`}
              >
                موردی یافت نشد.
              </Text>
            )}
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

export default DropdownInput;

const styles = StyleSheet.create({
  label: {
    textAlign: "right"
  }
});
