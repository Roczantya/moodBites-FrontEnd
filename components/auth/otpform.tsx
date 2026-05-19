import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
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
  isLoading: boolean;
}

export default function OtpForm({
  otp,
  inputRefs,
  handleOtpChange,
  handleKeyPress,
  onVerify,
  onResend,
  isLoading,
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
            editable={!isLoading}
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
        style={styles.resendButton}
        onPress={onResend}
        disabled={isLoading}
      >
        <Feather name="refresh-cw" size={14} color={Colors.accent} />
        <Text style={styles.resendText}>
          {isLoading ? "PLEASE WAIT..." : "RESEND CODE"}
        </Text>
      </TouchableOpacity>

      {/* Tombol Verify */}
      <Button
        label={isLoading ? "Verifying..." : "Verify & Continue"}
        onPress={onVerify}
        variant="primary"
        disabled={isLoading || otp.join("").length < 4} // Disable kalau belum 4 digit
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
    justifyContent: "space-between",
    width: "100%",
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
    backgroundColor: Colors.third,
    padding: 16,
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
