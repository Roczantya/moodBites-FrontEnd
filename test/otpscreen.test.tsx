import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
// Pastikan path ini sesuai dengan lokasi komponen OtpForm kamu
import OtpForm from "@/components/auth/otpform";

// 🔥 1. MOCK EXPO VECTOR ICONS (Solusi Ampuh Hilangkan Warning act(...))
jest.mock("@expo/vector-icons", () => {
  const { View } = require("react-native");
  return {
    MaterialIcons: (props: any) => (
      <View testID="mock-material-icon" {...props} />
    ),
    Feather: (props: any) => <View testID="mock-feather-icon" {...props} />,
  };
});

describe("OtpForm UI Component", () => {
  // 2. Setup Data Palsu (Mock Props) biar gak capek nulis ulang di tiap test
  const mockInputRefs = { current: [] };
  const mockProps = {
    otp: ["", "", "", ""],
    inputRefs: mockInputRefs as any,
    handleOtpChange: jest.fn(),
    handleKeyPress: jest.fn(),
    onVerify: jest.fn(),
    onResend: jest.fn(),
    isLoading: false,
  };

  beforeEach(() => {
    // Reset semua fungsi mock sebelum tes baru dimulai
    jest.clearAllMocks();
  });

  it("1. Harus merender form dengan benar", () => {
    const { getByText, getAllByTestId } = render(<OtpForm {...mockProps} />);

    // Pastikan teks keamanan muncul di layar
    expect(getByText("SECURED BY MOODBITES")).toBeTruthy();

    // Pastikan ada 4 kotak input OTP (menggunakan testID yang sudah kita pasang di komponen)
    const inputs = getAllByTestId(/otp-input-/);
    expect(inputs.length).toBe(4);
  });

  it("2. Harus memanggil handleOtpChange saat user mengetik angka", () => {
    const { getByTestId } = render(<OtpForm {...mockProps} />);

    // Ambil kotak input OTP yang pertama (index 0)
    const firstInput = getByTestId("otp-input-0");

    // Simulasi user mengetik angka '5'
    fireEvent.changeText(firstInput, "5");

    // Pastikan fungsi ngetik dipanggil dengan angka '5' di index 0
    expect(mockProps.handleOtpChange).toHaveBeenCalledWith("5", 0);
  });

  it("3. Tombol Verify harus ter-disable jika OTP belum lengkap (4 digit)", () => {
    // Render dengan kondisi OTP baru diisi 2 kotak
    const { getByText } = render(
      <OtpForm {...mockProps} otp={["1", "2", "", ""]} />,
    );

    const verifyButton = getByText("Verify & Continue");

    // Paksa klik tombolnya
    fireEvent.press(verifyButton);

    // Karena OTP belum lengkap, fungsi onVerify TIDAK BOLEH berjalan
    expect(mockProps.onVerify).not.toHaveBeenCalled();
  });

  it("4. Harus memanggil onVerify jika OTP lengkap 4 digit dan tombol diklik", () => {
    // Render dengan kondisi OTP 4 digit penuh
    const { getByText } = render(
      <OtpForm {...mockProps} otp={["1", "2", "3", "4"]} />,
    );

    const verifyButton = getByText("Verify & Continue");
    fireEvent.press(verifyButton);

    // Karena datanya lengkap, fungsi API verify harusnya terpanggil 1 kali
    expect(mockProps.onVerify).toHaveBeenCalledTimes(1);
  });

  it("5. Menampilkan status loading dan mengunci input saat proses API berjalan", () => {
    // Render dengan status isLoading = true
    const { getByText, getByTestId } = render(
      <OtpForm {...mockProps} isLoading={true} otp={["1", "2", "3", "4"]} />,
    );

    // Teks di tombol harus berubah
    expect(getByText("Verifying...")).toBeTruthy();
    expect(getByText("PLEASE WAIT...")).toBeTruthy();

    // Kotak input harus terkunci (editable = false)
    const firstInput = getByTestId("otp-input-0");
    expect(firstInput.props.editable).toBe(false);
  });
});
