import tw from "@/libs/twrnc";
import { View, ActivityIndicator, Dimensions, Platform } from "react-native";

type Props = {
  isLoading: boolean;
};

const Loader = ({ isLoading }: Props) => {
  const osName = Platform.OS;
  const screenHeight = Dimensions.get("screen").height;

  if (!isLoading) return null;

  return (
    <View
      style={tw`absolute  w-full h-full bg-black-50 flex justify-center items-center z-50`}
    >
      <ActivityIndicator
        animating={true}
        color="#fff"
        size={Platform.OS === "ios" ? "large" : 50}
      />
    </View>
  );
};

export default Loader;
