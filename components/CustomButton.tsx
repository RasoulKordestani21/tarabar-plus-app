import {
  ActivityIndicator,
  GestureResponderEvent,
  Text,
  TouchableOpacity
} from "react-native";
import tw from "@/libs/twrnc";

type Props = {
  title: string;
  handlePress?: (event: GestureResponderEvent, param?: number) => void; // Accept the event parameter
  containerStyles: string;
  textStyles?: string | undefined;
  isLoading?: boolean;
  disabled?: boolean;
};

const CustomButton = ({
  title,
  handlePress,
  containerStyles,
  textStyles,
  isLoading,
  disabled
}: Props) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      style={tw`bg-customCard rounded-xl py-3 flex flex-row justify-center items-center ${containerStyles} ${
        disabled || isLoading ? "bg-card" : ""
      }`}
      disabled={isLoading || disabled}
    >
      <Text style={tw`text-text  font-vazir text-base ${textStyles || ""}`}>
        {title}
      </Text>

      {isLoading && (
        <ActivityIndicator
          animating={isLoading}
          color="#fff"
          size="small"
          className="ml-2"
        />
      )}
    </TouchableOpacity>
  );
};

export default CustomButton;
