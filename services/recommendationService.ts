import { Mood, RecommendationResponse } from "@/types/recommendation";

const BASE_URL = "http://103.185.52.14:8067";

export async function fetchRecommendations(
  mood: Mood,
  userId: string
): Promise<RecommendationResponse> {
  const response = await fetch(
    `${BASE_URL}/recommend-external/${mood}/${userId}`
  );

  if (!response.ok) {
    throw new Error(`Gagal memuat rekomendasi: ${response.status}`);
  }

  return response.json();
}