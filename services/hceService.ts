import { NativeModules } from "react-native";

const { HCEModule } = NativeModules;

const hceService = {

  startHCE: async (userId: string) => {

    try {

      // payload final
      const payload = userId;

      console.log(  
        "START HCE PAYLOAD:",
        payload
      );

      
      
       NativeModules.HCEModule.startHCE(payload)
       
       

      return true;

    } catch (error) {

      console.log(
        "START HCE ERROR:",
        error
      );

      throw error;
    }
  },

  stopHCE: async () => {

    try {

      console.log("STOP HCE");

     
       NativeModules.HCEModule.stopHCE()
       

      return true;

    } catch (error) {

      console.log(
        "STOP HCE ERROR:",
        error
      );

      throw error;
    }
  },
};

export default hceService;