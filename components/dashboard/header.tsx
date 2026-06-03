import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../../constants/colors"; // Sesuaikan kembali path ini

interface HeaderProps {
  title?: string;
  showBell?: boolean;
  showBack?: boolean;
  alignTitle?: "left" | "center";
  variant?: "logo" | "title"; // ← tambah ini
  onBackPress?: () => void; // ← opsional, untuk custom back action
}

export default function Header({
  title = "MoodBites",
  showBell = true,
  showBack = false,
  alignTitle = "left",
  variant = "logo", // ← default logo
  onBackPress,
}: HeaderProps) {
  return (
    <View style={styles.container}>
      {/* --- KIRI: Area Tombol Back --- */}
      <View style={styles.sideSection}>
        {showBack && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => {
              onBackPress ? onBackPress() : router.back();
            }}
          >
            <Ionicons
              name="arrow-back"
              size={20}
              color={Colors.optionalAccent}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* --- TENGAH: Area Title --- */}
      <View
        style={[
          styles.titleSection,
          {
            // Logika untuk ngatur posisi teks dari prop alignTitle
            alignItems: alignTitle === "center" ? "center" : "flex-start",
            // Kalau rata kiri dan nggak ada tombol back, geser sedikit biar nggak terlalu nempel ke kiri
            marginLeft: alignTitle === "left" && !showBack ? -30 : 0,
          },
        ]}
      >
        <Text style={variant === "title" ? styles.title : styles.logo}>
          {title}
        </Text>
      </View>

      {/* --- KANAN: Area Tombol Bell --- */}
      <View style={[styles.sideSection, { alignItems: "flex-end" }]}>
        {showBell && (
          <TouchableOpacity
            style={styles.iconButton}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 10,
    backgroundColor: Colors.primary,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(61, 26, 27, 0.08)",

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

  /* --- Area Layout Flexbox --- */
  sideSection: {
    width: 44, // Lebar tetap (sesuai lebar iconButton + sedikit margin)
    height: 44,
    justifyContent: "center",
  },
  titleSection: {
    flex: 1, // Mengambil sisa ruang di tengah
    justifyContent: "center",
  },

  /* --- Text Styles --- */
  logo: {
    fontSize: 22,
    fontFamily: "PlusJakartaSans-ExtraBoldItalic",
    color: Colors.optionalAccent,
  },
  title: {
    fontSize: 22,
    fontFamily: "PlusJakartaSans-Bold",
    color: Colors.optionalAccent,
  },

  /* --- Button Styles --- */
  iconButton: {
    backgroundColor: Colors.secondary,
    padding: 10,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});
