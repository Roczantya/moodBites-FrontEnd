import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons, Ionicons, Feather } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";
import BottomNavBar from "@/components/dashboard/bottomNavbar";
import Header from "@/components/dashboard/header";

// ✅ Import dari preferensi
import { usePreferensiLogic } from "@/hooks/use-preference-logic";
import { MoodBottomSheet } from "@/components/preference/Moodmodalsheet";

interface SuccessScreenProps {
  onBack: () => void;
}

export default function SuccessScreen({ onBack }: SuccessScreenProps) {
  // ✅ Pakai hook preferensi
  const {
    currentMood,
    tempMood,
    isModalVisible,
    isUpdating,
    foods,
    setTempMood,
    handleOpenMoodSelector,
    handleCloseMoodSelector,
    handleApplyMood,
  } = usePreferensiLogic();

  return (
    <SafeAreaView style={styles.container}>
      <Header title="NFC" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Scan Success Content ── */}
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
        </View>

        {/* ── Konten Preferensi ── */}
        <View style={styles.prefSection}>
          {/* Hero */}
          <View style={styles.heroSection}>
            <Text style={styles.heroTitleBlack}>Pilihan</Text>
            <Text style={styles.heroTitlePink}>Terbaik</Text>
            <Text style={styles.heroSubtitle}>Sesuai dengan Mood Kamu</Text>

            <View style={styles.moodDisplay}>
              <Feather name="smile" size={20} color="#D9534F" />
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.moodDisplayLabel}>Mood Saat Ini</Text>
                <Text style={styles.moodDisplayValue}>{currentMood}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.updateButton}
              onPress={handleOpenMoodSelector}
            >
              {isUpdating ? (
                <ActivityIndicator color="#FFF" size="small" />
              ) : (
                <>
                  <Feather
                    name="refresh-cw"
                    size={16}
                    color="#FFF"
                    style={{ marginRight: 8 }}
                  />
                  <Text style={styles.updateButtonText}>Memperbarui...</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Food Cards */}
          {foods.map((item) => (
            <View key={item.id} style={styles.card}>
              <Image source={{ uri: item.image }} style={styles.cardImage} />
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDesc}>{item.desc}</Text>
              <View style={styles.cardMetaInfo}>
                <View style={styles.metaRow}>
                  <Feather name="clock" size={14} color="#666" />
                  <Text style={styles.metaText}>{item.time}</Text>
                </View>
                <View style={styles.metaRow}>
                  <Feather name="zap" size={14} color="#666" />
                  <Text style={styles.metaText}>{item.cal}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <BottomNavBar />

      {/* Bottom Sheet Mood */}
      <MoodBottomSheet
        visible={isModalVisible}
        onClose={handleCloseMoodSelector}
        tempMood={tempMood}
        setTempMood={setTempMood}
        onApply={handleApplyMood}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // ... styles lama tetap sama ...
  container: { flex: 1, backgroundColor: Colors.primary },
  scrollView: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingBottom: 100 },
  mainContent: { alignItems: "center", marginTop: 20, marginBottom: 20 },
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
    fontFamily: "PlusJakartaSans-Bold",
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
    fontFamily: "PlusJakartaSans-Bold",
    marginBottom: 4,
  },
  cardValue: { color: Colors.textPrimary, fontSize: 16, fontWeight: "bold" },

  // ✅ Styles preferensi
  prefSection: { paddingHorizontal: 20 },
  heroSection: { marginTop: 10, marginBottom: 20 },
  heroTitleBlack: { fontSize: 32, fontWeight: "900", color: "#000" },
  heroTitlePink: { fontSize: 32, fontWeight: "900", color: "#FF8A8A" },
  heroSubtitle: { fontSize: 12, color: "#666", marginTop: 5, marginBottom: 20 },
  moodDisplayContainer: {
    backgroundColor: "#F5EBE1",
    borderRadius: 25,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  moodDisplay: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FCF2E2",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
  },
  moodDisplayLabel: { fontSize: 10, color: "#666" },
  moodDisplayValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.optionalAccent,
    paddingVertical: 5,
  },
  updateButton: {
    backgroundColor: "#FF8A8A",
    borderRadius: 25,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
    alignItems: "center",
  },
  updateButtonText: { color: "#FFF", fontWeight: "bold" },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardImage: { width: "100%", height: 150, borderRadius: 15, marginBottom: 15 },
  cardTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
  cardDesc: { fontSize: 12, color: "#666", lineHeight: 18, marginBottom: 15 },
  cardMetaInfo: { flexDirection: "row", gap: 15 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  metaText: { fontSize: 12, color: "#666" },
});
