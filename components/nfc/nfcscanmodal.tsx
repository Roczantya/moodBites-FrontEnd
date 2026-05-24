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
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";

const COLORS = {
  bg: "#FDF0E8",
  overlay: "rgba(122, 45, 53, 0.45)",
  cardBg: "#FFFFFF",
  infoBg: "#FAE0DC",
  primary: "#C0616A",
  primaryLight: "#E8A0A7",
  primaryPale: "#F5C5C9",
  textDark: "#7A2D35",
  textMedium: "#9C5A62",
  iconBg: "#F5C5C9",
};

interface NfcScanModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function NfcScanModal({ visible, onClose, onSuccess }: NfcScanModalProps) {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 60,
          friction: 8,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    } else {
      scaleAnim.setValue(0.85);
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
        <Animated.View
          style={[
            styles.card,
            { transform: [{ scale: scaleAnim }], opacity: opacityAnim },
          ]}
        >
          {/* Spinner */}
          <View style={styles.spinnerContainer}>
            <Animated.View style={[styles.spinner, { transform: [{ rotate: spin }] }]} />
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons name="nfc-variant" size={34} color={COLORS.primary} />
            </View>
          </View>

          <Text style={styles.title}>Scanning…</Text>
          <Text style={styles.subtitle}>
            Keep your devices close{"\n"}until the connection is established.
          </Text>

          <TouchableOpacity style={styles.cancelBtn} onPress={onClose} activeOpacity={0.75}>
            <Ionicons name="close-circle-outline" size={18} color={COLORS.textMedium} />
            <Text style={styles.cancelText}>Cancel</Text>
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
    paddingHorizontal: 32,
  },
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 28,
    paddingVertical: 40,
    paddingHorizontal: 28,
    alignItems: "center",
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
  },
  spinnerContainer: {
    width: 90,
    height: 90,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  spinner: {
    position: "absolute",
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: COLORS.primaryPale,
    borderTopColor: COLORS.primary,
  },
  iconCircle: {
    width: 66,
    height: 66,
    borderRadius: 18,
    backgroundColor: COLORS.iconBg,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.textDark,
    marginBottom: 10,
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textMedium,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 28,
  },
  cancelBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLORS.infoBg,
    paddingVertical: 11,
    paddingHorizontal: 24,
    borderRadius: 50,
  },
  cancelText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textMedium,
  },
});