import React, { memo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Pressable
} from "react-native";
import tw from "@/libs/twrnc";

export interface CustomCardProps {
  header?: React.ReactNode;
  content?: React.ReactNode;
  footer?: React.ReactNode;
  onPress?: () => void;
  containerStyle?: ViewStyle;
  headerStyle?: ViewStyle;
  contentStyle?: ViewStyle;
  footerStyle?: ViewStyle;
  headerTextStyle?: TextStyle;
  contentTextStyle?: TextStyle;
  footerTextStyle?: TextStyle;
  testID?: string;
  accessibilityLabel?: string;
  disabled?: boolean;
}

const CustomCard: React.FC<CustomCardProps> = memo(
  ({
    header,
    content,
    footer,
    onPress,
    containerStyle,
    headerStyle,
    contentStyle,
    footerStyle,
    headerTextStyle,
    contentTextStyle,
    footerTextStyle,
    testID,
    accessibilityLabel,
    disabled = false
  }) => {
    const CardContainer = onPress ? Pressable : View;

    return (
      <CardContainer
        style={[
          styles.container,
          tw`opacity-90 rounded-lg border border-primary/10 shadow-sm p-4`,
          containerStyle,
          disabled && styles.disabled
        ]}
        onPress={onPress}
        disabled={disabled}
        testID={testID}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole={onPress ? "button" : "none"}
        accessibilityState={{ disabled }}
      >
        {header && (
          <View style={[styles.header, headerStyle]}>
            {typeof header === "string" ? (
              <Text
                style={[
                  styles.headerText,
                  tw`text-primary font-vazir text-base`,
                  headerTextStyle
                ]}
              >
                {header}
              </Text>
            ) : (
              header
            )}
          </View>
        )}

        {content && (
          <View style={[styles.content, contentStyle]}>
            {typeof content === "string" ? (
              <Text
                style={[
                  styles.contentText,
                  tw`text-text font-vazir text-sm`,
                  contentTextStyle
                ]}
              >
                {content}
              </Text>
            ) : (
              content
            )}
          </View>
        )}

        {footer && (
          <View style={[styles.footer, footerStyle]}>
            {typeof footer === "string" ? (
              <Text
                style={[
                  styles.footerText,
                  tw`text-secondary font-vazir text-sm`,
                  footerTextStyle
                ]}
              >
                {footer}
              </Text>
            ) : (
              footer
            )}
          </View>
        )}
      </CardContainer>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    width: "100%",
    overflow: "hidden"
  },
  header: {
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB", // light gray border
    paddingBottom: 8
  },
  headerText: {
    textAlign: "center"
  },
  content: {
    marginVertical: 8
  },
  contentText: {
    textAlign: "right"
  },
  footer: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB", // light gray border
    paddingTop: 8
  },
  footerText: {
    textAlign: "center"
  },
  disabled: {
    opacity: 0.5
  }
});

CustomCard.displayName = "CustomCard";

export default CustomCard;
