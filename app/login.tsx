import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  Pressable,
  Animated,
  Platform
} from "react-native";
// import { ScreenContainer } from "react-native-screens";

export default function LoginScreen({ onLoginDriver, onLoginOwner }) {
  const [showButtons, setShowButtons] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0]; // Ensure fadeAnim persists across renders

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 1500,
        useNativeDriver: true
      })
    ]).start(() => setShowButtons(true));
  }, [fadeAnim]);

  return (
    <View style={styles.container}>
      {!showButtons ? (
        <Animated.View style={[styles.logoContainer, { opacity: fadeAnim }]}>
          <Image
            source={require("@/assets/images/tarabarplusicon.png")} // مسیر لوگو
            // style={styles.logo}
          />
        </Animated.View>
      ) : (
        <View style={styles.screenContainer}>
          <Image
            source={require("@/assets/images/tarabarplusicon.png")}
            // style={styles.logo}
          />
          <View style={styles.infoBox}>
            <Text
              style={{
                ...styles.boldText,
                ...Platform.select({
                  android: {
                    // borderColor: "#ee3388"
                    // textAlign: "right"
                  }
                  //   default: {}
                })
              }}
            >
              به اپلیکیشن <Text style={{ color: "#FFB300" }}>ترابر پلاس</Text>{" "}
              خوش آمدید.
            </Text>
            {/* <View style={[styles.separator]} /> */}
            <Text style={styles.normalText}>
              در این اپلیکیشن شما می‌توانید به عوان راننده یا معرف بار ثبت‌نام
              نمایید .{"\n"} ۱- اگر به دنبال بار هستید می‌توانید به عنوان راننده
              وارد شوید.{"\n"} ۲- اگر صاحب بار و یا معرف بار هستید به عنوان معرف
              بار وارد شوید.
            </Text>
          </View>

          <View style={styles.buttonsContainer}>
            <Pressable style={styles.button} onPress={onLoginDriver}>
              <Text style={styles.buttonText}>ورود به عنوان راننده </Text>
            </Pressable>
            <Pressable style={styles.button} onPress={onLoginOwner}>
              <Text style={styles.buttonText}>ورود به عنوان صاحب بار</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#003366",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 60
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20
  },
  logo: {
    width: 150,
    height: 150
    // resizeMode: "contain"
  },
  screenContainer: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 50
  },
  buttonsContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%"
    // gap: 20
  },
  infoBox: {
    width: "100%",
    backgroundColor: "#4CAF50",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20
  },
  boldText: {
    width: "100%",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#eeeeee",
    borderBottomWidth: 1,
    borderColor: "#ffffff",
    paddingBottom: 20,
    textAlign: "center"
  },
  separator: {
    width: "100%",
    marginVertical: 8
  },
  normalText: {
    fontSize: 14,
    color: "#ffffff",
    textAlign: "right"
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 15,
    // paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 20,
    width: "100%",
    textAlign: "center"
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center"
  },
  text: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20
  }
});
