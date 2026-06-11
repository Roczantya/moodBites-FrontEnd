import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from "react-native";
import { MenuItem } from "@/types/recommendation";
import FoodCard from "@/components/dashboard/foodCard";

interface RecommendedListProps {
  menuList: MenuItem[];
}

export default function RecommendedList({ menuList }: RecommendedListProps) {
  if (menuList.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Rekomendasi untukmu</Text>
        <Text style={styles.count}>{menuList.length} menu</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      >
        {menuList.map((item) => (
          <FoodCard key={String(item.No)} item={item} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 4,
  },
  header: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  title: {
    fontSize: 17,
    fontFamily: "PlusJakartaSans-ExtraBold",
    color: "#351213",
  },
  count: {
    fontSize: 12,
    fontFamily: "PlusJakartaSans-Regular",
    color: "#6B4226",
  },
  listContent: {
    paddingBottom: 4,
    paddingRight: 4,
  },
});