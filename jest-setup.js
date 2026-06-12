import "react-native-gesture-handler/jestSetup";

// 1. Perbaikan untuk structuredClone (Masalah utama kamu saat ini)
if (typeof global.structuredClone !== "function") {
  global.structuredClone = (obj) => {
    if (obj === undefined) return undefined;
    return JSON.parse(JSON.stringify(obj));
  };
}

// 2. Perbaikan untuk Expo Winter Runtime Registry
global.__ExpoImportMetaRegistry = {
  get(id) {
    return {};
  },
};

// 3. Mock untuk Expo Router
jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useLocalSearchParams: () => ({}),
  router: {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  },
  Link: "Link",
}));

// 4. Mock untuk Reanimated
jest.mock("react-native-reanimated", () => {
  const Reanimated = require("react-native-reanimated/mock");
  Reanimated.default.call = () => {};
  return Reanimated;
});

jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);

global.alert = jest.fn();
