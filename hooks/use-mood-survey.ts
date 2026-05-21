import { useState, useRef, useEffect } from "react";
import { ScrollView, Alert } from "react-native";
import { router } from "expo-router";
import { MoodKey, DataType, Responses } from "@/constants/surveystate";
import { MOOD_SECTIONS, FLAVORS } from "@/constants/mood";

export const useMoodSurvey = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [toastMessage, setToastMessage] = useState({
    visible: false,
    message: "",
    type: "error", // default-nya error
  });

  // Ref untuk ScrollView & Timer
  const scrollViewRef = useRef<ScrollView>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [responses, setResponses] = useState<Responses>({
    moods: {
      Sad: { desire: {}, intensity: {}, categories: [] },
      Angry: { desire: {}, intensity: {}, categories: [] },
      Happy: { desire: {}, intensity: {}, categories: [] },
      Neutral: { desire: {}, intensity: {}, categories: [] },
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

  // ✅ FUNGSI SHOW TOAST DIKEMBALIKAN KE SINI
  const showToast = (message: string, type: "success" | "error" = "error") => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastMessage({ visible: true, message, type });

    toastTimerRef.current = setTimeout(() => {
      setToastMessage((prev) => ({ ...prev, visible: false }));
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

  // Helper Variables
  const moodInfo = MOOD_SECTIONS[currentStep];
  const moodData = responses.moods[moodInfo.key];
  const totalSteps = MOOD_SECTIONS.length;
  const progressPercentage =
    (((currentStep + 1) / totalSteps) * 100).toFixed(0) + "%";

  const validateAndProceed = (isSubmit: boolean = false) => {
    if (!moodData) return;

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
        "error",
      );
      return;
    }

    if (isSubmit) {
      console.log("Final Payload:", JSON.stringify(responses, null, 2));

      // ✅ SUKSES: MUNCUL TOAST WARNA HIJAU DAN PINDAH HALAMAN
      showToast("✓ Survei selesai! Mengalihkan ke Login...", "success");
      setTimeout(() => {
        router.replace("/auth");
      }, 1500);
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  // Kembalikan semua state dan fungsi yang dibutuhkan oleh UI
  return {
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
  };
};
