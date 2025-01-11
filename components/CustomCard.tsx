import { View } from "react-native";
import tw from "@/libs/twrnc";

type Props = {
  header: React.ReactNode;
  content: React.ReactNode;
  customStyle?: string;
  cardContentStyle?: string; // added to allow the flexibility for styling the content
};

const CustomCard = ({
  header,
  content,
  customStyle,
  cardContentStyle
}: Props) => {
  return (
    <View
      style={tw`w-full bg-customCard p-4 rounded-lg items-center  ${
        customStyle ?? ""
      }`}
    >
      {header}
      <View style={tw`w-full h-[1px] bg-text mb-5 mt-3`}></View>
      <View style={tw`w-full items-center ${cardContentStyle ?? ""}`}>
        {content}
      </View>
    </View>
  );
};

export default CustomCard;
