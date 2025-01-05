import { ActivityIndicator, Text, TouchableOpacity } from "react-native";
import tw from "@/libs/twrnc";

type Props = {
  title: string;
  handlePress: () => void;
  containerStyles: string;
  textStyles?: string | undefined;
  isLoading?: boolean;
};

const CustomButton = ({
  title,
  handlePress,
  containerStyles,
  textStyles,
  isLoading
}: Props) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      style={tw`bg-customCard rounded-xl min-h-[62px] flex flex-row justify-center items-center ${containerStyles} ${
        isLoading ? "opacity-50" : ""
      }`}
      disabled={isLoading}
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
