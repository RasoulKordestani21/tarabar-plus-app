import { View, ActivityIndicator, Dimensions, Platform } from "react-native";

type Props = {
  isLoading: boolean;
};

const Loader = ({ isLoading }: Props) => {
  const osName = Platform.OS;
  const screenHeight = Dimensions.get("screen").height;

  if (!isLoading) return null;

  return (
    <View className="absolute flex justify-center items-center w-full bg-primary/60 z-10">
      <ActivityIndicator
        animating={isLoading}
        color="#fff"
        size={osName === "ios" ? "large" : 50}
      />
    </View>
  );
};

export default Loader;
