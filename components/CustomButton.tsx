import { ActivityIndicator, Text, TouchableOpacity } from "react-native";
import tw from "@/libs/twrnc";

const CustomButton = ({
  title,
  handlePress,
  containerStyles,
  textStyles,
  isLoading
}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      style={tw`bg-card rounded-xl min-h-[62px] flex flex-row justify-center items-center ${containerStyles} ${
        isLoading ? "opacity-50" : ""
      }`}
      disabled={isLoading}
    >
      <Text style={tw`text-primary font-vazir text-lg ${textStyles}`}>
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
