import React, { useState, useRef, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { LikertScale } from "../../components/survey/Skalasurvey";
import { CheckboxGroup } from "../../components/survey/checkbox";
import { MoodKey, DataType, Responses } from "../../constants/surveystate";
import { MOOD_SECTIONS, FLAVORS, MENU_CATEGORIES } from "../../constants/mood";
import { Colors } from "../../constants/colors";
import { router } from "expo-router";

export default function MoodSurveyScreen() {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  // Ref untuk ScrollView & Timer
  const scrollViewRef = useRef<ScrollView>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [responses, setResponses] = useState<Responses>({
    moods: {
      sad: { desire: {}, intensity: {}, categories: [] },
      angry: { desire: {}, intensity: {}, categories: [] },
      fearful: { desire: {}, intensity: {}, categories: [] },
      happy: { desire: {}, intensity: {}, categories: [] },
      neutral: { desire: {}, intensity: {}, categories: [] },
      surprised: { desire: {}, intensity: {}, categories: [] },
      disgusted: { desire: {}, intensity: {}, categories: [] }, // FIX TYPO: Hapus huruf 'i'
    },
  });

  // Auto-scroll ke atas setiap ganti step
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    }, 100);
    return () => clearTimeout(timer);
  }, [currentStep]);

  // Cleanup Toast Timer saat unmount
  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const showToast = (message: string) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastMessage(message);
    toastTimerRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleMoodChange = (
    moodKey: MoodKey,
    type: DataType,
    flavorOrCat: string | null,
    value: number | string[],
  ) => {
    setResponses((prev) => {
      const updatedMood = { ...prev.moods[moodKey] };

      if (type === "categories") {
        updatedMood.categories = value as string[];
      } else {
        updatedMood[type] = {
          ...updatedMood[type],
          [flavorOrCat as string]: value as number,
        };
      }

      return {
        ...prev,
        moods: { ...prev.moods, [moodKey]: updatedMood },
      };
    });
  };
  const moodInfo = MOOD_SECTIONS[currentStep];
  const moodData = responses.moods[moodInfo.key];
  if (!moodData) {
    console.error(
      `Data untuk mood "${moodInfo.key}" tidak ditemukan di state!`,
    );
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
  const validateAndProceed = (isSubmit: boolean = false) => {
    // Validasi: Semua flavor harus dipilih (tidak boleh 0)
    const isDesireFilled = FLAVORS.every(
      (f) => moodData.desire[f] !== undefined && moodData.desire[f] > 0,
    );
    const isIntensityFilled = FLAVORS.every(
      (f) => moodData.intensity[f] !== undefined && moodData.intensity[f] > 0,
    );
    const isCategoryFilled = moodData.categories.length > 0;

    if (!isDesireFilled || !isIntensityFilled || !isCategoryFilled) {
      showToast(
        "Harap isi semua skala (1-5) dan minimal 1 kategori menu ya! 😅",
      );
      return;
    }

    if (isSubmit) {
      console.log("Final Payload:", JSON.stringify(responses, null, 2));
      Alert.alert("Sukses!", "Data survey berhasil disubmit!", [
        { text: "OK", onPress: () => router.replace("/auth") },
      ]);
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const totalSteps = MOOD_SECTIONS.length;
  const progressPercentage =
    (((currentStep + 1) / totalSteps) * 100).toFixed(0) + "%";

  return (
    <View style={styles.mainContainer}>
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

      {/* Floating Toast - Berada di luar ScrollView agar tidak tertutup saat scroll */}
      {toastMessage && (
        <View style={styles.toastContainer}>
          <Text style={styles.toastText}>{toastMessage}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingTop: 30, // Sesuaikan dengan safe area
    paddingBottom: 20,
    backgroundColor: Colors.primary,
    zIndex: 10,
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
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    fontSize: 26,
    marginTop: 10,
    fontFamily: "PlusJakartaSans-ExtraBold",
    color: Colors.textPrimary,
  },
  desc: {
    fontSize: 16,
    marginBottom: 25,
    fontFamily: "PlusJakartaSans-Regular",
    color: Colors.textPrimary + "CC", // Warna sedikit lebih terang untuk deskripsi
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
    backgroundColor: "#E74C3C", // Warna Error (bisa diganti Colors.optionalAccent)
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
