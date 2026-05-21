export type MoodKey = "sad" | "angry" | "happy" | "neutral";

export type DataType = "desire" | "intensity" | "categories";

export interface MoodData {
  desire: Record<string, number>;
  intensity: Record<string, number>;
  categories: string[];
}

export interface Responses {
  moods: Record<MoodKey, MoodData>;
}

export interface MoodSection {
  key: MoodKey;
  title: string;
  desc: string;
}
