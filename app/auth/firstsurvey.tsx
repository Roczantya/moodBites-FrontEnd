import React from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from "react-native";

import { LikertScale } from "@/components/survey/Skalasurvey";
import { CheckboxGroup } from "@/components/survey/checkbox";
import { Colors } from "@/constants/colors";
import { FLAVORS, MENU_CATEGORIES } from "@/constants/mood";

import { useMoodSurvey } from "@/hooks/use-mood-survey";
import Header from "@/components/dashboard/header";

export default function MoodSurveyScreen() {
  // Panggil hook logika di sini dan ekstrak data yang diperlukan
  const {
    currentStep,
    setCurrentStep,
    toastMessage,
    scrollViewRef,
    moodInfo,
    moodData,
    totalSteps,
    progressPercentage,
    handleMoodChange,
    validateAndProceed,
  } = useMoodSurvey();

  // Handle jika data mood hilang / error state
  if (!moodData) {
    return (
      <View
        style={[
          styles.mainContainer,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text style={{ color: "white" }}>
          Memuat data mood atau terjadi kesalahan...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <StatusBar hidden={true} />
      <Header title="Mood Survey" showBell={false} />

      {/* Progress Header */}
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          Step {currentStep + 1} of {totalSteps}
        </Text>
        <View style={styles.progressBarBackground}>
          <View
            style={[
              styles.progressBarFill,
              { width: progressPercentage as any },
            ]}
          />
        </View>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.header}>{moodInfo.title}</Text>
        <Text style={styles.desc}>{moodInfo.desc}</Text>

        <Text style={styles.subHeader}>
          Seberapa PENGEN kamu dengan rasa berikut?
        </Text>
        {FLAVORS.map((flavor) => (
          <LikertScale
            key={`desire-${flavor}`}
            label={flavor}
            minLabel="Sangat Tidak"
            maxLabel="Pengen Banget"
            value={moodData.desire[flavor] || 0}
            onChange={(val: number) =>
              handleMoodChange(moodInfo.key, "desire", flavor, val)
            }
          />
        ))}

        <Text style={[styles.subHeader, { marginTop: 25 }]}>
          Seberapa KUAT intensitas rasanya?
        </Text>
        {FLAVORS.map((flavor) => (
          <LikertScale
            key={`int-${flavor}`}
            label={`Tingkat ${flavor.split(" /")[0]}`}
            minLabel="Sangat Ringan"
            maxLabel="Sangat Kuat"
            value={moodData.intensity[flavor] || 0}
            onChange={(val: number) =>
              handleMoodChange(moodInfo.key, "intensity", flavor, val)
            }
          />
        ))}

        <Text style={[styles.subHeader, { marginTop: 25 }]}>
          Pilih kategori yang sesuai untuk mood {moodInfo.title.toLowerCase()}
        </Text>
        <CheckboxGroup
          options={MENU_CATEGORIES}
          selectedValues={moodData.categories}
          onChange={(val: string[]) =>
            handleMoodChange(moodInfo.key, "categories", null, val)
          }
        />

        {/* Navigation Buttons */}
        <View style={styles.navRow}>
          <TouchableOpacity
            testID="back-button"
            style={[styles.btnOutline, { opacity: currentStep === 0 ? 0 : 1 }]}
            disabled={currentStep === 0}
            onPress={() => setCurrentStep((prev) => prev - 1)}
          >
            <Text style={styles.btnOutlineText}>Back</Text>
          </TouchableOpacity>

          {currentStep < totalSteps - 1 ? (
            <TouchableOpacity
              style={styles.btnSolid}
              onPress={() => validateAndProceed(false)}
            >
              <Text style={styles.btnSolidText}>Next</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.btnSubmit}
              onPress={() => validateAndProceed(true)}
            >
              <Text style={styles.btnSolidText}>Submit</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {toastMessage.visible && (
        <View
          style={[
            styles.toastContainer,
            {
              backgroundColor:
                toastMessage.type === "success" ? "#A0D585" : "#FF9494",
            },
          ]}
        >
          <Text style={styles.toastText}>{toastMessage.message}</Text>
        </View>
      )}
    </View>
  );
}

// ... Sisipkan styles.create kamu di bawah sini (tidak ada yang perlu diubah di bagian styles)
const styles = StyleSheet.create({
  // ... [Salin semua kode styles milikmu dari sebelumnya ke sini] ...
  mainContainer: { flex: 1, backgroundColor: Colors.primary },
  progressContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: Colors.primary,
    zIndex: 5,
  },
  progressText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontFamily: "PlusJakartaSans-Bold",
    marginBottom: 8,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: Colors.secondary,
    borderRadius: 4,
    width: "100%",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: Colors.accent,
    borderRadius: 4,
  },
  scrollContainer: { flex: 1 },
  scrollContent: { paddingHorizontal: 20 },
  header: {
    fontSize: 24,
    fontFamily: "PlusJakartaSans-ExtraBold",
    color: Colors.textPrimary,
  },
  desc: {
    fontSize: 16,
    marginBottom: 25,
    fontFamily: "PlusJakartaSans-Regular",
    color: Colors.textPrimary + "CC",
  },
  subHeader: {
    fontSize: 18,
    fontFamily: "PlusJakartaSans-SemiBold",
    marginBottom: 15,
    color: Colors.textAccent,
  },
  navRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 40,
    paddingBottom: 20,
  },
  btnOutline: {
    width: "48%",
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.textAccent,
    backgroundColor: Colors.white,
  },
  btnOutlineText: {
    color: Colors.textAccent,
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 14,
  },
  btnSolid: {
    width: "48%",
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: Colors.accent,
  },
  btnSubmit: {
    width: "48%",
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: Colors.optionalAccent,
  },
  btnSolidText: {
    color: Colors.white,
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 16,
  },
  toastContainer: {
    position: "absolute",
    bottom: 50,
    left: 20,
    right: 20,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    zIndex: 9999,
  },
  toastText: {
    color: "white",
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Medium",
    textAlign: "center",
  },
});
