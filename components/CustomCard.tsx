import { View } from "react-native";
import tw from "@/libs/twrnc";

type Props = {
  header: React.ReactNode;
  content: React.ReactNode;
};

const CustomCard = ({ header, content }: Props) => {
  return (
    <View style={tw`w-full bg-customCard p-4 rounded-lg items-center mb-5`}>
      {header}
      <View style={tw`w-full h-[1px] bg-text mb-5 mt-3`}></View>
      {content}
    </View>
  );
};

export default CustomCard;
