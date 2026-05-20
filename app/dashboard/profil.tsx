import React, { useState } from "react";
import { Alert } from "react-native";
import ProfileUI, { UserProfileData } from "@/components/profil/profileScreen"; // Sesuaikan path import

export default function ProfileScreen() {
  // 1. STATE MANAGEMENT (Simulasi data yang didapat dari Backend/Axios)
  const [userData, setUserData] = useState<UserProfileData>({
    name: "Elena Rodriguez",
    bio: "Curating flavor through feelings since 2023",
    healthFilters: ["NUT ALLERGY", "DAIRY FREE"],
    commonMoods: ["STRESSED", "RADIANT", "QUIET"],
  });

  // 2. FUNGSI LOGIKA (Handler)
  const handleMenuPress = (menuName: string) => {
    // Navigasi atau aksi berdasarkan menu yang diklik
    console.log(`Navigating to: ${menuName}`);
    // router.push(`/${menuName}`) jika pakai expo-router
  };

  const handleEditProfile = () => {
    console.log("Membuka modal/halaman edit profile...");
  };

  const handleSignOut = () => {
    // Konfirmasi sebelum logout
    Alert.alert("Sign Out", "Apakah kamu yakin ingin keluar dari MoodBites?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Keluar",
        style: "destructive",
        onPress: () => {
          console.log("Membersihkan token dan logout...");
          // Logika hapus token AsyncStorage & pindah halaman di sini
        },
      },
    ]);
  };

  // 3. RENDER UI
  return (
    <ProfileUI
      userData={userData}
      onMenuPress={handleMenuPress}
      onSignOut={handleSignOut}
      onEditProfile={handleEditProfile}
    />
  );
}
