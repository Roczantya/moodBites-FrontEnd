// moodBites/components/onboardingItem.tsx

import React from "react";
import { View, Image, StyleSheet, Platform } from "react-native";
import { TextBold, TextRegular } from "@/constants/customFont";
import Button from "@/components/Reuse/button";
interface Props {
  image: any; // Adjust type as needed, e.g., ImageSourcePropType
  title: string;
  description: string;
  backgroundColor?: string;
  onNext: () => void;
  isLast: boolean;
}
export default function OnboardingItem({
  image,
  title,
  description,
  backgroundColor,
  onNext,
  isLast,
}: Props) {
  return (
    <View style={[styles.container, { backgroundColor }]}>
      {/* Container Konten: Menarik semua ke tengah vertikal */}
      <View style={styles.contentContainer}>
        <Image source={image} style={styles.image} />
        <TextBold style={styles.title}>{title}</TextBold>
        <TextRegular style={styles.desc}>{description}</TextRegular>
      </View>

      {/* Container Tombol: Berada di bawah konten */}
      <View style={styles.buttonContainer}>
        <Button label={isLast ? "Mulai" : "Next"} onPress={onNext} />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8E7", // Warna krem agar estetik
    // Solusi agar tidak mepet status bar di Android
    paddingTop: Platform.OS === "android" ? 40 : 0,
    paddingHorizontal: 24,
  },
  imageContainer: {
    flex: 1,
    marginTop: "5%", // Memberi jarak agar ilustrasi lebih "bernafas"
    height: "40%", // Membatasi tinggi agar teks tidak terdorong ke bawah layar
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  image: {
    width: "70%",
    height: "40%",
    resizeMode: "contain",
    marginBottom: 20,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontFamily: "PlusJakartaSans-ExtraBold", // Sesuai dengan desain MoodBites
    textAlign: "center",
    marginBottom: 20,
    color: "#000",
  },
  desc: {
    fontSize: 15,
    color: "#555",
    textAlign: "center",
    lineHeight: 22,
    fontFamily: "PlusJakartaSans-Medium",
  },
  buttonContainer: {
    width: "100%",
    marginBottom: 120, // Beri jarak antara Tombol dan Pagination
    alignItems: "center",
  },
});
