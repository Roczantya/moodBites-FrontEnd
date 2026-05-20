import BottomNavBar from "@/components/dashboard/bottomNavbar";
import Header from "@/components/dashboard/header";
import { Text, View, StyleSheet } from "react-native";

export default function NotificationScreen() {
  return (
    <View style={styles.container}>
      <Header title="Notifikasi" showBack={true} showBell={false} />

      <Text style={styles.text}>Notifikasi screen</Text>
      <BottomNavBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
  },

  text: {
    color: "#fff",
    textAlign: "center",
  },
});
