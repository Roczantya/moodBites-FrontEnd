import React, {
  useState,
  useEffect
} from "react";
import { View, StyleSheet, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Sevices
import storageService from "@/services/storageService";
import hceService from "@/services/hceService";

// Existing shared components
import Header from "@/components/dashboard/header";
import BottomNavbar from "@/components/dashboard/bottomNavbar";

// NFC-specific components
import ScanScreen from "@/components/nfc/scanscreen";
import SuccessScreen from "@/components/nfc/successscreen";
import NfcScanModal from "@/components/nfc/nfcscanmodal";

const COLORS = {
  bg: "#FDF0E8",
};

type NfcView = "scan" | "success";

export default function NfcScreen() {
  const [currentView, setCurrentView] = useState<NfcView>("scan");
  const [modalVisible, setModalVisible] = useState(false);
  const [isHceStarted, setIsHceStarted] =
  useState(false);
  
  useEffect(() => {

  if (!isHceStarted) {

    handleScanStart();
  }

}, [isHceStarted]);

  const handleScanStart = async () => {

  try {

    const userId = await storageService.getUserId();

    if (!userId) {
      alert("User ID tidak ditemukan");
      return;
    }

    await hceService.startHCE(userId);

    console.log("HCE ACTIVE USER ID:", userId);

    setModalVisible(true);
    setIsHceStarted(true);

  } catch (error) {

    console.log("HCE ERROR:", error);

    alert("Gagal mengaktifkan NFC");
  }
};

  const handleModalClose = async () => {

  await hceService.stopHCE();

  setModalVisible(false);
  setIsHceStarted(true);

};

  const handleSuccess = () => {
    setModalVisible(false);
    setCurrentView("success");
  };

  const handleScanAgain = () => {
    setCurrentView("scan");
    setIsHceStarted(false);
  };

  const handleDone = async () => {

  await hceService.stopHCE();

  setCurrentView("scan");
};

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />

      {/* Shared Header Component */}
      <Header title="NFC" />

      {/* Main Content */}
      <View style={styles.content}>
        {currentView === "scan" ? (
          <ScanScreen/>
        ) : (
          <SuccessScreen
            profileName="MoodBits User"
            onDone={handleDone}
            onScanAgain={handleScanAgain}
          />
        )}
      </View>

      {/* NFC Scan Modal */}
      <NfcScanModal
        visible={modalVisible}
        onClose={handleModalClose}
        onSuccess={handleSuccess}
      />

      {/* Shared Bottom Navigation Component */}
      <BottomNavbar activeTab="nfc" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  content: {
    flex: 1,
  },
});