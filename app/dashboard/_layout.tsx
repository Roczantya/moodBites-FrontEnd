import authService from "@/services/authService";
import storageService from "@/services/storageService";
import { Stack, router } from "expo-router";
import React, { useEffect } from "react";

export default function DashboardLayout() {
  useEffect(() => {
    const verifyTokenDiDashboard = async () => {
      try {
        // Panggil satpam API untuk cek token
        await authService.checkToken();
        console.log(
          "🛡️ [DASHBOARD GUARD]: Token valid! Selamat datang di area Dashboard.",
        );
      } catch (error: any) {
        // Kalau error 401 (Token Expired / Tidak Valid)
        if (error.statusCode === 401) {
          console.log(
            "🚨 [DASHBOARD GUARD]: Token Expired! Menendang user ke Login...",
          );
          await storageService.clearAllSession();
          router.replace("/auth");
        } else {
          console.log("⚠️ [DASHBOARD GUARD]: Gangguan koneksi saat cek token.");
          // Opsional: Kamu bisa memunculkan toast error koneksi di sini
        }
      }
    };

    verifyTokenDiDashboard();
  }, []); // <-- Array kosong agar hanya dicek sekali saat Dashboard pertama kali dibuka

  return (
    <Stack
      screenOptions={{
        headerShown: false, // Menghilangkan bar putih di atas
      }}
    >
      <Stack.Screen name="home" options={{ animation: "fade" }} />
      <Stack.Screen name="nfc" options={{ animation: "fade" }} />
      <Stack.Screen name="profil" options={{ animation: "fade" }} />
      <Stack.Screen
        name="notification"
        options={{ animation: "slide_from_bottom" }}
      />
      <Stack.Screen name="editprofil" options={{ animation: "fade" }} />
    </Stack>
  );
}
