import AsyncStorage from "@react-native-async-storage/async-storage";

const storageService = {
  // ─── SESSION (token + userId sekaligus) ───
  saveSession: async (token: string, userId: string) => {
    try {
      await AsyncStorage.multiSet([
        ["authToken", token],
        ["userId", userId],
      ]);
    } catch (error) {
      console.log("ERROR SAVE SESSION:", error);
    }
  },

  // ─── TOKEN ───
  saveToken: async (token: string) => {
    try {
      await AsyncStorage.setItem("authToken", token);
    } catch (error) {
      console.log("ERROR SAVE TOKEN:", error);
    }
  },

  getToken: async () => {
    try {
      return await AsyncStorage.getItem("authToken");
    } catch (error) {
      console.log("ERROR GET TOKEN:", error);
      return null;
    }
  },

  clearToken: async () => {
    try {
      await AsyncStorage.removeItem("authToken");
    } catch (error) {
      console.log("ERROR CLEAR TOKEN:", error);
    }
  },

  getTokenSavedAt: async () => {
    try {
      return await AsyncStorage.getItem("tokenSavedAt");
    } catch (error) {
      console.log("ERROR GET TOKEN SAVED AT:", error);
      return null;
    }
  },
  // ─── USER ID ───
  saveUserId: async (userId: string) => {
    try {
      await AsyncStorage.setItem("userId", userId);
    } catch (error) {
      console.log("ERROR SAVE USER ID:", error);
    }
  },

  getUserId: async () => {
    try {
      return await AsyncStorage.getItem("userId");
    } catch (error) {
      console.log("ERROR GET USER ID:", error);
      return null;
    }
  },

  clearUserId: async () => {
    try {
      await AsyncStorage.removeItem("userId");
    } catch (error) {
      console.log("ERROR CLEAR USER ID:", error);
    }
  },

  // ─── NAME ───
  saveName: async (name: string) => {
    try {
      await AsyncStorage.setItem("userName", name);
    } catch (error) {
      console.log("ERROR SAVE NAME:", error);
    }
  },

  getName: async () => {
    try {
      return await AsyncStorage.getItem("userName");
    } catch (error) {
      console.log("ERROR GET NAME:", error);
      return null;
    }
  },

  // ─── ONBOARDING ───
  saveOnboardingDone: async () => {
    try {
      await AsyncStorage.setItem("onboardingDone", "true");
    } catch (error) {
      console.log(error);
    }
  },

  getOnboardingDone: async () => {
    try {
      return await AsyncStorage.getItem("onboardingDone");
    } catch (error) {
      console.log(error);
      return null;
    }
  },

  // ─── SURVEY ───
  saveSurveyDone: async () => {
    try {
      await AsyncStorage.setItem("surveyDone", "true");
    } catch (error) {
      console.log("ERROR SAVE SURVEY DONE:", error);
    }
  },

  getSurveyDone: async () => {
    try {
      return await AsyncStorage.getItem("surveyDone");
    } catch (error) {
      console.log("ERROR GET SURVEY DONE:", error);
      return null;
    }
  },

  // ─── CLEAR ALL (logout) ───
  clearAllSession: async () => {
    try {
      // ✅ onboardingDone sengaja tidak dihapus biar tidak muncul lagi pas relogin
      await AsyncStorage.multiRemove([
        "authToken",
        "userId",
        "surveyDone",
        "userName",
        "tokenSavedAt", // ✅ tambah ini
      ]);
    } catch (error) {
      console.log("ERROR CLEAR ALL SESSION:", error);
    }
  },
};

export default storageService;
