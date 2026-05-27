import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Index from "../app/index";

// Helper untuk metrics safe area agar test tidak error
const safeAreaMetrics = {
  frame: { x: 0, y: 0, width: 375, height: 667 },
  insets: { top: 20, left: 0, right: 0, bottom: 0 },
};

describe("Onboarding Screen", () => {
  // Gunakan fungsi wrapper untuk menghindari duplikasi kode
  const renderWithSafeArea = (ui: React.ReactElement) => {
    return render(
      <SafeAreaProvider initialMetrics={safeAreaMetrics}>
        {ui}
      </SafeAreaProvider>,
    );
  };

  it("berpindah ke halaman berikutnya saat Next ditekan", async () => {
    const { findAllByText, findByText } = renderWithSafeArea(<Index />);

    // 1. Cari tombol "Next"
    const nextButtons = await findAllByText("Next");

    // 2. Klik tombol Next
    fireEvent.press(nextButtons[0]);

    // 3. Pengecekan slide berikutnya
    // Pastikan teks yang dicari sesuai dengan isi onboardingData Anda
    const nextScreenText = await findByText(/Kenali mood/i);
    expect(nextScreenText).toBeTruthy();
  });
});
