import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";

const COLORS = {
  bg: "#FDF0E8",
  cardBg: "#FFFFFF",
  infoBg: "#FAE0DC",
  primary: "#C0616A",
  primaryLight: "#E8A0A7",
  primaryPale: "#F5C5C9",
  textDark: "#7A2D35",
  textMedium: "#9C5A62",
  textLight: "#B08890",
  iconBg: "#F5C5C9",
};

type Props = {
  onStartScan: () => void;
};

export default function ScanScreen({
  onStartScan,
}: Props) {
  const pulseAnim1 = useRef(new Animated.Value(1)).current;
  const pulseAnim2 = useRef(new Animated.Value(1)).current;
  const pulseOpacity1 = useRef(new Animated.Value(0.6)).current;
  const pulseOpacity2 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const pulse = (anim: Animated.Value, opacity: Animated.Value, delay: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.parallel([
            Animated.timing(anim, {
              toValue: 1.35,
              duration: 1400,
              easing: Easing.out(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0,
              duration: 1400,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(anim, {
              toValue: 1,
              duration: 0,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: delay === 0 ? 0.6 : 0.3,
              duration: 0,
              useNativeDriver: true,
            }),
          ]),
        ])
      ).start();
    };

    pulse(pulseAnim1, pulseOpacity1, 0);
    pulse(pulseAnim2, pulseOpacity2, 700);
  }, []);

  return (
    <View style={styles.container}>
      {/* Ready Card */}
      <View style={styles.readyCard}>
        {/* NFC Icon with pulse rings */}
        <View style={styles.iconWrapper}>
          <Animated.View
            style={[
              styles.pulseRing,
              { transform: [{ scale: pulseAnim2 }], opacity: pulseOpacity2 },
            ]}
          />
          <Animated.View
            style={[
              styles.pulseRing,
              styles.pulseRingInner,
              { transform: [{ scale: pulseAnim1 }], opacity: pulseOpacity1 },
            ]}
          />
          <View style={styles.iconCircle}>
            <MaterialCommunityIcons
              name="nfc-variant"
              size={38}
              color={COLORS.primary}
            />
          </View>
        </View>

        <Text style={styles.cardTitle}>Ready to Connect</Text>
        <Text style={styles.cardSubtitle}>
          Hold your phone near another{"\n"}device to share your profile.
        </Text>
      </View>

      <TouchableOpacity
        style={styles.scanButton}
        onPress={onStartScan}
      >
        <Text style={styles.scanButtonText}>
          Activate NFC
        </Text>
      </TouchableOpacity>

      {/* Enable NFC Info Card */}
      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <View style={styles.infoIconWrap}>
            <Ionicons name="radio-outline" size={22} color={COLORS.primary} />
          </View>
          <Text style={styles.infoTitle}>Enable NFC</Text>
        </View>
        <Text style={styles.infoText}>
          Ensure NFC is toggled on in your device system settings for proximity sharing.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 16,
  },
  readyCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 28,
    paddingVertical: 40,
    paddingHorizontal: 24,
    alignItems: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  iconWrapper: {
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  pulseRing: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primaryPale,
  },
  pulseRingInner: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: COLORS.primaryLight,
  },
  iconCircle: {
    width: 66,
    height: 66,
    borderRadius: 20,
    backgroundColor: COLORS.iconBg,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.textDark,
    marginBottom: 10,
    textAlign: "center",
    letterSpacing: -0.3,
  },
  cardSubtitle: {
    fontSize: 14,
    color: COLORS.textMedium,
    textAlign: "center",
    lineHeight: 21,
    fontWeight: "400",
  },
  infoCard: {
    backgroundColor: COLORS.infoBg,
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  infoIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  infoText: {
    fontSize: 13,
    color: COLORS.textMedium,
    lineHeight: 20,
    fontWeight: "400",
  },

  scanButton: {
  backgroundColor: COLORS.primary,
  paddingVertical: 16,
  borderRadius: 18,
  alignItems: "center",
  justifyContent: "center",
},

scanButtonText: {
  color: "#FFFFFF",
  fontSize: 16,
  fontWeight: "700",
},
});