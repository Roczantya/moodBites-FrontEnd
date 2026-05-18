import React, { useState } from "react";
// Sesuaikan path import ini dengan lokasi komponenmu nanti
import ScanScreen from "@/components/nfc/scanscreen";
import SuccessScreen from "@/components/nfc/successscreen";

export default function NFCScreen() {
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  return isSuccess ? (
    <SuccessScreen onBack={() => setIsSuccess(false)} />
  ) : (
    <ScanScreen onSuccess={() => setIsSuccess(true)} />
  );
}
