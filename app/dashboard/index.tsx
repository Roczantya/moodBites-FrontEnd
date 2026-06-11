import React, { useEffect, useState, useCallback } from "react";
import {
  SafeAreaView,
  ScrollView,
  FlatList,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "@/constants/colors";
import Header from "@/components/dashboard/header";
import BottomNavBar from "@/components/dashboard/bottomNavbar";
import MoodSelector from "@/components/dashboard/moodSelector";
import FoodCard from "@/components/dashboard/foodCard";
import { Mood, RecommendationResponse, MenuItem } from "@/types/recommendation";
import { fetchRecommendations } from "@/services/recommendationService";

function flattenAllMenus(data: RecommendationResponse): MenuItem[] {
  const all: MenuItem[] = [];

  for (const vendor of data.vendors) {
    for (const items of Object.values(vendor.condiment_categories)) {
      all.push(...items);
    }
    all.push(...vendor.standalone_menus);
  }

  // Hapus duplikat berdasarkan No, lalu sort match_pct tertinggi dulu
  const seen = new Set<number>();
  return all
    .filter((item) => {
      if (seen.has(item.No)) return false;
      seen.add(item.No);
      return true;
    })
    .sort((a, b) => b.match_pct - a.match_pct);
}

export default function DashboardScreen() {
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("User");
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [menuList, setMenuList] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const [id, name] = await Promise.all([
          AsyncStorage.getItem("userId"),
          AsyncStorage.getItem("userName"),
        ]);
        setUserId(id);
        if (name) setUserName(name);
      } catch {
        // lanjut dengan default
      }
    };
    loadUser();
  }, []);

  const handleMoodSelect = useCallback(
    async (mood: Mood) => {
      if (!userId) {
        setError("Sesi tidak ditemukan. Silakan login ulang.");
        return;
      }
      setSelectedMood(mood);
      setMenuList([]);
      setLoading(true);
      setError(null);
      try {
        const data = await fetchRecommendations(mood, userId);
        setMenuList(flattenAllMenus(data));
      } catch {
        setError("Gagal memuat rekomendasi. Periksa koneksimu dan coba lagi.");
      } finally {
        setLoading(false);
      }
    },
    [userId]
  );

  const handleRetry = () => {
    if (selectedMood) handleMoodSelect(selectedMood);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Header
          title="MoodBites"
          variant="title"
          alignTitle="center"
          showBack={false}
          showBell={false}
        />

        <View style={styles.page}>
          {/* Greeting */}
          <View style={styles.greetingContainer}>
            <Text style={styles.greeting}>Halo, {userName}! 👋</Text>
            <Text style={styles.greetingSubtitle}>
              Yuk temukan makanan yang pas buat suasana hatimu
            </Text>
          </View>

          {/* Mood Selector */}
          <MoodSelector
            selectedMood={selectedMood}
            onMoodSelect={handleMoodSelect}
            disabled={loading}
          />

          {/* Loading */}
          {loading && (
            <View style={styles.centeredBlock}>
              <ActivityIndicator size="large" color="#4A2411" />
              <Text style={styles.loadingText}>
                Mencari rekomendasi terbaik...
              </Text>
            </View>
          )}

          {/* Error */}
          {!loading && error && (
            <View style={styles.centeredBlock}>
              <Text style={styles.stateEmoji}>😕</Text>
              <Text style={styles.stateText}>{error}</Text>
              <TouchableOpacity
                style={styles.retryBtn}
                onPress={handleRetry}
                activeOpacity={0.8}
              >
                <Text style={styles.retryText}>Coba Lagi</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Empty state sebelum pilih mood */}
          {!loading && !error && menuList.length === 0 && !selectedMood && (
            <View style={styles.centeredBlock}>
              <Text style={styles.stateEmoji}>🍽️</Text>
              <Text style={styles.stateText}>
                Pilih mood kamu di atas untuk mendapatkan rekomendasi makanan
                yang cocok
              </Text>
            </View>
          )}

          {/* Food List */}
          {!loading && !error && menuList.length > 0 && (
            <View>
              <View style={styles.resultHeader}>
                <Text style={styles.resultTitle}>Rekomendasi untukmu</Text>
                <Text style={styles.resultCount}>{menuList.length} menu</Text>
              </View>

              <FlatList
                data={menuList}
                keyExtractor={(item) => String(item.No)}
                renderItem={({ item }) => <FoodCard item={item} />}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                scrollEnabled={true}
              />
            </View>
          )}
        </View>
      </ScrollView>

      <BottomNavBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  page: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 120,
  },
  greetingContainer: {
    marginBottom: 4,
  },
  greeting: {
    fontSize: 22,
    fontFamily: "PlusJakartaSans-ExtraBold",
    color: "#351213",
  },
  greetingSubtitle: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans-Regular",
    color: "#6B4226",
    marginTop: 4,
    lineHeight: 19,
  },
  centeredBlock: {
    alignItems: "center",
    marginTop: 40,
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 14,
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Regular",
    color: "#6B4226",
  },
  stateEmoji: {
    fontSize: 52,
    marginBottom: 14,
  },
  stateText: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Regular",
    color: "#6B4226",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 20,
  },
  retryBtn: {
    backgroundColor: "#351213",
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryText: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Bold",
    color: Colors.white,
  },
  resultHeader: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  resultTitle: {
    fontSize: 17,
    fontFamily: "PlusJakartaSans-ExtraBold",
    color: "#351213",
  },
  resultCount: {
    fontSize: 12,
    fontFamily: "PlusJakartaSans-Regular",
    color: "#6B4226",
  },
  listContent: {
    paddingBottom: 4,
    paddingRight: 4,
  },
});