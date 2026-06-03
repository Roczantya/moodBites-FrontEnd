import { Colors } from "@/constants/colors";
import { TextSemiBold } from "@/constants/customFont";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import OtpForm from "@/components/auth/otpform"; // Import UI yang baru dibuat
import authService from "@/services/authService";
import storageService from "@/services/storageService";

export default function OTP() {
  // 1. Ambil params dari halaman register sebelumnya (email & loginId)
  const { email, loginId } = useLocalSearchParams();

  // 2. State Management
  const [otp, setOtp] = useState(["", "", "", ""]); // Array untuk 6 digit OTP
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Toast State
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "success",
  });
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ visible: true, message, type });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 3000);
  };

  // 3. Logic Ketik OTP
  const handleOtpChange = (text: string, index: number) => {
    const numericText = text.replace(/[^0-9]/g, "").slice(0, 1); // ✅ Tambah slice(0,1)
    const newOtp = [...otp];
    newOtp[index] = numericText;
    setOtp(newOtp);

    // ✅ Hanya urus maju — HAPUS logika mundur dari sini
    if (numericText && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace") {
      if (otp[index]) {
        // ✅ Kotak berisi → hapus isinya
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        // ✅ Kotak sudah kosong → mundur ke kotak sebelumnya
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  // DI DALAM OTP.TSX (Fungsi handleVerify)
  const handleVerify = async () => {
    const otpCode = otp.join("");
    if (otpCode.length < 4) return;
    setIsVerifying(true);
    try {
      const activeLoginId = (loginId as string) || (email as string) || "";
      const response = await authService.verifyOtp({
        loginId: activeLoginId,
        code: otpCode,
      });

      console.log("VERIFY RESPONSE:", JSON.stringify(response, null, 2)); // ← lihat ini

      if (response?.userId) {
        await storageService.saveUserId(response.userId);
        console.log("userId tersimpan:", response.userId); // ← konfirmasi tersimpan
      }
      if (response?.token) {
        // Sesuaikan 'token' dengan nama properti dari response API kamu
        await storageService.saveToken(response.token);
        console.log("Token berhasil disimpan!");
      }
      router.push({
        pathname: "/auth/firstsurvey",
        params: { userId: response?.userId ?? "" },
      });
    } catch (error: any) {
      showToast(
        `✕ ${error?.message || "Kode OTP salah atau expired"}`,
        "error",
      );
      setOtp(["", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setIsVerifying(false);
    }
  };
  // DI DALAM OTP.TSX (Fungsi handleResend)
  const handleResend = async () => {
    if (resendCooldown > 0) return; // Block kalau masih cooldown
    setIsResending(true); // ← pakai isResending
    try {
      const activeLoginId = (loginId as string) || (email as string) || "";
      await authService.refreshOtp(activeLoginId);

      showToast("✓ Kode OTP baru telah dikirim!", "success");
      setOtp(["", "", "", ""]);

      inputRefs.current[0]?.focus();

      // Mulai cooldown 60 detik
      setResendCooldown(300);
      const interval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error: any) {
      showToast(`✕ ${error?.message || "Gagal mengirim ulang OTP"}`, "error");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent={true} backgroundColor="black" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.content}
      >
        <Text style={styles.title}>Verification</Text>
        <Text style={styles.subtitle}>
          Kita akan mengirimkan 4 kode digit{"\n"}
          ke email yang telah diregistrasikan ({email}). {"\n"} Silahkan
          masukkan untuk mendapatkan {"\n"} akses ke aplikasi MoodBites.
        </Text>

        {/* 👇 Panggil Component UI Form di sini 👇 */}
        <OtpForm
          otp={otp}
          inputRefs={inputRefs}
          handleOtpChange={handleOtpChange}
          handleKeyPress={handleKeyPress}
          onVerify={handleVerify}
          onResend={handleResend}
          isVerifying={isVerifying}
          isResending={isResending}
          resendCooldown={resendCooldown}
        />
        {/* UI TOAST */}
        {toast.visible && (
          <View
            style={[
              styles.toastContainer,
              {
                backgroundColor:
                  toast.type === "success" ? "#A0D585" : "#FF9494",
              },
            ]}
          >
            <TextSemiBold style={styles.toastText}>
              {toast.message}
            </TextSemiBold>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: "5%", // Gunakan persentase
    justifyContent: "center",
    alignItems: "center",
    // Hindari marginTop negatif yang kaku seperti -50
    // Gunakan proporsi layar jika perlu ruang lebih
    marginTop: Platform.OS === "ios" ? 0 : -20,
  },
  title: {
    // Gunakan skala font yang dinamis jika ingin lebih pro
    fontSize: 28,
    fontFamily: "PlusJakartaSans-Bold",
    color: Colors.textPrimary,
    marginBottom: "5%", // Margin berbasis persentase
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: "10%", // Margin bawah lebih lebar untuk memberi napas
    paddingHorizontal: "5%", // Agar tidak menempel ke pinggir layar di HP kecil
  },
  toastContainer: {
    position: "absolute",
    bottom: "5%", // 5% dari bawah layar
    left: "5%",
    right: "5%",
    padding: 15,
    borderRadius: 5,
    zIndex: 100,
    elevation: 10,
  },
  toastText: {
    textAlign: "center",
    fontSize: 12,
    color: "#FFFFFF",
  },
});
