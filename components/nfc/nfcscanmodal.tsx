import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  Easing,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const COLORS = {
  overlay: "rgba(90, 30, 36, 0.5)",
  cardBg: "#FFFFFF",
  infoBg: "#FAE0DC",
  primary: "#C0616A",
  primaryLight: "#E8A0A7",
  primaryPale: "#F5C5C9",
  primaryDeep: "#A84850",
  textDark: "#7A2D35",
  textMedium: "#9C5A62",
  textLight: "#C4909A",
};

interface NfcScanModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function NfcScanModal({ visible, onClose, onSuccess }: NfcScanModalProps) {
  const rotateAnim  = useRef(new Animated.Value(0)).current;
  const scaleAnim   = useRef(new Animated.Value(0.88)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const pulse1      = useRef(new Animated.Value(1)).current;
  const pulse1Op    = useRef(new Animated.Value(0.55)).current;
  const pulse2      = useRef(new Animated.Value(1)).current;
  const pulse2Op    = useRef(new Animated.Value(0.28)).current;
  const dotAnim1    = useRef(new Animated.Value(0.3)).current;
  const dotAnim2    = useRef(new Animated.Value(0.3)).current;
  const dotAnim3    = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    if (visible) {
      // Card entrance
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 65,
          friction: 9,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();

      // Spinner rotation
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 1100,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();

      // Pulse rings
      const pulseFn = (anim: Animated.Value, op: Animated.Value, delay: number, baseOp: number) => {
        Animated.loop(
          Animated.sequence([
            Animated.delay(delay),
            Animated.parallel([
              Animated.timing(anim, { toValue: 1.2, duration: 850, easing: Easing.out(Easing.ease), useNativeDriver: true }),
              Animated.timing(op,   { toValue: 0,   duration: 1400, useNativeDriver: true }),
            ]),
            Animated.parallel([
              Animated.timing(anim, { toValue: 1, duration: 0, useNativeDriver: true }),
              Animated.timing(op,   { toValue: baseOp, duration: 0, useNativeDriver: true }),
            ]),
          ])
        ).start();
      };
      pulseFn(pulse1, pulse1Op, 0,   0.55);
      pulseFn(pulse2, pulse2Op, 350, 0.22);

      // Bouncing dots
      const dotFn = (anim: Animated.Value, delay: number) => {
        Animated.loop(
          Animated.sequence([
            Animated.delay(delay),
            Animated.timing(anim, { toValue: 1,   duration: 380, easing: Easing.out(Easing.ease), useNativeDriver: true }),
            Animated.timing(anim, { toValue: 0.3, duration: 380, easing: Easing.in(Easing.ease),  useNativeDriver: true }),
            Animated.delay(640),
          ])
        ).start();
      };
      dotFn(dotAnim1, 0);
      dotFn(dotAnim2, 200);
      dotFn(dotAnim3, 400);
    } else {
      scaleAnim.setValue(0.88);
      opacityAnim.setValue(0);
      rotateAnim.setValue(0);
    }
  }, [visible]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Animated.View style={[styles.card, { transform: [{ scale: scaleAnim }], opacity: opacityAnim }]}>

          {/* ── Icon + rings ── */}
          <View style={styles.iconArea}>
            <Animated.View style={[styles.ring, styles.ringOuter, { transform: [{ scale: pulse2 }], opacity: pulse2Op }]} />
            <Animated.View style={[styles.ring, styles.ringInner, { transform: [{ scale: pulse1 }], opacity: pulse1Op }]} />
            <Animated.View style={[styles.spinnerRing, { transform: [{ rotate: spin }] }]} />
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons name="nfc-variant" size={32} color="#FFFFFF" />
            </View>
          </View>

          {/* ── Title + animated dots ── */}
          <View style={styles.titleRow}>
            <Text style={styles.title}>Mendeteksi Kiosk</Text>
            <View style={styles.dotsRow}>
              {[dotAnim1, dotAnim2, dotAnim3].map((d, i) => (
                <Animated.View key={i} style={[styles.dot, { opacity: d }]} />
              ))}
            </View>
          </View>

          <Text style={styles.subtitle}>
            Tempelkan bagian belakang HP kamu{"\n"}ke Kiosk hingga terhubung
          </Text>

          {/* ── Tip card ── */}
          <View style={styles.tipCard}>
            <MaterialCommunityIcons name="lightbulb-outline" size={16} color={COLORS.primary} />
            <Text style={styles.tipText}>
              Pastikan layar HP menyala dan NFC aktif
            </Text>
          </View>

          {/* ── Cancel ── */}
          <TouchableOpacity style={styles.cancelBtn} onPress={onClose} activeOpacity={0.75}>
            <Text style={styles.cancelText}>Batalkan</Text>
          </TouchableOpacity>

        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
  },
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 32,
    paddingTop: 44,
    paddingBottom: 32,
    paddingHorizontal: 28,
    alignItems: "center",
    width: "100%",
    shadowColor: "#7A2D35",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.18,
    shadowRadius: 32,
    elevation: 12,
  },

  // Icon area
  iconArea: {
    width: 120,
    height: 120,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
  },
  ring: {
    position: "absolute",
    borderRadius: 999,
  },
  ringOuter: {
    width: 120,
    height: 120,
    backgroundColor: COLORS.primaryPale,
  },
  ringInner: {
    width: 94,
    height: 94,
    backgroundColor: COLORS.primaryLight,
  },
  spinnerRing: {
    position: "absolute",
    width: 82,
    height: 82,
    borderRadius: 41,
    borderWidth: 2.5,
    borderColor: COLORS.primaryPale,
    borderTopColor: COLORS.primaryDeep,
    borderRightColor: COLORS.primary,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 5,
  },

  // Title row
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 10,
  },
  title: {
    fontSize: 19,
    fontWeight: "800",
    color: COLORS.textDark,
    letterSpacing: -0.3,
  },
  dotsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingTop: 4,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
  },

  subtitle: {
    fontSize: 13,
    color: COLORS.textMedium,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 22,
  },

  // Tip card
  tipCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: COLORS.infoBg,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: "100%",
    marginBottom: 24,
  },
  tipText: {
    fontSize: 12.5,
    color: COLORS.textMedium,
    fontWeight: "500",
    flex: 1,
  },

  // Cancel button
  cancelBtn: {
    paddingVertical: 13,
    paddingHorizontal: 48,
    borderRadius: 50,
    borderWidth: 1.5,
    borderColor: COLORS.primaryLight,
  },
  cancelText: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textMedium,
    letterSpacing: 0.2,
  },
});