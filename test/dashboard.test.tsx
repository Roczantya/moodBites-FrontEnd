import RecommendationList from "@/components/dashboard/recommendedlist";
import { FOOD_DATA } from "@/constants/food_item";
import { render, screen } from "@testing-library/react-native";
import React from "react";

// Mock dependencies yang tidak relevan untuk unit test ini
jest.mock("@/components/dashboard/header", () => {
  const { Text } = require("react-native");
  return function MockHeader({ title }: { title: string }) {
    return <Text>{title}</Text>;
  };
});

jest.mock("/components/dashboard/moodSelector", () => {
  const { Text } = require("react-native");
  return function MockMoodSelector() {
    return <Text>MoodSelector</Text>;
  };
});

describe("RecommendationList", () => {
  it("merender Header dengan judul MoodBites", () => {
    render(<RecommendationList />);
    expect(screen.getByText("MoodBites")).toBeTruthy();
  });

  it("merender judul rekomendasi dan subtitle", () => {
    render(<RecommendationList />);
    expect(screen.getByText(/Rekomendasi makanan berdasarkan/i)).toBeTruthy();
    expect(
      screen.getByText(/Isi tenagamu dengan berbagai nutrisi/i),
    ).toBeTruthy();
  });

  it("merender MoodSelector", () => {
    render(<RecommendationList />);
    expect(screen.getByText("MoodSelector")).toBeTruthy();
  });

  it("merender semua item dari FOOD_DATA dengan nama yang benar", () => {
    render(<RecommendationList />);
    FOOD_DATA.forEach((item) => {
      expect(screen.getAllByText(item.name).length).toBeGreaterThan(0);
    });
  });

  it("merender moodTag untuk setiap item makanan", () => {
    render(<RecommendationList />);
    // Ambil moodTag unik agar tidak duplikat assertion
    const uniqueTags = Array.from(new Set(FOOD_DATA.map((i) => i.moodTag)));
    uniqueTags.forEach((tag) => {
      expect(screen.getAllByText(tag).length).toBeGreaterThan(0);
    });
  });

  it("merender jumlah item sama dengan panjang FOOD_DATA", () => {
    render(<RecommendationList />);
    FOOD_DATA.forEach((item) => {
      const matches = screen.getAllByText(item.name);
      expect(matches.length).toBe(1);
    });
  });

  it("setiap item memiliki source gambar yang valid (bukan string/uri)", () => {
    // Memastikan tidak ada item yang menggunakan string biasa
    // (mencegah regresi ke pola { uri: item.image })
    FOOD_DATA.forEach((item) => {
      expect(typeof item.image).not.toBe("string");
    });
  });

  it("snapshot RecommendationList sesuai", () => {
    const { toJSON } = render(<RecommendationList />);
    expect(toJSON()).toMatchSnapshot();
  });
});
