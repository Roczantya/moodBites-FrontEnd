import AsyncStorage from "@react-native-async-storage/async-storage";

const storageService = {
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
  saveName: async (name: string) => {
    try {
      await AsyncStorage.setItem("name", name);
    } catch (error) {
      console.log("ERROR SAVE NAME:", error);
    }
  },

  getName: async () => {
    try {
      return await AsyncStorage.getItem("name");
    } catch (error) {
      console.log("ERROR GET NAME:", error);
      return null;
    }
  },

  clearAllSession: async () => {
    try {
      const keys = [
        "userId",
        "authToken",
        "surveyDone",
        "userName",
        "loginToken",
      ];
      await AsyncStorage.multiRemove(keys);
      console.log("SEMUA SESSION BERHASIL DIHAPUS (LOGOUT SUCCESS)");
    } catch (error) {
      console.log("ERROR CLEAR ALL SESSION:", error);
    }
  },

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
  saveLoginToken: async (token: string) => {
    try {
      await AsyncStorage.setItem("loginToken", token);
    } catch (error) {
      console.log("ERROR SAVE LOGIN TOKEN:", error);
    }
  },

  getLoginToken: async () => {
    try {
      return await AsyncStorage.getItem("loginToken");
    } catch (error) {
      console.log("ERROR GET LOGIN TOKEN:", error);
      return null;
    }
  },
};

export default storageService;
