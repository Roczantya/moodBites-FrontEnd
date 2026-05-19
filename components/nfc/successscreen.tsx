import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";
import BottomNavBar from "@/components/dashboard/bottomNavbar";
import Header from "@/components/dashboard/header"; // Import komponen Header global kamu

interface SuccessScreenProps {
  onBack: () => void;
}

export default function SuccessScreen({ onBack }: SuccessScreenProps) {
  return (
    // Menghapus barStyle inline agar mengikuti kesatuan global layout
    <SafeAreaView style={styles.container}>
      {/* Gunakan komponen Header yang sama agar tinggi halaman seragam */}
      <Header title="NFC" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mainContent}>
          <TouchableOpacity onPress={onBack}>
            <View style={styles.glowCircleOuter}>
              <View style={styles.glowCircleInner}>
                <MaterialCommunityIcons
                  name="nfc-variant"
                  size={40}
                  color={Colors.accent}
                />
              </View>
            </View>
          </TouchableOpacity>

          <Text style={styles.successText}>Connection Successful</Text>

          <View style={styles.cardsContainer}>
            <View style={styles.dataCard}>
              <View style={styles.iconContainer}>
                <Ionicons name="sparkles" size={20} color={Colors.accent} />
              </View>
              <View>
                <Text style={styles.cardLabel}>MOOD DETECTED</Text>
                <Text style={styles.cardValue}>Energized</Text>
              </View>
            </View>

            <View style={styles.dataCard}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: Colors.third },
                ]}
              >
                <MaterialCommunityIcons
                  name="cookie"
                  size={20}
                  color={Colors.textAccent}
                />
              </View>
              <View>
                <Text style={styles.cardLabel}>SNACK PROFILE</Text>
                <Text style={styles.cardValue}>HyperBites Alpha</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <BottomNavBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary, // Memberikan warna dasar yang rata
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  mainContent: {
    alignItems: "center",
    marginTop: 20, // Mengurangi margin top agar presisinya pas pasca-header global
    marginBottom: 20,
  },
  glowCircleOuter: {
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: Colors.secondary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.textPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  glowCircleInner: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
  },
  successText: {
    color: Colors.textPrimary,
    fontWeight: "bold",
    fontSize: 18,
    marginTop: 40,
    marginBottom: 30,
  },
  cardsContainer: { width: "100%", paddingHorizontal: 24 },
  dataCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: Colors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.optional,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  cardLabel: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 4,
  },
  cardValue: { color: Colors.textPrimary, fontSize: 16, fontWeight: "bold" },
});
