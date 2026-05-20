import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";
import BottomNavBar from "../dashboard/bottomNavbar";
import Header from "../dashboard/header";

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
            <Text style={styles.userName}>{userData.name}</Text>
            <Text style={styles.userBio}>{userData.bio}</Text>
          </View>

          {/* Health & Safety Card */}
          <View style={[styles.infoCard, { backgroundColor: Colors.optional }]}>
            <View style={styles.cardHeaderTitle}>
              <MaterialCommunityIcons
                name="bandage"
                size={18}
                color="#C87A7A"
              />
              <Text style={[styles.cardTitle, { color: "#C87A7A" }]}>
                HEALTH & SAFETY
              </Text>
            </View>
            <View style={styles.pillContainer}>
              {userData.healthFilters.map((item, index) => (
                <View key={index} style={styles.pill}>
                  <Text style={styles.pillText}>{item}</Text>
                </View>
              ))}
            </View>
            <Text style={styles.cardDesc}>
              Personalized safety filters are active for all mood-based
              recommendations.
            </Text>
          </View>

          {/* Common Moods Card */}
          <View style={[styles.infoCard, { backgroundColor: Colors.third }]}>
            <View style={styles.cardHeaderTitle}>
              <Feather name="smile" size={18} color="#FF9B82" />
              <Text style={[styles.cardTitle, { color: "#FF9B82" }]}>
                COMMON MOODS
              </Text>
            </View>
            <View style={styles.pillContainer}>
              {userData.commonMoods.map((item, index) => (
                <View
                  key={index}
                  style={[styles.pill, { backgroundColor: Colors.white }]}
                >
                  <Text style={[styles.pillText, { color: "#FF9B82" }]}>
                    {item}
                  </Text>
                </View>
              ))}
            </View>
            <Text style={styles.cardDesc}>
              You frequently seek comfort foods during high-stress peaks.
            </Text>
          </View>

          {/* Account Harmony Title */}
          <View style={styles.harmonyHeader}>
            <Text style={styles.harmonyTitle}>Account Harmony</Text>
          </View>

          {/* Menu 1: Personal Profile */}
          <TouchableOpacity
            style={[styles.menuItem, { backgroundColor: Colors.white }]}
            onPress={() => onMenuPress("Personal Profile")}
            activeOpacity={0.8}
          >
            <View style={styles.menuIcon}>
              <Feather name="user" size={20} color="#C87A7A" />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuItemTitle}>Personal Profile</Text>
              <Text style={styles.menuItemSub}>
                MANAGE YOUR BIO AND IDENTITY
              </Text>
            </View>
            <Feather
              name="chevron-right"
              size={20}
              color={Colors.optionalAccent}
            />
          </TouchableOpacity>

          {/* Menu 2: Survey */}
          <TouchableOpacity
            style={[styles.menuItem, { backgroundColor: Colors.secondary }]}
            onPress={() => onMenuPress("Survey")}
            activeOpacity={0.8}
          >
            <View style={styles.menuIcon}>
              <MaterialCommunityIcons
                name="silverware-variant"
                size={20}
                color="#C87A7A"
              />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuItemTitle}>Survey</Text>
              <Text style={styles.menuItemSub}>
                REFINE YOUR ARTISANAL TASTE PALATE
              </Text>
            </View>
            <Feather name="chevron-right" size={20} color="#C87A7A" />
          </TouchableOpacity>

          {/* Menu 3: History Preferences */}
          <TouchableOpacity
            style={[styles.menuItem, { backgroundColor: "#FFFFFE" + "80" }]}
            onPress={() => onMenuPress("History Preferences")}
            activeOpacity={0.8}
          >
            <View style={styles.menuIcon}>
              <MaterialCommunityIcons
                name="silverware-variant"
                size={20}
                color="#4A2411"
              />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuItemTitle}>History Preferences</Text>
              <Text style={styles.menuItemSub}>
                REFINE YOUR ARTISANAL TASTE PALATE
              </Text>
            </View>
            <Feather
              name="chevron-right"
              size={20}
              color={Colors.optionalAccent}
            />
          </TouchableOpacity>

          {/* Sign Out */}
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

  /* ── SINGLE PAGE ── */
  page: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 140,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.optionalAccent,
    marginBottom: 30,
  },

  /* ── AVATAR ── */
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
    fontWeight: "900",
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  userBio: {
    fontSize: 14,
    color: Colors.optionalAccent,
    textAlign: "center",
    paddingHorizontal: 20,
  },

  /* ── INFO CARDS ── */
  infoCard: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
  },
  cardHeaderTitle: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 8,
    letterSpacing: 1,
  },
  pillContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
    gap: 8,
  },
  pill: {
    backgroundColor: Colors.secondary,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  pillText: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#4A2411",
  },
  cardDesc: {
    fontSize: 11,
    color: Colors.optionalAccent,
    lineHeight: 16,
  },

  /* ── ACCOUNT HARMONY ── */
  harmonyHeader: {
    marginTop: 8,
    marginBottom: 16,
  },
  harmonyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#351213",
  },

  /* ── MENU ITEMS ── */
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 24,
    marginBottom: 12,
  },
  menuIcon: {
    width: 44,
    height: 44,
    backgroundColor: "#FCE4E4",
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  menuItemSub: {
    fontSize: 10,
    color: Colors.optionalAccent,
    fontWeight: "600",
  },

  /* ── SIGN OUT ── */
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
    fontWeight: "bold",
  },
});
