import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const COLORS = {
  bg: "#FDF0E8",
  bgCircle: "#F2C8C4",       // large decorative circle behind card
  cardBg: "#FFFFFF",
  infoBg: "#FAE0DC",
  primary: "#C0616A",
  primaryLight: "#E8A0A7",
  primaryPale: "#F5C5C9",
  iconCircleBg: "#E8A0A7",   // medium pink circle around icon
  textDark: "#7A2D35",
  textMedium: "#9C5A62",
};

export default function ScanScreen() {
  const pulseAnim1 = useRef(new Animated.Value(1)).current;
  const pulseAnim2 = useRef(new Animated.Value(1)).current;
  const pulseOpacity1 = useRef(new Animated.Value(0.7)).current;
  const pulseOpacity2 = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    const pulse = (
      anim: Animated.Value,
      opacity: Animated.Value,
      delay: number,
      baseOpacity: number
    ) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.parallel([
            Animated.timing(anim, {
              toValue: 1.4,
              duration: 1500,
              easing: Easing.out(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0,
              duration: 1500,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(anim, { toValue: 1, duration: 0, useNativeDriver: true }),
            Animated.timing(opacity, { toValue: baseOpacity, duration: 0, useNativeDriver: true }),
          ]),
        ])
      ).start();
    };

    pulse(pulseAnim1, pulseOpacity1, 0, 0.7);
    pulse(pulseAnim2, pulseOpacity2, 750, 0.35);
  }, []);

  return (
    <View style={styles.container}>
      {/* Big decorative pale-pink circle — sits behind the card */}
      

      {/* Main white card */}
      <View style={styles.card}>
        {/* Icon area: pulse rings + solid circle + NFC icon */}
        <View style={styles.iconWrapper}>
          {/* Outer pulse ring */}
          <Animated.View
            style={[
              styles.pulseRing,
              styles.pulseRingOuter,
              { transform: [{ scale: pulseAnim2 }], opacity: pulseOpacity2 },
            ]}
          />
          {/* Inner pulse ring */}
          <Animated.View
            style={[
              styles.pulseRing,
              styles.pulseRingInner,
              { transform: [{ scale: pulseAnim1 }], opacity: pulseOpacity1 },
            ]}
          />
          {/* Solid circle behind icon */}
          <View style={styles.iconCircle}>
            <MaterialCommunityIcons
              name="nfc-variant"
              size={36}
              color="#FFFFFF"
            />
          </View>
        </View>

        {/* Subtitle only — no title as per new design */}
        <Text style={styles.subtitle}>
          Tempelkan HP ke Kiosk untuk{"\n"}mengirim preferensi mood kamu
        </Text>

        {/* Info card inside the white card */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="nfc" size={18} color={COLORS.primary} />
            <Text style={styles.infoTitle}>Pastikan NFC Aktif</Text>
          </View>
          <Text style={styles.infoText}>
            Buka pengaturan perangkat dan aktifkan{"\n"}NFC sebelum mendekatkan ke Kiosk.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 60,
    paddingHorizontal: 24,
  },

  // ── Large pale pink decorative circle ──────────────────────────────
  

  // ── White card ──────────────────────────────────────────────────────
  card: {
    width: "100%",
    backgroundColor: COLORS.cardBg,
    borderRadius: 28,
    paddingTop: 44,
    paddingBottom: 28,
    paddingHorizontal: 24,
    alignItems: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },

  // ── Icon + pulse rings ──────────────────────────────────────────────
  iconWrapper: {
    width: 120,
    height: 120,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  pulseRing: {
    position: "absolute",
    borderRadius: 999,
  },
  pulseRingOuter: {
    width: 120,
    height: 120,
    backgroundColor: COLORS.primaryPale,
  },
  pulseRingInner: {
    width: 96,
    height: 96,
    backgroundColor: COLORS.primaryLight,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },

  // ── Text ────────────────────────────────────────────────────────────
  subtitle: {
    fontSize: 15,
    color: COLORS.textMedium,
    textAlign: "center",
    lineHeight: 23,
    fontWeight: "400",
    marginBottom: 24,
  },

  // ── Info card (inside white card) ───────────────────────────────────
  infoCard: {
    width: "100%",
    backgroundColor: COLORS.infoBg,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  infoText: {
    fontSize: 13,
    color: COLORS.textMedium,
    lineHeight: 20,
  },
});