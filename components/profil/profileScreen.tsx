import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";

// Import komponen pendukung
import BottomNavBar from "../dashboard/bottomNavbar";
import Header from "../dashboard/header";
import ProfileAvatar from "@/components/profil/profileavatar";
import InfoCard from "@/components/profil/cardinfo";
import MenuItem from "@/components/profil/menuItem";

export interface UserProfileData {
  name: string;
  bio: string;
  healthFilters: string[];
  commonMoods: string[];
}

interface ProfileUIProps {
  userData: UserProfileData;
  onMenuPress: (menuName: string) => void;
  onSignOut: () => void;
  onEditProfile: () => void;
}

export default function ProfileUI({
  userData,
  onMenuPress,
  onSignOut,
  onEditProfile,
}: ProfileUIProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
      >
        <Header title="Profil" showBell={false} />

        <View style={styles.page}>
          <ProfileAvatar
            name={userData.name}
            bio={userData.bio}
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
            pills={userData.healthFilters}
            description="Personalized safety filters are active for all mood-based recommendations."
          />

          <InfoCard
            title="COMMON MOODS"
            icon={<Feather name="smile" size={18} color="#FF9B82" />}
            titleColor={Colors.accent}
            backgroundColor={Colors.third + "66"}
            pills={userData.commonMoods}
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
            onPress={() => onMenuPress("Personal Profile")}
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
            onPress={() => onMenuPress("History Preferences")}
          />

          <TouchableOpacity
            style={styles.signOutBtn}
            onPress={onSignOut}
            activeOpacity={0.7}
          >
            <Feather name="log-out" size={20} color={Colors.logoutText} />
            <Text style={styles.signOutText}>Sign Out of MoodBites</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <BottomNavBar />
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
  },
  scrollContent: {
    flexGrow: 1,
  },
  page: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 120,
  },
  harmonyHeader: {
    marginTop: 8,
    marginBottom: 16,
  },
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
});
