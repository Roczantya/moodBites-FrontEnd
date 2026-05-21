import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  ListRenderItem,
} from "react-native";
import { Feather } from "@expo/vector-icons";

// Import Custom Hook dan Component beserta typenya
import { usePreferensiLogic, FoodItem } from "@/hooks/use-preference-logic";
import { MoodBottomSheet } from "@/components/preference/Moodmodalsheet";
import BottomNavBar from "@/components/dashboard/bottomNavbar";

export default function PreferensiScreen() {
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

  // Type-safe render function untuk FlatList
  const renderFoodCard: ListRenderItem<FoodItem> = ({ item }) => (
    <View style={styles.card}>
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
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Feather name="arrow-left" size={24} color="#D9534F" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Preferensi</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Konten Utama */}
      <FlatList
        data={foods}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.heroSection}>
            <Text style={styles.heroTitleBlack}>Pilihan</Text>
            <Text style={styles.heroTitlePink}>Terbaik</Text>
            <Text style={styles.heroSubtitle}>Sesuai dengan Mood Kamu</Text>

            <View style={styles.moodDisplayContainer}>
              <View style={styles.moodDisplay}>
                <Feather name="smile" size={20} color="#D9534F" />
                <View style={{ marginLeft: 10 }}>
                  <Text style={styles.moodDisplayLabel}>Mood Saat Ini</Text>
                  <Text style={styles.moodDisplayValue}>{currentMood}</Text>
                </View>
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
        }
        renderItem={renderFoodCard}
      />
      <BottomNavBar />

      {/* Bottom Sheet */}
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
  container: {
    flex: 1,
    backgroundColor: "#FFFBF5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#D9534F",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  heroSection: {
    marginTop: 10,
    marginBottom: 20,
  },
  heroTitleBlack: {
    fontSize: 32,
    fontWeight: "900",
    color: "#000",
  },
  heroTitlePink: {
    fontSize: 32,
    fontWeight: "900",
    color: "#FF8A8A",
  },
  heroSubtitle: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
    marginBottom: 20,
  },
  moodDisplayContainer: {
    backgroundColor: "#F5EBE1",
    borderRadius: 25,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  moodDisplay: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EADACA",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
  },
  moodDisplayLabel: {
    fontSize: 10,
    color: "#666",
  },
  moodDisplayValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
  },
  updateButton: {
    backgroundColor: "#FF8A8A",
    borderRadius: 25,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  updateButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
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
  cardImage: {
    width: "100%",
    height: 150,
    borderRadius: 15,
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  cardDesc: {
    fontSize: 12,
    color: "#666",
    lineHeight: 18,
    marginBottom: 15,
  },
  cardMetaInfo: {
    flexDirection: "row",
    gap: 15,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  metaText: {
    fontSize: 12,
    color: "#666",
  },
  bottomNav: {
    position: "absolute",
    bottom: 20,
    left: 40,
    right: 40,
    backgroundColor: "#FFFDF9",
    borderRadius: 30,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    paddingVertical: 10,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 15,
    elevation: 5,
  },
  navItem: {
    alignItems: "center",
    padding: 10,
  },
  navText: {
    fontSize: 8,
    color: "#D9534F",
    fontWeight: "bold",
    marginTop: 5,
  },
  navNfcContainer: {
    alignItems: "center",
    position: "relative",
    top: -15,
  },
  navNfcBtn: {
    backgroundColor: "#FF8A8A",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#FFFDF9",
  },
});
