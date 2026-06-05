import authService from "@/services/authService";
import storageService from "@/services/storageService";
import { Stack, router } from "expo-router";
import React, { useEffect, useRef } from "react";

export default function DashboardLayout() {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        await authService.checkToken();
        console.log("🛡️ [DASHBOARD GUARD]: Token valid!");
      } catch (error: any) {
        if (error.statusCode === 401) {
          console.log(
            "🚨 [DASHBOARD GUARD]: Token Expired! Redirect ke Login...",
          );

          // Hentikan interval dulu biar gak dobel redirect
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }

          await storageService.clearAllSession();
          router.replace("/auth");
        } else {
          console.log("⚠️ [DASHBOARD GUARD]: Gangguan koneksi saat cek token.");
        }
      }
    };

    verifyToken();

    // Polling setiap 20 detik
    intervalRef.current = setInterval(verifyToken, 20_000);

    // Cleanup saat komponen di-unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
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
