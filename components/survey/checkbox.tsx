import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Colors } from "@/constants/colors";

interface CheckboxGroupProps {
  options: string[];
  selectedValues: string[];
  onChange: (val: string[]) => void;
}

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  options,
  selectedValues,
  onChange,
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
    alignItems: "center",
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
  },
  boxSelected: { borderColor: Colors.textAccent },
  innerDot: {
    width: 12,
    height: 12,
    backgroundColor: Colors.textAccent,
    borderRadius: 3,
  },
  checkboxText: {
    fontSize: 16,
    color: Colors.textPrimary,
    fontFamily: "PlusJakartaSans-SemiBold",
  },
  checkboxTextSelected: {
    fontFamily: "PlusJakartaSans-SemiBold",
    color: Colors.textAccent,
  },
});
