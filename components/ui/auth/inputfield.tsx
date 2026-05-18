import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";
import { TextBold, TextBoldItalic, TextRegular } from "@/constants/customFont";

interface InputFieldProps {
  label: string;
  icon: string;
  isPassword?: boolean;
  [key: string]: any; // for restProps
}
export default function InputField({
  label,
  icon,
  isPassword,
  ...restProps
}: InputFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.inputContainer}>
      {label && <TextBold style={styles.label}>{label}</TextBold>}
      <TextBold style={styles.inputLabel}>{label}</TextBold>
      <View style={styles.inputWrapper}>
        <Ionicons
          label={icon}
          size={20}
          color={Colors.white}
          style={styles.inputIcon}
        />

        <TextInput
          style={styles.textInput}
          placeholderTextColor={Colors.textAccent + "80"}
          secureTextEntry={isPassword && !showPassword}
          {...restProps}
        />
        {isPassword && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color={Colors.textSecondary}
              style={styles.eyeIcon}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 10,
  },
  label: {
    fontSize: 11,
    color: Colors.optionalAccent,
    fontFamily: "PlusJakartaSans-Bold",
  },
  inputLabel: {
    fontSize: 12,
    fontFamily: "PlusJakartaSans-Regular",
    color: Colors.white,
    marginBottom: 8,
    marginLeft: 5,
    letterSpacing: 0.5,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.secondary + "80",
    borderRadius: 20,
    height: 55,
    paddingHorizontal: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    height: "100%",
    color: Colors.textAccent,
    fontSize: 14,
  },
  eyeIcon: {
    marginLeft: 10,
    color: Colors.textAccent + "99",
  },
});
