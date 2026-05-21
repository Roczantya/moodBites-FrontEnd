import { useState, useEffect } from "react";
import { Platform } from "react-native";
import NfcManager, { NfcTech } from "react-native-nfc-manager";

export const useNfcScanner = (onSuccess: () => void) => {
  const [isScanning, setIsScanning] = useState<boolean>(false);

  // Inisialisasi NFC saat komponen dipasang
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

  const cancelNfcScan = () => {
    if (Platform.OS !== "web") {
      NfcManager.cancelTechnologyRequest();
    }
    setIsScanning(false);
  };

  return {
    isScanning,
    startNfcScan,
    cancelNfcScan,
  };
};
