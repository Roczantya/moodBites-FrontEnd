import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, Alert } from "react-native";
import {
  render,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react-native";
import MoodSurveyScreen from "@/app/auth/firstsurvey";
import { router } from "expo-router";
import { FLAVORS, MENU_CATEGORIES, MOOD_SECTIONS } from "@/constants/mood";

jest.mock("expo-router", () => ({
  router: { replace: jest.fn() },
}));

const alertSpy = jest
  .spyOn(Alert, "alert")
  .mockImplementation((title, message, buttons: any) => {
    if (buttons && buttons[0] && buttons[0].onPress) {
      buttons[0].onPress();
    }
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

describe("MoodSurveyScreen Integration Tests", () => {
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  const fillStepData = (getByTestId: any) => {
    FLAVORS.forEach((f) => fireEvent.press(getByTestId(`scale-${f}`)));
    FLAVORS.forEach((f) => {
      const label = `Tingkat ${f.split(" /")[0]}`;
      fireEvent.press(getByTestId(`scale-${label}`));
    });
    fireEvent.press(getByTestId(`checkbox-${MENU_CATEGORIES[0]}`));
  };

  it("tampilan awal merender step 1 dan progress bar dengan benar", () => {
    const { getByText } = render(<MoodSurveyScreen />);
    expect(getByText(MOOD_SECTIONS[0].title)).toBeTruthy();
    expect(
      getByText(new RegExp(`Step 1 of ${MOOD_SECTIONS.length}`, "i")),
    ).toBeTruthy();
  });

  it("memunculkan Toast error jika menekan 'Next' tanpa mengisi data", async () => {
    const { getByText, findByText } = render(<MoodSurveyScreen />);
    fireEvent.press(getByText("Next"));
    const errorMsg = await findByText(/Harap isi semua skala/i);
    expect(errorMsg).toBeTruthy();
  });

  it("tombol 'Back' harus transparan (opacity 0) di Step 1", () => {
    const { getByTestId } = render(<MoodSurveyScreen />);
    const backButton = getByTestId("back-button");
    expect(StyleSheet.flatten(backButton.props.style).opacity).toBe(0);
  });

  it("seharusnya bisa menyelesaikan seluruh step survey sampai Submit", async () => {
    const { getByTestId, getByText } = render(<MoodSurveyScreen />);
    const totalSteps = MOOD_SECTIONS.length;

    // Loop otomatis dari Step 1 sampai Step 6
    for (let i = 1; i < totalSteps; i++) {
      fillStepData(getByTestId);
      fireEvent.press(getByText("Next"));

      await waitFor(() => {
        expect(
          getByText(new RegExp(`Step ${i + 1} of ${totalSteps}`, "i")),
        ).toBeTruthy();
      });
    }

    // --- STEP TERAKHIR ---
    fillStepData(getByTestId);
    fireEvent.press(getByText("Submit"));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith(
        "Sukses!",
        "Data survey berhasil disubmit!",
        expect.any(Array),
      );
      expect(router.replace).toHaveBeenCalledWith("/auth");
    });
  });

  it("membersihkan timer toast saat component unmount", () => {
    const clearTimeoutSpy = jest.spyOn(global, "clearTimeout");
    const { unmount } = render(<MoodSurveyScreen />);
    unmount();
    expect(clearTimeoutSpy).toHaveBeenCalled();
  });
});
