import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

import ProfileUI, { UserProfileData } from "@/components/profil/profileScreen";
import { Colors } from "@/constants/colors";
import authService from "@/services/authService";
import storageService from "@/services/storageService";

export default function ProfileScreen() {
  const [userData, setUserData] = useState<UserProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSignOutModalVisible, setSignOutModalVisible] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setIsLoading(true);
        const data = await authService.getProfile();

        // ✅ Kalau backend tidak return name, ambil dari storage
        if (!data?.name) {
          const savedName = await storageService.getName();
          data.name = savedName ?? "Pengguna";
        }

        setUserData(data);
      } catch (error) {
        const savedName = await storageService.getName();
        setUserData({ name: savedName ?? "Pengguna" } as UserProfileData);
      } finally {
        setIsLoading(false); // ✅ selalu jalan, loading pasti berhenti
      }
    };
    fetchProfileData();
  }, []);

  const handleMenuPress = (menuName: string) => {};

  const handleEditProfile = () => {};

  const handleSignOutPress = () => {
    setSignOutModalVisible(true);
  };

  const handleCancelSignOut = () => {
    setSignOutModalVisible(false);
  };

  const handleConfirmSignOut = async () => {
    setSignOutModalVisible(false);
    try {
      await authService.logout();
      await storageService.clearAllSession(); // ✅ hapus semua sekaligus pakai multiRemove
      router.replace("/");
    } catch (err) {
      console.log("Gagal memanggil API logout:", err);
      await storageService.clearAllSession(); // ✅ tetap hapus meski API error
      router.replace("/");
    }
  };

  if (isLoading || !userData) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: Colors.primary + "20",
        }}
      >
        <ActivityIndicator size="large" color="#A0D585" />
      </View>
    );
  }

  return (
    <ProfileUI
      userData={userData}
      onMenuPress={handleMenuPress}
      onEditProfile={handleEditProfile}
      onSignOutPress={handleSignOutPress}
      isSignOutModalVisible={isSignOutModalVisible}
      onCancelSignOut={handleCancelSignOut}
      onConfirmSignOut={handleConfirmSignOut}
    />
  );
}
