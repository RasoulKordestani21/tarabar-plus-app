// components/CustomToast.js
import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import tw from "@/libs/twrnc";

const CustomToast = ({ visible, message, onClose, type = "success" }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      }).start();
    }
  }, [visible, fadeAnim]);

  if (!visible) return null;

  // Configure based on type
  const getToastConfig = () => {
    switch (type) {
      case "success":
        return {
          backgroundColor: "#4CAF50",
          icon: "checkmark-circle",
          iconColor: "#FFFFFF"
        };
      case "error":
        return {
          backgroundColor: "#F44336",
          icon: "close-circle",
          iconColor: "#FFFFFF"
        };
      case "warning":
        return {
          backgroundColor: "#FF9800",
          icon: "warning",
          iconColor: "#FFFFFF"
        };
      case "info":
        return {
          backgroundColor: "#2196F3",
          icon: "information-circle",
          iconColor: "#FFFFFF"
        };
      default:
        return {
          backgroundColor: "#4CAF50",
          icon: "checkmark-circle",
          iconColor: "#FFFFFF"
        };
    }
  };

  const config = getToastConfig();

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: config.backgroundColor, opacity: fadeAnim }
      ]}
    >
      <View style={styles.content}>
        <Ionicons name={config.icon} size={24} color={config.iconColor} />
        <Text style={styles.message}>{message}</Text>
      </View>
      <TouchableOpacity onPress={onClose}>
        <Ionicons name="close" size={20} color="#FFFFFF" />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    borderRadius: 8,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 1000
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1
  },
  message: {
    marginRight: 10,
    color: "#ffffff",
    fontFamily: "Vazir-Regular",
    fontSize: 14,
    flex: 1,
    textAlign: "right"
  }
});

export default CustomToast;
