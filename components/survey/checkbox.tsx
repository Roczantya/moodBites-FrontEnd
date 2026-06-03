import { Colors } from "@/constants/colors";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface CheckboxGroupProps {
  options: string[];
  selectedValues: string[];
  onChange: (val: string[]) => void;
  labelKey?: string;
  valueKey?: string;
}

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  options,
  selectedValues,
  onChange,
  labelKey = "label",
  valueKey = "value",
}) => {
  const toggleSelection = (option: string) => {
    if (selectedValues.includes(option)) {
      onChange(selectedValues.filter((item) => item !== option));
    } else {
      onChange([...selectedValues, option]);
    }
  };

  return (
    <View style={styles.checkboxContainer}>
      {options.map((option, index) => {
        const isSelected = selectedValues.includes(option);
        return (
          <TouchableOpacity
            key={index}
            style={[styles.checkboxRow, isSelected && styles.checkboxSelected]}
            onPress={() => toggleSelection(option)}
          >
            <View style={[styles.box, isSelected && styles.boxSelected]}>
              {isSelected && <View style={styles.innerDot} />}
            </View>
            <Text
              style={[
                styles.checkboxText,
                isSelected && styles.checkboxTextSelected,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  checkboxContainer: { marginTop: 10 },
  checkboxRow: {
    flexDirection: "row",
    // Ubah ke flex-start biar kalau teksnya 2 baris, kotak checkbox tetap di atas
    alignItems: "flex-start",
    marginBottom: 10,
    padding: 15,
    borderRadius: 12,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.secondary,
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.05,
  },
  checkboxSelected: {
    backgroundColor: Colors.optional,
    borderColor: Colors.accent,
  },
  box: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: Colors.third,
    borderRadius: 6,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
    // Tambah marginTop sedikit biar sejajar sama baris pertama teks kalau teksnya panjang
    marginTop: 2,
  },
  boxSelected: { borderColor: Colors.textAccent },
  innerDot: {
    width: 12,
    height: 12,
    backgroundColor: Colors.textAccent,
    borderRadius: 3,
  },
  checkboxText: {
    flex: 1,
    flexShrink: 1, // ← pastiin teks menyusut, bukan overflow
    fontSize: 14,
    lineHeight: 22, // ← 22 - 16 = 6px spacing antar baris (bisa tuning ke 20 atau 21)
    color: Colors.textPrimary,
    fontFamily: "PlusJakartaSans-SemiBold",
  },
  checkboxTextSelected: {
    fontFamily: "PlusJakartaSans-SemiBold",
    color: Colors.textAccent,
  },
});
