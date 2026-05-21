import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";

interface MenuItemProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  backgroundColor: string;
  chevronColor?: string;
  onPress: () => void;
}

export default function MenuItem({
  title,
  subtitle,
  icon,
  backgroundColor,
  chevronColor = Colors.optionalAccent,
  onPress,
}: MenuItemProps) {
  return (
    <TouchableOpacity
      style={[styles.menuItem, { backgroundColor }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.menuIcon}>{icon}</View>
      <View style={styles.menuTextContainer}>
        <Text style={styles.menuItemTitle}>{title}</Text>
        <Text style={styles.menuItemSub}>{subtitle}</Text>
      </View>
      <Feather name="chevron-right" size={20} color={chevronColor} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 24,
    marginBottom: 12,
  },
  menuIcon: {
    width: 44,
    height: 44,
    backgroundColor: Colors.third,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontFamily: "PlusJakartaSans-Bold",
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  menuItemSub: {
    fontSize: 10,
    color: Colors.optionalAccent,
    fontFamily: "PlusJakartaSans-Regular",
  },
});
