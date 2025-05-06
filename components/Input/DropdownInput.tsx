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
  SafeAreaView,
  ActivityIndicator,
  BackHandler
} from "react-native";
import tw from "@/libs/twrnc";
import { FontAwesome } from "@expo/vector-icons";
import { FormikErrors, useFormikContext } from "formik";

interface Option {
  label: string;
  value: string;
}

interface SearchableInputProps {
  options: Option[];
  placeholder?: string;
  onSelect?: (value: string) => void;
  containerStyle?: string;
  textStyle?: string;
  title?: string;
  defaultValue?: string;
  listContainerStyle?: string;
  iconName?: "search" | "dot-circle-o" | "location-arrow" | "caret-down";
  disableSearch?: boolean;
  name?: string;
  formikError?:
    | string
    | FormikErrors<any>
    | string[]
    | FormikErrors<any>[]
    | undefined;
  isLoading?: boolean;
}

const DropdownInput: React.FC<SearchableInputProps> = ({
  options,
  placeholder = "",
  onSelect,
  containerStyle,
  textStyle,
  title,
  defaultValue = "",
  iconName,
  disableSearch = false,
  name,
  formikError,
  isLoading = false
}) => {
  const [searchText, setSearchText] = useState(defaultValue);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [localError, setLocalError] = useState<string | undefined>(undefined);
  const [isTouched, setIsTouched] = useState(false);

  const { setFieldValue, setFieldTouched, setFieldError, validateField } =
    useFormikContext();

  useEffect(() => {
    if (formikError) {
      setLocalError(typeof formikError === "string" ? formikError : "");
    } else {
      setLocalError(undefined);
    }
  }, [formikError]);

  const handleOpenModal = useCallback(() => {
    setIsModalVisible(true);
    setIsTouched(true);
    if (name && !searchText) {
      const initialValue =
        options.find(ele => ele.label === defaultValue)?.value || "";
      setFieldValue(name, initialValue);
    }
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleCloseModal
    );
    return () => backHandler.remove();
  }, [name, defaultValue, options, setFieldValue, searchText]);

  const handleOnSelect = async (label: string, value: string) => {
    setSearchText(label);
    if (name) {
      setFieldValue(name, value);
      setFieldTouched(name, true);
      setFieldError(name, undefined);
      setLocalError(undefined);

      if (isTouched) {
        try {
          await validateField(name);
        } catch (error) {
          // Validation error will be handled by the formikError prop
        }
      }

      if (onSelect) {
        onSelect(value);
      }
    } else if (onSelect) {
      onSelect(value);
    }
    setIsModalVisible(false);
    Keyboard.dismiss();
  };

  const handleCloseModal = useCallback(() => {
    setIsModalVisible(false);
    Keyboard.dismiss();
    if (!searchText.length) {
      setSearchText("");
      if (name) {
        setFieldValue(name, "");
        setFieldError(name, undefined);
        setLocalError(undefined);
      }
    }
  }, [searchText, name, setFieldValue, setFieldError]);

  const handleClear = useCallback(() => {
    if (name) {
      setFieldTouched(name, true);
      setFieldValue(name, "");
      setFieldError(name, undefined);
      setLocalError(undefined);
    }
    setSearchText("");
  }, [name, setFieldValue, setFieldError, setFieldTouched]);

  // Filter options based on search text
  const filteredOptions = useMemo(() => {
    if (!isModalVisible) return [];
    return disableSearch
      ? options
      : options.filter(option =>
          option.label.toLowerCase().includes(searchText.toLowerCase())
        );
  }, [isModalVisible, options, searchText, disableSearch]);

  const Item = ({ item }: { item: Option }) => (
    <Pressable
      style={tw`mb-1 rounded-md p-3 bg-white  `}
      onPress={() => handleOnSelect(item.label, item.value)}
      accessibilityRole="button"
      accessibilityLabel={`Select ${item.label}`}
    >
      <Text style={[styles.label, tw`text-background font-vazir text-right`]}>
        {item.label}
      </Text>
    </Pressable>
  );

  const focusStyles = useMemo(() => {
    if (name) {
      if (formikError) {
        return tw`border-red-500`;
      } else {
        return tw`border-background`;
      }
    } else {
      if (isModalVisible) {
        return tw`border-secondary`;
      } else {
        if (searchText) {
          return tw`border-success`;
        } else {
          return tw`border-background`;
        }
      }
    }
  }, [isModalVisible, searchText, formikError]);

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
            <Pressable onPress={handleClear} style={tw`mr-1`}>
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
        {isLoading ? (
          <ActivityIndicator size="small" color="#888" />
        ) : (
          <FontAwesome
            name={iconName}
            size={20}
            color="#888"
            style={disableSearch ? tw`ml-1` : ""}
          />
        )}
      </Pressable>
      {localError && (
        <Text style={tw`text-xs text-red-500 mt-1 font-vazir text-right`}>
          {localError}
        </Text>
      )}
      <Modal visible={isModalVisible} transparent={true} animationType="fade">
        <SafeAreaView
          style={tw`flex-1 items-center justify-center bg-black/60`}
        >
          <TouchableWithoutFeedback
            style={tw`flex-1 absolute top-0 left-0 w-full h-full bg-transparent z-0`}
            onPress={handleCloseModal}
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
                <Pressable
                  onPress={() => {
                    if (name) {
                      setFieldTouched(name, true);
                      setFieldValue(name, "");
                    }
                    setSearchText("");
                  }}
                >
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
                  accessibilityLabel="Search input"
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
            <FlatList
              data={filteredOptions}
              renderItem={({ item }) => <Item item={item} />}
              keyExtractor={item => item.value}
              style={tw`max-h-[300px]`}
              keyboardShouldPersistTaps="handled"
              ListEmptyComponent={
                <Text style={tw`text-center text-background font-vazir`}>
                  No options found
                </Text>
              }
            />
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 16
  }
});

export default React.memo(DropdownInput);
