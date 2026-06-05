import axios from "axios";
import { router } from "expo-router";
import storageService from "./storageService";

const BASE_URL = "https://api.moodbites.qzz.io/api/v1";

// ─── 1. CLIENT UTAMA (Untuk API Internal Moodbites) ───
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    Accept: "application/json",
  },
});

// ─── INTERCEPTORS CLIENT UTAMA ───
apiClient.interceptors.request.use(
  async (config) => {
    const token = await storageService.getToken();

    console.log("=== REQUEST ===");
    console.log("URL:", config.url);

    if (token) {
      config.headers["token"] = `${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// ─── INTERCEPTOR RESPONSE — CLIENT UTAMA ───
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    let customErrorMessage =
      "Terjadi kesalahan. Mohon coba beberapa saat lagi.";
    let statusCode = 0;

    if (error.response) {
      statusCode = error.response.status;
      const backendMessage = [400, 409, 422].includes(statusCode)
        ? error.response.data?.message
        : null;

      switch (statusCode) {
        case 400:
          customErrorMessage =
            backendMessage ||
            "Data yang dikirim tidak sesuai. Coba periksa kembali.";
          break;
        case 401:
          if (
            error.config &&
            error.config.url &&
            error.config.url.includes("/auth")
          ) {
            customErrorMessage = backendMessage || "Email atau password salah.";
          } else {
            customErrorMessage =
              "Sesi kamu telah berakhir. Silakan login kembali.";
            storageService.clearAllSession().then(() => {
              router.replace("/auth");
            });
          }
          break;
        case 403:
          customErrorMessage = "Kamu tidak memiliki akses untuk melakukan ini.";
          break;
        case 404:
          customErrorMessage = "Data yang kamu cari tidak ditemukan.";
          break;
        case 405:
          customErrorMessage =
            "Terjadi kesalahan pada aplikasi. Coba lagi atau hubungi kami.";
          break;
        case 409:
          customErrorMessage =
            backendMessage ||
            "Data sudah terdaftar atau sedang konflik. Coba dengan data lain.";
          break;
        case 422:
          customErrorMessage =
            backendMessage || "Format data yang kamu masukkan tidak valid.";
          break;
        case 500:
        case 501:
          customErrorMessage =
            "Terjadi gangguan pada server kami. Tim kami sedang menanganinya, coba lagi nanti.";
          break;
        case 502:
        case 503:
        case 504:
          customErrorMessage =
            "Server sedang tidak dapat dihubungi. Periksa koneksimu dan coba beberapa saat lagi.";
          break;
        default:
          customErrorMessage =
            "Terjadi kesalahan yang tidak diketahui. Coba lagi.";
      }
    } else if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
      customErrorMessage =
        "Koneksi terlalu lama. Periksa koneksimu dan coba lagi.";
    } else if (error.request) {
      customErrorMessage =
        "Gagal terhubung ke server. Periksa koneksi internetmu.";
    } else {
      customErrorMessage = "Terjadi kesalahan yang tidak diketahui. Coba lagi.";
    }

    return Promise.reject({
      message: customErrorMessage,
      statusCode,
      originalError: error,
    });
  },
);

// Export apiClient sebagai default
export default apiClient;
