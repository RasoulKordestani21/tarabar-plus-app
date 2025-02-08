import { Text, View, Button } from "react-native";
import { router } from "expo-router";
import tw from "@/libs/twrnc"; // Ensure you're using tailwind-rn for styling
import CustomButton from "@/components/CustomButton";
import { useGlobalContext } from "@/context/GlobalProvider";

const Error = () => {
  const { setToken, setPhoneNumber, setRole } = useGlobalContext();
  const handleRedirect = () => {
    // Redirect user to /otp-sender screen when the button is clicked
    setToken();
    // setPhoneNumber();
    // setRole();
    router.replace("/otp-sender"); // Change to your actual path
  };

  return (
    <View style={tw`flex-1 justify-center items-center p-4`}>
      {/* Show error message with a red background */}
      <View style={tw`bg-red-100 p-4 rounded-md mb-4`}>
        <Text style={tw`text-red-800 font-bold`}>
          Error occurred: 401 Unauthorized
        </Text>
      </View>

      {/* Button to redirect to the otp-sender screen */}
      <CustomButton
        containerStyles="bg-red-400 p-2"
        title="ورود مجدد"
        handlePress={handleRedirect}
      />
    </View>
  );
};

export default Error;
