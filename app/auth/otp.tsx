import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import Button from "@/components/Reuse/button"; // Import custom Button kamu
import { Colors } from "@/constants/colors";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
export default function OTP() {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef<Array<TextInput | null>>([]);

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

  const handleVerify = () => {
    const otpCode = otp.join("");
    console.log("Verifying OTP for Moodbites:", otpCode);
    router.push("/auth/firstsurvey");
    // Tambahkan logika verifikasi ke API di sini
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.content}
      >
        <Text style={styles.title}>Verification</Text>
        <Text style={styles.subtitle}>
          We've sent a 4-digit code to your{"\n"}
          registered mobile number. Please enter it{"\n"}
          below to keep your culinary journey secure.
        </Text>

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
              Your data is encrypted. We only use this to{"\n"}ensure it's
              really you.
            </Text>
          </View>
        </View>

        {/* Tombol Resend */}
        <TouchableOpacity style={styles.resendButton} testID="resend-button">
          <Feather name="refresh-cw" size={14} color={Colors.accent} />
          <Text style={styles.resendText}>RESEND CODE</Text>
        </TouchableOpacity>

        {/* Menggunakan Komponen Custom Button Milikmu */}
        <Button
          label="Verify & Continue"
          onPress={handleVerify}
          variant="primary" // Menggunakan style Figma dari button.tsx kamu
          style={{ backgroundColor: Colors.accent, shadowColor: Colors.accent }} // Override agar warnanya sama dengan desain (pink)
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary, // #FFF5E4 dari constants/colors
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontFamily: "PlusJakartaSans-Bold", // Asumsi kamu punya font ini berdasar customFont.tsx
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
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 16,
    marginBottom: 40,
  },
  otpInput: {
    width: 60,
    height: 75,
    backgroundColor: Colors.white,
    borderRadius: 30,
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: Colors.textPrimary,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  otpInputFilled: {
    borderColor: Colors.accent,
    borderWidth: 1,
  },
  secureBox: {
    flexDirection: "row",
    backgroundColor: Colors.third, // #FFD1D1
    padding: 16,
    borderRadius: 20,
    width: "100%",
    alignItems: "center",
    marginBottom: 40,
  },
  secureIconContainer: {
    backgroundColor: Colors.secondary, // #FFE3E1
    padding: 8,
    borderRadius: 12,
    marginRight: 12,
  },
  secureTextContainer: {
    flex: 1,
  },
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
    marginLeft: 8,
    color: Colors.accent,
    fontWeight: "bold",
    fontSize: 12,
    letterSpacing: 1,
  },
});
