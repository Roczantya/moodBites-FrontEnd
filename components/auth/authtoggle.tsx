import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Colors } from "../../constants/colors";

interface AuthToggleProps {
  isLogin: boolean;
  onToggle: (value: boolean) => void;
}
export default function AuthToggle({ isLogin, onToggle }: AuthToggleProps) {
  return (
    <View style={styles.toggleContainer}>
      <TouchableOpacity
        style={[styles.toggleButton, isLogin && styles.toggleActive]}
        onPress={() => onToggle(true)}
      >
        <Text style={[styles.toggleText, isLogin && styles.toggleTextActive]}>
          Login
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.toggleButton, !isLogin && styles.toggleActive]}
        onPress={() => onToggle(false)}
      >
        <Text style={[styles.toggleText, !isLogin && styles.toggleTextActive]}>
          Register
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: Colors.secondary,
    borderRadius: 30,
    width: "100%",
    height: 50,
    padding: 5,
    marginBottom: 20,
  },
  toggleButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
  },
  toggleActive: {
    backgroundColor: Colors.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textAccent,
  },
  toggleTextActive: {
    color: Colors.accent,
  },
});
