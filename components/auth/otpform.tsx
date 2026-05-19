import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import Button from "@/components/Reuse/button";
import { Colors } from "@/constants/colors";

// 1. Definisikan tipe props yang akan diterima dari Screen
interface OtpFormProps {
  otp: string[];
  inputRefs: React.MutableRefObject<Array<TextInput | null>>;
  handleOtpChange: (text: string, index: number) => void;
  handleKeyPress: (e: any, index: number) => void;
  onVerify: () => void;
  onResend: () => void;
  isVerifying: boolean; // ← ganti isLoading
  isResending: boolean;
  resendCooldown: number;
}

export default function OtpForm({
  otp,
  inputRefs,
  handleOtpChange,
  handleKeyPress,
  onVerify,
  onResend,
  isVerifying, // ← bukan isLoading
  isResending,
  resendCooldown,
}: OtpFormProps) {
  return (
    <View style={styles.formContainer}>
      {/* Kolom Input OTP */}
      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => {
              inputRefs.current[index] = ref;
            }}
            style={[styles.otpInput, digit ? styles.otpInputFilled : null]}
            keyboardType="number-pad"
            maxLength={1}
            value={digit}
            onChangeText={(text) => handleOtpChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            editable={!isVerifying && !isResending} // Disable input saat sedang verifying atau resending
            testID={`otp-input-${index}`}
          />
        ))}
      </View>

      {/* Kotak Info Keamanan */}
      <View style={styles.secureBox}>
        <View style={styles.secureIconContainer}>
          <MaterialIcons name="security" size={16} color={Colors.accent} />
        </View>
        <View style={styles.secureTextContainer}>
          <Text style={styles.secureTitle}>SECURED BY MOODBITES</Text>
          <Text style={styles.secureSubtitle}>
            Your data is encrypted. We only use this to{"\n"}ensure it's really
            you.
          </Text>
        </View>
      </View>

      {/* Tombol Resend */}
      <TouchableOpacity
        style={[
          styles.resendButton,
          resendCooldown > 0 && { opacity: 0.5 }, // ← redup kalau cooldown aktif
        ]}
        onPress={onResend}
        disabled={resendCooldown > 0 || isResending}
      >
        <Feather name="refresh-cw" size={14} color={Colors.accent} />
        <Text style={styles.resendText}>
          {isResending
            ? "PLEASE WAIT..."
            : resendCooldown > 0
              ? `Kirim ulang dalam ${resendCooldown}s` // ← tampil hitungan mundur
              : "Kirim ulang kode OTP"}
        </Text>
      </TouchableOpacity>

      {/* Tombol Verify */}
      <Button
        label={isVerifying ? "Verifying..." : "Verify & Continue"}
        onPress={onVerify}
        variant="primary"
        disabled={isVerifying || isResending || otp.join("").length < 4} // Disable kalau belum 4 digit
        style={{ backgroundColor: Colors.accent, shadowColor: Colors.accent }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    width: "100%",
    alignItems: "center",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between", // Akan otomatis membagi sisa ruang secara rata
    width: "100%",
    marginBottom: 40,
    paddingHorizontal: 5, // Tambahkan sedikit padding agar tidak terlalu mepet layar
  },
  otpInput: {
    width: 60, // Dikecilkan dari 60 agar muat 6 kolom
    height: 75, // Dikecilkan dari 75
    backgroundColor: Colors.white,
    borderRadius: 15, // Disesuaikan dengan ukuran kotak yang lebih kecil
    fontSize: 20, // Font sedikit dikecilkan
    fontWeight: "bold",
    textAlign: "center",
    color: Colors.textPrimary,

    // Konfigurasi shadow
    ...Platform.select({
      ios: {
        shadowColor: Colors.textPrimary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.05)",
      },
    }),
  },
  otpInputFilled: {
    borderColor: Colors.accent,
    borderWidth: 1,
  },

  // ... (Style bagian secureBox, resendButton, dll biarkan sama persis seperti kode aslimu)
  secureBox: {
    flexDirection: "row",
    backgroundColor: Colors.third,
    padding: 10,
    borderRadius: 20,
    width: "100%",
    alignItems: "center",
    marginBottom: 40,
  },
  secureIconContainer: {
    backgroundColor: Colors.secondary,
    padding: 8,
    borderRadius: 12,
    marginRight: 12,
  },
  secureTextContainer: { flex: 1 },
  secureTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: Colors.textAccent,
    letterSpacing: 1,
    marginBottom: 4,
  },
  secureSubtitle: {
    fontSize: 10,
    color: Colors.textSecondary,
    lineHeight: 14,
  },
  resendButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  resendText: {
    marginLeft: 10,
    color: Colors.accent,
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 12,
    letterSpacing: 1,
  },
});
