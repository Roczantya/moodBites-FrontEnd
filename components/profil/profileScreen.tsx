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

// Tipe data untuk Props yang akan diterima oleh UI
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
        {/* BAGIAN ATAS: Background Cream */}
        <View style={styles.topSection}>
          <Text style={styles.headerTitle}>Profil</Text>

          {/* Avatar & Info */}
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
          <View
            style={[styles.infoCard, { backgroundColor: Colors.secondary }]}
          >
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

          {/* Menu 1 (Inside Cream Section) */}
          <TouchableOpacity
            style={styles.menuItemTop}
            onPress={() => onMenuPress("Personal Profile")}
            activeOpacity={0.8}
          >
            <View style={styles.menuIconContainerTop}>
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
        </View>

        {/* BAGIAN BAWAH: Background Gelap */}
        <View style={styles.bottomSection}>
          {/* Menu 2 */}
          <TouchableOpacity
            style={[styles.menuItemBottom, { backgroundColor: Colors.third }]}
            onPress={() => onMenuPress("Survey")}
            activeOpacity={0.8}
          >
            <View style={styles.menuIconContainerBottom}>
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

          {/* Menu 3 */}
          <TouchableOpacity
            style={[styles.menuItemBottom, { backgroundColor: "FFFFFE" }]}
            onPress={() => onMenuPress("History Preferences")}
            activeOpacity={0.8}
          >
            <View style={styles.menuIconContainerBottomDark}>
              <MaterialCommunityIcons
                name="silverware-variant"
                size={20}
                color="#4A2411"
              />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={[styles.menuItemTitle, { color: Colors.darkBg }]}>
                History Preferences
              </Text>
              <Text style={[styles.menuItemSub, { color: Colors.darkBg }]}>
                REFINE YOUR ARTISANAL TASTE PALATE
              </Text>
            </View>
            <Feather name="chevron-right" size={20} color={Colors.darkBg} />
          </TouchableOpacity>

          {/* Sign Out Button */}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.primary, // Supaya warna notch selaras dengan background terbawah
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: Colors.darkBg,
  },
  topSection: {
    backgroundColor: Colors.creamBg,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
    // Efek lengkungan di bawah cream section jika diinginkan:
    // borderBottomLeftRadius: 24,
    // borderBottomRightRadius: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.optionalAccent,
    marginBottom: 30,
  },
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
    backgroundColor: "#2A3A40", // Warna gelap di belakang avatar
    borderRadius: 35, // Membuat bentuknya agak melengkung unik
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
  infoCard: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
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
    gap: 8, // Mengatur jarak antar tag otomatis
  },
  pill: {
    backgroundColor: "#FCE4E4",
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
  harmonyHeader: {
    marginTop: 10,
    marginBottom: 16,
  },
  harmonyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#351213",
  },
  menuItemTop: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 24,
    marginBottom: 10, // Memberi jarak dengan section gelap di bawahnya
  },
  menuIconContainerTop: {
    width: 44,
    height: 44,
    backgroundColor: "#FCE4E4",
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  bottomSection: {
    backgroundColor: Colors.darkBg,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
  },
  menuItemBottom: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 24,
    marginBottom: 16,
  },
  menuIconContainerBottom: {
    width: 44,
    height: 44,
    backgroundColor: "#F4C7C7",
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  menuIconContainerBottomDark: {
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
  signOutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    paddingVertical: 12,
  },
  signOutText: {
    color: Colors.logoutText,
    marginLeft: 10,
    fontSize: 14,
    fontWeight: "bold",
  },
});
