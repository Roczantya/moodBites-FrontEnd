import { Responses } from "@/constants/surveystate";
// Impor apiClient (default) dan moodbitesExternalClient (named export)
import apiClient from "./apiClient";

export const surveyService = {
  submitMoodSurvey: async (data: Responses) => {
    // ✅ tidak perlu userId param
    const payloadToSubmit = {
      moods: data.moods,
      valid_MOODS: Object.keys(data.moods),
      // userId tidak perlu — token di header sudah cukup
    };
    const response = await apiClient.post("/form", payloadToSubmit);
    return response.data;
  },
};
