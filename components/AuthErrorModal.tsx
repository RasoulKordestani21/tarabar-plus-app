// components/AuthErrorModal.js
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ActivityIndicator
} from "react-native";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Ionicons } from "@expo/vector-icons";
import { useGlobalContext } from "@/context/GlobalProvider";

const AuthErrorModal = ({ visible, message, onClose }) => {
  const [isRedirecting, setIsRedirecting] = React.useState(false);
  const { setToken } = useGlobalContext();

  const handleRedirect = async () => {
    setIsRedirecting(true);
    try {
      // Clear token
      await setToken(null);
      console.log("Token cleared successfully");

      // Close modal first
      router.replace("/otp-sender");

      setTimeout(() => {
        onClose();
      }, 100);
    } catch (error) {
      console.error("Error during logout:", error);
      setIsRedirecting(false);
    } finally {
      setIsRedirecting(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => {}} // Empty function to prevent back button from closing the modal
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.iconContainer}>
            <Ionicons name="alert-circle" size={60} color="#F44336" />
          </View>

          <Text style={styles.modalTitle}>خطای احراز هویت</Text>

          <Text style={styles.modalMessage}>{message}</Text>

          <TouchableOpacity
            style={styles.redirectButton}
            onPress={handleRedirect}
            disabled={isRedirecting}
          >
            {isRedirecting ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.buttonText}>بازگشت به صفحه ورود</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center"
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    elevation: 5
  },
  iconContainer: {
    marginBottom: 15
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: "Vazir-Bold",
    color: "#333",
    marginBottom: 15,
    textAlign: "center"
  },
  modalMessage: {
    fontSize: 16,
    fontFamily: "Vazir-Regular",
    color: "#555",
    marginBottom: 20,
    textAlign: "center",
    lineHeight: 24
  },
  redirectButton: {
    backgroundColor: "#003366",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginTop: 10
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "Vazir-Bold"
  }
});

export default AuthErrorModal;
