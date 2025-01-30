import React, { useState, useEffect } from "react";
import { View, Text, Button, TouchableOpacity } from "react-native";
import tw from "@/libs/twrnc";
import CustomButton from "./CustomButton";

interface OTPTimerProps {
  duration: number; // Time in seconds for the OTP expiration
  onResend: () => void; // Function to handle OTP resend
}

const OTPTimer: React.FC<OTPTimerProps> = ({ duration, onResend }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      setIsExpired(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer); // Clean up the interval on unmount
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleResend = () => {
    setTimeLeft(duration);
    setIsExpired(false);
    onResend();
  };

  return (
    <View style={tw`flex  items-start my-5 `}>
      {isExpired ? (
        <View style={tw`flex items-center bg-orange-300 p-3 rounded-5`}>
          <Text style={tw`text-red-500 text-md  mb-3 text-right font-vazir`}>
            کد منقضی شده است .
          </Text>
          <CustomButton
            title="ارسال مجدد"
            handlePress={handleResend}
            containerStyles="align-left  bg-primary"
            textStyles="text-sm px-3"
          />
        </View>
      ) : (
        <Text
          style={tw`items-start text-text font-vazir text-left bg-black-50 text-sm  p-2 rounded-2`}
        >
          زمان باقیمانده : {formatTime(timeLeft)}
        </Text>
      )}
    </View>
  );
};

export default OTPTimer;
