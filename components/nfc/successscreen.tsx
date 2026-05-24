import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const COLORS = {
  bg: "#FDF0E8",
  cardBg: "#FFFFFF",
  infoBg: "#FAE0DC",
  primary: "#C0616A",
  primaryLight: "#E8A0A7",
  primaryPale: "#F5C5C9",
  success: "#6BAE8A",
  successLight: "#C8E6D5",
  textDark: "#7A2D35",
  textMedium: "#9C5A62",
  textLight: "#B08890",
  iconBg: "#F5C5C9",
};

interface SuccessScreenProps {
  profileName?: string;
  onDone?: () => void;
  onScanAgain?: () => void;
}

export default function SuccessScreen({
  profileName = "MoodBits User",
  onDone,
  onScanAgain,
}: SuccessScreenProps) {
  const checkAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(checkAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* Success Card */}
      <View style={styles.successCard}>
        <Animated.View
          style={[
            styles.checkCircle,
            { transform: [{ scale: checkAnim }] },
          ]}
        >
          <Ionicons name="checkmark" size={38} color="#FFFFFF" />
        </Animated.View>

        <Animated.View
          style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
        >
          <Text style={styles.title}>Connected!</Text>
          <Text style={styles.subtitle}>
            Profile shared successfully with{"\n"}
            <Text style={styles.profileName}>{profileName}</Text>
          </Text>
        </Animated.View>
      </View>

      {/* Profile Shared Info */}
      <Animated.View
        style={[
          styles.infoCard,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <View style={styles.infoRow}>
          <View style={styles.infoIconWrap}>
            <MaterialCommunityIcons
              name="account-check-outline"
              size={20}
              color={COLORS.primary}
            />
          </View>
          <Text style={styles.infoTitle}>Profile Shared</Text>
        </View>
        <Text style={styles.infoText}>
          Your MoodBits profile has been shared. You can view it in your connection history.
        </Text>
      </Animated.View>

      {/* Action Buttons */}
      <Animated.View
        style={[
          styles.actions,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <TouchableOpacity style={styles.scanAgainBtn} onPress={onScanAgain} activeOpacity={0.8}>
          <MaterialCommunityIcons name="nfc-variant" size={18} color={COLORS.primary} />
          <Text style={styles.scanAgainText}>Scan Again</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.doneBtn} onPress={onDone} activeOpacity={0.85}>
          <Text style={styles.doneText}>Done</Text>
        </TouchableOpacity>
      </Animated.View>
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
  successCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 28,
    paddingVertical: 44,
    paddingHorizontal: 24,
    alignItems: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  checkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.success,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    shadowColor: COLORS.success,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.textDark,
    textAlign: "center",
    marginBottom: 10,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textMedium,
    textAlign: "center",
    lineHeight: 21,
  },
  profileName: {
    fontWeight: "700",
    color: COLORS.primary,
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
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
  },
  scanAgainBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: COLORS.infoBg,
    paddingVertical: 15,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.primaryPale,
  },
  scanAgainText: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.primary,
  },
  doneBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    borderRadius: 16,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 5,
  },
  doneText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },
});