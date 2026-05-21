import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";

interface ProfileAvatarProps {
  name: string;
  bio: string;
  onEditProfile: () => void;
}

export default function ProfileAvatar({
  name,
  bio,
  onEditProfile,
}: ProfileAvatarProps) {
  return (
    <View style={styles.profileCenter}>
      <View style={styles.avatarContainer}>
        <View style={styles.avatarBlob}>
          <Image
            source={{
              uri: "https://api.dicebear.com/7.x/avataaars/png?seed=Elena&backgroundColor=transparent",
            }}
            style={styles.avatarImage}
          />
        </View>
        <TouchableOpacity
          style={styles.editBadge}
          onPress={onEditProfile}
          activeOpacity={0.8}
        >
          <Feather name="edit-2" size={12} color={Colors.white} />
        </TouchableOpacity>
      </View>
      <Text style={styles.userName}>{name}</Text>
      <Text style={styles.userBio}>{bio}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  profileCenter: {
    alignItems: "center",
    marginBottom: 32,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 16,
  },
  avatarBlob: {
    width: 100,
    height: 100,
    backgroundColor: "#2A3A40",
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  avatarImage: {
    width: 80,
    height: 80,
  },
  editBadge: {
    position: "absolute",
    bottom: -5,
    right: -5,
    backgroundColor: Colors.accent,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.creamBg,
  },
  userName: {
    fontSize: 24,
    color: Colors.textPrimary,
    marginBottom: 6,
    fontFamily: "PlusJakartaSans-ExtraBold",
  },
  userBio: {
    fontSize: 14,
    color: Colors.optionalAccent,
    textAlign: "center",
    paddingHorizontal: 20,
  },
});
