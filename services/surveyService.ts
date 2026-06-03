import { Responses } from "@/constants/surveystate";
// Impor apiClient (default) dan moodbitesExternalClient (named export)
import apiClient, { moodbitesExternalClient } from "./apiClient";

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

  // Tambahkan userId di sini sebagai parameter
  getRecommendations: async (mood: string, userId: string | number) => {
    try {
      console.log("GET ke IP Baru:", `/recommend_external/${mood}/${userId}`);
      // Menggunakan API eksternal (IP Baru)
      const response = await moodbitesExternalClient.get(
        `/recommend-external/${mood}/${userId}`,
      );
      return response.data ?? [];
    } catch (error: any) {
      throw error;
    }
  },
};
