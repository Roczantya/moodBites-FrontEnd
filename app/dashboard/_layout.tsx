import { Stack } from "expo-router";

export default function Homelayout() {
  return (
    <Stack
      screenOptions={{
        // Ini kunci untuk menghilangkan bar putih di atas
        headerShown: false,
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

      {/* <Stack.Screen
        name="history"
        options={{ animation: "slide_from_bottom" }}
      /> */}
    </Stack>
  );
}
