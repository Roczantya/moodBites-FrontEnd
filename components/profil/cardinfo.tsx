import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors } from "@/constants/colors";

interface InfoCardProps {
  title: string;
  icon: React.ReactNode;
  titleColor: string;
  backgroundColor: string;
  pills: string[];
  pillBgColor?: string;
  pillTextColor?: string;
  description: string;
}

export default function InfoCard({
  title,
  icon,
  titleColor,
  backgroundColor,
  pills,
  pillBgColor = Colors.secondary,
  pillTextColor = "#4A2411",
  description,
}: InfoCardProps) {
  return (
    <View style={[styles.infoCard, { backgroundColor }]}>
      <View style={styles.cardHeaderTitle}>
        {icon}
        <Text style={[styles.cardTitle, { color: titleColor }]}>{title}</Text>
      </View>
      <View style={styles.pillContainer}>
        {pills.map((item, index) => (
          <View
            key={index}
            style={[styles.pill, { backgroundColor: pillBgColor }]}
          >
            <Text style={[styles.pillText, { color: pillTextColor }]}>
              {item}
            </Text>
          </View>
        ))}
      </View>
      <Text style={styles.cardDesc}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  infoCard: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
  },
  cardHeaderTitle: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 12,
    fontFamily: "PlusJakartaSans-Bold",
    marginLeft: 8,
    letterSpacing: 1,
  },
  pillContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
    gap: 8,
  },
  pill: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  pillText: {
    fontSize: 11,
    fontFamily: "PlusJakartaSans-Bold",
  },
  cardDesc: {
    fontSize: 11,
    color: Colors.optionalAccent,
    lineHeight: 16,
  },
});
