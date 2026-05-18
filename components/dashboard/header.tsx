import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../constants/colors";

export default function Header() {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>MoodBites</Text>
      <TouchableOpacity style={styles.bellContainer}>
        <Ionicons
          name="notifications-outline"
          size={20}
          color={Colors.optionalAccent}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 20,
    marginBottom: 30,
  },
  logo: {
    fontSize: 24,
    fontFamily: "PlusJakartaSans-ExtraBoldItalic",
    color: Colors.optionalAccent,
  },
  bellContainer: {
    backgroundColor: Colors.secondary,
    padding: 10,
    borderRadius: 20,
  },
});
