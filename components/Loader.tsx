// components/Loader.tsx - True Ping Animation (Expanding Rings)
import React, { useEffect, useRef } from "react";
import {
  View,
  Image,
  Modal,
  StatusBar,
  Dimensions,
  Animated,
  Easing
} from "react-native";
import tw from "@/libs/twrnc";

type Props = {
  isLoading: boolean;
};

const Loader = ({ isLoading }: Props) => {
  const ping1 = useRef(new Animated.Value(0)).current;
  const ping2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startPinging = () => {
      // First ring
      Animated.loop(
        Animated.sequence([
          Animated.timing(ping1, {
            toValue: 1,
            duration: 1500,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true
          }),
          Animated.timing(ping1, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true
          })
        ])
      ).start();

      // Second ring (delayed for layered effect)
      setTimeout(() => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(ping2, {
              toValue: 1,
              duration: 1500,
              easing: Easing.out(Easing.quad),
              useNativeDriver: true
            }),
            Animated.timing(ping2, {
              toValue: 0,
              duration: 0,
              useNativeDriver: true
            })
          ])
        ).start();
      }, 750); // Start second ring halfway through first
    };

    if (isLoading) {
      startPinging();
    }
  }, [isLoading, ping1, ping2]);

  // First ping ring
  const ping1Scale = ping1.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 3]
  });

  const ping1Opacity = ping1.interpolate({
    inputRange: [0, 0.1, 1],
    outputRange: [0, 0.8, 0]
  });

  // Second ping ring
  const ping2Scale = ping2.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 3]
  });

  const ping2Opacity = ping2.interpolate({
    inputRange: [0, 0.1, 1],
    outputRange: [0, 0.6, 0]
  });

  if (!isLoading) return null;

  return (
    <Modal
      transparent={true}
      animationType="none"
      visible={isLoading}
      statusBarTranslucent={true}
      presentationStyle="overFullScreen"
    >
      <View
        style={[
          tw`flex-1 bg-background  bg-opacity-95 justify-center items-center`,
          {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: Dimensions.get("window").width,
            height: Dimensions.get("screen").height,
            zIndex: 9999,
            elevation: 9999
          }
        ]}
      >
        <View style={tw`relative justify-center items-center`}>
          {/* Ping Ring 1 */}
          <Animated.View
            style={[
              tw`absolute w-30 h-30 rounded-full border-2 border-secondary`,
              {
                transform: [{ scale: ping1Scale }],
                opacity: ping1Opacity
              }
            ]}
          />

          {/* Ping Ring 2 */}
          <Animated.View
            style={[
              tw`absolute w-30 h-30 rounded-full border-2 border-secondary`,
              {
                transform: [{ scale: ping2Scale }],
                opacity: ping2Opacity
              }
            ]}
          />

          {/* Main Image */}
          <Image
            source={require("@/assets/images/loader_logo.png")}
            style={tw`w-10 h-10`}
            resizeMode="contain"
          />
        </View>
      </View>
    </Modal>
  );
};

export default Loader;
