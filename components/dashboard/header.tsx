import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../constants/colors"; // Sesuaikan kembali path ini

interface HeaderProps {
  title?: string; // Tanda tanya (?) artinya props ini opsional
}
export default function Header({ title = "MoodBites" }: HeaderProps) {
  return (
    <View style={styles.container}>
      {/* Teks logo sekarang dinamis mengikuti props title */}
      <Text style={styles.logo}>{title}</Text>
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
    paddingHorizontal: 20,
    paddingTop:
      Platform.OS === "android" ? (StatusBar.currentHeight || 0) + 16 : 16,
    paddingBottom: 16,
    backgroundColor: Colors.primary,

    ...Platform.select({
      ios: {
        shadowColor: Colors.textPrimary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: "0px 2px 4px rgba(61, 26, 27, 0.06)",
      },
    }),
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
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});
