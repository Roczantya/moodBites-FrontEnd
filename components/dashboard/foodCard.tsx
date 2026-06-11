import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors } from "@/constants/colors";
import { MenuItem } from "@/types/recommendation";

interface FoodCardProps {
  item: MenuItem;
}

export default function FoodCard({ item }: FoodCardProps) {
  const matchPct = Math.round(item.match_pct);
  const matchColor =
    matchPct >= 80 ? "#00B894" :
    matchPct >= 50 ? "#FDCB6E" :
    "#FF7675";

  return (
    <View style={styles.card}>
      {/* Placeholder Image */}
      <View style={styles.imagePlaceholder}>
        <Text style={styles.placeholderEmoji}>🍽️</Text>
      </View>

      {/* Match Badge */}
      <View style={[styles.matchBadge, { backgroundColor: matchColor }]}>
        <Text style={styles.matchText}>{matchPct}%</Text>
      </View>

      {/* Nama Makanan */}
      <View style={styles.info}>
        <Text style={styles.foodName} numberOfLines={2}>
          {item["Nama Menu"]}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 130,
    marginRight: 10,
    backgroundColor: Colors.white,
    borderRadius: 14,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  imagePlaceholder: {
    width: "100%",
    height: 90,
    backgroundColor: "#F5ECD7",
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderEmoji: {
    fontSize: 36,
  },
  matchBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    borderRadius: 20,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  matchText: {
    fontSize: 10,
    fontFamily: "PlusJakartaSans-Bold",
    color: Colors.white,
  },
  info: {
    padding: 10,
  },
  foodName: {
    fontSize: 12,
    fontFamily: "PlusJakartaSans-Bold",
    color: "#351213",
    lineHeight: 17,
  },
});