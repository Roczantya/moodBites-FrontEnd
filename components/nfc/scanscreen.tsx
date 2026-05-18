import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
  ScrollView,
  Modal,
  ActivityIndicator,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import NfcManager, { NfcTech } from "react-native-nfc-manager";
import { Colors } from "../../constants/colors";
import BottomNavBar from "../dashboard/bottomNavbar";

interface ScanScreenProps {
  onSuccess: () => void;
}

export default function ScanScreen({ onSuccess }: ScanScreenProps) {
  const [isScanning, setIsScanning] = useState<boolean>(false);

  useEffect(() => {
    if (Platform.OS !== "web") {
      NfcManager.start().catch((err) => console.warn("NFC Init Error:", err));
    }
  }, []);

  const startNfcScan = async (): Promise<void> => {
    if (Platform.OS === "web") {
      console.log("Simulasi NFC di Web berjalan...");
      setIsScanning(true);
      setTimeout(() => {
        setIsScanning(false);
        onSuccess();
      }, 2000);
      return;
    }

    try {
      if (Platform.OS === "android") {
        setIsScanning(true);
      }

      if (Platform.OS === "ios") {
        await NfcManager.setAlertMessageIOS(
          "Dekatkan HP Anda ke stiker NFC di meja restoran.",
        );
      }

      await NfcManager.requestTechnology(NfcTech.Ndef);
      const tag = await NfcManager.getTag();

      if (tag) {
        setIsScanning(false);
        onSuccess();
      }
    } catch (ex) {
      console.warn("Scan dibatalkan atau gagal", ex);
      setIsScanning(false);
    } finally {
      NfcManager.cancelTechnologyRequest();
    }
  };

  return (
    <SafeAreaView style={[styles.container, styles.lightContainer]}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.primary} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.logoTextLight}>MoodBites</Text>
        </View>

        <View style={styles.mainContent}>
          <Text style={styles.titleLight}>Ready to Scan?</Text>
          <Text style={styles.subtitleLight}>
            Tap here to scan restaurant table NFC
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

      {/* UI MODAL KUSTOM (Android & Web) */}
      <Modal
        visible={isScanning}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsScanning(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.iconGlowOuter}>
              <MaterialCommunityIcons
                name="nfc"
                size={50}
                color={Colors.accent}
              />
            </View>

            <ActivityIndicator
              size="large"
              color={Colors.accent}
              style={{ marginTop: 20 }}
            />

            <Text style={styles.modalTitle}>Ready to Scan</Text>
            <Text style={styles.modalSubtitle}>
              Dekatkan bagian belakang HP Anda ke stiker NFC yang ada di meja.
            </Text>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                NfcManager.cancelTechnologyRequest();
                setIsScanning(false);
              }}
            >
              <Text style={styles.cancelButtonText}>Batal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Sekarang ditutup dengan benar dan Navbar sudah muncul kembali */}
      <BottomNavBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  lightContainer: { backgroundColor: Colors.primary },
  scrollView: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingBottom: 100 },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  logoTextLight: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.textAccent,
    textAlign: "center",
  },
  mainContent: { alignItems: "center", marginTop: 40, marginBottom: 20 },
  titleLight: { fontSize: 22, fontWeight: "bold", color: Colors.textPrimary },
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
    shadowColor: Colors.textPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  scanButtonText: {
    marginTop: 12,
    color: Colors.accent,
    fontWeight: "bold",
    fontSize: 14,
  },
  infoCard: {
    backgroundColor: Colors.white,
    margin: 24,
    padding: 20,
    borderRadius: 16,
    shadowColor: Colors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
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

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  iconGlowOuter: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginTop: 20,
  },
  modalSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
    marginTop: 10,
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  cancelButton: {
    marginTop: 25,
    backgroundColor: Colors.secondary,
    paddingVertical: 12,
    paddingHorizontal: 60,
    borderRadius: 20,
    width: "100%",
    alignItems: "center",
  },
  cancelButtonText: {
    color: Colors.textAccent,
    fontWeight: "bold",
    fontSize: 16,
  },
});
