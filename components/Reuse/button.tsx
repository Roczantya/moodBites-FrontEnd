import React from "react";
import { Pressable, StyleSheet, ViewStyle, TextStyle } from "react-native";
import { Colors } from "@/constants/colors";
import { TextBold } from "@/constants/customFont";

type ButtonVariant = "primary" | "accent" | "outline";

type Props = {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
};

export default function Button({
  label,
  onPress,
  variant = "accent",
  style,
  textStyle,
  disabled = false,
}: Props) {
  return (
    <Pressable
      disabled={disabled}
      style={({ pressed }) => [
        styles.baseButton,
        variant === "primary" && styles.primaryButton,
        variant === "accent" && styles.accentButton,
        style, // Custom style dari luar tetep aman di sini
        pressed && !disabled && { opacity: 0.7 },
        disabled && styles.disabledButton,
      ]}
      onPress={onPress}
    >
      <TextBold style={[styles.baseText, textStyle]}>{label}</TextBold>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  baseButton: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  accentButton: {
    padding: 14,
    borderRadius: 50,
    backgroundColor: Colors.accent,
  },
  primaryButton: {
    height: 55,
    borderRadius: 50,
    backgroundColor: Colors.primary || "#FF949A",
    bottom: 10,
    shadowColor: Colors.primary || "#FF949A",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 8,
  },
  disabledButton: {
    backgroundColor: "#CCCCCC",
    shadowOpacity: 0,
    elevation: 0,
    opacity: 0.7,
  },
  baseText: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: "PlusJakartaSans-Bold",
  },
});
