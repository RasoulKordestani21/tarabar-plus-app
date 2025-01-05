import React, { useState, useEffect } from "react";
import { View, Text, Button, TouchableOpacity } from "react-native";
import tw from "@/libs/twrnc";

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
        <View style={tw`flex items-center`}>
          <Text style={tw`text-red text-lg font-bold mb-3 text-right`}>
            کد منقضی شده است .
          </Text>
          <TouchableOpacity
            style={tw`bg-blue-500 px-4 py-2 rounded-md`}
            onPress={handleResend}
          >
            <Text style={tw`text-white font-bold text-left w-full`}>
              ارسال مجدد
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text
          style={tw`items-start text-text font-vazir text-left bg-customCard text-sm  p-2 rounded-2`}
        >
          زمان باقیمانده : {formatTime(timeLeft)}
        </Text>
      )}
    </View>
  );
};

export default OTPTimer;
