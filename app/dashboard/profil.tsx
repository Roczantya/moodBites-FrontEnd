import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

// Services
import ProfileUI, { UserProfileData } from "@/components/profil/profileScreen";
import { Colors } from "@/constants/colors";
import authService from "@/services/authService";
import storageService from "@/services/storageService";

export default function ProfileScreen() {
  const [userData, setUserData] = useState<UserProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // STATE BARU UNTUK KONTROL POP-UP UI
  const [isSignOutModalVisible, setSignOutModalVisible] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setIsLoading(true);
        const data = await authService.getProfile();
        setUserData(data);
      } catch (error) {
        console.log("Gagal memuat profil:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfileData();
  }, []);

  const handleMenuPress = (menuName: string) => {
    console.log(`Navigating to: ${menuName}`);
  };

  const handleEditProfile = () => {
    console.log("Membuka modal edit profile...");
  };

  // 3 FUNGSI BARU UNTUK MENGATUR POP-UP SIGN OUT
  const handleSignOutPress = () => {
    setSignOutModalVisible(true); // Membuka pop-up
  };

  const handleCancelSignOut = () => {
    setSignOutModalVisible(false); // Menutup pop-up (batal)
  };

  const handleConfirmSignOut = async () => {
    setSignOutModalVisible(false); // Tutup pop-up dulu
    try {
      console.log("Menghubungi server untuk logout...");
      await authService.logout();
      await storageService.clearToken();
      await storageService.clearUserId();
      router.replace("/");
    } catch (err) {
      console.log("Gagal memanggil API logout:", err);
      await storageService.clearToken();
      await storageService.clearUserId();
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
      // Passing props pop-up ke UI
      onSignOutPress={handleSignOutPress}
      isSignOutModalVisible={isSignOutModalVisible}
      onCancelSignOut={handleCancelSignOut}
      onConfirmSignOut={handleConfirmSignOut}
    />
  );
}
