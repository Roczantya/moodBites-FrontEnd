import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import OnboardingItem from "@/components/onboarding/onboardingItem";
import { View } from "react-native";

describe("OnboardingItem", () => {
  it("menampilkan title dan deskripsi", () => {
    const { getByText } = render(
      <OnboardingItem
        title="Test Title"
        description="Test Description"
        image={null}
        backgroundColor="#fff"
        onNext={() => {}}
        isLast={false}
      />,
    );

    expect(getByText("Test Title")).toBeTruthy();
    expect(getByText("Test Description")).toBeTruthy();
  });

  it("memanggil onNext saat tombol ditekan", () => {
    const mockNext = jest.fn();

    const { getByText } = render(
      <OnboardingItem
        title="Test"
        description="Test"
        image={null}
        backgroundColor="#fff"
        onNext={mockNext}
        isLast={false}
      />,
    );

    fireEvent.press(getByText("Next"));

    expect(mockNext).toHaveBeenCalled();
  });
});
