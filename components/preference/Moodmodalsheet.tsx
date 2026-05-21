import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from "react-native";
// Import MaterialCommunityIcons bersama dengan Feather
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { MoodKey } from "@/constants/surveystate";

// Modifikasi interface agar fleksibel menerima tipe icon dari Feather atau MaterialCommunityIcons
interface MoodConfig {
  id: MoodKey;
  icon:
    | keyof typeof Feather.glyphMap
    | keyof typeof MaterialCommunityIcons.glyphMap;
}

interface MoodBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  tempMood: MoodKey;
  setTempMood: (mood: MoodKey) => void;
  onApply: () => void;
}

const MOODS: MoodConfig[] = [
  { id: "happy", icon: "smile" },
  { id: "sad", icon: "frown" },
  { id: "neutral", icon: "meh" },
  // Gunakan icon angry bawaan Material Community Icons karena di Feather tidak ada
  { id: "angry", icon: "emoticon-angry-outline" },
];

export const MoodBottomSheet: React.FC<MoodBottomSheetProps> = ({
  visible,
  onClose,
  tempMood,
  setTempMood,
  onApply,
}) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.bottomSheet}>
          <View style={styles.dragHandle} />
          <Text style={styles.sheetTitle}>Mood kamu saat ini?</Text>

          <View style={styles.moodGrid}>
            {MOODS.map((mood) => {
              const isSelected = tempMood === mood.id;
              const moodLabel =
                mood.id.charAt(0).toUpperCase() + mood.id.slice(1);

              return (
                <TouchableOpacity
                  key={mood.id}
                  style={[
                    styles.moodItem,
                    isSelected && styles.moodItemSelected,
                  ]}
                  onPress={() => setTempMood(mood.id)}
                >
                  {/* Kondisional rendering: Jika id-nya angry, gunakan MaterialCommunityIcons */}
                  {mood.id === "angry" ? (
                    <MaterialCommunityIcons
                      name={
                        mood.icon as keyof typeof MaterialCommunityIcons.glyphMap
                      }
                      size={24}
                      color={isSelected ? "#FFF" : "#FF8A8A"}
                    />
                  ) : (
                    <Feather
                      name={mood.icon as keyof typeof Feather.glyphMap}
                      size={24}
                      color={isSelected ? "#FFF" : "#FF8A8A"}
                    />
                  )}

                  <Text
                    style={[
                      styles.moodText,
                      isSelected && styles.moodTextSelected,
                    ]}
                  >
                    {moodLabel}
                  </Text>
                  {isSelected && (
                    <View style={styles.checkBadge}>
                      <Feather name="check" size={10} color="#FFF" />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity style={styles.applyButton} onPress={onApply}>
            <Text style={styles.applyButtonText}>Terapkan</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  bottomSheet: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    paddingBottom: 40,
    alignItems: "center",
  },
  dragHandle: {
    width: 50,
    height: 5,
    backgroundColor: "#E0E0E0",
    borderRadius: 5,
    marginBottom: 20,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  moodGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 15,
    marginBottom: 30,
  },
  moodItem: {
    width: 80,
    height: 80,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#FF8A8A",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
    position: "relative",
  },
  moodItemSelected: {
    backgroundColor: "#FF8A8A",
  },
  moodText: {
    marginTop: 8,
    fontSize: 12,
    color: "#FF8A8A",
    fontWeight: "600",
  },
  moodTextSelected: {
    color: "#FFF",
  },
  checkBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#D9534F",
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFF",
  },
  applyButton: {
    backgroundColor: "#FF8A8A",
    width: "100%",
    padding: 16,
    borderRadius: 25,
    alignItems: "center",
  },
  applyButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});
