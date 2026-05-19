import React, { useState, useRef, useEffect } from "react";
import {
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  View,
} from "react-native";
import { Colors } from "@/constants/colors";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextSemiBold } from "@/constants/customFont";

import authService from "@/services/authService";
import OtpForm from "@/components/auth/otpform"; // Import UI yang baru dibuat

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
    setIsVerifying(true); // ← pakai isVerifying
    try {
      const activeLoginId = (loginId as string) || (email as string) || "";
      const payloadData = {
        loginId: activeLoginId,
        code: otpCode, // Sudah sesuai dengan interface VerifyOtpPayload
      };
      console.log("PARAMS →", { loginId, email });
      console.log("activeLoginId →", activeLoginId);
      console.log("otpCode →", otpCode);
      console.log("Mengirim payload ke backend:", payloadData);

      // PASTIKAN MEMANGGIL 'verifyOtp', BUKAN 'refreshOtp'
      const response = await authService.verifyOtp(payloadData);

      console.log("Berhasil verifikasi:", response);
      router.push("/auth/firstsurvey");
    } catch (error: any) {
      showToast(
        `✕ ${error?.message || "Kode OTP salah atau expired"}`,
        "error",
      );
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
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.content}
      >
        <Text style={styles.title}>Verification</Text>
        <Text style={styles.subtitle}>
          Kita akan mengirimkan 6 kode digit{"\n"}
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
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -50,
  },
  title: {
    fontSize: 28,
    fontFamily: "PlusJakartaSans-Bold",
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 40,
  },
  toastContainer: {
    position: "absolute",
    bottom: 40, // Muncul dari atas untuk OTP biar ga nutupin keyboard
    left: 20,
    right: 20,
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
