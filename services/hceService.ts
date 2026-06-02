import { NativeModules } from "react-native";

// Melakukan destructuring dengan aman
const { HCEModule } = NativeModules;

const hceService = {
  startHCE: async (userId: string) => {
    try {
      const payload = userId;

      console.log("START HCE PAYLOAD:", payload);

      // 1. Validasi apakah Modul Native terdeteksi oleh React Native
      if (!HCEModule) {
        throw new Error(
          "HCEModule tidak ditemukan! Pastikan Anda memakai Development Build / Production APK dan bukan Expo Go."
        );
      }

      // 2. Validasi apakah fungsi startHCE terekspos di sisi Kotlin
      if (typeof HCEModule.startHCE !== "function") {
        throw new Error(
          "HCEModule terdeteksi, tetapi fungsi startHCE() tidak ditemukan. Periksa anotasi @ReactMethod di Kotlin."
        );
      }

      // 3. Panggil metode native jika semua validasi lolos
      HCEModule.startHCE(payload);
      return true;

    } catch (error: any) {
      console.log("START HCE ERROR:", error.message || error);
      throw error;
    }
  },

  stopHCE: async () => {
    try {
      console.log("STOP HCE");

      if (!HCEModule || typeof HCEModule.stopHCE !== "function") {
        throw new Error("HCEModule atau fungsi stopHCE() tidak tersedia.");
      }

      HCEModule.stopHCE();
      return true;

    } catch (error: any) {
      console.log("STOP HCE ERROR:", error.message || error);
      throw error;
    }
  },
};

export default hceService;