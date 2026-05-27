const hceService = {

  startHCE: async (payload: string) => {

    console.log("HCE START PAYLOAD:", payload);

    // nanti NativeModules masuk di sini
    return true;
  },

  stopHCE: async () => {

    console.log("HCE STOP");

    return true;
  },
};

export default hceService;