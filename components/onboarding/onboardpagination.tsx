import React from "react";
import { StyleSheet, View, Animated, useWindowDimensions } from "react-native";
import { Colors } from "@/constants/colors"; // Pastikan path ini sesuai

interface PaginationProps {
  data: any[];
  scrollX: Animated.Value;
}

const OnboardingPagination = ({ data, scrollX }: PaginationProps) => {
  const { width } = useWindowDimensions();

  return (
    <View style={styles.container}>
      {data.map((_, i) => {
        const inputRange = [(i - 1) * width, i * width, (i + 1) * width];

        // Animasi lebar dot
        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [10, 24, 10],
          extrapolate: "clamp",
        });

        // Animasi opacity dot
        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.3, 1, 0.3],
          extrapolate: "clamp",
        });

        return (
          <Animated.View
            style={[styles.dot, { width: dotWidth, opacity }]}
            key={i.toString()}
          />
        );
      })}
    </View>
  );
};

export default OnboardingPagination;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.accent, // Warna pink MoodBites
    marginHorizontal: 6,
  },
});
