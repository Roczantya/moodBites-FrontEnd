import BottomNavBar from "@/components/dashboard/bottomNavbar";
import RecommendationList from "@/components/dashboard/recommendedlist";
import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { Colors } from "../../constants/colors";

export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.primary }}>
      <RecommendationList />
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
    position: "relative",
  },
});
