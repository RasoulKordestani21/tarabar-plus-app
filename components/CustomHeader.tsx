// components/CustomHeader.js
import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

type Props = {
  title?: string;
};

const CustomHeader = ({ title }: Props) => (
  <View style={styles.header}>
    <Image source={require("@/assets/images/tarabarplusicon.png")} />
  </View>
);

const styles = StyleSheet.create({
  header: {
    height: 80,
    backgroundColor: "#003366",
    justifyContent: "flex-end",
    alignItems: "center",
    borderBottomRightRadius: 16,
    borderBottomLeftRadius: 16
  }
});

export default CustomHeader;
