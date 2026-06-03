import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, View } from "react-native";

// Komponen
import InputField from "@/components/auth/inputfield"; // Sesuaikan path InputField-mu
import Header from "@/components/dashboard/header";
import PrimaryButton from "@/components/Reuse/button"; // Sesuaikan path button-mu

// Constants & Services
import { Colors } from "@/constants/colors";
import authService from "@/services/authService";

export default function EditProfileScreen() {
  const [name, setName] = useState("");

  // State untuk loading
  const [isFetching, setIsFetching] = useState(true); // Loading awal pas buka halaman
  const [isSaving, setIsSaving] = useState(false); // Loading pas tombol simpan dipencet

  // 1. Ambil data nama yang sekarang biar inputnya terisi otomatis
  useEffect(() => {
    const fetchCurrentProfile = async () => {
      try {
        const data = await authService.getProfile();
        if (data && data.name) {
          setName(data.name);
        }
      } catch (error) {
        console.log("Gagal mengambil profil saat ini", error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchCurrentProfile();
  }, []);

  // 2. Fungsi untuk menyimpan (PATCH) nama baru
  const handleSave = async () => {
    if (name.trim().length < 2) {
      Alert.alert("Validasi", "Nama harus terdiri dari minimal 2 karakter.");
      return;
    }

    setIsSaving(true);
    try {
      await authService.updateProfile({ name });

      router.push("/dashboard/profil");
    } catch (error: any) {
      console.log("Gagal update profil:", error);
      Alert.alert("Error", error.message || "Gagal memperbarui nama.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="Edit Profile"
        variant="title"
        alignTitle="center"
        showBell={false}
        showBack={true}
        onBackPress={() => router.push("/dashboard/profil")}
      />

      {isFetching ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.accent} />
        </View>
      ) : (
        <View style={styles.formContainer}>
          {/* Komponen InputField kamu yang keren */}
          <InputField
            label="Nama Lengkap"
            icon="person-outline"
            value={name}
            onChangeText={setName}
            placeholder="Masukkan nama baru kamu"
          />

          <View style={styles.buttonWrapper}>
            <PrimaryButton
              label={isSaving ? "Menyimpan..." : "Simpan Perubahan"}
              onPress={handleSave}
              disabled={isSaving || name.trim() === ""}
            />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  formContainer: {
    paddingHorizontal: 24,
    paddingTop: 30,
    flex: 1,
  },
  buttonWrapper: {
    marginTop: 40,
  },
});
