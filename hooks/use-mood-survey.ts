import { FLAVORS, MOOD_SECTIONS } from "@/constants/mood";
import { DataType, MoodKey, Responses } from "@/constants/surveystate";
import storageService from "@/services/storageService";
import { surveyService } from "@/services/surveyService";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ScrollView } from "react-native";

export const useMoodSurvey = () => {
  const params = useLocalSearchParams();
  const routeUserId = params.userId as string;
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState({
    visible: false,
    message: "",
    type: "error", // default-nya error
  });
  const [menuOptions, setMenuOptions] = useState<string[]>([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);
  // Ref untuk ScrollView & Timer
  const scrollViewRef = useRef<ScrollView>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mood = MOOD_SECTIONS[currentStep].key.toLowerCase();
  const [responses, setResponses] = useState<Responses>({
    moods: {
      sad: { desire: {}, intensity: {}, categories: [] },
      angry: { desire: {}, intensity: {}, categories: [] },
      happy: { desire: {}, intensity: {}, categories: [] },
      neutral: { desire: {}, intensity: {}, categories: [] },
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

  useEffect(() => {
    const fetchRecommendations = async () => {
      setIsLoadingOptions(true);
      try {
        // 👇 3. Cek routeUserId dulu (lebih cepat), kalau kosong baru ambil dari storage
        const userId = routeUserId || (await storageService.getUserId());

        if (!userId) {
          console.warn(
            "User ID tidak ditemukan, lewati pengambilan rekomendasi.",
          );
          setMenuOptions([]);
          return;
        }

        const currentKey = MOOD_SECTIONS[currentStep].key.toLowerCase();

        // Gunakan userId yang didapat
        const data = await surveyService.getRecommendations(currentKey, userId);
        console.log("=== ISI DATA DARI BE ===");
        console.log("TIPE DATA:", typeof data);
        console.log("STRUKTUR DATA:", JSON.stringify(data, null, 2));
        setMenuOptions(data);
      } catch (error: any) {
        console.log("=== FETCH ERROR ===");
        console.log("STATUS:", error.statusCode);
        console.log("RESPONSE:", error.originalError?.response?.data);
        setMenuOptions([]);
      } finally {
        setIsLoadingOptions(false);
      }
    };

    fetchRecommendations();
  }, [currentStep, routeUserId]);

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

  const validateAndProceed = async (isSubmit: boolean = false) => {
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
      setIsLoading(true);
      try {
        await surveyService.submitMoodSurvey(responses);

        // 👇 1. Simpan status survey ke local storage
        await storageService.saveSurveyDone();

        // 👇 2. Arahkan langsung ke dashboard, BUKAN ke "/auth"
        showToast("✓ Survei selesai! Masuk ke aplikasi...", "success");
        setTimeout(() => {
          router.replace("/dashboard/home"); // Sesuaikan dengan rute dashboard utama kamu
        }, 1500);
      } catch (error: any) {
        console.error("Survey Submit Error:", error);
        showToast(error.message || "Gagal mengirim data survei 😢", "error");
      } finally {
        setIsLoading(false);
      }
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  // Kembalikan semua state dan fungsi yang dibutuhkan oleh UI
  return {
    currentStep,
    setCurrentStep,
    isLoading,
    toastMessage,
    scrollViewRef,
    moodInfo: MOOD_SECTIONS[currentStep],
    moodData: responses.moods[MOOD_SECTIONS[currentStep].key],
    totalSteps: MOOD_SECTIONS.length,
    menuOptions,
    isLoadingOptions,
    handleMoodChange,
    validateAndProceed,
    progressPercentage,
  };
};
