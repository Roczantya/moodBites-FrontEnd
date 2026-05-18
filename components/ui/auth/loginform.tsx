import React from "react";
import { StyleSheet, View, Text } from "react-native";
import InputField from "./inputfield"; // Sesuaikan path ke inputfield lu

interface LoginFormProps {
  email: string;
  onChangeEmail: (text: string) => void;
  password: string;
  onChangePassword: (text: string) => void;
  errors: { email?: string; password?: string };
  isLoading: boolean;
}

export default function LoginForm({
  email,
  onChangeEmail,
  password,
  onChangePassword,
  errors,
  isLoading,
}: LoginFormProps) {
  return (
    <View style={styles.formContainer}>
      <View style={styles.inputWrapper}>
        <InputField
          label="EMAIL ADDRESS"
          icon="mail-outline"
          placeholder="hello@moodbites.com"
          keyboardType="email-address"
          value={email}
          onChangeText={onChangeEmail}
          editable={!isLoading}
        />
        {errors.email ? (
          <Text style={styles.errorText}>{errors.email}</Text>
        ) : null}
      </View>

      <View style={styles.inputWrapper}>
        <InputField
          label="PASSWORD"
          icon="lock-closed-outline"
          placeholder="••••••••"
          isPassword={true}
          value={password}
          onChangeText={onChangePassword}
          editable={!isLoading}
        />
        {errors.password ? (
          <Text style={styles.errorText}>{errors.password}</Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    width: "100%",
    marginBottom: 30,
  },
  inputWrapper: {
    marginBottom: 15,
  },
  errorText: {
    color: "#FF9494",
    fontSize: 11,
    marginTop: 5,
    marginLeft: 15,
    fontFamily: "PlusJakartaSans-Medium",
  },
});
