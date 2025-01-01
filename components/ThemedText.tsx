import { Text, type TextProps, StyleSheet } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";
import { CustomTheme } from "@/themes/customTheme";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "default",
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return (
    <Text
      style={[
        { color },
        type === "default" ? styles.default : undefined,
        type === "title" ? styles.title : undefined,
        type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
        type === "subtitle" ? styles.subtitle : undefined,
        type === "link" ? styles.link : undefined,
        style
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontFamily: CustomTheme.fonts.regular.fontFamily,
    fontSize: 16,
    lineHeight: 24
  },
  defaultSemiBold: {
    fontFamily: CustomTheme.fonts.bold.fontFamily,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600"
  },
  title: {
    fontFamily: CustomTheme.fonts.bold.fontFamily,
    fontSize: 32,
    fontWeight: "bold",
    lineHeight: 32
  },
  subtitle: {
    fontFamily: CustomTheme.fonts.bold.fontFamily,
    fontSize: 20,
    fontWeight: "bold"
  },
  link: {
    fontFamily: CustomTheme.fonts.regular.fontFamily,
    lineHeight: 30,
    fontSize: 16,
    color: "#0a7ea4"
  }
});
