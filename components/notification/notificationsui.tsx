import React from "react";
import { View, Text, StyleSheet, FlatList, SafeAreaView } from "react-native";
import NotificationItem, {
  NotificationData,
} from "@/components/notification/notificationitem";
import { Colors } from "@/constants/colors";
import Header from "@/components/dashboard/header";

interface NotificationsUIProps {
  notifications: NotificationData[];
}

export default function NotificationsUI({
  notifications,
}: NotificationsUIProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="Notifikasi"
        showBack={true}
        showBell={false}
        alignTitle="center"
      />
      <View style={styles.container}>
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <NotificationItem item={item} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  listContent: {
    paddingBottom: 40,
  },
});
