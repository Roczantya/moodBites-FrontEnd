import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "../../constants/colors";

// Komponen
import BottomNavBar from "../dashboard/bottomNavbar";
import Header from "../dashboard/header";
import NfcScanModal from "@/components/nfc/nfcscanmodal"; // Import UI Modal

// Hook Logika
import { useNfcScanner } from "@/hooks/use-nfc-hooks"; // Import Hook NFC

interface ScanScreenProps {
  onSuccess: () => void;
}

export default function ScanScreen({ onSuccess }: ScanScreenProps) {
  // Panggil semua logika NFC dari Hook
  const { isScanning, startNfcScan, cancelNfcScan } = useNfcScanner(onSuccess);

  return (
    <SafeAreaView style={[styles.container, styles.lightContainer]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Header title="NFC" showBell={false} />

        <View style={styles.mainContent}>
          <Text style={styles.titleLight}>Ready to Scan?</Text>
          <Text style={styles.subtitleLight}>
            Tekan disini dengan scan Orderhere NFC
          </Text>

          <TouchableOpacity
            style={styles.scanButtonOuter}
            onPress={startNfcScan}
          >
            <View style={styles.scanButtonInner}>
              <MaterialCommunityIcons
                name="nfc-tap"
                size={48}
                color={Colors.accent}
              />
              <Text style={styles.scanButtonText}>TAP TO SCAN</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Feather name="info" size={16} color={Colors.accent} />
            <Text style={styles.infoTitle}>How it works</Text>
          </View>
          <Text style={styles.infoDesc}>
            Hold your phone near the NFC sticker on your table. We'll instantly
            load the menu, reviews, and pair it with your current mood to give
            personalized recommendations.
          </Text>
          <View style={styles.infoFooter}>
            <Feather name="lock" size={12} color={Colors.textSecondary} />
            <Text style={styles.infoFooterText}>
              Ensure your screen is unlocked
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Gunakan komponen Modal yang sudah dipisah */}
      <NfcScanModal visible={isScanning} onCancel={cancelNfcScan} />

      <BottomNavBar />
    </SafeAreaView>
  );
}

// Hanya tersisa styles untuk layout utama saja
const styles = StyleSheet.create({
  container: { flex: 1 },
  lightContainer: { backgroundColor: Colors.primary },
  scrollView: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingBottom: 100 },
  mainContent: { alignItems: "center", marginTop: 30, marginBottom: 20 },
  titleLight: {
    fontSize: 22,
    fontFamily: "PlusJakartaSans-Bold",
    color: Colors.textPrimary,
  },
  subtitleLight: { fontSize: 14, color: Colors.textSecondary, marginTop: 8 },
  scanButtonOuter: {
    marginTop: 40,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: Colors.secondary,
    justifyContent: "center",
    alignItems: "center",
  },
  scanButtonInner: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  scanButtonText: {
    marginTop: 12,
    color: Colors.accent,
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 14,
  },
  infoCard: {
    backgroundColor: Colors.white,
    margin: 24,
    padding: 20,
    borderRadius: 16,
    elevation: 3,
  },
  infoHeader: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  infoTitle: { marginLeft: 8, fontWeight: "bold", color: Colors.textPrimary },
  infoDesc: { fontSize: 13, color: Colors.textSecondary, lineHeight: 20 },
  infoFooter: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    justifyContent: "center",
  },
  infoFooterText: {
    marginLeft: 6,
    fontSize: 11,
    color: Colors.textSecondary,
    marginBottom: 10,
  },
});
