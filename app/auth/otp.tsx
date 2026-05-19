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
  const [otp, setOtp] = useState(["", "", "", ""]);
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

  // 4. Logic Fetching API (Verify)
  // 4. Logic Fetching API (Verify)
  const handleVerify = async () => {
    const otpCode = otp.join("");
    if (otpCode.length < 4) return;

    // 🔥 JALUR BYPASS UNTUK TESTING FE 🔥
    if (otpCode === "4534") {
      showToast("✓ [TEST] Verifikasi berhasil bypass!", "success");
      setTimeout(() => {
        router.push("/auth/firstsurvey");
      }, 1500);
      return; // Berhenti di sini, jangan hit API beneran
    }

    setIsLoading(true);
    try {
      // Hit API verifyOtp (Hanya jalan kalau kodenya bukan 1234)
      await authService.verifyOtp({
        loginId: loginId as string,
        code: otpCode,
      });

      showToast("✓ Verifikasi berhasil!", "success");
      setTimeout(() => {
        setIsLoading(false);
        router.push("/auth/firstsurvey");
      }, 1500);
    } catch (error: any) {
      setIsLoading(false);
      showToast(`✕ ${error?.message || "OTP salah atau kedaluwarsa"}`, "error");
    }
  };

  // 5. Logic Fetching API (Resend)
  const handleResend = async () => {
    setIsLoading(true);
    try {
      await authService.refreshOtp(loginId as string);
      showToast("✓ Kode OTP baru telah dikirim!", "success");
      setOtp(["", "", "", ""]); // Reset kotak OTP
      inputRefs.current[0]?.focus(); // Fokus ke kotak pertama lagi
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
          We've sent a 4-digit code to your{"\n"}
          registered email ({email}). Please enter it{"\n"}
          below to keep your culinary journey secure.
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
