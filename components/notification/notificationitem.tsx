import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Colors } from "@/constants/colors"; // Sesuaikan path ini dengan proyekmu

export interface NotificationData {
  id: string;
  userName: string;
  avatarUrl: string;
  message: string;
  timeAgo: string;
  type: "accepted" | "invited";
  isUnread: boolean;
}

interface NotificationItemProps {
  item: NotificationData;
}

export default function NotificationItem({ item }: NotificationItemProps) {
  return (
    <View style={styles.container}>
      {/* Avatar & Badge */}
      <View style={styles.avatarContainer}>
        <Image source={{ uri: item.avatarUrl }} style={styles.avatar} />
        <View
          style={[
            styles.badge,
            {
              backgroundColor: item.type === "accepted" ? "#4CAF50" : "#7B61FF",
            },
          ]}
        >
          <Feather
            name={item.type === "accepted" ? "check" : "plus"}
            size={10}
            color="#FFF"
          />
        </View>
      </View>

      {/* Teks Notifikasi */}
      <View style={styles.textContainer}>
        <Text style={styles.messageText}>
          <Text style={styles.userName}>{item.userName} </Text>
          {item.message}
        </Text>
        <Text style={styles.timeText}>{item.timeAgo}</Text>
      </View>

      {/* Indikator Unread (Titik Biru) */}
      {item.isUnread && <View style={styles.unreadDot} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#c2c1c1a6",
  },
  avatarContainer: {
    position: "relative",
    marginRight: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.third, // Fallback color
  },
  badge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#ffffffaf", // Agar badge terlihat terpisah dari avatar
  },
  textContainer: {
    flex: 1,
    marginRight: 12,
  },
  messageText: {
    fontSize: 14,
    color: Colors.optionalAccent,
    lineHeight: 20,
    marginBottom: 4,
  },
  userName: {
    fontWeight: "bold",
    color: Colors.textPrimary,
  },
  timeText: {
    fontSize: 13,
    color: "#888",
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.accent, // Warna titik biru iOS standard
  },
});
