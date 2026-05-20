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
import { router } from "expo-router";

interface HeaderProps {
  title?: string; // Tanda tanya (?) artinya props ini opsional
  showBell?: boolean; // ← tambah
  showBack?: boolean; // ← tambah ini
}
export default function Header({
  title = "MoodBites",
  showBell = true,
  showBack = false, // ← default false
}: HeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        {/* Back button kalau showBack = true */}
        {showBack && (
          <TouchableOpacity
            style={styles.bellContainer}
            onPress={() => router.back()}
          >
            <Ionicons
              name="arrow-back"
              size={20}
              color={Colors.optionalAccent}
            />
          </TouchableOpacity>
        )}
        {/* Title selalu tampil */}
        <Text style={showBack ? styles.title : styles.logo}>{title}</Text>
      </View>

      {/* Bell */}
      {showBell && (
        <TouchableOpacity
          style={styles.bellContainer}
          onPress={() => router.push("/dashboard/notification")}
        >
          <Ionicons
            name="notifications-outline"
            size={20}
            color={Colors.optionalAccent}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 10,
    backgroundColor: Colors.primary,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(61, 26, 27, 0.08)", // warna sangat transparan

    ...Platform.select({
      ios: {
        shadowColor: Colors.textPrimary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 3,
      },
      android: {
        elevation: 1,
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
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10, // jarak back button dan title
  },
  title: {
    fontSize: 18,
    fontFamily: "PlusJakartaSans-Bold",
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
