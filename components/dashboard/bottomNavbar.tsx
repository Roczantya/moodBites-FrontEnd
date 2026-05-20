import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "../../constants/colors";
import { router, usePathname } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function BottomNavBar() {
  const insets = useSafeAreaInsets(); // ← tambah ini

  const pathname = usePathname(); // Ambil rute aktif saat ini

  // Cek apakah rute tertentu sedang aktif
  const isHomeActive = pathname === "/dashboard/home";
  const isNfcActive = pathname === "/dashboard/nfc";
  const isProfilActive = pathname === "/dashboard/profil";

  return (
    <View style={[styles.container, { bottom: 10 + insets.bottom }]}>
      {/* Tombol NFC Floating */}
      <TouchableOpacity
        style={[
          styles.centerButton,
          // Contoh: Jika di halaman NFC, warnanya sedikit berubah atau tetap solid
          { backgroundColor: isNfcActive ? Colors.accent : Colors.third },
          { opacity: isNfcActive ? 1 : 0.9 },
        ]}
        onPress={() => router.replace("/dashboard/nfc")}
        activeOpacity={0.8}
      >
        <MaterialCommunityIcons
          name="contactless-payment-circle-outline"
          size={30}
          color={isNfcActive ? Colors.white : Colors.optionalAccent}
        />
        <Text
          style={[
            styles.nfcText, // Ini mengambil fontSize, fontFamily, dll.
            { color: isNfcActive ? Colors.white : Colors.optionalAccent }, // Ini mengatur warna secara dinamis
          ]}
        >
          NFC
        </Text>
      </TouchableOpacity>
      <View style={styles.navBar}>
        {/* Beranda Tab */}
        <TouchableOpacity
          style={styles.tab}
          onPress={() => router.replace("/dashboard/home")}
        >
          <Ionicons
            name={isHomeActive ? "home" : "home-outline"} // Berubah ikon jika aktif
            size={24}
            color={isHomeActive ? Colors.optionalAccent : Colors.optionalAccent} // Warna aktif
          />
          <Text
            style={[
              styles.tabText,
              {
                color: isHomeActive
                  ? Colors.optionalAccent
                  : Colors.optionalAccent,
              },
            ]}
          >
            BERANDA
          </Text>
        </TouchableOpacity>

        <View style={styles.spacer} />

        {/* Profil Tab */}
        <TouchableOpacity
          style={styles.tab}
          onPress={() => router.replace("/dashboard/profil")}
        >
          <Ionicons
            name={isProfilActive ? "person" : "person-outline"}
            size={24}
            color={
              isProfilActive ? Colors.optionalAccent : Colors.optionalAccent
            }
          />
          <Text
            style={[
              styles.tabText,
              {
                color: isProfilActive
                  ? Colors.optionalAccent
                  : Colors.optionalAccent,
              },
            ]}
          >
            PROFIL
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 16,
    left: 0,
    right: 0,
    alignItems: "center", // Ini otomatis menengahkan semua anak (navBar & centerButton)
  },
  navBar: {
    flexDirection: "row",
    backgroundColor: "#FFF7E8",
    width: "85%", // Ditingkatkan sedikit agar tidak terlalu sempit di HP kecil
    height: 70,
    borderRadius: 35,
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: "#FBE6E6",
  },
  tab: {
    flex: 1, // Agar area tekan seimbang
    alignItems: "center",
    justifyContent: "center",
  },
  spacer: {
    width: 70, // Lebarnya sama dengan centerButton agar Beranda & Profil terdorong rapi
  },
  tabText: {
    fontSize: 10,
    fontFamily: "PlusJakartaSans-Bold",
    color: Colors.optionalAccent,
    marginTop: 4,
  },
  centerButton: {
    backgroundColor: Colors.accent,
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: -25, // Floating di atas bar
    zIndex: 10, // Pastikan di atas navBar
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 12,
  },
  nfcText: {
    fontSize: 10,
    fontFamily: "PlusJakartaSans-Bold",
    marginTop: 2,
  },
});
