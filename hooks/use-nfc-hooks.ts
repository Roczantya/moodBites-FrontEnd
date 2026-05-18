// import { useState, useEffect } from "react";
// import { Platform } from "react-native";
// import NfcManager, { NfcTech, Ndef } from "react-native-nfc-manager";

// interface NfcPayload {
//   restaurantId: string;
//   tableName: string;
//   branch?: string;
// }

// export function useNfcScan(onScanSuccess: (data: NfcPayload) => void) {
//   const [isScanning, setIsScanning] = useState<boolean>(false);

//   useEffect(() => {
//     if (Platform.OS !== "web") {
//       NfcManager.start().catch((err) => console.warn("NFC Init Error:", err));
//     }
//   }, []);

//   const startNfcScan = async (): Promise<void> => {
//     // Handling untuk testing di Web
//     if (Platform.OS === "web") {
//       console.log("Simulasi NFC di Web berjalan...");
//       setIsScanning(true);
//       setTimeout(() => {
//         setIsScanning(false);
//         // Payload mock dummy khusus web
//         onScanSuccess({
//           restaurantId: "mock_web_001",
//           tableName: "Meja Mock Web",
//         });
//       }, 2000);
//       return;
//     }

//     try {
//       if (Platform.OS === "android") setIsScanning(true);
//       if (Platform.OS === "ios") {
//         await NfcManager.setAlertMessageIOS(
//           "Dekatkan HP Anda ke stiker NFC di meja restoran.",
//         );
//       }

//       await NfcManager.requestTechnology(NfcTech.Ndef);
//       const tag = await NfcManager.getTag();

//       if (tag && tag.ndefMessage && tag.ndefMessage.length > 0) {
//         // Ambil bytes payload dari record pertama
//         const payloadBytes = tag.ndefMessage[0].payload;
//         // Decode bytes menjadi teks asli
//         const decodedText = Ndef.text.decodePayload(payloadBytes);
//         // Parse teks ke object JSON (Payload Meja)
//         const parsedPayload: NfcPayload = JSON.parse(decodedText);

//         setIsScanning(false);
//         onScanSuccess(parsedPayload); // Kirim data hasil scan ke UI / Parent
//       } else {
//         setIsScanning(false);
//       }
//     } catch (ex) {
//       console.warn("Scan dibatalkan atau gagal", ex);
//       setIsScanning(false);
//     } finally {
//       NfcManager.cancelTechnologyRequest();
//     }
//   };

//   const cancelNfcScan = () => {
//     if (Platform.OS !== "web") {
//       NfcManager.cancelTechnologyRequest();
//     }
//     setIsScanning(false);
//   };

//   return {
//     isScanning,
//     startNfcScan,
//     cancelNfcScan,
//   };
// }
