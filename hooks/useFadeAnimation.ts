import { useState, useEffect } from "react";
import { Animated } from "react-native";

export const useFadeAnimation = (duration = 1500) => {
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration,
        useNativeDriver: true
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration,
        useNativeDriver: true
      })
    ]).start();
  }, [fadeAnim, duration]);

  return fadeAnim;
};
