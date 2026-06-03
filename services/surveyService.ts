import { Responses } from "@/constants/surveystate";
// Impor apiClient (default) dan moodbitesExternalClient (named export)
import apiClient, { moodbitesExternalClient } from "./apiClient";
import storageService from "./storageService";

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
      console.log(`[API] Mencoba fetch eksternal untuk mood: ${mood}`);
      const response = await moodbitesExternalClient.get(
        `/recommend_external/${mood}/${userId}`,
      );

      return response.data ?? [];
    } catch (externalError: any) {
      // Kalau API Eksternal gagal, kita jangan langsung nyerah
      console.warn(
        "API Eksternal gagal. Beralih ke API Internal...",
        externalError.message,
      );
      try {
        console.log(`[API] Mencoba fetch internal untuk mood: ${mood}`);
        console.log("ID dari parameter URL:", userId);
        const responseInternal = await apiClient.get(
          `/external/recommendations/${mood}`,
        );
        const token = await storageService.getToken();
        console.log("TOKEN YANG DIKIRIM:", token);
        return responseInternal.data ?? [];
      } catch (internalError: any) {
        // Kalau kedua API gagal semua, baru lemparkan error ke UI (layar)
        console.error("Kedua API gagal merespons.");
        throw internalError;
      }
    }
  },
};
