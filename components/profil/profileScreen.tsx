import { Colors } from "@/constants/colors";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import {
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import InfoCard from "@/components/profil/cardinfo";
import MenuItem from "@/components/profil/menuItem";
import ProfileAvatar from "@/components/profil/profileavatar";
import { router } from "expo-router";
import BottomNavBar from "../dashboard/bottomNavbar";
import Header from "../dashboard/header";

export interface UserProfileData {
  name: string;
  bio: string;
  healthFilters: string[];
  commonMoods: string[];
}

interface ProfileUIProps {
  userData: UserProfileData | null;
  onMenuPress: (menuName: string) => void;
  onEditProfile: () => void;
  // Props baru untuk Modal Sign Out
  onSignOutPress: () => void;
  isSignOutModalVisible: boolean;
  onCancelSignOut: () => void;
  onConfirmSignOut: () => void;
}

export default function ProfileUI({
  userData,
  onMenuPress,
  onEditProfile,
  onSignOutPress,
  isSignOutModalVisible,
  onCancelSignOut,
  onConfirmSignOut,
}: ProfileUIProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
      >
        <Header
          title="Profile"
          variant="title"
          alignTitle="center"
          showBack={false}
          showBell={false}
        />

        <View style={styles.page}>
          <ProfileAvatar
            name={userData?.name || "User"}
            bio={userData?.bio || "Belum ada bio"}
            onEditProfile={onEditProfile}
          />

          <InfoCard
            title="HEALTH & SAFETY"
            icon={
              <MaterialCommunityIcons
                name="bandage"
                size={18}
                color="#C87A7A"
              />
            }
            titleColor="#C87A7A"
            backgroundColor={Colors.optional}
            pills={userData?.healthFilters || []}
            description="Personalized safety filters are active for all mood-based recommendations."
          />

          <InfoCard
            title="COMMON MOODS"
            icon={<Feather name="smile" size={18} color="#FF9B82" />}
            titleColor={Colors.accent}
            backgroundColor={Colors.third + "66"}
            pills={userData?.commonMoods || []}
            pillBgColor={Colors.white}
            pillTextColor={Colors.accent}
            description="You frequently seek comfort foods during high-stress peaks."
          />

          <View style={styles.harmonyHeader}>
            <Text style={styles.harmonyTitle}>Account Harmony</Text>
          </View>

          <MenuItem
            title="Personal Profile"
            subtitle="MANAGE YOUR BIO AND IDENTITY"
            icon={<Feather name="user" size={20} color="#4A2411" />}
            backgroundColor={Colors.white}
            onPress={() => router.push("/dashboard/editprofil")}
          />

          <MenuItem
            title="Survey"
            subtitle="REFINE YOUR ARTISANAL TASTE PALATE"
            icon={
              <MaterialCommunityIcons
                name="silverware-variant"
                size={20}
                color="#4A2411"
              />
            }
            backgroundColor={Colors.secondary}
            chevronColor="#C87A7A"
            onPress={() => onMenuPress("Survey")}
          />

          <MenuItem
            title="History Preferences"
            subtitle="REFINE YOUR ARTISANAL TASTE PALATE"
            icon={
              <MaterialCommunityIcons
                name="silverware-variant"
                size={20}
                color="#4A2411"
              />
            }
            backgroundColor={"#fffffecf"}
            onPress={() => router.push("/dashboard/history")}
          />

          <TouchableOpacity
            style={styles.signOutBtn}
            onPress={onSignOutPress} // Panggil pop-up di sini
            activeOpacity={0.7}
          >
            <Feather name="log-out" size={20} color={Colors.logoutText} />
            <Text style={styles.signOutText}>Sign Out of MoodBites</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* POP-UP UI CUSTOM */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isSignOutModalVisible}
        onRequestClose={onCancelSignOut} // Agar tombol back di Android bisa nutup pop-up
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Sign Out</Text>
            <Text style={styles.modalDesc}>
              Apakah kamu yakin ingin keluar dari MoodBites?
            </Text>

            <View style={styles.modalAction}>
              <TouchableOpacity
                style={styles.modalBtnCancel}
                onPress={onCancelSignOut}
              >
                <Text style={styles.modalBtnCancelText}>Batal</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalBtnConfirm}
                onPress={onConfirmSignOut}
              >
                <Text style={styles.modalBtnConfirmText}>Keluar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <BottomNavBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.primary },
  container: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  page: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 120,
  },
  harmonyHeader: { marginTop: 8, marginBottom: 16 },
  harmonyTitle: {
    fontSize: 18,
    fontFamily: "PlusJakartaSans-ExtraBold",
    color: "#351213",
  },
  signOutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    paddingVertical: 12,
  },
  signOutText: {
    color: Colors.logoutText,
    marginLeft: 10,
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Bold",
  },

  // STYLE UNTUK MODAL POP-UP
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)", // Background gelap transparan
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  modalCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    width: "100%",
    elevation: 5, // Shadow untuk Android
    shadowColor: "#000", // Shadow untuk iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: "PlusJakartaSans-ExtraBold",
    color: "#351213",
    marginBottom: 10,
  },
  modalDesc: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Regular",
    color: "#4A2411",
    textAlign: "center",
    marginBottom: 24,
  },
  modalAction: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalBtnCancel: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: Colors.secondary,
    borderRadius: 12,
    marginRight: 8,
    alignItems: "center",
  },
  modalBtnCancelText: {
    color: "#4A2411",
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 14,
  },
  modalBtnConfirm: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: "#FF6B6B", // Merah agar pengguna hati-hati
    borderRadius: 12,
    marginLeft: 8,
    alignItems: "center",
  },
  modalBtnConfirmText: {
    color: Colors.white,
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 14,
  },
});
