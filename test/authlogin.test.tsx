import React from "react";
import { render, fireEvent, act } from "@testing-library/react-native";
import AuthScreen from "../app/auth/index"; // Sesuaikan rute dengan struktur proyekmu
import { router } from "expo-router";
import authService from "@/services/authService";

// 1. Mocking expo-router
jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
    replace: jest.fn(),
  },
  useLocalSearchParams: jest.fn(() => ({})),
}));

// 2. Mocking icons agar tidak error saat render komponen
jest.mock("@expo/vector-icons", () => ({
  Ionicons: "Ionicons",
  MaterialIcons: "MaterialIcons",
  Feather: "Feather",
}));

describe("AuthScreen Testing", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Gunakan fake timers dari awal untuk seluruh test case yang butuh manipulasi waktu
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("harus menampilkan form login secara default", () => {
    const { getByText, queryByPlaceholderText } = render(<AuthScreen />);
    expect(getByText("Enter the Hearth")).toBeTruthy();
    expect(queryByPlaceholderText("Sarah")).toBeNull();
  });

  it("harus menampilkan kolom NAMA saat pindah ke mode Register", () => {
    const { getByText, getByPlaceholderText } = render(<AuthScreen />);

    fireEvent.press(getByText("Register"));

    expect(getByPlaceholderText("Sarah")).toBeTruthy();
    expect(getByText("Join the Hearth")).toBeTruthy();
  });

  it("harus menampilkan pesan error jika format email salah", () => {
    const { getByText, getByPlaceholderText } = render(<AuthScreen />);

    fireEvent.changeText(
      getByPlaceholderText("hello@moodbites.com"),
      "emailngasal",
    );
    fireEvent.press(getByText("Enter the Hearth"));

    expect(getByText("Format email tidak valid")).toBeTruthy();
    expect(router.push).not.toHaveBeenCalled();
  });

  it("harus menampilkan pesan error jika password kurang dari 6 karakter", () => {
    const { getByText, getByPlaceholderText } = render(<AuthScreen />);

    fireEvent.changeText(getByPlaceholderText("••••••••"), "123");
    fireEvent.press(getByText("Enter the Hearth"));

    expect(getByText("Password minimal harus 6 karakter")).toBeTruthy();
    expect(router.push).not.toHaveBeenCalled();
  });

  // --- 👇 FIX TEST CASE: LOGIN BERHASIL ---
  it("harus menampilkan toast sukses dan navigasi ke home saat login berhasil", async () => {
    const mockLogin = jest.spyOn(authService, "login").mockResolvedValue({
      token: "dummy_jwt_token",
    });

    const { getByText, getByPlaceholderText } = render(<AuthScreen />);

    // Isi form login
    fireEvent.changeText(
      getByPlaceholderText("hello@moodbites.com"),
      "user@moodbites.com",
    );
    fireEvent.changeText(getByPlaceholderText("••••••••"), "password123");

    // Trigger tombol login
    fireEvent.press(getByText("Enter the Hearth"));

    // KUNCI UTAMA: Menguras antrean Promise (Microtask) agar blok .then() / kode pasca-await tereksekusi
    await act(async () => {
      await Promise.resolve();
    });

    // Sekarang Toast dijamin sudah merender teks sukses ke layar
    expect(getByText("✓ Login Berhasil! Memuat Hearth...")).toBeTruthy();

    // Jalankan waktu virtual maju 1500ms untuk mengeksekusi fungsi di dalam setTimeout
    act(() => {
      jest.advanceTimersByTime(1500);
    });

    // Navigasi kini berhasil dideteksi
    expect(router.replace).toHaveBeenCalledWith("/dashboard/home");

    mockLogin.mockRestore();
  });

  // --- 👇 FIX TEST CASE: REGISTER BERHASIL ---
  it("harus menampilkan toast sukses dan navigasi ke /auth/otp saat register berhasil", async () => {
    const mockRegister = jest.spyOn(authService, "register").mockResolvedValue({
      loginId: "dummy_id_123",
    });

    const { getByText, getByPlaceholderText } = render(<AuthScreen />);

    // Pindah ke mode register
    fireEvent.press(getByText("Register"));

    // Isi form register
    fireEvent.changeText(getByPlaceholderText("Sarah"), "Sarah");
    fireEvent.changeText(
      getByPlaceholderText("hello@moodbites.com"),
      "register@moodbites.com",
    );
    fireEvent.changeText(getByPlaceholderText("••••••••"), "password123");

    fireEvent.press(getByText("Join the Hearth"));

    // Kurasi antrean data register kembali
    await act(async () => {
      await Promise.resolve();
    });

    expect(
      getByText("✓ Registrasi Berhasil! Kode OTP sedang dikirim..."),
    ).toBeTruthy();

    // Majukan waktu virtual sejauh 2500ms untuk menembus batas penantian OTP
    act(() => {
      jest.advanceTimersByTime(2500);
    });

    expect(router.push).toHaveBeenCalledWith({
      pathname: "/auth/otp",
      params: {
        email: "register@moodbites.com",
        loginId: "dummy_id_123",
      },
    });

    mockRegister.mockRestore();
  });

  // --- 👇 FIX TEST CASE: HANDLER API ERROR ---
  it("harus menampilkan toast error jika API mengembalikan kesalahan", async () => {
    const mockLogin = jest.spyOn(authService, "login").mockRejectedValue({
      message: "Email atau password salah.",
    });

    const { getByText, getByPlaceholderText } = render(<AuthScreen />);

    fireEvent.changeText(
      getByPlaceholderText("hello@moodbites.com"),
      "user@moodbites.com",
    );
    fireEvent.changeText(getByPlaceholderText("••••••••"), "salahpass");

    fireEvent.press(getByText("Enter the Hearth"));

    // Selesaikan proses penolakan dari server (Catch block)
    await act(async () => {
      await Promise.resolve();
    });

    expect(getByText("✕ Email atau password salah.")).toBeTruthy();
    expect(router.push).not.toHaveBeenCalled();

    mockLogin.mockRestore();
  });
});
