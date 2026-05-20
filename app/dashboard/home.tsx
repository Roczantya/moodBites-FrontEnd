import React from "react";
import { StyleSheet, SafeAreaView, ScrollView, View } from "react-native";
import Header from "@/components/dashboard/header";
import MoodSelector from "@/components/dashboard/moodSelector";
import RecommendationList from "@/components/dashboard/recommendedlist";
import BottomNavBar from "@/components/dashboard/bottomNavbar";
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
