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
      style={tw`absolute  w-full h-full bg-[#000] opacity-95 flex justify-center items-center z-100`}
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
