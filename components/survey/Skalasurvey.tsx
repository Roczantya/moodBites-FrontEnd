import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Colors } from "@/constants/colors";

interface LikertScaleProps {
  label: string;
  value?: number;
  onChange: (val: number) => void;
  minLabel: string;
  maxLabel: string;
}

export const LikertScale: React.FC<LikertScaleProps> = ({
  label,
  value = 0,
  onChange,
  minLabel,
  maxLabel,
}) => {
  const isFilled = value > 0;
  // Thumb disembunyikan (opacity 0) jika belum ada nilai
  const thumbOpacity = isFilled ? 1 : 0;
  const fillPercentage = (
    value === 0 ? "0%" : `${((value - 1) / 4) * 100}%`
  ) as any;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.sliderWrapper}>
        <View style={styles.sliderContainer}>
          {/* Garis Dasar - Kalau kosong pakai abu-abu pudar */}
          <View
            style={[
              styles.trackBackground,
              !isFilled && { backgroundColor: "#E0E0E0" },
            ]}
          />

          {/* Garis Aktif - Hanya muncul kalau isFilled */}
          {isFilled && (
            <View style={[styles.trackActive, { width: fillPercentage }]} />
          )}

          {/* Bulatan (Thumb) - Muncul otomatis saat angka ditekan */}
          <View
            style={[
              styles.thumb,
              { left: fillPercentage, opacity: thumbOpacity },
            ]}
          />

          <View style={styles.touchableOverlay}>
            {[1, 2, 3, 4, 5].map((num) => (
              <TouchableOpacity
                key={num}
                style={styles.touchableArea}
                onPress={() => onChange(num)}
                activeOpacity={1}
              />
            ))}
          </View>
        </View>
      </View>

      <View style={styles.numbersRow}>
        {[1, 2, 3, 4, 5].map((num) => (
          <Text
            key={num}
            style={[
              styles.numberText,
              value === num
                ? { color: Colors.textPrimary, fontSize: 18 }
                : { color: "#BBB" },
            ]}
          >
            {num}
          </Text>
        ))}
      </View>

      <View style={styles.labelRow}>
        <Text style={styles.minMaxText}>{minLabel}</Text>
        <Text style={styles.minMaxText}>{maxLabel}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#F5F5F5",
  },
  label: {
    fontSize: 18,
    fontFamily: "PlusJakartaSans-SemiBold",
    marginBottom: 20,
    color: Colors.textPrimary,
  },
  sliderWrapper: { paddingHorizontal: 10, marginBottom: 15 },
  sliderContainer: { height: 20, justifyContent: "center" },
  trackBackground: {
    position: "absolute",
    width: "100%",
    height: 5,
    backgroundColor: Colors.secondary,
    borderRadius: 2,
  },
  trackActive: {
    position: "absolute",
    height: 4,
    backgroundColor: Colors.accent,
    borderRadius: 2,
  },
  thumb: {
    position: "absolute",
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.white,
    borderWidth: 4,
    borderColor: Colors.textAccent,
    transform: [{ translateX: -11 }],
  },
  touchableOverlay: { ...StyleSheet.absoluteFillObject, flexDirection: "row" },
  touchableArea: { flex: 1 },
  numbersRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  numberText: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Bold",
    width: 25,
    textAlign: "center",
  },
  labelRow: { flexDirection: "row", justifyContent: "space-between" },
  minMaxText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontFamily: "PlusJakartaSans-Bold",
  },
});
