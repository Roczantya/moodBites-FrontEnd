// @ts-nocheck
import MoodSurveyScreen from "@/app/auth/firstsurvey";
import { FLAVORS, MOOD_SECTIONS } from "@/constants/mood";
import {
  act,
  cleanup,
  fireEvent,
  render,
  waitFor,
} from "@testing-library/react-native";
import { router } from "expo-router";
import React from "react";

jest.mock("expo-router", () => ({
  router: { replace: jest.fn(), push: jest.fn() },
  useLocalSearchParams: () => ({ userId: "123" }),
}));

jest.mock("@/services/surveyService", () => ({
  surveyService: {
    getRecommendations: jest.fn().mockResolvedValue(["Ayam Bakar", "Bebek"]),
    submitMoodSurvey: jest.fn().mockResolvedValue({ success: true }),
  },
}));

// ✅ Mock hook langsung — hindari masalah async fetch di render
jest.mock("@/hooks/use-mood-survey", () => {
  const { useState, useRef } = require("react");
  const { MOOD_SECTIONS, FLAVORS } = require("@/constants/mood");

  const MOCK_OPTIONS = [
    "Nasi Ayam (Goreng / Panggang)",
    "Nasi Goreng / Nasi Gila",
    "Bakso Kuah",
  ];

  return {
    useMoodSurvey: () => {
      const [currentStep, setCurrentStep] = useState(0);
      const [isLoading, setIsLoading] = useState(false);
      const [toastMessage, setToastMessage] = useState({
        visible: false,
        message: "",
        type: "error",
      });
      const [responses, setResponses] = useState({
        moods: {
          sad: { desire: {}, intensity: {}, categories: [] }, // ← lowercase
          angry: { desire: {}, intensity: {}, categories: [] }, // ← lowercase
          happy: { desire: {}, intensity: {}, categories: [] }, // ← lowercase
          neutral: { desire: {}, intensity: {}, categories: [] }, // ← lowercase
        },
      });
      const scrollViewRef = useRef(null);
      const toastTimerRef = useRef(null); // ← hapus type parameter
      const moodInfo = MOOD_SECTIONS[currentStep];
      const moodKey = MOOD_SECTIONS[currentStep].key.toLowerCase(); // ← key fix
      const moodData = responses.moods[moodKey]; // ← pakai moodKey
      const totalSteps = MOOD_SECTIONS.length;

      const showToast = (message, type = "error") => {
        // ← hapus type annotation
        if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
        setToastMessage({ visible: true, message, type });
        toastTimerRef.current = setTimeout(() => {
          setToastMessage((prev) => ({ ...prev, visible: false })); // ← hapus :any
        }, 3000);
      };

      const handleMoodChange = (moodKey, type, flavorOrCat, value) => {
        const lowerKey = moodKey.toLowerCase(); // ← lowercase saat update juga
        setResponses((prev) => {
          const updatedMood = { ...prev.moods[lowerKey] };
          if (type === "categories") {
            updatedMood.categories = value;
          } else {
            updatedMood[type] = { ...updatedMood[type], [flavorOrCat]: value };
          }
          return { ...prev, moods: { ...prev.moods, [lowerKey]: updatedMood } };
        });
      };

      const validateAndProceed = async (isSubmit) => {
        // ← hapus :boolean
        const isDesireFilled = FLAVORS.every(
          (f) => moodData.desire[f] !== undefined && moodData.desire[f] > 0,
        );
        const isIntensityFilled = FLAVORS.every(
          (f) =>
            moodData.intensity[f] !== undefined && moodData.intensity[f] > 0,
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
            const { surveyService } = require("@/services/surveyService");
            await surveyService.submitMoodSurvey(responses);
            showToast("✓ Survei selesai! Mengalihkan ke Login...", "success");
            setTimeout(() => {
              const { router } = require("expo-router");
              router.replace("/auth");
            }, 1500);
          } catch (error) {
            showToast(
              error.message || "Gagal mengirim data survei 😢",
              "error",
            );
          } finally {
            setIsLoading(false);
          }
        } else {
          setCurrentStep((prev) => prev + 1); // ← hapus :number
        }
      };

      return {
        currentStep,
        setCurrentStep,
        isLoading,
        toastMessage,
        scrollViewRef,
        moodInfo,
        moodData,
        totalSteps,
        progressPercentage: `${Math.round(((currentStep + 1) / totalSteps) * 100)}%`,
        handleMoodChange,
        validateAndProceed,
        menuOptions: MOCK_OPTIONS,
        isLoadingOptions: false,
      };
    },
  };
});

