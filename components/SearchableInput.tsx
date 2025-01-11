import tw from "@/libs/twrnc";
import { FontAwesome } from "@expo/vector-icons";
import { useRef, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform
} from "react-native";

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
  listContainerStyle?: string;
  isDropdownVisible: boolean;
  onDropdownVisibilityChange: (value: boolean) => void;
  zIndex: number;
  dropdownRef: React.RefObject<View>;
}

const SearchableInput: React.FC<SearchableInputProps> = ({
  options,
  placeholder = "Search...",
  onSelect,
  containerStyle,
  textStyle,
  title,
  listContainerStyle,
  isDropdownVisible,
  onDropdownVisibilityChange,
  zIndex,
  dropdownRef
}) => {
  const [searchText, setSearchText] = useState("");
  const inputRef = useRef<TextInput>(null);

  const filteredOptions = isDropdownVisible
    ? options.filter(option =>
        option.label.toLowerCase().includes(searchText.toLowerCase())
      )
    : [];

  return (
    <View style={[tw`${containerStyle}`, { zIndex: zIndex }]}>
      {title && <Text style={tw`text-gray-700 text-right mb-2`}>{title}</Text>}
      <TouchableOpacity
        style={tw`border border-gray-300 rounded py-2 px-3 flex-row justify-between items-center`}
        onPress={() => {
          onDropdownVisibilityChange(!isDropdownVisible);
          if (!isDropdownVisible) {
            inputRef?.current?.focus();
          }
        }}
      >
        <TextInput
          placeholder={placeholder}
          style={tw`flex-1 ${textStyle}`}
          value={searchText}
          onChangeText={text => {
            setSearchText(text);
            if (!isDropdownVisible) {
              onDropdownVisibilityChange(true);
            }
          }}
          ref={inputRef}
        />
        <FontAwesome name="search" size={20} color="#888" />
      </TouchableOpacity>

      {isDropdownVisible && (
        <View
          style={[
            tw`bg-white border border-gray-300 rounded mt-1 absolute  left-0 right-0`,
            { maxHeight: 160 } // Limit the height
          ]}
          ref={dropdownRef}
        >
          <FlatList
            data={filteredOptions}
            keyExtractor={item => item.value}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={tw`py-2 px-3`}
                onPress={() => {
                  setSearchText(item.label);
                  onSelect(item.value);
                  onDropdownVisibilityChange(false);
                }}
              >
                <Text style={styles.label}>{item.label}</Text>
              </TouchableOpacity>
            )}
            nestedScrollEnabled // Allow scrolling within FlatList
          />
        </View>
      )}
    </View>
  );
};

export default SearchableInput;

const styles = StyleSheet.create({
  label: {
    textAlign: "right"
  }
});
