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
};

export default storageService;