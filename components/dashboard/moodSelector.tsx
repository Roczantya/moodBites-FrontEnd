import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { Colors } from "../../constants/colors";

export default function MoodSelector() {
  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>TODAY'S VIBE</Text>
      <Text style={styles.title}>Bagaimana{"\n"}perasaanmu hari ini?</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipContainer}
      >
        {/* Active Chip */}
        <TouchableOpacity style={[styles.chip, styles.chipActive]}>
          <Feather name="smile" size={18} color={Colors.white} />
          <Text style={[styles.chipText, { color: Colors.white }]}>
            Energetic
          </Text>
        </TouchableOpacity>

        {/* Inactive Chip */}
        <TouchableOpacity style={styles.chip}>
          <Feather name="meh" size={18} color={Colors.optionalAccent} />
          <Text style={styles.chipText}>Stressed</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    marginBottom: 30,
  },
  subtitle: {
    fontSize: 12,
    fontFamily: "PlusJakartaSans-Bold",
    color: Colors.optionalAccent,
    letterSpacing: 1,
    marginTop: 10,
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    color: Colors.textPrimary,
    fontFamily: "PlusJakartaSans-ExtraBold",
    lineHeight: 38,
    marginBottom: 20,
  },
  chipContainer: {
    flexDirection: "row",
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.secondary, // 20% opacity
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginRight: 12,
  },
  chipActive: {
    backgroundColor: Colors.accent,
  },
  chipText: {
    marginLeft: 8,
    fontSize: 12,
    fontFamily: "PlusJakartaSans-Bold",
    color: Colors.textPrimary,
  },
});
