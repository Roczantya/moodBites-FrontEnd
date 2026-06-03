import { Responses } from "@/constants/surveystate";
// Impor apiClient (default) dan moodbitesExternalClient (named export)
import apiClient from "./apiClient";

export const surveyService = {
  submitMoodSurvey: async (data: Responses) => {
    try {
      const payloadToSubmit = {
        moods: data.moods,
        valid_MOODS: ["sad", "angry", "happy", "neutral"],
      };

      // Menggunakan API internal
      const response = await apiClient.post("/survey", payloadToSubmit);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  // Tambahkan userId di sini sebagai parameter fetch rekomendasi menu tapi tidak jadi
  // getRecommendations: async (mood: string, userId: string | number) => {
  //   try {
  //     console.log(`[API] Mencoba fetch eksternal untuk mood: ${mood}`);
  //     const response = await moodbitesExternalClient.get(
  //       `/recommend-external/${mood}/${userId}`,
  //     );
  //     return response.data ?? [];
  //   } catch (error: any) {
  //     console.error(
  //       `[API] Gagal fetch rekomendasi untuk mood: ${mood}`,
  //       console.error(error),
  //       error.message,
  //     );
  //     throw error;
  //   }
  // },
};
