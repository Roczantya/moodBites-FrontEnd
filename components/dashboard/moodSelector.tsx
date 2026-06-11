import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Colors } from "@/constants/colors";
import { Mood, MoodOption } from "@/types/recommendation";

const MOODS: MoodOption[] = [
  { label: "Happy", value: "happy", emoji: "😊", color: "#FFD166" },
  { label: "Sad", value: "sad", emoji: "😢", color: "#74B9FF" },
  { label: "Neutral", value: "neutral", emoji: "😐", color: "#A29BFE" },
  { label: "Angry", value: "angry", emoji: "😠", color: "#FF7675" },
];

interface MoodSelectorProps {
  selectedMood: Mood | null;
  onMoodSelect: (mood: Mood) => void;
  disabled?: boolean;
}

export default function MoodSelector({
  selectedMood,
  onMoodSelect,
  disabled = false,
}: MoodSelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kamu lagi gimana hari ini?</Text>
      <View style={styles.moodRow}>
        {MOODS.map((mood) => {
          const isSelected = selectedMood === mood.value;
          return (
            <TouchableOpacity
              key={mood.value}
              style={[
                styles.moodBtn,
                { borderColor: mood.color },
                isSelected && { backgroundColor: mood.color },
              ]}
              onPress={() => !disabled && onMoodSelect(mood.value)}
              activeOpacity={0.75}
            >
              <Text style={styles.emoji}>{mood.emoji}</Text>
              <Text
                style={[
                  styles.moodLabel,
                  isSelected && styles.moodLabelSelected,
                ]}
              >
                {mood.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  title: {
    fontSize: 16,
    fontFamily: "PlusJakartaSans-Bold",
    color: "#351213",
    marginBottom: 12,
  },
  moodRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  moodBtn: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 2,
    backgroundColor: Colors.white,
  },
  emoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  moodLabel: {
    fontSize: 11,
    fontFamily: "PlusJakartaSans-Bold",
    color: "#4A2411",
  },
  moodLabelSelected: {
    color: "#351213",
  },
});