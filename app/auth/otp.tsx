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
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<Array<TextInput | null>>([]);

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
    const numericText = text.replace(/[^0-9]/g, "");
    const newOtp = [...otp];
    newOtp[index] = numericText;
    setOtp(newOtp);

    if (numericText && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // DI DALAM OTP.TSX (Fungsi handleVerify)
  const handleVerify = async () => {
    const otpCode = otp.join("");
    if (otpCode.length < 4) return;

    try {
      const activeLoginId = (loginId as string) || (email as string) || "";
      const payloadData = {
        loginId: activeLoginId,
        code: otpCode, // Sudah sesuai dengan interface VerifyOtpPayload
      };

      console.log("Mengirim payload ke backend:", payloadData);

      // PASTIKAN MEMANGGIL 'verifyOtp', BUKAN 'refreshOtp'
      const response = await authService.verifyOtp(payloadData);

      console.log("Berhasil verifikasi:", response);
      // router.push("/auth/firstsurvey");
    } catch (error: any) {
      console.error("Gagal verifikasi:", error.response?.data || error.message);
    }
  };
  // DI DALAM OTP.TSX (Fungsi handleResend)
  const handleResend = async () => {
    setIsLoading(true);
    try {
      const activeLoginId = (loginId as string) || (email as string) || "";
      // Cukup kirim string-nya langsung, jangan dikasih {}
      await authService.refreshOtp(activeLoginId);

      showToast("✓ Kode OTP baru telah dikirim!", "success");
      setOtp(["", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (error: any) {
      showToast(`✕ ${error?.message || "Gagal mengirim ulang OTP"}`, "error");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.content}
      >
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

        <Text style={styles.title}>Verification</Text>
        <Text style={styles.subtitle}>
          Kita akan mengirimkan 6 kode digit{"\n"}
          keemail yang telah diregistrasikan ({email}). Silahkan masukkan{"\n"}
          untuk mendapatkan akses ke aplikasi MoodBites.
        </Text>

        {/* 👇 Panggil Component UI Form di sini 👇 */}
        <OtpForm
          otp={otp}
          inputRefs={inputRefs}
          handleOtpChange={handleOtpChange}
          handleKeyPress={handleKeyPress}
          onVerify={handleVerify}
          onResend={handleResend}
          isLoading={isLoading}
        />
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
    paddingHorizontal: 24,
    justifyContent: "center",
    alignItems: "center",
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
    top: 20, // Muncul dari atas untuk OTP biar ga nutupin keyboard
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