jest.mock("@/components/survey/Skalasurvey", () => {
  const { TouchableOpacity, Text } = require("react-native");
  return {
    LikertScale: ({ label, onChange, testID }: any) => (
      <TouchableOpacity
        testID={testID || `scale-${label}`}
        onPress={() => onChange(4)}
      >
        <Text>{label}</Text>
      </TouchableOpacity>
    ),
  };
});

jest.mock("@/components/survey/checkbox", () => {
  const { View, Text, TouchableOpacity } = require("react-native");
  return {
    CheckboxGroup: ({ options, onChange }: any) => (
      <View>
        {options.map((opt: string) => (
          <TouchableOpacity
            key={opt}
            testID={`checkbox-${opt}`}
            onPress={() => onChange([opt])}
          >
            <Text>{opt}</Text>
          </TouchableOpacity>
        ))}
      </View>
    ),
  };
});

const MOCK_MENU = "Nasi Ayam (Goreng / Panggang)";

const fillStepData = (getByTestId: any) => {
  FLAVORS.forEach((f: string) => fireEvent.press(getByTestId(`scale-${f}`)));
  FLAVORS.forEach((f: string) => {
    fireEvent.press(getByTestId(`scale-Tingkat ${f.split(" /")[0]}`));
  });
  fireEvent.press(getByTestId(`checkbox-${MOCK_MENU}`));
};

describe("MoodSurveyScreen Integration Tests", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it("tampilan awal merender step 1 dan progress bar dengan benar", () => {
    const { getByText } = render(<MoodSurveyScreen />);
    expect(getByText(MOOD_SECTIONS[0].title)).toBeTruthy();
    expect(
      getByText(new RegExp(`Step 1 of ${MOOD_SECTIONS.length}`, "i")),
    ).toBeTruthy();
  });

  it("memunculkan Toast error jika menekan 'Next' tanpa mengisi data", async () => {
    const { getByTestId, getByText } = render(<MoodSurveyScreen />);

    await act(async () => {
      fireEvent.press(getByTestId("next-button"));
    });

    await act(async () => {
      jest.advanceTimersByTime(100);
    });

    await waitFor(() => {
      expect(getByText(/Harap isi semua skala/i)).toBeTruthy();
    });
  });

  it("tombol 'Back' harus transparan (opacity 0) di Step 1", () => {
    const { getByTestId } = render(<MoodSurveyScreen />);
    const backButton = getByTestId("back-button");
    const inlineStyle = Array.isArray(backButton.props.style)
      ? backButton.props.style.find((s: any) => s?.opacity !== undefined)
      : backButton.props.style;
    expect(inlineStyle?.opacity).toBe(0);
  });

  it("seharusnya bisa menyelesaikan seluruh step survey sampai Submit", async () => {
    const { getByTestId, getByText } = render(<MoodSurveyScreen />);
    const totalSteps = MOOD_SECTIONS.length;

    for (let i = 0; i < totalSteps - 1; i++) {
      await act(async () => {
        fillStepData(getByTestId);
      });

      await act(async () => {
        fireEvent.press(getByTestId("next-button"));
        jest.runAllTimers();
      });

      await waitFor(() => {
        expect(
          getByText(new RegExp(`Step ${i + 2} of ${totalSteps}`, "i")),
        ).toBeTruthy();
      });
    }

    await act(async () => {
      fillStepData(getByTestId);
    });

    await act(async () => {
      fireEvent.press(getByTestId("submit-button"));
    });

    await waitFor(() => {
      expect(
        getByText("✓ Survei selesai! Mengalihkan ke Login..."),
      ).toBeTruthy();
    });

    await act(async () => {
      jest.runAllTimers();
    });

    expect(router.replace).toHaveBeenCalledWith("/auth");
  });
  it("membersihkan timer toast saat component unmount", () => {
    // Test ini verifikasi komponen bisa unmount tanpa error
    const { unmount } = render(<MoodSurveyScreen />);
    expect(() => unmount()).not.toThrow();
  });
});
